/**
 * Objetos de las cartas del memotest. Mismo criterio que los animales:
 * centrados en (0,0), pensados para un viewBox de 200×200.
 */

const OUTLINE = {
  stroke: "var(--color-tinta)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
};

/** Carita kawaii reutilizable para los objetos que la llevan. */
function Face({ y = 0, gap = 13 }: { y?: number; gap?: number }) {
  return (
    <g stroke="none">
      <ellipse cx={-gap - 9} cy={y + 7} rx={6} ry={4} fill="var(--color-blush)" />
      <ellipse cx={gap + 9} cy={y + 7} rx={6} ry={4} fill="var(--color-blush)" />
      <circle cx={-gap} cy={y} r={4} fill="var(--color-tinta)" />
      <circle cx={gap} cy={y} r={4} fill="var(--color-tinta)" />
      <path
        d={`M ${-6} ${y + 9} q 6 6 12 0`}
        fill="none"
        stroke="var(--color-tinta)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </g>
  );
}

export function YarnSprite() {
  return (
    <g {...OUTLINE}>
      <path
        d="M 44 40 q 32 16 28 40"
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx={0} cy={0} r={52} fill="var(--color-berry)" />
      <g stroke="var(--color-crema)" strokeWidth={7} fill="none" strokeLinecap="round">
        <path d="M -44 -22 q 44 22 74 -18" />
        <path d="M -30 38 q 30 -44 74 -18" />
        <path d="M -46 14 q 36 30 58 -34" />
      </g>
    </g>
  );
}

export function LampSprite() {
  return (
    <g {...OUTLINE}>
      <rect x={-26} y={68} width={52} height={14} rx={6} fill="var(--color-berry)" />
      <rect x={-11} y={-6} width={22} height={74} fill="var(--color-madera)" />
      <rect x={-16} y={26} width={32} height={12} rx={4} fill="var(--color-madera-dark)" />
      <rect x={-26} y={-18} width={52} height={14} rx={5} fill="var(--color-berry)" />
      {/* Farol */}
      <path d="M -22 -18 L -15 -56 L 15 -56 L 22 -18 Z" fill="var(--color-sol)" />
      <path d="M -9 -24 l 7 -26" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" />
      <rect x={-19} y={-66} width={38} height={12} rx={4} fill="var(--color-berry)" />
      <circle cx={0} cy={-72} r={6} fill="var(--color-berry)" />
    </g>
  );
}

export function BookSprite() {
  return (
    <g {...OUTLINE}>
      <path d="M -60 -34 L -60 38 L 0 30 L 0 -42 Z" fill="var(--color-crema)" />
      <path d="M 60 -34 L 60 38 L 0 30 L 0 -42 Z" fill="var(--color-crema)" />
      <path d="M -66 -40 L -60 -34 L -60 38 L -66 32 Z" fill="var(--color-berry)" />
      <path d="M 66 -40 L 60 -34 L 60 38 L 66 32 Z" fill="var(--color-berry)" />
      <g stroke="var(--color-blush)" strokeWidth={4} strokeLinecap="round">
        <path d="M -48 -18 h 34" />
        <path d="M -48 -4 h 34" />
        <path d="M -48 10 h 26" />
      </g>
      {/* Señalador */}
      <path d="M 26 -38 l 0 42 l 11 -11 l 11 11 l 0 -46 z" fill="var(--color-sol)" />
      <Face y={8} gap={10} />
    </g>
  );
}

export function PencilSprite() {
  return (
    <g {...OUTLINE} transform="rotate(-38)">
      <rect x={-84} y={-20} width={34} height={40} rx={7} fill="var(--color-blush)" />
      <rect x={-50} y={-20} width={112} height={40} fill="var(--color-sol)" />
      <path d="M 62 -20 L 104 0 L 62 20 Z" fill="#fff6e6" />
      <path d="M 90 -9 L 104 0 L 90 9 Z" fill="var(--color-tinta)" />
      <g stroke="none" transform="rotate(38) translate(6 -2)">
        <circle cx={-10} cy={0} r={3.6} fill="var(--color-tinta)" />
        <circle cx={10} cy={0} r={3.6} fill="var(--color-tinta)" />
        <ellipse cx={-20} cy={7} rx={5} ry={3.5} fill="var(--color-blush)" />
        <ellipse cx={20} cy={7} rx={5} ry={3.5} fill="var(--color-blush)" />
      </g>
    </g>
  );
}

