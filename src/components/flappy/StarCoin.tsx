import type { Ref } from "react";
import { STAR_RADIUS } from "@/lib/flappy";

type Props = {
  nodeRef: Ref<SVGGElement>;
};

/** Estrella de 4 puntas dentro de una moneda crema, centrada en (0,0). */
export default function StarCoin({ nodeRef }: Props) {
  return (
    <g ref={nodeRef}>
      <circle
        cx={0}
        cy={0}
        r={STAR_RADIUS}
        fill="var(--color-crema)"
        stroke="var(--color-tinta)"
        strokeWidth={5}
      />
      <path
        d="M 0 -19 Q 4 -4 19 0 Q 4 4 0 19 Q -4 4 -19 0 Q -4 -4 0 -19 Z"
        fill="var(--color-sol)"
        stroke="var(--color-tinta)"
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </g>
  );
}
