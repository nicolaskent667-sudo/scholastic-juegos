/**
 * "Sacar flechas": cada flecha ocupa una hilera de celdas (recta o en L) y al
 * tocarla avanza hacia donde apunta su cabeza, como una viborita, hasta salir
 * del tablero. Si en esa recta hay otra flecha o Sieni, choca y vuelve.
 *
 * Sacar una flecha solo libera celdas, nunca traba a otra. Por eso alcanza un
 * bucle simple para saber si un nivel tiene solución: sacar las flechas libres
 * y repetir. Las rondas de ese bucle miden qué tan encadenado es el nivel.
 */

export type Cell = readonly [col: number, row: number];
export type Dir = "up" | "down" | "left" | "right";

export type ArrowColor = { id: string; name: string; fill: string };

/** Los seis colores del diseño. */
export const ARROW_COLORS: ArrowColor[] = [
  { id: "azul", name: "azul", fill: "#8fb3e8" },
  { id: "verde", name: "verde", fill: "#8fd3a8" },
  { id: "rosa", name: "rosa", fill: "#e982a8" },
  { id: "amarillo", name: "amarillo", fill: "#f4c86a" },
  { id: "naranja", name: "naranja", fill: "#f0a65a" },
  { id: "coral", name: "coral", fill: "#ec6b6b" },
];

export type Arrow = {
  /** Su posición en `level.arrows`. */
  id: number;
  color: ArrowColor;
  /** De la cola a la cabeza, celda por celda. */
  cells: Cell[];
  dir: Dir;
};

export type ArrowsLevel = {
  id: number;
  cols: number;
  rows: number;
  /** Esquina superior izquierda del bloque de 2 × 2 donde está Sieni. */
  sieni: Cell;
  arrows: Arrow[];
  /** Cuántas rondas hacen falta sacando todas las libres a la vez. */
  rounds: number;
};

const STEP: Record<Dir, Cell> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/**
 * Cada flecha se escribe como sus puntos de quiebre: cola, codos y cabeza.
 * Los niveles quedan legibles y se expanden a celdas acá.
 */
type RawArrow = [color: number, ...points: Cell[]];
type RawLevel = {
  id: number;
  cols: number;
  rows: number;
  sieni: Cell;
  arrows: RawArrow[];
};

export function expandPath(points: readonly Cell[]): Cell[] {
  const cells: Cell[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [fc, fr] = points[i - 1];
    const [tc, tr] = points[i];
    if (fc !== tc && fr !== tr) {
      throw new Error(`Tramo en diagonal: ${points[i - 1]} → ${points[i]}`);
    }
    const dc = Math.sign(tc - fc);
    const dr = Math.sign(tr - fr);
    let c = fc;
    let r = fr;
    while (c !== tc || r !== tr) {
      c += dc;
      r += dr;
      cells.push([c, r]);
    }
  }
  return cells;
}

export function headDir(cells: readonly Cell[]): Dir {
  const [hc, hr] = cells[cells.length - 1];
  const [pc, pr] = cells[cells.length - 2];
  if (hc > pc) return "right";
  if (hc < pc) return "left";
  return hr > pr ? "down" : "up";
}

export function dirStep(dir: Dir): Cell {
  return STEP[dir];
}

function inSieni(level: Pick<ArrowsLevel, "sieni">, c: number, r: number) {
  const [sc, sr] = level.sieni;
  return c >= sc && c <= sc + 1 && r >= sr && r <= sr + 1;
}

/** Celdas libres u ocupadas: -1 vacía, -2 Sieni, o el id de la flecha. */
export function occupancy(level: ArrowsLevel, remaining: readonly boolean[]) {
  const grid = new Int32Array(level.cols * level.rows).fill(-1);
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      if (inSieni(level, c, r)) grid[r * level.cols + c] = -2;
    }
  }
  for (const arrow of level.arrows) {
    if (!remaining[arrow.id]) continue;
    for (const [c, r] of arrow.cells) grid[r * level.cols + c] = arrow.id;
  }
  return grid;
}