export function BackpackSprite() {
  return (
    <g {...OUTLINE}>
      {/* Manija */}
      <path
        d="M -18 -48 q 18 -20 36 0"
        fill="none"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <rect x={-52} y={-46} width={104} height={104} rx={26} fill="#8fb3e8" />
      <rect x={-34} y={6} width={68} height={44} rx={14} fill="#6f97d4" />
      <path
        d="M 0 36 L -9 26 A 5.4 5.4 0 0 1 0 19 A 5.4 5.4 0 0 1 9 26 Z"
        fill="var(--color-sol)"
        strokeWidth={3.5}
      />
      <Face y={-22} gap={15} />
    </g>
  );
}

export function RulerSprite() {
  return (
    <g {...OUTLINE} transform="rotate(-18)">
      <rect x={-86} y={-22} width={172} height={44} rx={10} fill="#a8dcc0" />
      {/* Marcas alternadas: las pares más largas, como en una regla de verdad */}
      <g stroke="var(--color-tinta)" strokeWidth={4} strokeLinecap="round">
        {[-62, -38, -14, 10, 34, 58].map((x, i) => (
          <path key={x} d={`M ${x} -22 l 0 ${i % 2 === 0 ? 22 : 14}`} />
        ))}
      </g>
    </g>
  );
}

export function AppleSprite() {
  return (
    <g {...OUTLINE}>
      <path
        d="M 4 -44 q 4 -18 22 -22"
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path d="M 12 -46 q 26 -14 34 6 q -24 12 -34 -6 z" fill="var(--color-menta-dark)" />
      <path
        d="M 0 -42 C 44 -62, 62 -14, 40 26 C 26 52, 10 58, 0 50 C -10 58, -26 52, -40 26 C -62 -14, -44 -62, 0 -42 Z"
        fill="var(--color-berry)"
      />
      <ellipse cx={-22} cy={-12} rx={9} ry={14} fill="#f08a92" stroke="none" transform="rotate(-20 -22 -12)" />
      <Face y={2} gap={14} />
    </g>
  );
}

export function StrawberrySprite() {
  return (
    <g {...OUTLINE}>
      <path d="M 0 -58 l 0 14" strokeWidth={6} strokeLinecap="round" />
      <path
        d="M -30 -44 L -8 -50 L 0 -38 L 8 -50 L 30 -44 L 18 -28 L -18 -28 Z"
        fill="var(--color-menta-dark)"
      />
      <path
        d="M -40 -30 C -10 -40, 10 -40, 40 -30 C 40 14, 16 56, 0 56 C -16 56, -40 14, -40 -30 Z"
        fill="var(--color-berry)"
      />
      <g stroke="none" fill="var(--color-sol)">
        {[
          [-22, 0],
          [-6, 12],
          [14, 2],
          [24, 18],
          [-16, 26],
          [2, 34],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={3} ry={4.5} />
        ))}
      </g>
      <Face y={0} gap={13} />
    </g>
  );
}

export function BasketSprite() {
  return (
    <g {...OUTLINE}>
      {/* Panes y frutas asomando */}
      <ellipse cx={-18} cy={-18} rx={20} ry={13} fill="#e8c9a0" transform="rotate(-18 -18 -18)" />
      <circle cx={16} cy={-16} r={15} fill="var(--color-berry)" />
      {/* Asa */}
      <path
        d="M -34 -12 q 34 -46 68 0"
        fill="none"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path d="M -52 -6 L 52 -6 L 40 56 L -40 56 Z" fill="#d9a56b" />
      <rect x={-58} y={-16} width={116} height={18} rx={8} fill="var(--color-blush)" />
      <g stroke="var(--color-tinta)" strokeWidth={4} fill="none" opacity={0.7}>
        <path d="M -48 14 h 96" />
        <path d="M -44 34 h 88" />
      </g>
    </g>
  );
}

export function FlowerSprite() {
  return (
    <g {...OUTLINE}>
      <path d="M 0 66 L 0 6" strokeWidth={7} stroke="var(--color-menta-dark)" strokeLinecap="round" />
      <path d="M 2 34 q 26 -6 30 -26 q -26 2 -30 26 z" fill="#a8dcc0" />
      <path d="M -2 50 q -26 -6 -30 -26 q 26 2 30 26 z" fill="#a8dcc0" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx={0}
          cy={-34}
          rx={16}
          ry={24}
          fill="var(--color-blush)"
          transform={`rotate(${angle} 0 -8)`}
        />
      ))}
      <circle cx={0} cy={-8} r={18} fill="var(--color-sol)" />
      <g stroke="none">
        <circle cx={-6} cy={-10} r={3} fill="var(--color-tinta)" />
        <circle cx={6} cy={-10} r={3} fill="var(--color-tinta)" />
        <path
          d="M -4 -3 q 4 4 8 0"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

