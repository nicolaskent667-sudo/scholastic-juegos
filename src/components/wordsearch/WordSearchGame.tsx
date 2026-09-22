"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LetterGrid from "@/components/wordsearch/LetterGrid";
import MascotPanel from "@/components/wordsearch/MascotPanel";
import WordList from "@/components/wordsearch/WordList";
import WordSearchWin from "@/components/wordsearch/WordSearchWin";
import WorldPicker from "@/components/wordsearch/WorldPicker";
import { toolButton } from "@/components/ui/buttons";
import { useCellSelection } from "@/hooks/useCellSelection";
import { formatTime } from "@/lib/puzzle";
import {
  WORLDS,
  generateBoard,
  matchWord,
  readSelection,
  type Board,
  type Cell,
  type Placement,
  type World,
} from "@/lib/wordsearch";

const MAX_HINTS = 3;
const IDLE_MESSAGE = "¿Dónde estarán?";

type Props = {
  onBack: () => void;
};

export default function WordSearchGame({ onBack }: Props) {
  const [world, setWorld] = useState<World | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [found, setFound] = useState<Placement[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintCell, setHintCell] = useState<Cell | null>(null);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [completed, setCompleted] = useState<number[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const won = board !== null && found.length === board.placements.length;

  useEffect(
    () => () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      if (hintTimer.current) clearTimeout(hintTimer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    },
    [],
  );

  // Cronómetro: arranca con el mundo y se congela al completarlo.
  useEffect(() => {
    if (startedAt === null || won) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, won]);

  const elapsed =
    startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  /** `generateBoard` usa Math.random: solo desde handlers del cliente. */
  const startWorld = useCallback((next: World) => {
    const startTime = Date.now();
    setWorld(next);
    setBoard(generateBoard(next));
    setFound([]);
    setHintsUsed(0);
    setHintCell(null);
    setMessage(IDLE_MESSAGE);
    setStartedAt(startTime);
    setNow(startTime);
  }, []);

  const say = useCallback((text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(IDLE_MESSAGE), 2200);
  }, []);

  const commitSelection = useCallback(
    (from: Cell, to: Cell) => {
      if (!board || won) return;

      const selection = readSelection(board.grid, from, to);
      const pending = board.placements
        .filter((p) => !found.some((f) => f.word === p.word))
        .map((p) => p.word);

      const hit = selection ? matchWord(selection.text, pending) : null;

      if (!hit) {
        say(selection ? "Mmm… fijate bien" : "Tiene que ser una línea derecha");
        setShake(true);
        if (shakeTimer.current) clearTimeout(shakeTimer.current);
        shakeTimer.current = setTimeout(() => setShake(false), 420);
        return;
      }

      const placement = board.placements.find((p) => p.word === hit)!;
      const nextFound = [...found, placement];
      setFound(nextFound);
      setHintCell(null);
      say(nextFound.length === board.placements.length ? "¡Lo lograste!" : "¡Muy bien!");

      if (nextFound.length === board.placements.length && world) {
        setCompleted((prev) =>
          prev.includes(world.id) ? prev : [...prev, world.id],
        );
      }
    },
    [board, found, won, world, say],
  );

  const { active, anchor, startDrag, tapCell, clear } =
    useCellSelection(commitSelection);

  const useHint = useCallback(() => {
    if (!board || won || hintsUsed >= MAX_HINTS) return;
    const pending = board.placements.filter(
      (p) => !found.some((f) => f.word === p.word),
    );
    if (pending.length === 0) return;

    const target = pending[Math.floor(Math.random() * pending.length)];
    setHintCell({ row: target.row, col: target.col });
    setHintsUsed((value) => value + 1);
    say(`${target.word} empieza acá`);

    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintCell(null), 3000);
  }, [board, found, hintsUsed, won, say]);

  const backToWorlds = useCallback(() => {
    clear();
    setWorld(null);
    setBoard(null);
    setFound([]);
    setStartedAt(null);
  }, [clear]);

  const nextWorld = useCallback(() => {
    if (!world) return;
    const next = WORLDS.find((w) => w.id === world.id + 1);
    if (next) startWorld(next);
  }, [world, startWorld]);

  if (!world || !board) {
    return (
      <WorldPicker onPick={startWorld} onBack={onBack} completed={completed} />
    );
  }

  const foundWords = found.map((p) => p.word);
  const hasNextWorld = WORLDS.some((w) => w.id === world.id + 1);

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={backToWorlds}
            aria-label="Elegir otro mundo"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            ‹
          </button>
          <h1 className="text-2xl font-extrabold tracking-wide text-berry sm:text-3xl">
            SOPA DE LETRAS
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border-[3px] border-tinta bg-white px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            🕐 {formatTime(elapsed)}
          </span>
          <span className="rounded-full border-[3px] border-tinta bg-sol/30 px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            ✦ {found.length}/{board.placements.length}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <LetterGrid
          board={board}
          worldName={`Mundo ${world.id}`}
          worldHint={world.name}
          found={found}
          active={active}
          anchor={anchor}
          hintCell={hintCell}
          shake={shake}
          onCellDown={startDrag}
          onCellTap={tapCell}
        />

        <div className="flex flex-col gap-4">
          <WordList
            words={world.words}
            found={foundWords}
            onHint={useHint}
            hintsLeft={MAX_HINTS - hintsUsed}
          />
          <MascotPanel message={message} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => startWorld(world)}
              className={toolButton}
            >
              ↻ Otro tablero
            </button>
            <button type="button" onClick={onBack} className={toolButton}>
              ← Juego anterior
            </button>
          </div>
        </div>
      </div>

      {won && (
        <WordSearchWin
          worldName={world.name}
          words={board.placements.length}
          seconds={elapsed}
          hintsUsed={hintsUsed}
          hasNextWorld={hasNextWorld}
          onNextWorld={nextWorld}
          onReplay={() => startWorld(world)}
          onWorlds={backToWorlds}
        />
      )}
    </div>
  );
}
