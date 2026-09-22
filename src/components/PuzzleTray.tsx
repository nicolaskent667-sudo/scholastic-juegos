"use client";

import PuzzlePiece from "@/components/PuzzlePiece";
import { trayTilt, type Piece } from "@/lib/puzzle";

type Props = {
  pieces: Piece[];
  rows: number;
  cols: number;
  pieceWidth: number;
  selectedId: number | null;
  draggingId: number | null;
  onPointerDown: (event: React.PointerEvent<HTMLElement>, piece: Piece) => void;
  onSelect: (pieceId: number) => void;
};

export default function PuzzleTray({
  pieces,
  rows,
  cols,
  pieceWidth,
  selectedId,
  draggingId,
  onPointerDown,
  onSelect,
}: Props) {
  return (
    <div className="rounded-3xl border-[3px] border-tinta bg-crema/80 p-3 sm:p-4">
      <p className="mb-3 text-center text-sm font-bold text-tinta/70">
        {pieces.length === 0
          ? "¡No quedan piezas!"
          : `Faltan ${pieces.length} ${pieces.length === 1 ? "pieza" : "piezas"}`}
      </p>

      <ul className="flex max-h-[42vh] flex-wrap justify-center gap-2 overflow-y-auto sm:gap-3 lg:max-h-[60vh]">
        {pieces.map((piece) => {
          const selected = selectedId === piece.id;
          const dragging = draggingId === piece.id;

          return (
            <li key={piece.id}>
              <div
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={`Pieza ${piece.id + 1}${
                  selected ? ", elegida" : ""
                }`}
                onPointerDown={(event) => onPointerDown(event, piece)}
                onClick={() => onSelect(piece.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(piece.id);
                  }
                }}
                className={[
                  "cursor-grab touch-none rounded-xl border-[3px] transition active:cursor-grabbing",
                  "outline-none focus-visible:ring-4 focus-visible:ring-cielo-azul",
                  selected
                    ? "border-berry ring-4 ring-berry/40"
                    : "border-tinta hover:-translate-y-1",
                  dragging ? "opacity-25" : "",
                ].join(" ")}
                style={{
                  width: pieceWidth,
                  transform: dragging
                    ? undefined
                    : `rotate(${trayTilt(piece.id)}deg)`,
                }}
              >
                <PuzzlePiece
                  piece={piece}
                  rows={rows}
                  cols={cols}
                  className="w-full rounded-lg"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
