"use client";

import type { CSSProperties } from "react";
import { ASPECT, pieceStyle, type Piece } from "@/lib/puzzle";

type Props = {
  piece: Piece;
  rows: number;
  cols: number;
  className?: string;
  style?: CSSProperties;
};

/** El recorte puro de la imagen. No sabe nada de arrastre ni de estado. */
export default function PuzzlePiece({
  piece,
  rows,
  cols,
  className = "",
  style,
}: Props) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        aspectRatio: ASPECT,
        ...pieceStyle(piece, rows, cols),
        ...style,
      }}
    />
  );
}
