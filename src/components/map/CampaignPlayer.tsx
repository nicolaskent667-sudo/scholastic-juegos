"use client";

import { useCallback } from "react";
import FlappyGame from "@/components/flappy/FlappyGame";
import MemoGame from "@/components/memo/MemoGame";
import PuzzleGame from "@/components/PuzzleGame";
import WordSearchGame from "@/components/wordsearch/WordSearchGame";
import { useProgress } from "@/hooks/useProgress";
import { starsFor, type CampaignLevel, type LevelResult } from "@/lib/campaign";

type Props = {
  level: CampaignLevel;
  /** Vuelve al mapa del mundo. */
  onExit: () => void;
};

/**
 * Corre un nivel de la campaña: elige el minijuego según la config, lo entrega
 * ya armado (sin su selector) y traduce el resultado a estrellas.
 */
export default function CampaignPlayer({ level, onExit }: Props) {
  const { recordLevelStars } = useProgress();

  const finish = useCallback(
    (result: LevelResult) => {
      recordLevelStars(level.id, starsFor(result));
    },
    [recordLevelStars, level.id],
  );

  const { config } = level;
  const title = `NIVEL ${level.index}`;

  switch (config.kind) {
    case "puzzle":
      return (
        <PuzzleGame
          onHome={onExit}
          campaign={{
            label: title,
            rows: config.rows,
            cols: config.cols,
            onFinish: (moves) =>
              finish({ kind: "puzzle", moves, pieces: config.rows * config.cols }),
          }}
        />
      );

    case "flappy":
      return (
        <FlappyGame
          onBack={onExit}
          campaign={{
            label: title,
            lamps: config.lamps,
            speed: config.speed,
            onFinish: (hearts) => finish({ kind: "flappy", hearts }),
          }}
        />
      );

    case "wordsearch":
      return (
        <WordSearchGame
          onBack={onExit}
          campaign={{
            worldId: config.worldId,
            onFinish: (hints) => finish({ kind: "wordsearch", hints }),
          }}
        />
      );

    case "memo":
      return (
        <MemoGame
          onBack={onExit}
          campaign={{
            levelId: config.levelId,
            pairs: config.pairs,
            onFinish: (tries) =>
              finish({ kind: "memo", tries, pairs: config.pairs }),
          }}
        />
      );
  }
}
