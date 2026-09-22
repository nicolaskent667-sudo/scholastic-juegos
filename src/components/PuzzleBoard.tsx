"use client";

import Image from "next/image";
import PuzzlePiece from "@/components/PuzzlePiece";
import { ASPECT, PUZZLE } from "@/lib/puzzle";

type Props = {
  rows: number;
  cols: number;
  /** índice de slot → id de pieza colocada (o null si está vacío). */
  placed: (number | null)[];
  wrongSlot: number | null;
  justPlaced: number | null;
  /** Hay una pieza elegida esperando destino (modo click/teclado). */
  hasSelection: boolean;
  showGuide: boolean;
  onSlotActivate: (slotIndex: number) => void;
};

export default function PuzzleBoard({
  rows,
  cols,
  placed,
  wrongSlot,
  justPlaced,
  hasSelection,
  showGuide,
  onSlotActivate,
}: Props) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-[3px] border-tinta bg-crema shadow-[0_10px_0_rgba(90,42,51,0.15)]"
      style={{ aspectRatio: ASPECT }}
    >
      {/* Imagen guía por detrás de la grilla */}
      <Image
        src={PUZZLE.src}
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 1024px) 92vw, 720px"
        className="pointer-events-none select-none object-cover transition-opacity duration-300"
        style={{ opacity: showGuide ? 0.55 : 0.1 }}
      />

      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {placed.map((pieceId, slotIndex) => {
          const filled = pieceId !== null;
          const row = Math.floor(slotIndex / cols);
          const col = slotIndex % cols;

          return (
            <button
              key={slotIndex}
              type="button"
              data-slot-index={slotIndex}
              disabled={filled}
              onClick={() => onSlotActivate(slotIndex)}
              aria-label={
                filled
                  ? `Casillero fila ${row + 1}, columna ${col + 1}: completo`
                  : `Casillero vacío fila ${row + 1}, columna ${col + 1}`
              }
              className={[
                "relative block h-full w-full outline-none",
                filled
                  ? "cursor-default"
                  : "cursor-pointer bg-crema/55 focus-visible:z-10 focus-visible:ring-4 focus-visible:ring-cielo-azul",
                !filled && hasSelection
                  ? "ring-2 ring-inset ring-tinta/35 hover:bg-sol/35"
                  : "",
                wrongSlot === slotIndex ? "animate-shake" : "",
              ].join(" ")}
            >
              {filled ? (
                <PuzzlePiece
                  piece={{ id: pieceId, row, col }}
                  rows={rows}
                  cols={cols}
                  className={`h-full w-full ${
                    justPlaced === slotIndex ? "animate-pop" : ""
                  }`}
                  style={{ aspectRatio: "auto" }}
                />
              ) : (
                <span className="absolute inset-[6%] rounded-lg border-2 border-dashed border-tinta/25" />
              )}

              {wrongSlot === slotIndex && (
                <span className="absolute inset-0 bg-berry/25" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
