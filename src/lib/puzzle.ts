import type { CSSProperties } from "react";

/** La ilustración del nivel. El tamaño real importa para no deformar el recorte. */
export const PUZZLE = {
  src: "/img/scholastic_sieni_picnic_amigos.png",
  width: 2776,
  height: 2120,
  title: "Picnic de Amigos",
  alt: "Un picnic sobre un mantel a cuadros rosa con una coneja, una ovejita, un pingüino, una rana, un patito, un pollito, una perrita y un pajarito.",
} as const;

/** ≈ 1.309 — lo usan el tablero y cada pieza como aspect-ratio. */
export const ASPECT = PUZZLE.width / PUZZLE.height;

export type Difficulty = {
  id: "facil" | "normal" | "dificil";
  label: string;
  emoji: string;
  rows: number;
  cols: number;
};

export const DIFFICULTIES: Difficulty[] = [
  { id: "facil", label: "Fácil", emoji: "🐣", rows: 3, cols: 3 },
  { id: "normal", label: "Normal", emoji: "🐰", rows: 4, cols: 4 },
  { id: "dificil", label: "Difícil", emoji: "🐧", rows: 5, cols: 5 },
];

/** El `id` de una pieza es también el índice del slot al que pertenece. */
export type Piece = {
  id: number;
  row: number;
  col: number;
};

export function createPieces(rows: number, cols: number): Piece[] {
  const pieces: Piece[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({ id: row * cols + col, row, col });
    }
  }
  return pieces;
}

/** Fisher-Yates sobre una copia. Solo se llama en el cliente (handlers/efectos). */
export function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Mezcla garantizando que no quede el orden original (importa sobre todo en 3×3). */
export function shuffleDistinct(pieces: readonly Piece[]): Piece[] {
  if (pieces.length < 2) return [...pieces];
  let out = shuffle(pieces);
  let guard = 0;
  while (out.every((p, i) => p.id === pieces[i].id) && guard++ < 20) {
    out = shuffle(pieces);
  }
  return out;
}

/**
 * Recorte de la pieza vía background-position: sin canvas ni imágenes generadas.
 * El elemento debe tener el mismo aspect-ratio que el tablero completo.
 */
export function pieceStyle(
  piece: Piece,
  rows: number,
  cols: number,
): CSSProperties {
  return {
    backgroundImage: `url(${PUZZLE.src})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${cols > 1 ? (piece.col / (cols - 1)) * 100 : 0}% ${
      rows > 1 ? (piece.row / (rows - 1)) * 100 : 0
    }%`,
    backgroundRepeat: "no-repeat",
  };
}

/** Inclinación estable por pieza para que la bandeja parezca "piezas tiradas". */
export function trayTilt(id: number): number {
  return ((id * 37) % 11) - 5;
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
