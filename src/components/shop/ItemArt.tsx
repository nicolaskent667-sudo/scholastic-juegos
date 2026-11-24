import {
  DressBody,
  FaceMask,
  SantaBody,
  SantaHat,
  StrawHat,
  Sunglasses,
  SwimBody,
  SwimGoggles,
} from "@/components/sprites/outfits";
import { FriendSprite } from "@/components/sprites/friends";
import type { ShopItemId } from "@/lib/shop";

/**
 * El dibujo suelto de cada cosa, para las tarjetas de la tienda. Los trajes
 * muestran sus piezas separadas, el gorro arriba y lo del cuerpo abajo, como
 * en el diseño. Cada uno lleva su recorte para que llene la tarjeta.
 */
const ART: Record<ShopItemId, { viewBox: string; art: React.ReactNode }> = {
  sombrero: { viewBox: "-68 -90 136 72", art: <StrawHat /> },
  anteojos: { viewBox: "-46 -40 92 76", art: <Sunglasses /> },
  barbijo: { viewBox: "-46 -18 92 64", art: <FaceMask /> },
  vestido: { viewBox: "-56 6 112 82", art: <DressBody /> },
  noel: {
    viewBox: "-50 -96 104 180",
    art: (
      <>
        <SantaHat />
        <SantaBody />
      </>
    ),
  },
  malla: {
    viewBox: "-50 -60 100 144",
    art: (
      <>
        <SwimGoggles />
        <SwimBody />
      </>
    ),
  },
  husky: { viewBox: "-70 -90 140 178", art: <FriendSprite id="husky" /> },
  nene: { viewBox: "-70 -90 140 178", art: <FriendSprite id="nene" /> },
  gallina: { viewBox: "-72 -90 144 178", art: <FriendSprite id="gallina" /> },
};

export default function ItemArt({ id, className }: { id: ShopItemId; className?: string }) {
  const { viewBox, art } = ART[id];
  return (
    <svg viewBox={viewBox} className={className} aria-hidden>
      <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
        {art}
      </g>
    </svg>
  );
}
