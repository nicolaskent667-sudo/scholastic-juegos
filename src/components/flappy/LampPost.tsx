import type { Ref } from "react";
import { LAMP, WORLD } from "@/lib/flappy";

const HALF_GAP = LAMP.gap / 2;
const POLE_W = LAMP.halfPoleWidth;
const SHADE_W = LAMP.halfShadeWidth;
const SHADE_H = LAMP.shadeHeight;
/** Los caños llegan siempre más allá del borde de pantalla. */
const POLE_END = 1500;

/** Collares del caño, a distancias fijas del hueco. */
const COLLARS = [320, 600, 880, 1160];

type Props = {
  /** Cuerpo del farol: el motor lo mueve con translate(x, gapY). */
  bodyRef: Ref<SVGGElement>;
  /** Tapa y base: solo se mueven en x, quedan clavadas al techo y al piso. */
  fixtureRef: Ref<SVGGElement>;
};

/**
 * El hueco es de tamaño constante, así que toda esta geometría es fija y el
 * motor la posiciona con un único transform por grupo.
 * El origen (0,0) es el centro del hueco.
 */
export default function LampPost({ bodyRef, fixtureRef }: Props) {
  return (
    <>
      <g
        ref={bodyRef}
        stroke="var(--color-tinta)"
        strokeWidth={6}
        strokeLinejoin="round"
      >
        {/* Haz de luz entre las dos pantallas */}
        <polygon
          points={`${-SHADE_W},${-HALF_GAP} ${SHADE_W},${-HALF_GAP} ${SHADE_W + 90},0 ${SHADE_W},${HALF_GAP} ${-SHADE_W},${HALF_GAP} ${-SHADE_W - 90},0`}
          fill="url(#beamGlow)"
          stroke="none"
        />

        {/* ---- Arriba ---- */}
        <rect
          x={-POLE_W}
          y={-POLE_END}
          width={POLE_W * 2}
          height={POLE_END - HALF_GAP - SHADE_H}
          fill="var(--color-madera)"
        />
        {COLLARS.map((d) => (
          <rect
            key={`t${d}`}
            x={-POLE_W - 6}
            y={-HALF_GAP - SHADE_H - d}
            width={POLE_W * 2 + 12}
            height={26}
            rx={6}
            fill="var(--color-madera-dark)"
          />
        ))}
        {/* Pantalla: trapecio que se abre hacia el hueco */}
        <path
          d={`M ${-POLE_W - 4} ${-HALF_GAP - SHADE_H} L ${POLE_W + 4} ${-HALF_GAP - SHADE_H} L ${SHADE_W} ${-HALF_GAP} L ${-SHADE_W} ${-HALF_GAP} Z`}
          fill="var(--color-sol)"
        />
        <path
          d={`M ${-SHADE_W + 18} ${-HALF_GAP - 12} l 10 -46`}
          stroke="#ffffff"
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.75}
        />
        <rect
          x={-SHADE_W - 6}
          y={-HALF_GAP - 26}
          width={SHADE_W * 2 + 12}
          height={26}
          rx={8}
          fill="var(--color-berry)"
        />
        <rect
          x={-POLE_W - 12}
          y={-HALF_GAP - SHADE_H - 24}
          width={POLE_W * 2 + 24}
          height={26}
          rx={8}
          fill="var(--color-berry)"
        />

        {/* ---- Abajo (espejado) ---- */}
        <rect
          x={-POLE_W}
          y={HALF_GAP + SHADE_H}
          width={POLE_W * 2}
          height={POLE_END - HALF_GAP - SHADE_H}
          fill="var(--color-madera)"
        />
        {COLLARS.map((d) => (
          <rect
            key={`b${d}`}
            x={-POLE_W - 6}
            y={HALF_GAP + SHADE_H + d - 26}
            width={POLE_W * 2 + 12}
            height={26}
            rx={6}
            fill="var(--color-madera-dark)"
          />
        ))}
        <path
          d={`M ${-SHADE_W} ${HALF_GAP} L ${SHADE_W} ${HALF_GAP} L ${POLE_W + 4} ${HALF_GAP + SHADE_H} L ${-POLE_W - 4} ${HALF_GAP + SHADE_H} Z`}
          fill="var(--color-sol)"
        />
        <path
          d={`M ${-SHADE_W + 22} ${HALF_GAP + 58} l 10 -46`}
          stroke="#ffffff"
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.75}
        />
        <rect
          x={-SHADE_W - 6}
          y={HALF_GAP}
          width={SHADE_W * 2 + 12}
          height={26}
          rx={8}
          fill="var(--color-berry)"
        />
        <rect
          x={-POLE_W - 12}
          y={HALF_GAP + SHADE_H - 2}
          width={POLE_W * 2 + 24}
          height={26}
          rx={8}
          fill="var(--color-berry)"
        />
      </g>

      <g
        ref={fixtureRef}
        stroke="var(--color-tinta)"
        strokeWidth={6}
        strokeLinejoin="round"
      >
        <rect
          x={-78}
          y={-8}
          width={156}
          height={34}
          rx={12}
          fill="var(--color-berry)"
        />
        <rect
          x={-78}
          y={WORLD.groundY - 34}
          width={156}
          height={34}
          rx={12}
          fill="var(--color-berry)"
        />
      </g>
    </>
  );
}
