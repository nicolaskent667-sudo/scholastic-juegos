"use client";

import { useCallback, useState } from "react";
import CampaignPlayer from "@/components/map/CampaignPlayer";
import LevelMap from "@/components/map/LevelMap";
import WorldSelect from "@/components/map/WorldSelect";
import FlappyGame from "@/components/flappy/FlappyGame";
import MemoGame from "@/components/memo/MemoGame";
import PuzzleGame from "@/components/PuzzleGame";
import StartScreen from "@/components/start/StartScreen";
import WordSearchGame from "@/components/wordsearch/WordSearchGame";
import type { CampaignLevel, CampaignWorld } from "@/lib/campaign";

/**
 * "campaign" es el recorrido del mapa; el resto son los juegos sueltos, a los
 * que se sigue llegando por los atajos del modo libre.
 */
type Screen =
  | "start"
  | "worlds"
  | "map"
  | "level"
  | "puzzle"
  | "flappy"
  | "wordsearch"
  | "memo";

/** Único dueño de qué pantalla se ve. */
export default function GameShell() {
  const [screen, setScreen] = useState<Screen>("start");
  const [world, setWorld] = useState<CampaignWorld | null>(null);
  const [level, setLevel] = useState<CampaignLevel | null>(null);

  const goToStart = useCallback(() => setScreen("start"), []);
  const goToWorlds = useCallback(() => setScreen("worlds"), []);
  const goToPuzzle = useCallback(() => setScreen("puzzle"), []);
  const goToFlappy = useCallback(() => setScreen("flappy"), []);
  const goToWordSearch = useCallback(() => setScreen("wordsearch"), []);
  const goToMemo = useCallback(() => setScreen("memo"), []);

  const pickWorld = useCallback((next: CampaignWorld) => {
    setWorld(next);
    setScreen("map");
  }, []);

  const pickLevel = useCallback((next: CampaignLevel) => {
    setLevel(next);
    setScreen("level");
  }, []);

  const backToMap = useCallback(() => {
    setLevel(null);
    setScreen(world ? "map" : "worlds");
  }, [world]);

  switch (screen) {
    case "worlds":
      return <WorldSelect onPickWorld={pickWorld} onBack={goToStart} />;

    case "map":
      return world ? (
        <LevelMap world={world} onPickLevel={pickLevel} onBack={goToWorlds} />
      ) : (
        <WorldSelect onPickWorld={pickWorld} onBack={goToStart} />
      );

    case "level":
      return level ? (
        // La key remonta el minijuego al cambiar de nivel, para que vuelva a
        // repartir desde cero en vez de arrastrar el estado del anterior.
        <CampaignPlayer key={level.id} level={level} onExit={backToMap} />
      ) : (
        <WorldSelect onPickWorld={pickWorld} onBack={goToStart} />
      );

    case "flappy":
      return <FlappyGame onBack={goToPuzzle} onNextGame={goToWordSearch} />;

    case "wordsearch":
      return <WordSearchGame onBack={goToFlappy} onNextGame={goToMemo} />;

    case "memo":
      return <MemoGame onBack={goToWordSearch} />;

    case "puzzle":
      return (
        <PuzzleGame
          onNextGame={goToFlappy}
          onSkipToWordSearch={goToWordSearch}
          onSkipToMemo={goToMemo}
          onHome={goToStart}
        />
      );

    default:
      return <StartScreen onPlay={goToWorlds} onFreePlay={goToPuzzle} />;
  }
}
