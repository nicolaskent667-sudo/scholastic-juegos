"use client";

import PuzzlePiece from "@/components/PuzzlePiece";
import type { DragState } from "@/hooks/usePointerDrag";

type Props = {
  drag: DragState;
  rows: number;
  cols: number;
};

/** La pieza "levantada" que sigue al dedo o al mouse. */
export default function DragLayer({ drag, rows, cols }: Props) {
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{
        width: drag.width,
        transform: `translate3d(${drag.x - drag.offsetX}px, ${
          drag.y - drag.offsetY
        }px, 0) scale(1.08) rotate(-3deg)`,
      }}
    >
      <PuzzlePiece
        piece={drag.piece}
        rows={rows}
        cols={cols}
        className="w-full rounded-xl border-[3px] border-tinta shadow-[0_12px_24px_rgba(90,42,51,0.35)]"
      />
    </div>
  );
}
