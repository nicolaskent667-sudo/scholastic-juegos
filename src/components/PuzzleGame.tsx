"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DifficultyPicker from "@/components/DifficultyPicker";
import DragLayer from "@/components/DragLayer";
import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleTray from "@/components/PuzzleTray";
import WinOverlay from "@/components/WinOverlay";
import { usePointerDrag } from "@/hooks/usePointerDrag";
import {
  createPieces,
  formatTime,
  shuffleDistinct,
  type Difficulty,
  type Piece,
} from "@/lib/puzzle";

/** Las piezas de la bandeja se achican cuando hay más. */
function trayPieceWidth(cols: number): number {
  if (cols <= 3) return 108;
  if (cols === 4) return 88;
  return 72;
}

type Props = {
  /** Lleva al nivel de vuelo. */
  onNextGame: () => void;
  /** Atajo directo al nivel 3. */
  onSkipToWordSearch: () => void;
};

export default function PuzzleGame({ onNextGame, onSkipToWordSearch }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [tray, setTray] = useState<Piece[]>([]);
  const [placed, setPlaced] = useState<(number | null)[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rows = difficulty?.rows ?? 0;
  const cols = difficulty?.cols ?? 0;
  const won = placed.length > 0 && placed.every((slot) => slot !== null);

  useEffect(
    () => () => {
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
      if (placedTimer.current) clearTimeout(placedTimer.current);
    },
    [],
  );

  // Cronómetro: arranca con el nivel y se congela al ganar.
  useEffect(() => {
    if (startedAt === null || won) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, won]);

  const elapsed =
    startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  /** La mezcla ocurre acá, en un handler del cliente: nunca durante el render. */
  const startLevel = useCallback((next: Difficulty) => {
    const startTime = Date.now();
    setDifficulty(next);
    setTray(shuffleDistinct(createPieces(next.rows, next.cols)));
    setPlaced(Array<number | null>(next.rows * next.cols).fill(null));
    setSelectedId(null);
    setWrongSlot(null);
    setJustPlaced(null);
    setMoves(0);
    setShowGuide(false);
    setStartedAt(startTime);
    setNow(startTime);
  }, []);

  const flashWrong = useCallback((slotIndex: number) => {
    setWrongSlot(slotIndex);
    if (wrongTimer.current) clearTimeout(wrongTimer.current);
    wrongTimer.current = setTimeout(() => setWrongSlot(null), 450);
  }, []);

  /** Único camino de colocación: lo usan el drop, el click y el teclado. */
  const tryPlace = useCallback(
    (pieceId: number, slotIndex: number) => {
      setSelectedId(null);
      if (placed[slotIndex] !== null) {
        flashWrong(slotIndex);
        return;
      }
      setMoves((value) => value + 1);

      if (slotIndex === pieceId) {
        setPlaced((prev) => {
          const next = [...prev];
          next[slotIndex] = pieceId;
          return next;
        });
        setTray((prev) => prev.filter((piece) => piece.id !== pieceId));
        setJustPlaced(slotIndex);
        if (placedTimer.current) clearTimeout(placedTimer.current);
        placedTimer.current = setTimeout(() => setJustPlaced(null), 400);
      } else {
        flashWrong(slotIndex);
      }
    },
    [placed, flashWrong],
  );

  const handleDrop = useCallback(
    (piece: Piece, slotIndex: number | null) => {
      // Soltada fuera del tablero: vuelve a la bandeja sin penalizar.
      if (slotIndex === null) return;
      tryPlace(piece.id, slotIndex);
    },
    [tryPlace],
  );

  const { drag, startDrag, consumeClickSuppression } = usePointerDrag(handleDrop);

  const handleSelect = useCallback(
    (pieceId: number) => {
      if (consumeClickSuppression()) return;
      setSelectedId((current) => (current === pieceId ? null : pieceId));
    },
    [consumeClickSuppression],
  );

  const handleSlotActivate = useCallback(
    (slotIndex: number) => {
      if (selectedId === null) return;
      tryPlace(selectedId, slotIndex);
    },
    [selectedId, tryPlace],
  );

  if (!difficulty) {
    return (
      <DifficultyPicker
        onStart={startLevel}
        onSkipToFlappy={onNextGame}
        onSkipToWordSearch={onSkipToWordSearch}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDifficulty(null);
              setStartedAt(null);
              setPlaced([]);
              setTray([]);
            }}
            className="cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-2 font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
          >
            ← Nivel
          </button>
          <button
            type="button"
            onClick={() => startLevel(difficulty)}
            className="cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-2 font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
          >
            ↻ Mezclar
          </button>
          <button
            type="button"
            aria-pressed={showGuide}
            onClick={() => setShowGuide((value) => !value)}
            className={`cursor-pointer rounded-2xl border-[3px] border-tinta px-4 py-2 font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none ${
              showGuide ? "bg-sol" : "bg-crema hover:bg-sol/40"
            }`}
          >
            👀 Ver imagen
          </button>
        </div>

        <dl className="flex items-center gap-2 text-tinta">
          <div className="rounded-2xl border-[3px] border-tinta bg-blush/60 px-3 py-1 text-center">
            <dt className="text-[10px] font-bold uppercase text-tinta/70">
              Tiempo
            </dt>
            <dd className="text-lg font-extrabold tabular-nums">
              {formatTime(elapsed)}
            </dd>
          </div>
          <div className="rounded-2xl border-[3px] border-tinta bg-menta/70 px-3 py-1 text-center">
            <dt className="text-[10px] font-bold uppercase text-tinta/70">
              Movidas
            </dt>
            <dd className="text-lg font-extrabold tabular-nums">{moves}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="lg:flex-[3]">
          <PuzzleBoard
            rows={rows}
            cols={cols}
            placed={placed}
            wrongSlot={wrongSlot}
            justPlaced={justPlaced}
            hasSelection={selectedId !== null}
            showGuide={showGuide}
            onSlotActivate={handleSlotActivate}
          />
        </div>

        <div className="lg:flex-[2]">
          <PuzzleTray
            pieces={tray}
            rows={rows}
            cols={cols}
            pieceWidth={trayPieceWidth(cols)}
            selectedId={selectedId}
            draggingId={drag?.piece.id ?? null}
            onPointerDown={startDrag}
            onSelect={handleSelect}
          />
          <p className="mt-3 text-center text-sm font-bold text-tinta/60">
            Arrastrá cada pieza a su lugar, o tocala y después tocá el casillero.
          </p>
        </div>
      </div>

      {drag && <DragLayer drag={drag} rows={rows} cols={cols} />}

      {won && (
        <WinOverlay
          seconds={elapsed}
          moves={moves}
          onNextGame={onNextGame}
          onReplay={() => startLevel(difficulty)}
          onChangeDifficulty={() => {
            setDifficulty(null);
            setStartedAt(null);
            setPlaced([]);
            setTray([]);
          }}
        />
      )}
    </div>
  );
}
