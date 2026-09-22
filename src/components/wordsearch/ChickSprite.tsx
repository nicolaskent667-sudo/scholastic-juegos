/** El pollito amarillo del picnic, centrado en (0,0). */
export default function ChickSprite() {
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={44} rx={32} ry={7} fill="var(--color-blush)" stroke="none" />

      {/* Copete */}
      <path d="M -4 -36 l 2 -16 l 10 12 z" fill="var(--color-sol)" />

      {/* Cuerpo */}
      <circle cx={0} cy={0} r={34} fill="var(--color-sol)" />

      {/* Alitas */}
      <path d="M -32 2 q -12 8 -6 20 q 8 -6 12 -14 z" fill="#e7b43f" />
      <path d="M 32 2 q 12 8 6 20 q -8 -6 -12 -14 z" fill="#e7b43f" />

      {/* Patitas */}
      <path d="M -11 33 l -3 12" stroke="#e07f2a" strokeWidth={6} strokeLinecap="round" />
      <path d="M 11 33 l 3 12" stroke="#e07f2a" strokeWidth={6} strokeLinecap="round" />

      {/* Cara */}
      <g stroke="none">
        <circle cx={-12} cy={-6} r={4.5} fill="var(--color-tinta)" />
        <circle cx={12} cy={-6} r={4.5} fill="var(--color-tinta)" />
        <circle cx={-10.5} cy={-7.5} r={1.6} fill="#ffffff" />
        <circle cx={13.5} cy={-7.5} r={1.6} fill="#ffffff" />
        <ellipse cx={-24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
      </g>
      <path d="M -7 6 l 7 10 l 7 -10 z" fill="#e07f2a" />
    </g>
  );
}
