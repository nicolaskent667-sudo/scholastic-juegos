"use client";

import { useCallback, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import FlappyScene from "@/components/flappy/FlappyScene";
import {
  FlappyWinOverlay,
  GameOverOverlay,
  PausedOverlay,
  ReadyOverlay,
} from "@/components/flappy/FlappyOverlays";
import { useFlappyEngine, type FlappyOutcome } from "@/hooks/useFlappyEngine";
import { GOAL_LAMPS, MAX_HEARTS, WORLD } from "@/lib/flappy";

const LEVEL_LABEL = "NIVEL 2";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 22" className="h-7 w-7" aria-hidden>
      <path
        d="M12 21 L3 12 A5.5 5.5 0 0 1 12 5 A5.5 5.5 0 0 1 21 12 Z"
        fill={filled ? "var(--color-berry)" : "#e3e0e0"}
        stroke="var(--color-tinta)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  onBack: () => void;
  /** Lleva a la sopa de letras. */
  onNextGame: () => void;
};

export default function FlappyGame({ onBack, onNextGame }: Props) {
  const { unlock, addStars } = useProgress();

  const handleWin = useCallback(
    ({ stars, hearts }: FlappyOutcome) => {
      addStars(stars);
      unlock("flappy-win");
      if (hearts === MAX_HEARTS) unlock("flappy-perfect");
    },
    [addStars, unlock],
  );

  const {
    status,
    hearts,
    stars,
    passed,
    seconds,
    progress,
    flap,
    reset,
    togglePause,
    nodes,
  } = useFlappyEngine(handleWin);

  const restart = useCallback(() => {
    reset();
    // `reset` deja el juego en "ready": el primer toque vuelve a arrancar.
  }, [reset]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        togglePause();
        return;
      }
      if (event.key !== " " && event.key !== "ArrowUp") return;
      // Space también activa un botón enfocado: no robamos esa tecla.
      if ((event.target as HTMLElement)?.tagName === "BUTTON") return;
      event.preventDefault();
      flap();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap, togglePause]);

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5">
      <div
        className="relative w-full touch-none select-none overflow-hidden rounded-3xl border-[3px] border-tinta shadow-[0_10px_0_rgba(90,42,51,0.18)]"
        style={{ aspectRatio: `${WORLD.width} / ${WORLD.height}` }}
        onPointerDown={flap}
      >
        <FlappyScene nodes={nodes} />

        {/* HUD en HTML por encima del SVG */}
        <div className="pointer-events-none absolute inset-0 z-20 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border-[3px] border-tinta bg-crema px-3 py-1 sm:px-4">
                <svg viewBox="-24 -24 48 48" className="h-5 w-5" aria-hidden>
                  <path
                    d="M 0 -19 Q 4 -4 19 0 Q 4 4 0 19 Q -4 4 -19 0 Q -4 -4 0 -19 Z"
                    fill="var(--color-sol)"
                    stroke="var(--color-tinta)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-lg font-extrabold tabular-nums text-tinta sm:text-xl">
                  {stars}
                </span>
              </div>
              <span className="rounded-full border-[3px] border-tinta bg-berry px-3 py-1 text-sm font-extrabold tracking-wide text-white sm:px-4 sm:text-base">
                {LEVEL_LABEL}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" aria-live="polite">
                <span className="sr-only">
                  {hearts} de {MAX_HEARTS} corazones
                </span>
                {Array.from({ length: MAX_HEARTS }, (_, i) => (
                  <Heart key={i} filled={i < hearts} />
                ))}
              </div>
              <button
                type="button"
                onClick={togglePause}
                aria-label={status === "paused" ? "Seguir jugando" : "Pausar"}
                className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-crema text-lg font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
              >
                {status === "paused" ? "▶" : "⏸"}
              </button>
            </div>
          </div>

          {/* Progreso hacia la meta */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border-2 border-tinta/40 bg-crema/70">
            <div
              className="h-full rounded-full bg-menta-dark transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs font-bold text-tinta/70">
            {passed} / {GOAL_LAMPS} faroles
          </p>
        </div>

        {status === "ready" && <ReadyOverlay onStart={flap} />}
        {status === "paused" && (
          <PausedOverlay
            onResume={togglePause}
            onRestart={restart}
            onBack={onBack}
          />
        )}
        {status === "over" && (
          <GameOverOverlay
            stars={stars}
            passed={passed}
            onRestart={restart}
            onBack={onBack}
          />
        )}
        {status === "won" && (
          <FlappyWinOverlay
            stars={stars}
            hearts={hearts}
            seconds={seconds}
            onRestart={restart}
            onBack={onBack}
            onNextGame={onNextGame}
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-2 font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
        >
          ← Rompecabezas
        </button>
        <p className="text-sm font-bold text-tinta/60">
          Tocá la pantalla o apretá la barra espaciadora para aletear
        </p>
      </div>
    </div>
  );
}
