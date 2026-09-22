import type { Ref } from "react";

type Props = {
  nodeRef: Ref<SVGGElement>;
};

/**
 * El pajarito azul del picnic, centrado en (0,0) para que el motor lo mueva con
 * un solo translate + rotate.
 */
export default function BirdSprite({ nodeRef }: Props) {
  return (
    <g ref={nodeRef}>
      {/* Líneas de movimiento */}
      <g
        stroke="var(--color-blush)"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      >
        <path d="M -76 4 q -22 -5 -36 2" />
        <path d="M -70 26 q -24 0 -38 9" />
      </g>

      <g
        stroke="var(--color-tinta)"
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Copete */}
        <path d="M -14 -30 l -6 -26 l 17 13 z" fill="var(--color-cielo-azul)" />
        <path d="M 3 -34 l 3 -26 l 12 19 z" fill="var(--color-cielo-azul)" />

        {/* Cuerpo */}
        <circle cx={0} cy={0} r={33} fill="var(--color-cielo-azul)" />

        {/* Pancita */}
        <path
          d="M -6 32 a 33 33 0 0 0 36 -28 a 27 27 0 0 1 -36 28 z"
          fill="var(--color-crema)"
        />

        {/* Ala */}
        <path d="M -12 -4 l -32 -14 l 5 31 z" fill="#4f7fc4" />

        {/* Pico */}
        <path d="M 27 0 l 21 7 l -19 11 z" fill="var(--color-sol)" />

        {/* Patitas */}
        <path d="M -7 33 l -3 12" stroke="var(--color-sol)" strokeWidth={7} />
        <path d="M 10 31 l 4 12" stroke="var(--color-sol)" strokeWidth={7} />
      </g>

      {/* Ojos y cachete: sin contorno, como en la ilustración */}
      <ellipse cx={-5} cy={9} rx={8} ry={6} fill="var(--color-blush)" />
      <circle cx={3} cy={-9} r={5} fill="var(--color-tinta)" />
      <circle cx={19} cy={-9} r={5} fill="var(--color-tinta)" />
      <circle cx={4.5} cy={-11} r={1.8} fill="#ffffff" />
      <circle cx={20.5} cy={-11} r={1.8} fill="#ffffff" />
    </g>
  );
}
