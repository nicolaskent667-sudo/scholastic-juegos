"use client";

import { useEffect, useMemo, useState } from "react";
import { exitRoute, pointAt, type Arrow, type ArrowsLevel } from "@/lib/arrows";
import { CRASH_REACH_MS, type Flight } from "@/hooks/useArrowsBoard";

/** Celdas por segundo al salir del tablero. */
const EXIT_SPEED = 16;
const CRASH_BACK_MS = 230;
const FADE_MS = 220;

/** Medidas en celdas: el tablero del SVG usa una unidad por celda. */
const OUTLINE = 0.42;
const FILL = 0.25;
const HEAD_BACK = 0.3;
const HEAD_TIP = 0.3;
const HEAD_HALF = 0.31;
/** El cuerpo termina donde arranca la cabeza, para no asomar por debajo. */
const BODY_TRIM = 0.25;

type Props = {
  level: ArrowsLevel;
  arrow: Arrow;
  flight: Flight | null;
  /** Cambia cada vez que otra flecha le choca: dispara el sacudón. */
  hitNonce: number | null;
  hinted: boolean;
  reduced: boolean;
  onTap: () => void;
  onDone: (nonce: number) => void;
};

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeIn(t: number) {
  return t * t;
}

export default function ArrowSprite({
  level,
  arrow,
  flight,
  hitNonce,
  hinted,
  reduced,
  onTap,
  onDone,
}: Props) {
  const route = useMemo(() => exitRoute(level, arrow), [level, arrow]);
  /** Cuánto avanzó la cola sobre el camino, en celdas. */
  const [travel, setTravel] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!flight) return;
    let frame = 0;
    const start = performance.now();

    const finish = () => onDone(flight.nonce);

    if (flight.kind === "exit") {
      const ms = reduced
        ? FADE_MS
        : Math.max(280, (route.exit / EXIT_SPEED) * 1000);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        if (reduced) {
          setOpacity(1 - t);
        } else {
          setTravel(route.exit * easeIn(t));
          // Se desvanece al final, ya fuera del tablero.
          setOpacity(t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35);
        }
        if (t < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    } else {
      // Avanza hasta tocar al obstáculo y vuelve a su lugar.
      const reach = reduced ? 0 : flight.distance + 0.42;
      const total = CRASH_REACH_MS + CRASH_BACK_MS;
      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed < CRASH_REACH_MS) {
          setTravel(reach * easeIn(elapsed / CRASH_REACH_MS));
        } else {
          const t = Math.min(1, (elapsed - CRASH_REACH_MS) / CRASH_BACK_MS);
          setTravel(reach * (1 - easeOut(t)));
        }
        if (elapsed < total) frame = requestAnimationFrame(tick);
        else {
          setTravel(0);
          finish();
        }
      };
      frame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frame);
    // Solo se reinicia con un vuelo nuevo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight?.nonce]);

  const d = route.points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  const bodyLength = Math.max(0.2, route.body - BODY_TRIM);
  const dash = {
    strokeDasharray: `${bodyLength} ${route.total + 10}`,
    strokeDashoffset: -travel,
  };

  const head = pointAt(route.points, travel + route.body);
  const tail = pointAt(route.points, travel);
  const px = -head.dy;
  const py = head.dx;
  const tip = `${head.x + head.dx * HEAD_TIP},${head.y + head.dy * HEAD_TIP}`;
  const bx = head.x - head.dx * HEAD_BACK;
  const by = head.y - head.dy * HEAD_BACK;
  const headPoints = `${tip} ${bx + px * HEAD_HALF},${by + py * HEAD_HALF} ${bx - px * HEAD_HALF},${by - py * HEAD_HALF}`;

  const cellsPath = arrow.cells
    .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
    .join("");

  const leaving = flight?.kind === "exit";
  const label = `Flecha ${arrow.color.name} hacia ${
    { up: "arriba", down: "abajo", left: "la izquierda", right: "la derecha" }[
      arrow.dir
    ]
  }`;

  return (
    <g
      role={leaving ? undefined : "button"}
      tabIndex={leaving ? -1 : 0}
      aria-label={leaving ? undefined : label}
      aria-hidden={leaving || undefined}
      onPointerDown={(event) => {
        if (leaving) return;
        event.preventDefault();
        onTap();
      }}
      onKeyDown={(event) => {
        if (leaving) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTap();
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible_.focus-ring]:opacity-100"
      style={{ opacity }}
    >
      <g
        key={hitNonce ?? "quieta"}
        style={{
          animation:
            hitNonce !== null ? "arrow-shake 0.35s ease-in-out" : undefined,
        }}
      >
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: hinted ? "arrow-hint 0.9s ease-in-out infinite" : undefined,
          }}
        >
          {/* Área de toque generosa: la flecha es fina para un dedo */}
          {!leaving && (
            <path
              d={cellsPath}
              fill="none"
              stroke="transparent"
              strokeWidth={0.95}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="stroke"
            />
          )}

          {/* Anillo de foco para el teclado */}
          <path
            className="focus-ring opacity-0"
            d={cellsPath}
            fill="none"
            stroke="var(--color-cielo-azul)"
            strokeWidth={0.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.45}
            pointerEvents="none"
          />

          <g pointerEvents="none">
            <path
              d={d}
              fill="none"
              stroke="var(--color-tinta)"
              strokeWidth={OUTLINE}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={dash}
            />
            <path
              d={d}
              fill="none"
              stroke={arrow.color.fill}
              strokeWidth={FILL}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={dash}
            />
            <polygon
              points={headPoints}
              fill={arrow.color.fill}
              stroke="var(--color-tinta)"
              strokeWidth={0.085}
              strokeLinejoin="round"
            />
            <circle
              cx={tail.x}
              cy={tail.y}
              r={0.12}
              fill="white"
              stroke="var(--color-tinta)"
              strokeWidth={0.07}
            />
          </g>
        </g>
      </g>
    </g>
  );
}
