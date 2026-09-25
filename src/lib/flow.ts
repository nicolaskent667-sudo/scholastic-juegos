/**
 * "Unir colores": tubos que conectan pares de puntos llenando toda la grilla.
 *
 * Los niveles no se generan en tiempo de ejecución. Se generaron con un script
 * que arma un camino hamiltoniano sobre la grilla y lo corta en tramos: cada
 * tramo es un tubo y el camino entero es, por construcción, la solución. Por
 * eso `solution` viene incluida — sirve de garantía de que el nivel se puede
 * resolver y además alimenta el botón de pista.
 */

export type Cell = { row: number; col: number };

export type FlowColor = {
  id: string;
  name: string;
  fill: string;
  /** Tono claro del interior del tubo. */
  light: string;
};

/** Los colores salen de la paleta del picnic y se asignan por orden. */
export const FLOW_COLORS: FlowColor[] = [
  { id: "coral", name: "Coral", fill: "#e3535e", light: "#f3a0a6" },
  { id: "azul", name: "Azul", fill: "#6fa8dc", light: "#aecbe9" },
  { id: "verde", name: "Verde", fill: "#5fbe8b", light: "#a9dcbd" },
  { id: "amarillo", name: "Amarillo", fill: "#f0b73f", light: "#f7d78f" },
  { id: "rosa", name: "Rosa", fill: "#e06a9c", light: "#f0aac6" },
  { id: "violeta", name: "Violeta", fill: "#a683d6", light: "#cbb6e8" },
  { id: "turquesa", name: "Turquesa", fill: "#49b6c2", light: "#9ad8de" },
];

type RawLevel = {
  id: number;
  rows: number;
  cols: number;
  /** Un array de celdas por color, en orden. */
  solution: [number, number][][];
};

const RAW_LEVELS: RawLevel[] = [
  {
    id: 1,
    rows: 5,
    cols: 5,
    solution: [
      [[0,0], [0,1], [0,2], [0,3], [0,4], [1,4], [2,4], [3,4], [4,4]],
      [[4,3], [3,3], [2,3]],
      [[1,3], [1,2], [2,2], [3,2], [3,1], [2,1], [1,1], [1,0], [2,0]],
      [[3,0], [4,0], [4,1], [4,2]],
    ],
  },
  {
    id: 2,
    rows: 5,
    cols: 5,
    solution: [
      [[4,0], [3,0], [2,0]],
      [[1,0], [0,0], [0,1], [0,2], [0,3], [0,4], [1,4], [1,3]],
      [[1,2], [1,1], [2,1]],
      [[3,1], [4,1], [4,2], [3,2], [2,2]],
      [[2,3], [2,4], [3,4], [4,4], [4,3], [3,3]],
    ],
  },
  {
    id: 3,
    rows: 6,
    cols: 6,
    solution: [
      [[3,3], [2,3], [1,3], [1,4], [1,5], [0,5], [0,4], [0,3], [0,2], [0,1], [0,0], [1,0], [1,1], [2,1]],
      [[2,0], [3,0], [3,1], [4,1], [4,0], [5,0], [5,1]],
      [[5,2], [5,3], [5,4]],
      [[5,5], [4,5], [3,5], [2,5], [2,4], [3,4]],
      [[4,4], [4,3], [4,2], [3,2], [2,2], [1,2]],
    ],
  },
  {
    id: 4,
    rows: 6,
    cols: 6,
    solution: [
      [[5,1], [5,0], [4,0], [3,0], [2,0], [1,0], [0,0], [0,1], [1,1]],
      [[2,1], [3,1], [4,1], [4,2], [5,2], [5,3]],
      [[5,4], [5,5], [4,5], [3,5], [3,4]],
      [[4,4], [4,3], [3,3]],
      [[3,2], [2,2], [1,2], [0,2], [0,3], [1,3], [1,4]],
      [[0,4], [0,5], [1,5], [2,5], [2,4], [2,3]],
    ],
  },
  {
    id: 5,
    rows: 6,
    cols: 6,
    solution: [
      [[5,3], [5,4], [5,5], [4,5], [3,5]],
      [[3,4], [4,4], [4,3], [3,3], [2,3], [1,3], [1,4], [2,4]],
      [[2,5], [1,5], [0,5], [0,4], [0,3], [0,2]],
      [[0,1], [0,0], [1,0]],
      [[2,0], [3,0], [4,0]],
      [[5,0], [5,1], [5,2], [4,2], [4,1], [3,1], [3,2], [2,2], [1,2], [1,1], [2,1]],
    ],
  },
  {
    id: 6,
    rows: 7,
    cols: 7,
    solution: [
      [[6,2], [6,1], [6,0], [5,0], [4,0], [3,0], [2,0], [2,1], [3,1], [4,1], [5,1], [5,2], [4,2], [4,3], [5,3], [6,3], [6,4], [5,4]],
      [[4,4], [4,5], [5,5], [6,5], [6,6]],
      [[5,6], [4,6], [3,6], [2,6], [1,6], [0,6], [0,5]],
      [[0,4], [0,3], [0,2], [0,1], [0,0], [1,0], [1,1], [1,2]],
      [[1,3], [1,4], [1,5], [2,5]],
      [[3,5], [3,4], [2,4], [2,3], [3,3], [3,2], [2,2]],
    ],
  },
  {
    id: 7,
    rows: 7,
    cols: 7,
    solution: [
      [[1,5], [2,5], [3,5]],
      [[4,5], [5,5], [6,5]],
      [[6,6], [5,6], [4,6], [3,6], [2,6], [1,6], [0,6], [0,5], [0,4], [1,4], [1,3], [0,3], [0,2], [0,1]],
      [[0,0], [1,0], [2,0], [2,1], [1,1]],
      [[1,2], [2,2], [3,2]],
      [[3,1], [3,0], [4,0], [4,1]],
      [[5,1], [5,0], [6,0], [6,1], [6,2], [5,2], [4,2], [4,3], [5,3], [6,3], [6,4], [5,4], [4,4], [3,4], [3,3], [2,3], [2,4]],
    ],
  },
  {
    id: 8,
    rows: 7,
    cols: 7,
    solution: [
      [[4,4], [4,3], [3,3]],
      [[3,4], [2,4], [2,5], [3,5]],
      [[4,5], [5,5], [5,4], [5,3], [6,3], [6,4], [6,5]],
      [[6,6], [5,6], [4,6], [3,6], [2,6], [1,6], [0,6]],
      [[0,5], [1,5], [1,4], [0,4], [0,3], [0,2], [0,1]],
      [[1,1], [1,2], [1,3], [2,3], [2,2], [3,2], [4,2], [4,1]],
      [[5,1], [5,2], [6,2], [6,1], [6,0], [5,0], [4,0], [3,0], [3,1], [2,1], [2,0], [1,0], [0,0]],
    ],
  },
];