/** Las celdas que recorre la cabeza desde donde está hasta el borde. */
export function exitRay(level: ArrowsLevel, arrow: Arrow): Cell[] {
  const [dc, dr] = STEP[arrow.dir];
  let [c, r] = arrow.cells[arrow.cells.length - 1];
  const out: Cell[] = [];
  for (;;) {
    c += dc;
    r += dr;
    if (c < 0 || r < 0 || c >= level.cols || r >= level.rows) return out;
    out.push([c, r]);
  }
}

export type Blocker = {
  /** Id de la flecha con la que choca, o "sieni". */
  what: number | "sieni";
  /** Celdas libres que alcanza a avanzar antes del choque. */
  distance: number;
};

/** Con qué choca la flecha si se la toca ahora, o null si sale. */
export function blockerOf(
  level: ArrowsLevel,
  remaining: readonly boolean[],
  arrow: Arrow,
  grid = occupancy(level, remaining),
): Blocker | null {
  const ray = exitRay(level, arrow);
  for (let i = 0; i < ray.length; i++) {
    const [c, r] = ray[i];
    const cell = grid[r * level.cols + c];
    if (cell === -2) return { what: "sieni", distance: i };
    if (cell >= 0) return { what: cell, distance: i };
  }
  return null;
}

export function freeArrows(
  level: ArrowsLevel,
  remaining: readonly boolean[],
): number[] {
  const grid = occupancy(level, remaining);
  return level.arrows
    .filter((a) => remaining[a.id] && !blockerOf(level, remaining, a, grid))
    .map((a) => a.id);
}

/**
 * Rondas hasta vaciar el tablero sacando todas las libres a la vez, o null si
 * alguna flecha queda trabada para siempre.
 */
export function solveRounds(level: ArrowsLevel): number | null {
  const remaining = level.arrows.map(() => true);
  let left = remaining.length;
  let rounds = 0;
  while (left > 0) {
    const free = freeArrows(level, remaining);
    if (free.length === 0) return null;
    for (const id of free) remaining[id] = false;
    left -= free.length;
    rounds++;
  }
  return rounds;
}

/**
 * Una flecha libre para la pista. Se elige la que más flechas destraba al
 * salir: así la pista enseña algo además de resolver una jugada.
 */
export function findHint(
  level: ArrowsLevel,
  remaining: readonly boolean[],
): number | null {
  const free = freeArrows(level, remaining);
  if (free.length === 0) return null;
  const before = free.length;
  let best = free[0];
  let bestGain = -1;
  for (const id of free) {
    const next = remaining.slice();
    next[id] = false;
    const gain = freeArrows(level, next).length - (before - 1);
    if (gain > bestGain) {
      bestGain = gain;
      best = id;
    }
  }
  return best;
}

/**
 * El camino completo de la animación: de la cola a la cabeza y después en
 * recta hasta quedar fuera del tablero, en coordenadas de celda.
 */
export function exitRoute(level: ArrowsLevel, arrow: Arrow) {
  const points: [number, number][] = arrow.cells.map(([c, r]) => [c, r]);
  const body = arrow.cells.length - 1;
  const [dc, dr] = STEP[arrow.dir];
  const [hc, hr] = arrow.cells[body];
  const toEdge =
    arrow.dir === "right"
      ? level.cols - hc
      : arrow.dir === "left"
        ? hc + 1
        : arrow.dir === "down"
          ? level.rows - hr
          : hr + 1;
  // Recorre el borde y además su propio largo, para salir entera.
  const out = toEdge + body + 1;
  points.push([hc + dc * out, hr + dr * out]);
  return { points, body, total: body + out, exit: out };
}

/** Punto y dirección a una distancia dada sobre una polilínea. */
export function pointAt(
  points: readonly (readonly [number, number])[],
  s: number,
): { x: number; y: number; dx: number; dy: number } {
  let left = Math.max(0, s);
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const len = Math.abs(bx - ax) + Math.abs(by - ay);
    const dx = Math.sign(bx - ax);
    const dy = Math.sign(by - ay);
    if (left <= len || i === points.length - 1) {
      return { x: ax + dx * left, y: ay + dy * left, dx, dy };
    }
    left -= len;
  }
  const [x, y] = points[points.length - 1];
  return { x, y, dx: 0, dy: -1 };
}

