"use client";

import DogSprite, { type DogProps } from "@/components/sprites/DogSprite";
import { FriendSprite } from "@/components/sprites/friends";
import { useProgress } from "@/hooks/useProgress";
import type { Equipped } from "@/lib/shop";

/** Dónde se para el amigo, a la derecha de Sieni, y a qué escala. */
export const FRIEND_X = 118;
const FRIEND_SCALE = 0.8;

type Props = Omit<DogProps, "look"> & {
  /** Para probar algo sin ponérselo, como en el probador de la tienda. */
  look?: Equipped;
  /** Dibuja al amigo al lado. El que llama tiene que dejarle lugar. */
  withFriend?: boolean;
};

/**
 * Sieni con lo que tiene puesto de la tienda. Es un `<g>` centrado en (0,0),
 * igual que `DogSprite`, para usarlo dentro de cualquier SVG.
 */
export default function SieniSprite({ look, withFriend = false, ...dog }: Props) {
  const { progress } = useProgress();
  const current = look ?? progress.equipped;
  const friend = withFriend ? current.amigo : undefined;

  return (
    <g>
      {friend && (
        <g transform={`translate(${FRIEND_X} 6) scale(${FRIEND_SCALE})`}>
          <FriendSprite id={friend} />
        </g>
      )}
      <DogSprite {...dog} look={current} />
    </g>
  );
}
