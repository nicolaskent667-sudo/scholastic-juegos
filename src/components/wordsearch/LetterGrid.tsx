"use client";

import type { ActiveSelection } from "@/hooks/useCellSelection";
import {
  placementCells,
  readSelection,
  type Board,
  type Cell,
  type Placement,
} from "@/lib/wordsearch";

/** Las cápsulas rotan de color según el orden en que se van encontrando. */
const CAPSULE_COLORS = [
  "var(--color-berry)",
  "var(--color-menta-dark)",
  "var(--color-sol)",
  "var(--color-cielo-azul)",
  "var(--color-blush)",
];

type Props = {
  board: Board;
  worldName: string;
  worldHint: string;
  /** Colocaciones ya encontradas, en orden de hallazgo. */
  found: Placement[];
  active: ActiveSelection | null;
  anchor: Cell | null;
  /** Celda que la pista está señalando. */
  hintCell: Cell | null;
  shake: boolean;
  onCellDown: (event: React.PointerEvent<HTMLElement>, cell: Cell) => void;
  onCellTap: (cell: Cell) => void;
};

/** Centro de una celda en las coordenadas del overlay (1 unidad = 1 celda). */
function center(cell: Cell): { x: number; y: number } {
  return { x: cell.col + 0.5, y: cell.row + 0.5 };
}

export default function LetterGrid({
  board,
  worldName,
  worldHint,
  found,
  active,
  anchor,
  hintCell,
  shake,
  onCellDown,
  onCellTap,
}: Props) {
  const { size, grid } = board;

  // La selección en curso solo vale si los extremos están alineados.
  const activeLine = active ? readSelection(grid, active.from, active.to) : null;
  const activeValid = activeLine !== null;

  return (
    <div
      className={`rounded-3xl border-[3px] border-tinta bg-crema p-3 sm:p-4 ${
        shake ? "animate-shake" : ""
      }`}
    >
      <p className="mb-2 text-sm font-bold text-tinta/60">
        {worldName} · {worldHint}
      </p>

      <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
        {/* Cápsulas y trazo en curso, por encima de las letras */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          aria-hidden
        >
          {found.map((placement, i) => {
            const cells = placementCells(placement);
            const a = center(cells[0]);
            const b = center(cells[cells.length - 1]);
            return (
              <line
                key={placement.word}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={CAPSULE_COLORS[i % CAPSULE_COLORS.length]}
                strokeWidth={0.78}
                strokeLinecap="round"
                opacity={0.42}
              />
            );
          })}

          {active && (
            <line
              x1={center(active.from).x}
              y1={center(active.from).y}
              x2={center(active.to).x}
              y2={center(active.to).y}
              stroke={
                activeValid ? "var(--color-berry)" : "var(--color-tinta)"
              }
              strokeWidth={0.78}
              strokeLinecap="round"
              strokeDasharray="0.28 0.22"
              opacity={activeValid ? 0.55 : 0.28}
              fill="none"
            />
          )}
        </svg>

        <div
          className="absolute inset-0 grid overflow-hidden rounded-2xl border-2 border-blush"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const isAnchor = anchor?.row === r && anchor?.col === c;
              const isHint = hintCell?.row === r && hintCell?.col === c;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  data-cell={`${r}-${c}`}
                  onPointerDown={(event) => onCellDown(event, { row: r, col: c })}
                  onClick={() => onCellTap({ row: r, col: c })}
                  aria-label={`Fila ${r + 1}, columna ${c + 1}, letra ${letter}`}
                  className={[
                    "flex cursor-pointer touch-none select-none items-center justify-center",
                    "border border-blush/70 text-[clamp(0.6rem,2.4vw,1.35rem)] font-extrabold text-tinta",
                    "outline-none transition-colors focus-visible:z-20 focus-visible:ring-4 focus-visible:ring-cielo-azul",
                    isAnchor ? "bg-berry/25" : "hover:bg-sol/25",
                    isHint ? "animate-pulse bg-sol/60 ring-4 ring-inset ring-berry" : "",
                  ].join(" ")}
                >
                  {letter}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
