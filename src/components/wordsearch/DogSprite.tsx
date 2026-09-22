/** La perrita roja del picnic, centrada en (0,0). */
export default function DogSprite() {
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      {/* Sombra */}
      <ellipse cx={0} cy={70} rx={52} ry={9} fill="var(--color-blush)" stroke="none" />

      {/* Cuerpo */}
      <path
        d="M -40 70 a 40 46 0 0 1 80 0 z"
        fill="var(--color-berry)"
      />
      <path d="M -20 70 a 20 26 0 0 1 40 0 z" fill="var(--color-crema)" />
      {/* Colita */}
      <path d="M 38 40 q 22 -4 26 -20 q -6 22 -24 28 z" fill="var(--color-berry)" />
      {/* Patitas */}
      <ellipse cx={-20} cy={70} rx={13} ry={8} fill="var(--color-crema)" />
      <ellipse cx={20} cy={70} rx={13} ry={8} fill="var(--color-crema)" />

      {/* Orejas */}
      <ellipse cx={-42} cy={4} rx={15} ry={26} fill="#c93b48" />
      <ellipse cx={42} cy={4} rx={15} ry={26} fill="#c93b48" />

      {/* Cabeza */}
      <circle cx={0} cy={-4} r={38} fill="var(--color-berry)" />
      <ellipse cx={0} cy={12} rx={24} ry={18} fill="var(--color-crema)" />

      {/* Moño */}
      <path d="M -26 -36 l -18 -10 l 0 20 z" fill="var(--color-blush)" />
      <path d="M -4 -36 l 18 -10 l 0 20 z" fill="var(--color-blush)" />
      <circle cx={-15} cy={-36} r={7} fill="var(--color-berry)" />

      {/* Cara, sin contorno */}
      <g stroke="none">
        <circle cx={-13} cy={-2} r={4.5} fill="var(--color-tinta)" />
        <circle cx={13} cy={-2} r={4.5} fill="var(--color-tinta)" />
        <circle cx={-11.5} cy={-3.5} r={1.6} fill="#ffffff" />
        <circle cx={14.5} cy={-3.5} r={1.6} fill="#ffffff" />
        <ellipse cx={-27} cy={8} rx={7} ry={5} fill="#f08a92" />
        <ellipse cx={27} cy={8} rx={7} ry={5} fill="#f08a92" />
        <ellipse cx={0} cy={6} rx={5} ry={4} fill="var(--color-tinta)" />
      </g>
      <path
        d="M -7 16 q 7 7 14 0"
        fill="none"
        stroke="var(--color-tinta)"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </g>
  );
}