const RAW_LEVELS: RawLevel[] = [
  {
    id: 1,
    cols: 6,
    rows: 7,
    sieni: [2, 3],
    arrows: [
      [5, [1, 6], [0, 6]],
      [3, [5, 2], [5, 0]],
      [1, [5, 3], [5, 5]],
      [4, [0, 5], [1, 5]],
      [2, [1, 3], [0, 3]],
    ],
  },
  {
    id: 2,
    cols: 6,
    rows: 7,
    sieni: [2, 3],
    arrows: [
      [3, [1, 1], [1, 3]],
      [3, [5, 0], [4, 0]],
      [2, [4, 1], [4, 3]],
      [1, [0, 5], [1, 5]],
      [4, [0, 4], [0, 2]],
      [2, [4, 5], [5, 5]],
      [0, [4, 6], [3, 6]],
    ],
  },
  {
    id: 3,
    cols: 8,
    rows: 9,
    sieni: [3, 4],
    arrows: [
      [3, [0, 8], [0, 6]],
      [0, [2, 5], [2, 2]],
      [1, [1, 7], [1, 4]],
      [1, [7, 5], [5, 5], [5, 7]],
      [5, [6, 7], [7, 7]],
      [1, [3, 1], [0, 1], [0, 0]],
      [4, [5, 8], [2, 8]],
      [1, [6, 3], [6, 2]],
      [5, [6, 4], [5, 4], [5, 2]],
      [5, [6, 0], [5, 0]],
    ],
  },
  // El nivel del diseño. La naranja en L apuntaba a Sieni y nunca podía
  // salir: se invirtió para que suba y espere a la cola de la azul.
  {
    id: 4,
    cols: 10,
    rows: 12,
    sieni: [4, 5],
    arrows: [
      [0, [0, 1], [0, 0], [4, 0]],
      [1, [2, 2], [2, 1], [5, 1]],
      [2, [6, 2], [6, 0]],
      [3, [8, 0], [8, 3]],
      [2, [9, 0], [9, 2]],
      [0, [3, 3], [6, 3]],
      [4, [2, 5], [0, 5], [0, 3]],
      [5, [9, 4], [7, 4], [7, 6]],
      [4, [9, 7], [6, 7]],
      [1, [1, 7], [1, 9]],
      [3, [0, 8], [0, 10]],
      [2, [3, 8], [3, 10]],
      [3, [5, 7], [5, 9], [8, 9]],
      [0, [7, 10], [4, 10]],
    ],
  },
  {
    id: 5,
    cols: 10,
    rows: 12,
    sieni: [4, 5],
    arrows: [
      [3, [3, 7], [7, 7]],
      [2, [2, 5], [2, 9], [1, 9]],
      [5, [8, 9], [8, 5]],
      [0, [0, 0], [2, 0]],
      [1, [6, 1], [6, 2], [8, 2]],
      [2, [4, 4], [4, 0]],
      [0, [6, 11], [2, 11]],
      [1, [0, 6], [0, 3]],
      [1, [9, 3], [9, 6]],
      [0, [6, 9], [7, 9]],
      [2, [7, 6], [7, 4], [8, 4]],
      [3, [2, 1], [2, 4]],
      [0, [9, 1], [7, 1]],
      [5, [3, 5], [3, 3]],
      [0, [6, 3], [6, 6]],
      [4, [5, 3], [5, 1]],
    ],
  },
  {
    id: 6,
    cols: 10,
    rows: 12,
    sieni: [4, 5],
    arrows: [
      [2, [8, 3], [9, 3]],
      [3, [7, 0], [9, 0]],
      [2, [8, 9], [4, 9]],
      [4, [3, 0], [5, 0]],
      [0, [4, 8], [5, 8]],
      [0, [6, 10], [7, 10]],
      [3, [3, 3], [2, 3]],
      [3, [0, 11], [4, 11]],
      [0, [5, 4], [9, 4]],
      [5, [5, 7], [7, 7]],
      [4, [2, 7], [2, 6]],
      [2, [4, 2], [1, 2], [1, 3]],
      [4, [0, 4], [0, 6]],
      [1, [8, 8], [9, 8]],
      [1, [3, 10], [3, 7]],
      [0, [6, 0], [6, 2], [9, 2]],
      [5, [3, 6], [3, 4]],
      [2, [8, 7], [8, 5]],
    ],
  },
  {
    id: 7,
    cols: 10,
    rows: 12,
    sieni: [4, 5],
    arrows: [
      [2, [6, 11], [7, 11]],
      [4, [4, 2], [1, 2]],
      [3, [3, 7], [1, 7]],
      [5, [6, 7], [6, 4], [7, 4]],
      [0, [5, 10], [6, 10]],
      [3, [2, 4], [4, 4]],
      [1, [7, 2], [7, 0]],
      [4, [8, 8], [8, 7]],
      [4, [9, 3], [6, 3]],
      [2, [4, 7], [4, 11]],
      [5, [0, 3], [0, 0]],
      [0, [8, 6], [8, 4]],
      [1, [8, 11], [8, 9], [9, 9]],
      [0, [0, 8], [0, 10]],
      [5, [3, 10], [3, 11], [2, 11]],
      [3, [2, 0], [2, 1]],
      [2, [9, 8], [9, 4]],
      [1, [0, 5], [0, 6]],
      [2, [6, 0], [3, 0]],
      [0, [1, 4], [0, 4]],
    ],
  },
  {
    id: 8,
    cols: 10,
    rows: 12,
    sieni: [4, 5],
    arrows: [
      [1, [5, 1], [8, 1]],
      [5, [2, 11], [2, 8]],
      [2, [6, 6], [8, 6]],
      [5, [0, 9], [0, 6]],
      [2, [5, 8], [9, 8], [9, 9]],
      [0, [6, 3], [4, 3], [4, 2]],
      [5, [6, 9], [6, 10]],
      [0, [2, 2], [2, 1], [0, 1]],
      [2, [1, 4], [2, 4]],
      [0, [3, 10], [5, 10]],
      [4, [8, 0], [5, 0]],
      [3, [7, 5], [7, 2]],
      [3, [3, 6], [3, 3]],
      [0, [4, 7], [3, 7]],
      [4, [9, 7], [9, 4]],
      [0, [1, 5], [0, 5]],
      [1, [4, 4], [6, 4]],
      [3, [7, 9], [7, 11], [5, 11]],
      [4, [1, 9], [1, 10]],
      [1, [8, 5], [8, 3]],
      [1, [4, 9], [3, 9]],
      [5, [8, 7], [5, 7]],
    ],
  },
];

