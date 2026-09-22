/**
 * Lógica pura de la sopa de letras: mundos, generación del tablero y validación
 * de la selección. Sin React ni DOM.
 */

export type Dir = { dr: number; dc: number };
export type Cell = { row: number; col: number };

export const DIRS = {
  right: { dr: 0, dc: 1 },
  down: { dr: 1, dc: 0 },
  downRight: { dr: 1, dc: 1 },
  downLeft: { dr: 1, dc: -1 },
  left: { dr: 0, dc: -1 },
  up: { dr: -1, dc: 0 },
  upLeft: { dr: -1, dc: -1 },
  upRight: { dr: -1, dc: 1 },
} as const;

/** Solo hacia adelante: lo más amable para quien recién lee. */
const FORWARD: Dir[] = [DIRS.right, DIRS.down];
/** Suma la diagonal descendente. */
const WITH_DIAGONAL: Dir[] = [DIRS.right, DIRS.down, DIRS.downRight];
/** Las ocho, incluidas las invertidas. */
const ALL_DIRS: Dir[] = Object.values(DIRS);

export type World = {
  id: number;
  name: string;
  hint: string;
  words: string[];
  size: number;
  dirs: Dir[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Proporción de celdas ocupadas por palabras que se busca en cada tablero. */
const TARGET_DENSITY = 0.45;

/**
 * El tablero tiene que darle aire a la palabra más larga (sobre todo en
 * diagonal) y además no quedar apretado: con demasiadas palabras juntas la
 * grilla se vuelve ilegible para un chico.
 */
function sizeFor(words: string[]): number {
  const longest = words.reduce((max, w) => Math.max(max, w.length), 0);
  const letters = words.reduce((total, w) => total + w.length, 0);
  const byDensity = Math.ceil(Math.sqrt(letters / TARGET_DENSITY));
  return clamp(Math.max(longest + 3, byDensity), 8, 12);
}

function makeWorld(
  id: number,
  name: string,
  hint: string,
  words: string[],
  dirs: Dir[],
): World {
  return { id, name, hint, words, size: sizeFor(words), dirs };
}

/**
 * Las 52 palabras repartidas por dificultad (largo), no por tema.
 * SOL, PAN, PATO, GATO, FLOR y NIDO venían repetidas en la lista original y
 * acá aparecen una sola vez.
 */
export const WORLDS: World[] = [
  makeWorld(1, "Cortitas", "Palabras de 3 letras", ["PAN", "SOL", "LUZ", "ALA", "PIE", "OSO"], FORWARD),
  makeWorld(2, "Primeras palabras", "De 3 y 4 letras", ["MAR", "PATO", "GATO", "JUGO", "MIEL", "FLOR"], FORWARD),
  makeWorld(3, "De a cuatro", "Palabras de 4 letras", ["HOJA", "NIDO", "NUBE", "CASA", "MOÑO", "LUNA"], FORWARD),
  makeWorld(4, "De a cinco", "Ahora también en diagonal", ["SIENI", "OVEJA", "TORTA", "PLAZA", "ARBOL", "PASTO"], WITH_DIAGONAL),
  makeWorld(5, "Cinco y seis", "Se ponen más largas", ["ABEJA", "LLAVE", "CONEJO", "AMIGOS", "PICNIC", "MANTEL"], WITH_DIAGONAL),
  makeWorld(6, "De a seis", "Palabras de 6 letras", ["PARQUE", "VIENTO", "PETALO", "SILLON", "MACETA", "PLANTA"], WITH_DIAGONAL),
  makeWorld(7, "Seis y siete", "¡Ojo, algunas van al revés!", ["OVILLO", "PELOTA", "AZULEJO", "POLLITO", "CANASTA", "MANZANA"], ALL_DIRS),
  makeWorld(8, "De a siete", "En las ocho direcciones", ["VENTANA", "JUGUETE", "PINGUINO", "MERIENDA", "FRUTILLA"], ALL_DIRS),
  makeWorld(9, "Las más largas", "El desafío final", ["CORAZON", "MARIPOSA", "ALFOMBRA", "LAGARTIJA", "PRIMAVERA"], ALL_DIRS),
];

export type Placement = {
  word: string;
  row: number;
  col: number;
  dir: Dir;
};

export type Board = {
  size: number;
  grid: string[][];
  placements: Placement[];
};

const EMPTY = "";
/** Letras frecuentes en español, para que el relleno no cante. */
const COMMON_LETTERS = "AAEEIIOOUURRSSTTNNLLMMCCDDPPBGFHJVZQY";

function fits(
  grid: string[][],
  size: number,
  word: string,
  row: number,
  col: number,
  dir: Dir,
): boolean {
  const endRow = row + dir.dr * (word.length - 1);
  const endCol = col + dir.dc * (word.length - 1);
  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false;

  for (let i = 0; i < word.length; i++) {
    const cell = grid[row + dir.dr * i][col + dir.dc * i];
    // Cruzarse con la misma letra está permitido y queda más lindo.
    if (cell !== EMPTY && cell !== word[i]) return false;
  }
  return true;
}

function write(grid: string[][], word: string, row: number, col: number, dir: Dir): void {
  for (let i = 0; i < word.length; i++) {
    grid[row + dir.dr * i][col + dir.dc * i] = word[i];
  }
}

function tryBuild(world: World): Board | null {
  const { size, dirs } = world;
  const grid: string[][] = Array.from({ length: size }, () =>
    Array<string>(size).fill(EMPTY),
  );
  const placements: Placement[] = [];

  // Las más largas primero, cuando el tablero todavía está vacío.
  const ordered = [...world.words].sort((a, b) => b.length - a.length);

  for (const word of ordered) {
    const options: Placement[] = [];
    for (const dir of dirs) {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (fits(grid, size, word, row, col, dir)) {
            options.push({ word, row, col, dir });
          }
        }
      }
    }
    if (options.length === 0) return null;

    const chosen = options[Math.floor(Math.random() * options.length)];
    write(grid, word, chosen.row, chosen.col, chosen.dir);
    placements.push(chosen);
  }

  // El alfabeto de relleno incluye las letras del propio mundo: así la Ñ de
  // MOÑO no queda como única Ñ del tablero delatando la palabra.
  const alphabet = (COMMON_LETTERS + world.words.join("").repeat(2)).split("");
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === EMPTY) {
        grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  // Devolvemos las colocaciones en el orden original de la lista de palabras.
  const byWord = new Map(placements.map((p) => [p.word, p]));
  return {
    size,
    grid,
    placements: world.words.map((w) => byWord.get(w)!),
  };
}

