"use client";

import { useCallback, useState } from "react";
import FlappyGame from "@/components/flappy/FlappyGame";
import MemoGame from "@/components/memo/MemoGame";
import PuzzleGame from "@/components/PuzzleGame";
import StartScreen from "@/components/start/StartScreen";
import WordSearchGame from "@/components/wordsearch/WordSearchGame";

type Screen = "start" | "puzzle" | "flappy" | "wordsearch" | "memo";

/**
 * Único dueño de qué nivel se ve. El progreso no necesita provider: vive en un
 * store de módulo que cada pantalla lee con `useProgress`.
 */
export default function GameShell() {
  const [screen, setScreen] = useState<Screen>("start");

  const goToStart = useCallback(() => setScreen("start"), []);
  const goToPuzzle = useCallback(() => setScreen("puzzle"), []);
  const goToFlappy = useCallback(() => setScreen("flappy"), []);
  const goToWordSearch = useCallback(() => setScreen("wordsearch"), []);
  const goToMemo = useCallback(() => setScreen("memo"), []);

  switch (screen) {
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
      return <StartScreen onPlay={goToPuzzle} />;
  }
}