export type FlowLevel = {
  id: number;
  rows: number;
  cols: number;
  /** Un color por tubo, en el orden de `endpoints`. */
  colors: FlowColor[];
  /** Las dos puntas fijas de cada tubo. */
  endpoints: [Cell, Cell][];
  /** El recorrido completo de cada tubo. */
  solution: Cell[][];
};

function toCells(raw: [number, number][]): Cell[] {
  return raw.map(([row, col]) => ({ row, col }));
}

export const FLOW_LEVELS: FlowLevel[] = RAW_LEVELS.map((raw) => {
  const solution = raw.solution.map(toCells);
  return {
    id: raw.id,
    rows: raw.rows,
    cols: raw.cols,
    colors: solution.map((_, i) => FLOW_COLORS[i % FLOW_COLORS.length]),
    endpoints: solution.map(
      (path) => [path[0], path[path.length - 1]] as [Cell, Cell],
    ),
    solution,
  };
});

export function findFlowLevel(id: number): FlowLevel | undefined {
  return FLOW_LEVELS.find((level) => level.id === id);
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

export function areAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

/** Índice del tubo que tiene una punta en esa celda, o -1. */
export function endpointAt(level: FlowLevel, cell: Cell): number {
  return level.endpoints.findIndex(
    ([a, b]) => sameCell(a, cell) || sameCell(b, cell),
  );
}

/** Estado del tablero: el camino dibujado de cada tubo. */
export type FlowPaths = Cell[][];

export function emptyPaths(level: FlowLevel): FlowPaths {
  return level.endpoints.map(() => []);
}

/** Un tubo está listo cuando su camino une las dos puntas. */
export function isConnected(level: FlowLevel, paths: FlowPaths, index: number): boolean {
  const path = paths[index];
  if (path.length < 2) return false;
  const [a, b] = level.endpoints[index];
  const first = path[0];
  const last = path[path.length - 1];
  return (
    (sameCell(first, a) && sameCell(last, b)) ||
    (sameCell(first, b) && sameCell(last, a))
  );
}

export function filledCount(paths: FlowPaths): number {
  const seen = new Set<string>();
  for (const path of paths) {
    for (const cell of path) seen.add(`${cell.row},${cell.col}`);
  }
  return seen.size;
}

/** Gana cuando todos los tubos están unidos y no queda ningún casillero libre. */
export function isSolved(level: FlowLevel, paths: FlowPaths): boolean {
  const allConnected = level.endpoints.every((_, i) =>
    isConnected(level, paths, i),
  );
  return allConnected && filledCount(paths) === level.rows * level.cols;
}

/** Qué tubo ocupa una celda, o -1 si está libre. */
export function ownerAt(paths: FlowPaths, cell: Cell): number {
  for (let i = 0; i < paths.length; i++) {
    if (paths[i].some((c) => sameCell(c, cell))) return i;
  }
  return -1;
}

/**
 * Corta el camino de un tubo justo antes de una celda.
 * Es lo que pasa cuando otro color se mete por encima.
 */
export function truncateAt(path: Cell[], cell: Cell): Cell[] {
  const index = path.findIndex((c) => sameCell(c, cell));
  return index === -1 ? path : path.slice(0, index);
}
