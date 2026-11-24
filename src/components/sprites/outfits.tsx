/**
 * Lo que se compra en la tienda para Sieni, dibujado en las mismas
 * coordenadas que `DogSprite`: cabeza centrada en (0,-4) con radio 38, ojos en
 * (±13,-2), hocico en (0,12), cuerpo de y=24 a y=70. Así cada cosa cae en su
 * lugar sin acomodarla a mano en cada pantalla.
 */

import type { Equipped, ShopItemId } from "@/lib/shop";

const TINTA = "var(--color-tinta)";
const CREMA = "#fdf6f0";
const SHINE = "rgba(255,255,255,0.55)";

/** Estrella de cinco puntas centrada en (cx, cy). */
function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.48;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(
      `${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return `M ${points.join(" L ")} Z`;
}

/** Volados de la pollera: arcos hacia abajo de punta a punta. */
function scallops(from: number, to: number, y: number, count: number): string {
  const step = (to - from) / count;
  let d = "";
  for (let i = 0; i < count; i++) d += ` q ${step / 2} 9 ${step} 0`;
  return `L ${from} ${y}${d}`;
}

/* ───────────── Accesorios ───────────── */

export function StrawHat() {
  return (
    <g>
      <ellipse cx={0} cy={-36} rx={60} ry={13} fill="#f4c86a" />
      <path d="M -30 -38 C -32 -88 32 -88 30 -38 Q 0 -33 -30 -38 Z" fill="#f4c86a" />
      <path
        d="M -31 -49 Q 0 -43 31 -49 L 31 -40 Q 0 -34 -31 -40 Z"
        fill="#ee6b6b"
        strokeWidth={3.5}
      />
      <circle cx={21} cy={-42} r={6} fill={TINTA} stroke="none" />
      <circle cx={21} cy={-42} r={2.8} fill="#e982a8" stroke="none" />
    </g>
  );
}

export function Sunglasses() {
  return (
    <g>
      <path d="M -30 -10 L -39 -15 M 30 -10 L 39 -15" fill="none" strokeWidth={4} strokeLinecap="round" />
      <path d="M -28 -10 H -2 Q -2 10 -15 10 Q -28 10 -28 -10 Z" fill="#3d1f22" strokeWidth={4} />
      <path d="M 2 -10 H 28 Q 28 10 15 10 Q 2 10 2 -10 Z" fill="#3d1f22" strokeWidth={4} />
      <path d="M -31 -10 H 31" fill="none" strokeWidth={5} strokeLinecap="round" />
      <g fill="none" stroke={SHINE} strokeWidth={2.6} strokeLinecap="round">
        <path d="M -23 -4 q 5 -2 10 0" />
        <path d="M 8 -4 q 5 -2 10 0" />
      </g>
    </g>
  );
}

export function FaceMask() {
  return (
    <g>
      <g fill="none" strokeWidth={3.5} strokeLinecap="round">
        <path d="M -25 7 Q -36 4 -38 14" />
        <path d="M 25 7 Q 36 4 38 14" />
      </g>
      <path d="M -25 6 Q 0 0 25 6 L 22 27 Q 0 37 -22 27 Z" fill="#cfe9d9" />
      <path d="M -25 6 Q 0 0 25 6 L 24.4 11 Q 0 5 -24.4 11 Z" fill="#b5dfc6" strokeWidth={3.5} />
      <g fill="none" stroke="#9bc9ad" strokeWidth={2.6} strokeLinecap="round">
        <path d="M -21 17 Q 0 21 21 17" />
        <path d="M -20 23 Q 0 28 20 23" />
      </g>
    </g>
  );
}

/* ───────────── Vestuarios: lo que va sobre el cuerpo ───────────── */

export function DressBody() {
  return (
    <g>
      <path
        d={`M -30 46 ${scallops(-46, 46, 67, 5)} L 30 46 Z`}
        fill={CREMA}
      />
      <g fill="none" stroke="#e6dcd6" strokeWidth={2.4} strokeLinecap="round">
        <path d="M -14 52 L -20 66" />
        <path d="M 0 52 L 0 68" />
        <path d="M 14 52 L 20 66" />
      </g>
      <path d="M -31 32 Q 0 42 31 32 L 29 46 Q 0 56 -29 46 Z" fill="#f3bad0" />
      <path d="M -21 39 L -21 49 L -12 44 Z" fill="#e982a8" strokeWidth={3} />
      <path d="M 21 39 L 21 49 L 12 44 Z" fill="#e982a8" strokeWidth={3} />
      <circle cx={0} cy={45} r={5} fill="#ffffff" strokeWidth={3.5} />
    </g>
  );
}

export function SantaBody() {
  return (
    <g>
      <path d="M -36 50 L 36 50 L 38.6 59 L -38.6 59 Z" fill="#463238" />
      <rect x={-8} y={46} width={16} height={17} rx={3} fill="#f4c86a" strokeWidth={3.5} />
      <rect x={-3} y={51} width={6} height={7} rx={1} fill="#faebd7" strokeWidth={2} />
      <ellipse cx={0} cy={37} rx={30} ry={8} fill={CREMA} />
      <ellipse cx={-20} cy={70} rx={14} ry={9} fill="#463238" />
      <ellipse cx={20} cy={70} rx={14} ry={9} fill="#463238" />
    </g>
  );
}

export function SwimBody() {
  return (
    <g>
      <path d="M -34 44 Q 0 34 34 44 Q 40 56 40 70 L -40 70 Q -40 56 -34 44 Z" fill="#6f9bd6" />
      <ellipse cx={10} cy={58} rx={16} ry={8} fill="#8fb3e8" stroke="none" />
      <path d="M -34 44 Q 0 34 34 44 L 35.6 51 Q 0 41 -35.6 51 Z" fill="#5b6b8c" strokeWidth={3.5} />
      <path d={starPath(0, 58, 10)} fill="#f4c86a" strokeWidth={3} />
      <ellipse cx={-22} cy={72} rx={17} ry={9} fill="#5b6b8c" />
      <ellipse cx={22} cy={72} rx={17} ry={9} fill="#5b6b8c" />
      <g fill="#b9c3d6" stroke="none">
        <ellipse cx={-26} cy={70} rx={5} ry={2.5} />
        <ellipse cx={18} cy={70} rx={5} ry={2.5} />
      </g>
    </g>
  );
}

/* ───────────── Vestuarios: lo que va en la cabeza ───────────── */

export function SantaHat() {
  return (
    <g>
      <path d="M -34 -46 C -30 -84 14 -94 40 -78 C 42 -66 36 -56 31 -46 Z" fill="#e5534f" />
      <path d="M -22 -62 q 16 -10 34 -5" fill="none" stroke={SHINE} strokeWidth={4} strokeLinecap="round" />
      <rect x={-40} y={-51} width={80} height={15} rx={7.5} fill={CREMA} />
      <circle cx={41} cy={-79} r={10} fill={CREMA} />
    </g>
  );
}

export function SwimGoggles() {
  return (
    <g>
      <path d="M -37 -20 Q 0 -33 37 -20" fill="none" strokeWidth={11} strokeLinecap="round" />
      <path d="M -37 -20 Q 0 -33 37 -20" fill="none" stroke="#5b6b8c" strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={-14} cy={-25} rx={11.5} ry={7.5} fill="#8fb3e8" strokeWidth={4} />
      <ellipse cx={14} cy={-25} rx={11.5} ry={7.5} fill="#8fb3e8" strokeWidth={4} />
      <g fill="none" stroke={SHINE} strokeWidth={2.4} strokeLinecap="round">
        <path d="M -20 -27 q 4 -2 8 -1" />
        <path d="M 8 -27 q 4 -2 8 -1" />
      </g>
    </g>
  );
}

/** Lo de la ropa que va sobre el cuerpo, debajo de la cabeza. */
export function OutfitBody({ id }: { id?: ShopItemId }) {
  switch (id) {
    case "vestido":
      return <DressBody />;
    case "noel":
      return <SantaBody />;
    case "malla":
      return <SwimBody />;
    default:
      return null;
  }
}

/**
 * Todo lo que va encima de la cara, en orden: barbijo, gorro o antiparras del
 * traje, anteojos y por último el sombrero.
 */
export function OutfitHead({ look }: { look: Equipped }) {
  return (
    <g>
      {look.boca === "barbijo" && <FaceMask />}
      {look.ropa === "malla" && <SwimGoggles />}
      {look.ojos === "anteojos" && <Sunglasses />}
      {look.ropa === "noel" && <SantaHat />}
      {look.cabeza === "sombrero" && <StrawHat />}
    </g>
  );
}
