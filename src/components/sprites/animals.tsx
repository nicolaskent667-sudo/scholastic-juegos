/**
 * Los animalitos que faltaban para el memotest. Todos centrados en (0,0) y
 * pensados para un viewBox de 200×200, con el mismo trazo vino del resto.
 */

const OUTLINE = {
  stroke: "var(--color-tinta)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
};

function Shadow({ rx = 40, y = 66 }: { rx?: number; y?: number }) {
  return <ellipse cx={0} cy={y} rx={rx} ry={8} fill="var(--color-blush)" />;
}

export function CatSprite() {
  return (
    <g {...OUTLINE}>
      <Shadow />
      {/* Cola */}
      <path
        d="M 40 50 q 34 -2 30 -30 q -2 -14 -14 -12 q -10 2 -6 12"
        fill="none"
        strokeWidth={9}
        strokeLinecap="round"
      />
      {/* Cuerpo */}
      <path d="M -40 66 a 40 44 0 0 1 80 0 z" fill="var(--color-crema)" />
      <path d="M 8 66 a 32 40 0 0 0 30 -30 q 6 26 -12 30 z" fill="#2f2a33" />
      <ellipse cx={-18} cy={66} rx={13} ry={8} fill="var(--color-crema)" />
      <ellipse cx={18} cy={66} rx={13} ry={8} fill="var(--color-crema)" />

      {/* Orejas */}
      <path d="M -34 -34 l -6 -32 l 26 16 z" fill="#2f2a33" />
      <path d="M 34 -34 l 6 -32 l -26 16 z" fill="var(--color-crema)" />

      {/* Cabeza */}
      <circle cx={0} cy={-6} r={36} fill="var(--color-crema)" />
      <path d="M -36 -10 a 36 36 0 0 1 20 -30 q -18 8 -20 30 z" fill="#2f2a33" />

      {/* Bigotes */}
      <g strokeWidth={3.5} strokeLinecap="round" fill="none">
        <path d="M -30 2 l -22 -6" />
        <path d="M -30 10 l -22 6" />
        <path d="M 30 2 l 22 -6" />
        <path d="M 30 10 l 22 6" />
      </g>

      <g stroke="none">
        <ellipse cx={-22} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={22} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <circle cx={-12} cy={-8} r={4.5} fill="var(--color-tinta)" />
        <circle cx={12} cy={-8} r={4.5} fill="var(--color-tinta)" />
        <circle cx={-10.5} cy={-9.5} r={1.6} fill="#ffffff" />
        <circle cx={13.5} cy={-9.5} r={1.6} fill="#ffffff" />
      </g>
      <path
        d="M -8 6 q 8 8 16 0"
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </g>
  );
}

export function DuckSprite() {
  return (
    <g {...OUTLINE}>
      <Shadow />
      <path d="M -6 -40 l 2 -18 l 12 14 z" fill="var(--color-crema)" />
      <circle cx={0} cy={0} r={40} fill="var(--color-crema)" />
      {/* Alita */}
      <ellipse cx={22} cy={14} rx={18} ry={14} fill="#efe6d4" />
      {/* Patitas */}
      <path d="M -16 38 l -4 14 l 14 0 z" fill="var(--color-sol)" />
      <path d="M 16 38 l 4 14 l -14 0 z" fill="var(--color-sol)" />
      {/* Pico */}
      <ellipse cx={-2} cy={8} rx={16} ry={9} fill="var(--color-sol)" />
      <g stroke="none">
        <ellipse cx={-28} cy={2} rx={7} ry={5} fill="var(--color-blush)" />
        <circle cx={-12} cy={-12} r={5} fill="var(--color-tinta)" />
        <circle cx={10} cy={-12} r={5} fill="var(--color-tinta)" />
        <circle cx={-10.5} cy={-13.5} r={1.8} fill="#ffffff" />
        <circle cx={11.5} cy={-13.5} r={1.8} fill="#ffffff" />
      </g>
    </g>
  );
}

export function PenguinSprite() {
  return (
    <g {...OUTLINE}>
      <Shadow rx={34} />
      {/* Cuerpo */}
      <ellipse cx={0} cy={2} rx={40} ry={52} fill="#4a5f80" />
      <ellipse cx={0} cy={10} rx={26} ry={40} fill="var(--color-crema)" />
      {/* Aletas */}
      <path d="M -38 -6 q -16 24 -6 42 q 10 -12 12 -34 z" fill="#3e5070" />
      <path d="M 38 -6 q 16 24 6 42 q -10 -12 -12 -34 z" fill="#3e5070" />
      {/* Patitas */}
      <ellipse cx={-15} cy={56} rx={13} ry={7} fill="var(--color-sol)" />
      <ellipse cx={15} cy={56} rx={13} ry={7} fill="var(--color-sol)" />
      <g stroke="none">
        <ellipse cx={-24} cy={-2} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={24} cy={-2} rx={7} ry={5} fill="var(--color-blush)" />
        <circle cx={-11} cy={-18} r={5} fill="var(--color-tinta)" />
        <circle cx={11} cy={-18} r={5} fill="var(--color-tinta)" />
        <circle cx={-9.5} cy={-19.5} r={1.8} fill="#ffffff" />
        <circle cx={12.5} cy={-19.5} r={1.8} fill="#ffffff" />
      </g>
      <path d="M -9 -4 l 9 14 l 9 -14 z" fill="var(--color-sol)" />
    </g>
  );
}