function build(raw: RawLevel): ArrowsLevel {
  const arrows: Arrow[] = raw.arrows.map(([color, ...points], id) => {
    const cells = expandPath(points);
    return {
      id,
      color: ARROW_COLORS[color % ARROW_COLORS.length],
      cells,
      dir: headDir(cells),
    };
  });
  const level: ArrowsLevel = { ...raw, arrows, rounds: 0 };

  // Ninguna flecha fuera del tablero, encima de otra o encima de Sieni.
  const taken = new Set<string>();
  for (const arrow of arrows) {
    for (const [c, r] of arrow.cells) {
      const key = `${c},${r}`;
      const outside = c < 0 || r < 0 || c >= raw.cols || r >= raw.rows;
      if (outside || taken.has(key) || inSieni(raw, c, r)) {
        throw new Error(`Nivel ${raw.id}: la flecha ${arrow.id} pisa ${key}`);
      }
      taken.add(key);
    }
  }

  const rounds = solveRounds(level);
  if (rounds === null) throw new Error(`El nivel ${raw.id} no tiene solución`);
  return { ...level, rounds };
}

export const ARROWS_LEVELS: ArrowsLevel[] = RAW_LEVELS.map(build);

export function findArrowsLevel(id: number): ArrowsLevel | undefined {
  return ARROWS_LEVELS.find((level) => level.id === id);
}
