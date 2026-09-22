"use client";

import { useCallback, useState } from "react";
import FlappyGame from "@/components/flappy/FlappyGame";
import PuzzleGame from "@/components/PuzzleGame";
import WordSearchGame from "@/components/wordsearch/WordSearchGame";

type Screen = "puzzle" | "flappy" | "wordsearch";

/** Único dueño de qué nivel se está viendo. */
export default function GameShell() {
  const [screen, setScreen] = useState<Screen>("puzzle");

  const goToPuzzle = useCallback(() => setScreen("puzzle"), []);
  const goToFlappy = useCallback(() => setScreen("flappy"), []);
  const goToWordSearch = useCallback(() => setScreen("wordsearch"), []);

  if (screen === "flappy") {
    return <FlappyGame onBack={goToPuzzle} onNextGame={goToWordSearch} />;
  }

  if (screen === "wordsearch") {
    return <WordSearchGame onBack={goToFlappy} />;
  }

  return (
    <PuzzleGame onNextGame={goToFlappy} onSkipToWordSearch={goToWordSearch} />
  );
}
