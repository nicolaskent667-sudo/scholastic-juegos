"use client";

import { useId } from "react";
import { CAPACITY, TUBE_COLORS, isComplete, type Tube } from "@/lib/tubes";

type Props = {
  tube: Tube;
  /** Levantado, esperando destino. */
  picked: boolean;
  /** Rechazó una jugada recién: se sacude. */
  rejected: boolean;
  /** Señalado por la pista. */
  hinted: boolean;
  onTap: () => void;
  label: string;
};

const BODY =
  "M 6 14 a 8 8 0 0 1 8 -8 h 72 a 8 8 0 0 1 8 8 v 218 a 44 44 0 0 1 -44 44 a 44 44 0 0 1 -44 -44 z";
const INNER =
  "M 9 11 h 82 v 221 a 41 41 0 0 1 -41 41 a 41 41 0 0 1 -41 -41 z";

/** Alto útil del interior, repartido entre las porciones. */
const FILL_TOP = 11;
const FILL_HEIGHT = 262;

/**
 * Un tubo de ensayo: tapa plana con dos muescas, fondo redondeado y las
 * porciones apiladas desde abajo. El brillo vertical de la izquierda es lo que
 * lo hace leer como vidrio.
 */
export default function TubeSprite({
  tube,
  picked,
  rejected,
  hinted,
  onTap,
  label,
}: Props) {
  // `useId` garantiza que dos tubos no compartan el mismo clipPath.
  const clipId = useId();
  const complete = isComplete(tube);
  const slotHeight = FILL_HEIGHT / CAPACITY;

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={label}
      aria-pressed={picked}
      className={[
        "relative block w-full cursor-pointer outline-none",
        "transition-transform duration-150 focus-visible:ring-4 focus-visible:ring-cielo-azul",
        // El tubo elegido se levanta, como si lo tuvieras en la mano.
        picked ? "-translate-y-3" : "hover:-translate-y-1",
        rejected ? "animate-shake" : "",
      ].join(" ")}
      style={{ aspectRatio: "1 / 3.1" }}
    >
      <svg viewBox="0 0 100 310" className="h-full w-full">
        <defs>
          <clipPath id={clipId}>
            <path d={INNER} />
          </clipPath>
        </defs>

        <path
          d={BODY}
          fill="var(--color-crema)"
          stroke="var(--color-tinta)"
          strokeWidth={7}
          strokeLinejoin="round"
        />

        <g clipPath={`url(#${clipId})`}>
          {tube.map((colorIndex, i) => {
            const color = TUBE_COLORS[colorIndex % TUBE_COLORS.length];
            const y = FILL_TOP + FILL_HEIGHT - (i + 1) * slotHeight;
            return (
              <g key={i}>
                <rect x={9} y={y} width={82} height={slotHeight} fill={color.fill} />
                {/* Línea tenue para que se vean dos porciones iguales apiladas */}
                {i > 0 && (
                  <line
                    x1={9}
                    y1={y + slotHeight}
                    x2={91}
                    y2={y + slotHeight}
                    stroke="var(--color-tinta)"
                    strokeWidth={1.5}
                    opacity={0.18}
                  />
                )}
              </g>
            );
          })}
          {/* Brillo de vidrio, por encima del líquido */}
          <rect x={16} y={18} width={9} height={248} rx={4.5} fill="#ffffff" opacity={0.45} />
        </g>

        {/* Tapa con las dos muescas */}
        <rect
          x={6}
          y={6}
          width={88}
          height={20}
          rx={8}
          fill="var(--color-crema)"
          stroke="var(--color-tinta)"
          strokeWidth={7}
        />
        <rect x={22} y={12} width={20} height={8} rx={4} fill="#cbc3c6" />
        <rect x={56} y={12} width={20} height={8} rx={4} fill="#cbc3c6" />

        {/* El tubo terminado se remarca en verde */}
        {complete && (
          <path d={BODY} fill="none" stroke="var(--color-menta-dark)" strokeWidth={7} />
        )}

        {/* La pista lo rodea con un punteado */}
        {hinted && (
          <path
            d="M 2 12 a 10 10 0 0 1 10 -10 h 76 a 10 10 0 0 1 10 10 v 222 a 48 48 0 0 1 -48 48 a 48 48 0 0 1 -48 -48 z"
            fill="none"
            stroke="var(--color-sol)"
            strokeWidth={5}
            strokeDasharray="12 10"
          />
        )}
      </svg>
    </button>
  );
}
