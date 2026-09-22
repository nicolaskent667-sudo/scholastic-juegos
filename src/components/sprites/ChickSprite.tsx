export type ChickProps = {
  bow?: boolean;
  glasses?: boolean;
  wink?: boolean;
};

/** El pollito amarillo del picnic, centrado en (0,0). */
export default function ChickSprite({
  bow = false,
  glasses = false,
  wink = false,
}: ChickProps) {
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={44} rx={32} ry={7} fill="var(--color-blush)" stroke="none" />

      {/* Copete */}
      <path d="M -4 -36 l 2 -16 l 10 12 z" fill="var(--color-sol)" />

      <circle cx={0} cy={0} r={34} fill="var(--color-sol)" />

      {/* Alitas */}
      <path d="M -32 2 q -12 8 -6 20 q 8 -6 12 -14 z" fill="#e7b43f" />
      <path d="M 32 2 q 12 8 6 20 q -8 -6 -12 -14 z" fill="#e7b43f" />

      {/* Patitas */}
      <path d="M -11 33 l -3 12" stroke="#e07f2a" strokeWidth={6} strokeLinecap="round" />
      <path d="M 11 33 l 3 12" stroke="#e07f2a" strokeWidth={6} strokeLinecap="round" />

      {bow && (
        <>
          <path d="M -20 -34 l -16 -9 l 0 18 z" fill="var(--color-blush)" />
          <path d="M 0 -34 l 16 -9 l 0 18 z" fill="var(--color-blush)" />
          <circle cx={-10} cy={-34} r={6} fill="var(--color-berry)" />
        </>
      )}

      <g stroke="none">
        <ellipse cx={-24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        <ellipse cx={24} cy={6} rx={7} ry={5} fill="var(--color-blush)" />
        {!wink && <circle cx={-12} cy={-6} r={4.5} fill="var(--color-tinta)" />}
        <circle cx={12} cy={-6} r={4.5} fill="var(--color-tinta)" />
        {!wink && <circle cx={-10.5} cy={-7.5} r={1.6} fill="#ffffff" />}
        <circle cx={13.5} cy={-7.5} r={1.6} fill="#ffffff" />
      </g>

      {wink && (
        <path
          d="M -18 -6 q 6 -6 12 0"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      )}

      {glasses && (
        <g fill="rgba(255,255,255,0.4)" strokeWidth={4}>
          <circle cx={-12} cy={-6} r={12} />
          <circle cx={12} cy={-6} r={12} />
          <path d="M -0.5 -6 h 1" />
        </g>
      )}

      <path d="M -7 6 l 7 10 l 7 -10 z" fill="#e07f2a" />
    </g>
  );
}
