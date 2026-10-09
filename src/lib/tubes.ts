/**
 * "Mezclar tubos": water sort. Cada tubo guarda hasta cuatro porciones de
 * color y se vuelca de a bloques del mismo color hasta dejar cada tubo con un
 * solo color.
 *
 * Los niveles no se generan en tiempo de ejecución: salieron de un script que
 * reparte al azar y descarta todo reparto que un BFS no logre resolver. Ese
 * mismo BFS devolvió el mínimo de movimientos de cada nivel, que queda
 * guardado como `par` y sirve de vara para las estrellas.
 */

import { FLOW_COLORS, type FlowColor } from "@/lib/flow";

/** Porciones que entran en un tubo. */
export const CAPACITY = 4;

export type Tube = number[];
export type TubesState = Tube[];

export type TubesLevel = {
  id: number;
  colors: number;
  /** Mínimo de movimientos, calculado con BFS al generar el nivel. */
  par: number;
  tubes: TubesState;
};

/** Reusa la paleta de "unir colores" para no multiplicar colores en el juego. */
export const TUBE_COLORS: FlowColor[] = FLOW_COLORS;

const RAW_LEVELS: TubesLevel[] = [
  {
    id: 1,
    colors: 4,
    par: 11,
    tubes: [[1,0,3,2], [1,0,0,3], [2,2,1,0], [2,1,3,3], [], []],
  },
  {
    id: 2,
    colors: 4,
    par: 9,
    tubes: [[3,3,1,0], [1,2,2,1], [2,2,3,3], [0,0,1,0], [], []],
  },
  {
    id: 3,
    colors: 5,
    par: 13,
    tubes: [[1,0,4,3], [4,4,0,0], [1,3,0,1], [3,4,2,1], [2,2,2,3], [], []],
  },
  {
    id: 4,
    colors: 5,
    par: 15,
    tubes: [[3,4,4,2], [1,2,0,1], [2,0,4,2], [0,1,0,3], [3,3,4,1], [], []],
  },
  {
    id: 5,
    colors: 6,
    par: 15,
    tubes: [[2,5,5,4], [1,1,2,1], [0,0,5,5], [4,0,3,3], [0,4,3,1], [3,4,2,2], [], []],
  },
  {
    id: 6,
    colors: 6,
    par: 17,
    tubes: [[0,1,3,3], [5,1,5,0], [3,4,5,2], [4,1,2,2], [5,3,1,4], [4,0,0,2], [], []],
  },
  {
    id: 7,
    colors: 7,
    par: 20,
    tubes: [[6,6,0,1], [5,3,6,0], [4,2,3,3], [4,2,1,0], [0,4,1,5], [2,5,5,2], [1,4,6,3], [], []],
  },
  {
    id: 8,
    colors: 7,
    par: 21,
    tubes: [[5,1,6,4], [3,0,0,4], [3,2,6,6], [1,3,2,5], [5,2,1,4], [2,4,1,0], [0,6,3,5], [], []],
  },
];

export const TUBES_LEVELS: TubesLevel[] = RAW_LEVELS;

export function findTubesLevel(id: number): TubesLevel | undefined {
  return TUBES_LEVELS.find((level) => level.id === id);
}

export function cloneTubes(tubes: TubesState): TubesState {
  return tubes.map((tube) => tube.slice());
}

/** Un tubo está terminado cuando está lleno y todo de un mismo color. */
export function isComplete(tube: Tube): boolean {
  return tube.length === CAPACITY && new Set(tube).size === 1;
}

export function isSolved(tubes: TubesState): boolean {
  return tubes.every((tube) => tube.length === 0 || isComplete(tube));
}

/** Cuántas porciones iguales hay apiladas arriba de todo. */
export function topRun(tube: Tube): number {
  if (tube.length === 0) return 0;
  const color = tube[tube.length - 1];
  let run = 1;
  while (run < tube.length && tube[tube.length - 1 - run] === color) run++;
  return run;
}

/**
 * Cuántas porciones se volcarían de `from` a `to`. Cero si la jugada no vale.
 * Solo se puede volcar sobre el mismo color o sobre un tubo vacío.
 */
export function pourAmount(tubes: TubesState, from: number, to: number): number {
  if (from === to) return 0;
  const source = tubes[from];
  const target = tubes[to];
  if (!source || !target) return 0;
  if (source.length === 0) return 0;
  if (isComplete(source)) return 0;
  if (target.length === CAPACITY) return 0;

  const color = source[source.length - 1];
  if (target.length > 0 && target[target.length - 1] !== color) return 0;

  const run = topRun(source);
  // Mudar un tubo entero a otro vacío no cambia nada: no es jugada.
  if (target.length === 0 && run === source.length) return 0;

  return Math.min(run, CAPACITY - target.length);
}

export function pour(tubes: TubesState, from: number, to: number): TubesState {
  const amount = pourAmount(tubes, from, to);
  if (amount === 0) return tubes;
  const next = cloneTubes(tubes);
  const moved = next[from].splice(next[from].length - amount, amount);
  next[to].push(...moved);
  return next;
}

/** Los tubos son intercambiables: ordenarlos colapsa estados equivalentes. */
function stateKey(tubes: TubesState): string {
  return tubes
    .map((tube) => tube.join(""))
    .sort()
    .join("|");
}

function legalMoves(tubes: TubesState): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < tubes.length; i++) {
    for (let j = 0; j < tubes.length; j++) {
      if (pourAmount(tubes, i, j) > 0) out.push([i, j]);
    }
  }
  return out;
}

/**
 * Primer movimiento de una solución óptima, buscado con BFS desde el estado
 * actual. Alimenta el botón de pista, así que sigue sirviendo aunque el
 * jugador se haya ido por un camino que no estaba previsto.
 *
 * El tope de nodos evita colgar la pestaña en un tablero muy enredado; si se
 * alcanza, se devuelve igual alguna jugada que junte colores.
 */
export function findHint(
  tubes: TubesState,
  nodeCap = 120000,
): [number, number] | null {
  if (isSolved(tubes)) return null;

  const seen = new Set([stateKey(tubes)]);
  // Cada entrada recuerda el primer movimiento que llevó hasta ese estado.
  let frontier: { state: TubesState; first: [number, number] }[] = [];

  for (const move of legalMoves(tubes)) {
    const child = pour(tubes, move[0], move[1]);
    if (isSolved(child)) return move;
    const key = stateKey(child);
    if (seen.has(key)) continue;
    seen.add(key);
    frontier.push({ state: child, first: move });
  }

  let nodes = 0;
  while (frontier.length > 0) {
    const next: typeof frontier = [];
    for (const node of frontier) {
      for (const move of legalMoves(node.state)) {
        const child = pour(node.state, move[0], move[1]);
        if (isSolved(child)) return node.first;
        const key = stateKey(child);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ state: child, first: node.first });
        if (++nodes > nodeCap) return fallbackHint(tubes);
      }
    }
    frontier = next;
  }

  return fallbackHint(tubes);
}

/** Sin búsqueda: cualquier jugada que apile color sobre su mismo color. */
function fallbackHint(tubes: TubesState): [number, number] | null {
  const moves = legalMoves(tubes);
  const merging = moves.find(([, to]) => tubes[to].length > 0);
  return merging ?? moves[0] ?? null;
}

/** Si no queda ninguna jugada legal, el tablero quedó trabado. */
export function isStuck(tubes: TubesState): boolean {
  return !isSolved(tubes) && legalMoves(tubes).length === 0;
}