export function LizardSprite() {
  return (
    <g {...OUTLINE}>
      <Shadow rx={38} />
      {/* Cola enroscada */}
      <path
        d="M 34 44 q 34 6 36 -18 q 2 -18 -14 -18 q -14 0 -12 14 q 2 10 12 8"
        fill="none"
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Cuerpo */}
      <path d="M -38 64 a 38 42 0 0 1 76 0 z" fill="#7fd196" />
      <ellipse cx={0} cy={44} rx={24} ry={20} fill="#c7ecd2" />
      <ellipse cx={-26} cy={64} rx={14} ry={8} fill="#7fd196" />
      <ellipse cx={26} cy={64} rx={14} ry={8} fill="#7fd196" />
      {/* Cabeza con los ojos arriba, como una ranita */}
      <circle cx={-20} cy={-18} r={15} fill="#7fd196" />
      <circle cx={20} cy={-18} r={15} fill="#7fd196" />
      <ellipse cx={0} cy={2} rx={38} ry={30} fill="#7fd196" />
      <g stroke="none">
        <ellipse cx={-30} cy={10} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={30} cy={10} rx={7} ry={5} fill="var(--color-blush)" />
        <circle cx={-20} cy={-18} r={5} fill="var(--color-tinta)" />
        <circle cx={20} cy={-18} r={5} fill="var(--color-tinta)" />
        <circle cx={-18.5} cy={-19.5} r={1.8} fill="#ffffff" />
        <circle cx={21.5} cy={-19.5} r={1.8} fill="#ffffff" />
      </g>
      <path
        d="M -14 8 q 14 14 28 0"
        fill="none"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
}

export function RabbitSprite() {
  return (
    <g {...OUTLINE}>
      <Shadow rx={38} />
      {/* Orejas */}
      <ellipse cx={-16} cy={-52} rx={11} ry={30} fill="var(--color-crema)" />
      <ellipse cx={16} cy={-52} rx={11} ry={30} fill="var(--color-crema)" />
      <ellipse cx={-16} cy={-52} rx={5} ry={20} fill="var(--color-blush)" stroke="none" />
      <ellipse cx={16} cy={-52} rx={5} ry={20} fill="var(--color-blush)" stroke="none" />
      {/* Cuerpo */}
      <path d="M -38 64 a 38 44 0 0 1 76 0 z" fill="var(--color-crema)" />
      <ellipse cx={-20} cy={64} rx={14} ry={8} fill="#f7ede0" />
      <ellipse cx={20} cy={64} rx={14} ry={8} fill="#f7ede0" />
      {/* Cabeza */}
      <circle cx={0} cy={-4} r={34} fill="var(--color-crema)" />
      <g stroke="none">
        <ellipse cx={-24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <circle cx={-12} cy={-8} r={5} fill="var(--color-tinta)" />
        <circle cx={12} cy={-8} r={5} fill="var(--color-tinta)" />
        <circle cx={-10.5} cy={-9.5} r={1.8} fill="#ffffff" />
        <circle cx={13.5} cy={-9.5} r={1.8} fill="#ffffff" />
      </g>
      <path d="M -6 6 l 6 6 l 6 -6 z" fill="#f0a9b5" strokeWidth={3} />
      <path
        d="M 0 12 q -6 8 -12 2 M 0 12 q 6 8 12 2"
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </g>
  );
}

export function SheepSprite() {
  const curls = [
    { x: -30, y: -28, r: 17 },
    { x: 0, y: -38, r: 18 },
    { x: 30, y: -28, r: 17 },
    { x: -34, y: 26, r: 22 },
    { x: 0, y: 40, r: 24 },
    { x: 34, y: 26, r: 22 },
    { x: -26, y: 0, r: 20 },
    { x: 26, y: 0, r: 20 },
  ];
  return (
    <g {...OUTLINE}>
      <Shadow rx={42} y={68} />
      {/* Lana del cuerpo */}
      {curls.map((curl) => (
        <circle
          key={`${curl.x}-${curl.y}`}
          cx={curl.x}
          cy={curl.y}
          r={curl.r}
          fill="var(--color-crema)"
        />
      ))}
      {/* Orejas */}
      <ellipse cx={-38} cy={-34} rx={15} ry={8} fill="#e8d5bd" />
      <ellipse cx={38} cy={-34} rx={15} ry={8} fill="#e8d5bd" />
      {/* Carita */}
      <ellipse cx={0} cy={-30} rx={24} ry={26} fill="#f2e2cd" />
      {/* Flequillo de lana */}
      <circle cx={-14} cy={-52} r={13} fill="var(--color-crema)" />
      <circle cx={10} cy={-56} r={14} fill="var(--color-crema)" />
      <g stroke="none">
        <ellipse cx={-18} cy={-22} rx={6} ry={4} fill="var(--color-blush)" />
        <ellipse cx={18} cy={-22} rx={6} ry={4} fill="var(--color-blush)" />
        <circle cx={-9} cy={-32} r={4.5} fill="var(--color-tinta)" />
        <circle cx={9} cy={-32} r={4.5} fill="var(--color-tinta)" />
        <circle cx={-7.5} cy={-33.5} r={1.6} fill="#ffffff" />
        <circle cx={10.5} cy={-33.5} r={1.6} fill="#ffffff" />
      </g>
      <path
        d="M -6 -20 q 6 5 12 0"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </g>
  );
}