export function SunSprite() {
  return (
    <g {...OUTLINE}>
      <g strokeLinecap="round" strokeWidth={9} stroke="var(--color-sol)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path
            key={angle}
            d="M 0 -50 L 0 -70"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      <circle cx={0} cy={0} r={44} fill="var(--color-sol)" />
      <Face y={-4} gap={14} />
    </g>
  );
}

export function CloudSprite() {
  return (
    <g {...OUTLINE}>
      <path
        d="M -56 22 A 28 28 0 0 1 -44 -30 A 34 34 0 0 1 12 -42 A 30 30 0 0 1 56 -12 A 22 22 0 0 1 50 22 Z"
        fill="#ffffff"
      />
      <Face y={-10} gap={14} />
      <g fill="#8fb3e8" stroke="none">
        {[-24, 0, 24].map((x, i) => (
          <path
            key={x}
            d={`M ${x} ${38 + i * 2} q 6 10 0 14 q -6 -4 0 -14 z`}
          />
        ))}
      </g>
    </g>
  );
}

export function StarSprite() {
  return (
    <g {...OUTLINE}>
      <path
        d="M 0 -58 L 17 -18 L 60 -14 L 28 14 L 37 56 L 0 34 L -37 56 L -28 14 L -60 -14 L -17 -18 Z"
        fill="var(--color-sol)"
      />
      <Face y={0} gap={12} />
    </g>
  );
}

export function HeartSprite() {
  return (
    <g {...OUTLINE}>
      <path
        d="M 0 56 L -44 6 A 26 26 0 0 1 0 -28 A 26 26 0 0 1 44 6 Z"
        fill="var(--color-berry)"
      />
      <ellipse cx={-20} cy={-2} rx={7} ry={11} fill="#f08a92" stroke="none" transform="rotate(-25 -20 -2)" />
      <Face y={2} gap={13} />
    </g>
  );
}

export function ButterflySprite() {
  return (
    <g {...OUTLINE}>
      {/* Antenas */}
      <g fill="none" strokeWidth={4} strokeLinecap="round">
        <path d="M -5 -30 q -10 -18 -20 -22" />
        <path d="M 5 -30 q 10 -18 20 -22" />
      </g>
      <circle cx={-26} cy={-52} r={4} fill="var(--color-tinta)" />
      <circle cx={26} cy={-52} r={4} fill="var(--color-tinta)" />
      {/* Alas de arriba */}
      <ellipse cx={-34} cy={-14} rx={30} ry={24} fill="var(--color-blush)" />
      <ellipse cx={34} cy={-14} rx={30} ry={24} fill="var(--color-blush)" />
      {/* Alas de abajo */}
      <ellipse cx={-28} cy={24} rx={24} ry={20} fill="var(--color-sol)" />
      <ellipse cx={28} cy={24} rx={24} ry={20} fill="var(--color-sol)" />
      <g stroke="none" fill="#ffffff">
        <circle cx={-38} cy={-18} r={7} />
        <circle cx={38} cy={-18} r={7} />
        <circle cx={-30} cy={24} r={6} />
        <circle cx={30} cy={24} r={6} />
      </g>
      {/* Cuerpo */}
      <ellipse cx={0} cy={2} rx={9} ry={34} fill="var(--color-tinta)" />
    </g>
  );
}

export function PawSprite() {
  return (
    <g {...OUTLINE}>
      <ellipse cx={-34} cy={-16} rx={16} ry={20} fill="var(--color-berry)" transform="rotate(-18 -34 -16)" />
      <ellipse cx={-11} cy={-36} rx={15} ry={19} fill="var(--color-berry)" />
      <ellipse cx={13} cy={-36} rx={15} ry={19} fill="var(--color-berry)" />
      <ellipse cx={36} cy={-16} rx={16} ry={20} fill="var(--color-berry)" transform="rotate(18 36 -16)" />
      <ellipse cx={0} cy={28} rx={40} ry={32} fill="var(--color-berry)" />
      <ellipse cx={0} cy={30} rx={22} ry={17} fill="#f08a92" stroke="none" />
    </g>
  );
}
