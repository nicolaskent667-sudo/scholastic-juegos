/**
 * Fondo decorativo de la portada: colinas, nubes, estrellas, corazones, las
 * letras sueltas, la pila de libros y el lápiz. Todo SVG, nada de imágenes.
 */

const STARS = [
  { x: 120, y: 140, s: 1.1 },
  { x: 1180, y: 200, s: 1.3 },
  { x: 215, y: 610, s: 1.5 },
  { x: 1310, y: 640, s: 1 },
];

const HEARTS = [
  { x: 225, y: 490, s: 1 },
  { x: 1155, y: 560, s: 1.1 },
];

const LETTERS = [
  { x: 205, y: 300, text: "A", size: 60 },
  { x: 1245, y: 360, text: "B", size: 58 },
  { x: 1130, y: 210, text: "C", size: 52 },
];

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d="M 0 -26 Q 5 -5 26 0 Q 5 5 0 26 Q -5 5 -26 0 Q -5 -5 0 -26 Z"
      fill="var(--color-sol)"
      transform={`translate(${x} ${y}) scale(${s})`}
    />
  );
}

function Heart({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d="M 0 16 L -14 1 A 8.4 8.4 0 0 1 0 -9 A 8.4 8.4 0 0 1 14 1 Z"
      fill="#f28ab0"
      transform={`translate(${x} ${y}) scale(${s})`}
    />
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff">
      <ellipse cx={0} cy={0} rx={62} ry={25} />
      <ellipse cx={-36} cy={10} rx={40} ry={19} />
      <ellipse cx={32} cy={11} rx={35} ry={17} />
    </g>
  );
}

function Books() {
  return (
    <g stroke="var(--color-tinta)" strokeWidth={6} strokeLinejoin="round">
      <rect x={-118} y={40} width={236} height={54} rx={12} fill="#8fb3e8" />
      <rect x={-100} y={-14} width={200} height={54} rx={12} fill="#f0a9c0" />
      <rect x={-86} y={-68} width={172} height={54} rx={12} fill="var(--color-sol)" />
      {/* Señalador */}
      <path d="M -40 -68 l 0 -72 l 46 16 l -46 20 z" fill="var(--color-berry)" />
    </g>
  );
}

function Pencil() {
  return (
    <g
      stroke="var(--color-tinta)"
      strokeWidth={6}
      strokeLinejoin="round"
      transform="rotate(-34)"
    >
      <rect x={-130} y={-22} width={40} height={44} rx={8} fill="#f6c9d8" />
      <rect x={-92} y={-22} width={190} height={44} fill="var(--color-sol)" />
      <path d="M 98 -22 L 150 0 L 98 22 Z" fill="#fff6e6" />
      <path d="M 134 -7 L 150 0 L 134 7 Z" fill="var(--color-tinta)" />
    </g>
  );
}

export default function StartScene() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <rect x={0} y={0} width={1440} height={900} fill="var(--color-cielo)" />

      {/* Burbujas rosas del fondo */}
      <circle cx={175} cy={165} r={105} fill="#fbd3e2" opacity={0.75} />
      <circle cx={1245} cy={255} r={120} fill="#fbd3e2" opacity={0.75} />

      {/* Colinas */}
      <path
        d="M 0 640 C 240 580, 420 700, 720 650 C 980 606, 1180 690, 1440 620 L 1440 900 L 0 900 Z"
        fill="#d8eede"
      />
      <path
        d="M 0 730 C 300 670, 520 780, 820 726 C 1080 680, 1250 760, 1440 706 L 1440 900 L 0 900 Z"
        fill="var(--color-menta)"
      />

      <Cloud x={265} y={330} s={1} />
      <Cloud x={1175} y={425} s={0.95} />

      {STARS.map((star) => (
        <Star key={`${star.x}-${star.y}`} {...star} />
      ))}
      {HEARTS.map((heart) => (
        <Heart key={`${heart.x}-${heart.y}`} {...heart} />
      ))}

      {LETTERS.map((letter) => (
        <text
          key={letter.text}
          x={letter.x}
          y={letter.y}
          fontSize={letter.size}
          fontWeight={400}
          fill="var(--color-tinta)"
          textAnchor="middle"
          fontFamily="var(--font-display)"
        >
          {letter.text}
        </text>
      ))}

      <g transform="translate(300 680)">
        <Books />
      </g>
      <g transform="translate(1150 690) scale(0.92)">
        <Pencil />
      </g>
    </svg>
  );
}
