"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlowBoard from "@/components/flow/FlowBoard";
import FlowWin from "@/components/flow/FlowWin";
import MascotPanel from "@/components/wordsearch/MascotPanel";
import { toolButton } from "@/components/ui/buttons";
import { useFlowBoard } from "@/hooks/useFlowBoard";
import { useGameMusic } from "@/hooks/useGameMusic";
import { useProgress } from "@/hooks/useProgress";
import { playEffect } from "@/lib/audio";
import { filledCount, type Cell, type FlowLevel } from "@/lib/flow";

const MAX_HINTS = 3;
const IDLE_MESSAGE = "Uní los puntos del mismo color";

export type FlowCampaign = {
  /** Se llama al resolver, con los movimientos usados. */
  onFinish: (moves: number) => void;
};

type Props = {
  level: FlowLevel;
  onBack: () => void;
  campaign?: FlowCampaign;
};

export default function FlowGame({ level, onBack, campaign }: Props) {
  const { unlock } = useProgress();
  useGameMusic();

  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<{ index: number; path: Cell[] } | null>(null);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [result, setResult] = useState<number | null>(null);

  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    },
    [],
  );

  const say = useCallback((text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(IDLE_MESSAGE), 2400);
  }, []);

  const handleSolved = useCallback(
    (moves: number) => {
      playEffect("victoria");
      setResult(moves);
      setHint(null);
      unlock("flow-first");
      if (hintsUsed === 0) unlock("flow-nohint");
      campaign?.onFinish(moves);
    },
    [unlock, hintsUsed, campaign],
  );

  const { paths, drawing, moves, solved, connected, startAt, reset } =
    useFlowBoard(level, handleSolved);

  const handleCellDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, cell: Cell) => {
      if (event.button !== 0) return;
      setHint(null);
      startAt(cell, event.pointerId);
    },
    [startAt],
  );

  const restart = useCallback(() => {
    reset();
    setHintsUsed(0);
    setHint(null);
    setResult(null);
    setMessage(IDLE_MESSAGE);
  }, [reset]);

  const useHint = useCallback(() => {
    if (solved || hintsUsed >= MAX_HINTS) return;
    const pending = level.endpoints
      .map((_, i) => i)
      .filter((i) => !connected[i]);
    if (pending.length === 0) return;

    const index = pending[Math.floor(Math.random() * pending.length)];
    setHint({ index, path: level.solution[index] });
    setHintsUsed((value) => value + 1);
    say(`Así va el ${level.colors[index].name.toLowerCase()}`);

    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 3000);
  }, [solved, hintsUsed, level, connected, say]);

  const doneCount = connected.filter(Boolean).length;
  const cellsLeft = level.rows * level.cols - filledCount(paths);
  const missing = level.colors.find((_, i) => !connected[i]);

  // El globo de la mascota dice qué falta: primero un color, después huecos.
  const status = solved
    ? "¡Lo lograste!"
    : message !== IDLE_MESSAGE
      ? message
      : missing
        ? `¡Falta el ${missing.name.toLowerCase()}!`
        : cellsLeft > 0
          ? `Quedan ${cellsLeft} casilleros vacíos`
          : IDLE_MESSAGE;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            ‹
          </button>
          <h1 className="text-2xl font-extrabold tracking-wide text-berry sm:text-3xl">
            UNIR COLORES
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border-[3px] border-tinta bg-white px-4 py-1 font-extrabold text-tinta">
            Movs{" "}
            <span className="tabular-nums text-lg">{moves}</span>
          </span>
          <span className="rounded-full border-[3px] border-tinta bg-sol/30 px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            ✦ {doneCount}/{level.colors.length}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <FlowBoard
          level={level}
          paths={paths}
          drawing={drawing}
          hint={hint}
          onCellDown={handleCellDown}
        />

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border-[3px] border-tinta bg-white p-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-extrabold tracking-wide text-berry">
                TUBOS
              </h2>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-blush">
                <div
                  className="h-full rounded-full bg-sol transition-[width] duration-300"
                  style={{
                    width: `${(doneCount / level.colors.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <ul className="mt-3 space-y-1">
              {level.colors.map((color, i) => (
                <li key={color.id} className="flex items-center gap-3 py-0.5">
                  <span
                    aria-hidden
                    className="h-7 w-7 shrink-0 rounded-full border-[3px] border-tinta"
                    style={{ background: color.fill }}
                  />
                  <span className="flex-1 text-lg font-extrabold text-tinta">
                    {color.name}
                  </span>
                  {connected[i] ? (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-tinta bg-menta-dark text-xs font-black text-white"
                      aria-label="Unido"
                    >
                      ✓
                    </span>
                  ) : drawing === i ? (
                    <span className="rounded-full border-2 border-tinta/30 bg-crema px-3 py-0.5 text-xs font-bold text-tinta/60">
                      uniendo
                    </span>
                  ) : (
                    <span
                      aria-label="Sin unir"
                      className="h-7 w-7 rounded-full border-[3px] border-tinta/40 bg-crema"
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={useHint}
                disabled={hintsUsed >= MAX_HINTS || solved}
                className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-cielo-azul px-4 py-2 font-extrabold tracking-wide text-white shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-berry active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                PISTA {hintsUsed < MAX_HINTS && `(${MAX_HINTS - hintsUsed})`}
              </button>
              <button
                type="button"
                onClick={restart}
                className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-crema px-4 py-2 font-extrabold tracking-wide text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                REINICIAR
              </button>
            </div>
          </div>

          <MascotPanel message={status} />
        </div>
      </div>

      <div className="mt-3">
        <button type="button" onClick={onBack} className={toolButton}>
          {campaign ? "← Mapa" : "← Volver"}
        </button>
      </div>

      {solved && result !== null && (
        <FlowWin
          levelId={level.id}
          moves={result}
          pipes={level.colors.length}
          hintsUsed={hintsUsed}
          campaignMode={campaign !== undefined}
          onReplay={restart}
          onBack={onBack}
        />
      )}
    </div>
  );
}
