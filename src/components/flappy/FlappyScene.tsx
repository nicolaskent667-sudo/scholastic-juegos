"use client";

import { memo } from "react";
import BirdSprite from "@/components/flappy/BirdSprite";
import LampPost from "@/components/flappy/LampPost";
import Scenery from "@/components/flappy/Scenery";
import StarCoin from "@/components/flappy/StarCoin";
import type { FlappyNodes } from "@/hooks/useFlappyEngine";
import { LAMP, WORLD } from "@/lib/flappy";

const LAMP_SLOTS = Array.from({ length: LAMP.poolSize }, (_, i) => i);

type Props = {
  nodes: FlappyNodes;
};

/**
 * El árbol SVG se monta una sola vez y nunca se re-renderiza: el motor mueve
 * estos nodos escribiendo `transform` por refs. De ahí el memo sin comparador,
 * y que `nodes` sea un objeto de refs estable.
 */
function FlappyScene({ nodes }: Props) {
  return (
    <svg
      viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="beamGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--color-sol)" stopOpacity={0.45} />
          <stop offset="100%" stopColor="var(--color-sol)" stopOpacity={0.05} />
        </radialGradient>
      </defs>

      <Scenery
        backRef={nodes.backNodeRef}
        midRef={nodes.midNodeRef}
        groundRef={nodes.groundNodeRef}
      />

      {LAMP_SLOTS.map((i) => (
        <LampPost
          key={i}
          bodyRef={(node) => {
            nodes.lampNodesRef.current[i] = node;
          }}
          fixtureRef={(node) => {
            nodes.fixtureNodesRef.current[i] = node;
          }}
        />
      ))}

      {LAMP_SLOTS.map((i) => (
        <StarCoin
          key={i}
          nodeRef={(node) => {
            nodes.starNodesRef.current[i] = node;
          }}
        />
      ))}

      <BirdSprite nodeRef={nodes.birdNodeRef} />
    </svg>
  );
}

export default memo(FlappyScene);