/**
 * Usa Math.random: llamar siempre desde un handler o efecto del cliente, nunca
 * durante el render, o Next tira hydration mismatch.
 */
export function generateBoard(world: World, attempts = 200): Board {
  for (let i = 0; i < attempts; i++) {
    const board = tryBuild(world);
    if (board) return board;
  }
  throw new Error(`No se pudo generar el tablero del mundo ${world.id}`);
}

/** Las celdas que recorre una colocación, para dibujar su cápsula. */
export function placementCells(placement: Placement): Cell[] {
  return Array.from({ length: placement.word.length }, (_, i) => ({
    row: placement.row + placement.dir.dr * i,
    col: placement.col + placement.dir.dc * i,
  }));
}

export type Selection = {
  cells: Cell[];
  text: string;
};

/**
 * Lee la línea entre dos celdas. Devuelve null si no están alineadas: tienen
 * que compartir fila, columna, o estar en diagonal exacta.
 */
export function readSelection(
  grid: string[][],
  from: Cell,
  to: Cell,
): Selection | null {
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const aligned = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if (!aligned) return null;

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const dir: Dir = {
    dr: steps === 0 ? 0 : dr / steps,
    dc: steps === 0 ? 0 : dc / steps,
  };

  const cells: Cell[] = [];
  let text = "";
  for (let i = 0; i <= steps; i++) {
    const row = from.row + dir.dr * i;
    const col = from.col + dir.dc * i;
    cells.push({ row, col });
    text += grid[row][col];
  }
  return { cells, text };
}

function reverse(text: string): string {
  return [...text].reverse().join("");
}

/**
 * Compara contra las palabras que faltan, también al revés: marcar una palabra
 * de derecha a izquierda tiene que contar igual, si no habría que adivinar por
 * qué punta empezar.
 */
export function matchWord(text: string, pending: readonly string[]): string | null {
  const backwards = reverse(text);
  return pending.find((word) => word === text || word === backwards) ?? null;
}
