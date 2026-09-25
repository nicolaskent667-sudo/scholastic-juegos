"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DifficultyPicker from "@/components/DifficultyPicker";
import DragLayer from "@/components/DragLayer";
import PuzzleBoard from "@/components/PuzzleBoard";
import PuzzleTray from "@/components/PuzzleTray";
import WinOverlay from "@/components/WinOverlay";
import { useGameMusic } from "@/hooks/useGameMusic";
import { useProgress } from "@/hooks/useProgress";
import { usePointerDrag } from "@/hooks/usePointerDrag";
import { playEffect } from "@/lib/audio";
import type { AchievementId } from "@/lib/progress";
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

export type PuzzleCampaign = {
  label: string;
  rows: number;
  cols: number;
  /** Se llama al completar, con los movimientos usados. */
  onFinish: (moves: number) => void;
};

type Props = {
  /** Lleva al nivel de vuelo. Solo en el modo libre. */
  onNextGame?: () => void;
  onSkipToWordSearch?: () => void;
  onSkipToMemo?: () => void;
  onSkipToFlow?: () => void;
  /** Vuelve a la portada, o al mapa si viene de la campaña. */
  onHome: () => void;
  campaign?: PuzzleCampaign;
};

export default function PuzzleGame({
  onNextGame,
  onSkipToWordSearch,
  onSkipToMemo,
  onSkipToFlow,
  onHome,
  campaign,
}: Props) {
  const { unlock } = useProgress();
  useGameMusic();

  /**
   * En modo campaña el nivel arranca armado, sin pasar por el selector.
   * El reparto se calcula una sola vez con el initializer perezoso: este
   * subárbol nunca se renderiza en el servidor (la app abre en la portada),
   * así que el Math.random de la mezcla no puede provocar hydration mismatch.
   */
  const [deal] = useState(() =>
    campaign
      ? {
          difficulty: {
            id: "normal" as const,
            label: campaign.label,
            emoji: "🧩",
            rows: campaign.rows,
            cols: campaign.cols,
          },
          tray: shuffleDistinct(createPieces(campaign.rows, campaign.cols)),
          placed: Array<number | null>(campaign.rows * campaign.cols).fill(null),
          startedAt: Date.now(),
        }
      : null,
  );

  const [difficulty, setDifficulty] = useState<Difficulty | null>(
    deal?.difficulty ?? null,
  );
  const [tray, setTray] = useState<Piece[]>(deal?.tray ?? []);
  const [placed, setPlaced] = useState<(number | null)[]>(deal?.placed ?? []);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(
    deal?.startedAt ?? null,
  );
  const [now, setNow] = useState(deal?.startedAt ?? 0);
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

        // Si solo faltaba este hueco, el rompecabezas quedó terminado.
        const wasLastPiece =
          placed.filter((slot) => slot === null).length === 1;
        // La última pieza va con el sonido de victoria, no con el de encastre.
        playEffect(wasLastPiece ? "victoria" : "bloque");

        if (wasLastPiece && difficulty) {
          const seconds =
            startedAt === null
              ? Number.POSITIVE_INFINITY
              : Math.floor((Date.now() - startedAt) / 1000);
          const earned: AchievementId[] = ["puzzle-first"];
          if (difficulty.cols >= 5) earned.push("puzzle-hard");
          if (difficulty.cols <= 3 && seconds < 60) earned.push("puzzle-fast");
          unlock(...earned);
          // `moves` todavía no incluye este movimiento: lo sumamos acá.
          campaign?.onFinish(moves + 1);
        }
      } else {
        flashWrong(slotIndex);
      }
    },
    [placed, flashWrong, difficulty, startedAt, unlock, campaign, moves],
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
        onSkipToFlappy={onNextGame ?? onHome}
        onSkipToWordSearch={onSkipToWordSearch ?? onHome}
        onSkipToMemo={onSkipToMemo ?? onHome}
        onSkipToFlow={onSkipToFlow ?? onHome}
        onHome={onHome}
      />
    );
  }

  const backLabel = campaign ? "← Mapa" : "← Nivel";

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (campaign) {
                onHome();
                return;
              }
              setDifficulty(null);
              setStartedAt(null);
              setPlaced([]);
              setTray([]);
            }}
            className="cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-2 font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
          >
            {backLabel}
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
          pieces={rows * cols}
          campaignMode={campaign !== undefined}
          onNextGame={onNextGame ?? onHome}
          onReplay={() => startLevel(difficulty)}
          onChangeDifficulty={() => {
            if (campaign) {
              onHome();
              return;
            }
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
