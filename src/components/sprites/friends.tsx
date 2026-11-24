/**
 * Los amigos que acompañan a Sieni. Cada uno centrado en (0,0) y del mismo
 * alto que ella (de y≈-75 a y≈80), para pararse a su lado sin reescalar.
 */

import type { ShopItemId } from "@/lib/shop";

const CREMA = "#fdf6f0";
const BLUSH = "#f2a3b5";
const TINTA = "var(--color-tinta)";

function Eye({ cx, cy, r = 4.5 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={TINTA} stroke="none" />
      <circle cx={cx + 1.5} cy={cy - 1.5} r={r * 0.36} fill="#ffffff" stroke="none" />
    </>
  );
}

export function HuskySprite() {
  const orange = "#f0a65a";
  return (
    <g stroke={TINTA} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={78} rx={46} ry={8} fill="var(--color-blush)" stroke="none" />

      {/* Cola enroscada */}
      <path d="M 26 34 C 66 38 72 -14 48 -18 C 34 -20 34 -4 44 -5" fill="none" strokeWidth={19} strokeLinecap="round" />
      <path d="M 26 34 C 66 38 72 -14 48 -18 C 34 -20 34 -4 44 -5" fill="none" stroke={orange} strokeWidth={9} strokeLinecap="round" />

      <ellipse cx={0} cy={42} rx={36} ry={32} fill={orange} />
      <ellipse cx={0} cy={48} rx={17} ry={22} fill={CREMA} stroke="none" />
      <ellipse cx={-17} cy={74} rx={15} ry={8} fill={CREMA} />
      <ellipse cx={17} cy={74} rx={15} ry={8} fill={CREMA} />

      {/* Orejas */}
      <path d="M -33 -42 L -38 -80 L -9 -60 Z" fill={orange} />
      <path d="M 33 -42 L 38 -80 L 9 -60 Z" fill={orange} />
      <path d="M -31 -55 L -33 -70 L -22 -61 Z" fill="#f4b3c2" stroke="none" />
      <path d="M 31 -55 L 33 -70 L 22 -61 Z" fill="#f4b3c2" stroke="none" />

      <circle cx={0} cy={-26} r={36} fill={orange} />
      <ellipse cx={-14} cy={-44} rx={8} ry={5} fill={CREMA} stroke="none" />
      <ellipse cx={14} cy={-44} rx={8} ry={5} fill={CREMA} stroke="none" />
      <ellipse cx={-26} cy={-16} rx={7} ry={4.5} fill={BLUSH} stroke="none" />
      <ellipse cx={26} cy={-16} rx={7} ry={4.5} fill={BLUSH} stroke="none" />
      <Eye cx={-13} cy={-32} />
      <Eye cx={13} cy={-32} />
      <ellipse cx={0} cy={-11} rx={17} ry={13} fill={CREMA} />
      <ellipse cx={0} cy={-15} rx={5} ry={3.5} fill={TINTA} stroke="none" />
      <path d="M -6 -7 q 6 5 12 0" fill="none" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function KidSprite() {
  const skin = "#f3d8c6";
  return (
    <g stroke={TINTA} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={78} rx={42} ry={8} fill="var(--color-blush)" stroke="none" />

      <ellipse cx={-16} cy={72} rx={15} ry={8} fill={CREMA} />
      <ellipse cx={16} cy={72} rx={15} ry={8} fill={CREMA} />
      <ellipse cx={0} cy={38} rx={32} ry={31} fill="#cfe8d8" />
      <ellipse cx={-33} cy={36} rx={10} ry={15} fill={skin} transform="rotate(15 -33 36)" />
      <ellipse cx={33} cy={36} rx={10} ry={15} fill={skin} transform="rotate(-15 33 36)" />
      <path d="M 0 50 L -10 39 A 6 6 0 0 1 0 32 A 6 6 0 0 1 10 39 Z" fill="var(--color-sol)" strokeWidth={4} />

      <path d="M -7 -67 q 7 -9 14 0" fill={TINTA} />
      <circle cx={0} cy={-28} r={38} fill={skin} />
      <ellipse cx={-24} cy={-16} rx={8} ry={5} fill={BLUSH} stroke="none" />
      <ellipse cx={24} cy={-16} rx={8} ry={5} fill={BLUSH} stroke="none" />
      <Eye cx={-13} cy={-28} r={5} />
      <Eye cx={13} cy={-28} r={5} />
      <path d="M -8 -14 q 8 6 16 0" fill="none" strokeWidth={3.5} strokeLinecap="round" />
    </g>
  );
}

export function HenSprite() {
  const red = "#ee6b6b";
  return (
    <g stroke={TINTA} strokeWidth={5} strokeLinejoin="round">
      <ellipse cx={0} cy={80} rx={50} ry={7} fill="var(--color-blush)" stroke="none" />

      {/* Plumas de la cola, detrás del cuerpo */}
      <path d="M -14 30 C -50 26 -62 0 -60 -10 C -40 -8 -22 6 -14 30 Z" fill={CREMA} />
      <path d="M -10 22 C -40 4 -42 -26 -38 -36 C -20 -24 -10 -2 -10 22 Z" fill="#f2e4dc" />
      <path d="M -4 16 C -20 -10 -18 -40 -12 -48 C 2 -32 4 -8 -4 16 Z" fill={CREMA} />

      <g fill="none" stroke="#f0a65a" strokeWidth={5} strokeLinecap="round">
        <path d="M 2 62 V 76 M -6 82 L 2 76 L 10 82" />
        <path d="M 24 62 V 76 M 16 82 L 24 76 L 32 82" />
      </g>

      <ellipse cx={8} cy={34} rx={40} ry={32} fill={CREMA} />
      <ellipse cx={16} cy={40} rx={18} ry={12} fill="#f2e4dc" />

      <circle cx={28} cy={-12} r={22} fill={CREMA} />
      <circle cx={17} cy={-33} r={8} fill={red} />
      <circle cx={28} cy={-38} r={8.5} fill={red} />
      <circle cx={38} cy={-31} r={7.5} fill={red} />
      <path d="M 48 -14 L 64 -9 L 48 -3 Z" fill="#f4c86a" strokeWidth={4} />
      <path d="M 46 0 q -7 8 0 13 q 6 -5 0 -13 Z" fill={red} strokeWidth={3.5} />
      <Eye cx={33} cy={-15} r={4} />
      <ellipse cx={22} cy={-5} rx={6} ry={4} fill={BLUSH} stroke="none" />

      <ellipse cx={-42} cy={66} rx={14} ry={11} fill="#faebd7" />
    </g>
  );
}

export function FriendSprite({ id }: { id: ShopItemId }) {
  switch (id) {
    case "husky":
      return <HuskySprite />;
    case "nene":
      return <KidSprite />;
    case "gallina":
      return <HenSprite />;
    default:
      return null;
  }
}
