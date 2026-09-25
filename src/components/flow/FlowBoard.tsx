"use client";

import { sameCell, type Cell, type FlowLevel, type FlowPaths } from "@/lib/flow";

/** Celda → centro en las coordenadas del overlay (1 unidad = 1 casillero). */
function center(cell: Cell) {
  return { x: cell.col + 0.5, y: cell.row + 0.5 };
}

function toPolyline(path: Cell[]): string {
  return path.map((cell) => `${center(cell).x},${center(cell).y}`).join(" ");
}

type Props = {
  level: FlowLevel;
  paths: FlowPaths;
  drawing: number;
  /** Camino que muestra la pista, o null. */
  hint: { index: number; path: Cell[] } | null;
  onCellDown: (event: React.PointerEvent<HTMLElement>, cell: Cell) => void;
};

export default function FlowBoard({
  level,
  paths,
  drawing,
  hint,
  onCellDown,
}: Props) {
  const { rows, cols } = level;

  return (
    <div className="rounded-3xl border-[3px] border-tinta bg-crema p-3 sm:p-4">
      <p className="mb-2 text-sm font-bold text-tinta/60">
        Nivel {level.id} · Tubos de colores
      </p>

      <div className="relative w-full" style={{ aspectRatio: `${cols} / ${rows}` }}>
        {/* Casilleros vacíos, debajo de todo */}
        <div
          className="absolute inset-0 grid gap-[2%]"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
          aria-hidden
        >
          {Array.from({ length: rows * cols }, (_, i) => (
            <span
              key={i}
              className="rounded-[22%] border-2 border-blush/70 bg-white/70"
            />
          ))}
        </div>

        {/* Tubos y puntas */}
        <svg
          viewBox={`0 0 ${cols} ${rows}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {hint && (
            <polyline
              points={toPolyline(hint.path)}
              fill="none"
              stroke={level.colors[hint.index].fill}
              strokeWidth={0.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.18 0.16"
              opacity={0.65}
            />
          )}

          {paths.map((path, i) => {
            if (path.length < 2) return null;
            const color = level.colors[i];
            const points = toPolyline(path);
            return (
              <g key={color.id}>
                {/* Contorno vino, como el resto del juego */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--color-tinta)"
                  strokeWidth={0.56}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={color.fill}
                  strokeWidth={0.44}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={color.light}
                  strokeWidth={0.16}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {level.endpoints.map(([a, b], i) => {
            const color = level.colors[i];
            const isDrawing = drawing === i;
            return (
              <g key={`end-${color.id}`}>
                {[a, b].map((cell) => {
                  const { x, y } = center(cell);
                  // La punta desde la que se está dibujando lleva el halo.
                  const active =
                    isDrawing &&
                    paths[i].length > 0 &&
                    sameCell(paths[i][0], cell);
                  return (
                    <g key={`${cell.row}-${cell.col}`}>
                      {active && (
                        <circle
                          cx={x}
                          cy={y}
                          r={0.42}
                          fill="none"
                          stroke={color.fill}
                          strokeWidth={0.06}
                          strokeDasharray="0.1 0.09"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={0.32}
                        fill={color.fill}
                        stroke="var(--color-tinta)"
                        strokeWidth={0.055}
                      />
                      <circle
                        cx={x - 0.1}
                        cy={y - 0.1}
                        r={0.075}
                        fill="#ffffff"
                        opacity={0.85}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Zona sensible al puntero, por encima de todo */}
        <div
          className="absolute inset-0 grid touch-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }, (_, i) => {
            const cell = { row: Math.floor(i / cols), col: i % cols };
            return (
              <span
                key={i}
                data-flow={`${cell.row}-${cell.col}`}
                onPointerDown={(event) => onCellDown(event, cell)}
                className="cursor-pointer"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
