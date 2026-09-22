export type BowColor = "rosa" | "azul" | "amarillo";

const BOW_FILL: Record<BowColor, string> = {
  rosa: "var(--color-blush)",
  azul: "#8fb3e8",
  amarillo: "var(--color-sol)",
};

export type DogProps = {
  /** null = sin moño. */
  bow?: BowColor | null;
  glasses?: boolean;
  /** Guiña el ojo izquierdo. */
  wink?: boolean;
  /** Birrete de graduada, en lugar del moño. */
  cap?: boolean;
  /** Colgante del pecho. */
  pendant?: "corazon" | "estrella" | null;
};

/** Sieni, la perrita roja del picnic. Centrada en (0,0). */
export default function DogSprite({
  bow = "rosa",
  glasses = false,
  wink = false,
  cap = false,
  pendant = "corazon",
}: DogProps) {
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={70} rx={52} ry={9} fill="var(--color-blush)" stroke="none" />

      {/* Cuerpo */}
      <path d="M -40 70 a 40 46 0 0 1 80 0 z" fill="var(--color-berry)" />
      <path d="M -20 70 a 20 26 0 0 1 40 0 z" fill="var(--color-crema)" />
      <path d="M 38 40 q 22 -4 26 -20 q -6 22 -24 28 z" fill="var(--color-berry)" />
      <ellipse cx={-20} cy={70} rx={13} ry={8} fill="var(--color-crema)" />
      <ellipse cx={20} cy={70} rx={13} ry={8} fill="var(--color-crema)" />

      {pendant === "corazon" && (
        <path
          d="M 0 50 L -10 39 A 6 6 0 0 1 0 32 A 6 6 0 0 1 10 39 Z"
          fill="var(--color-sol)"
          strokeWidth={3.5}
        />
      )}
      {pendant === "estrella" && (
        <path
          d="M 0 30 L 4 42 L 16 42 L 6 49 L 10 60 L 0 53 L -10 60 L -6 49 L -16 42 L -4 42 Z"
          fill="var(--color-sol)"
          strokeWidth={3.5}
        />
      )}

      {/* Orejas */}
      <ellipse cx={-42} cy={4} rx={15} ry={26} fill="#c93b48" />
      <ellipse cx={42} cy={4} rx={15} ry={26} fill="#c93b48" />

      {/* Cabeza */}
      <circle cx={0} cy={-4} r={38} fill="var(--color-berry)" />
      <ellipse cx={0} cy={12} rx={24} ry={18} fill="var(--color-crema)" />

      {cap ? (
        <>
          <rect x={-14} y={-52} width={28} height={12} rx={3} fill="#2f2a33" />
          <path d="M -40 -52 L 0 -66 L 40 -52 L 0 -38 Z" fill="#2f2a33" />
          <path d="M 34 -54 l 8 24" stroke="var(--color-sol)" strokeWidth={4} />
          <circle cx={42} cy={-28} r={5} fill="var(--color-sol)" strokeWidth={3} />
        </>
      ) : (
        bow !== null && (
          <>
            <path d="M -26 -36 l -18 -10 l 0 20 z" fill={BOW_FILL[bow]} />
            <path d="M -4 -36 l 18 -10 l 0 20 z" fill={BOW_FILL[bow]} />
            <circle cx={-15} cy={-36} r={7} fill="var(--color-berry)" />
          </>
        )
      )}

      {/* Cara, sin contorno */}
      <g stroke="none">
        <ellipse cx={-27} cy={8} rx={7} ry={5} fill="#f08a92" />
        <ellipse cx={27} cy={8} rx={7} ry={5} fill="#f08a92" />
        {!wink && <circle cx={-13} cy={-2} r={4.5} fill="var(--color-tinta)" />}
        <circle cx={13} cy={-2} r={4.5} fill="var(--color-tinta)" />
        {!wink && <circle cx={-11.5} cy={-3.5} r={1.6} fill="#ffffff" />}
        <circle cx={14.5} cy={-3.5} r={1.6} fill="#ffffff" />
        <ellipse cx={0} cy={6} rx={5} ry={4} fill="var(--color-tinta)" />
      </g>

      {wink && (
        <path
          d="M -19 -2 q 6 -6 12 0"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      )}

      {glasses && (
        <g fill="rgba(255,255,255,0.45)" strokeWidth={3.5}>
          <circle cx={-13} cy={-2} r={12} />
          <circle cx={13} cy={-2} r={12} />
          <path d="M -1 -2 h 2" />
        </g>
      )}

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
