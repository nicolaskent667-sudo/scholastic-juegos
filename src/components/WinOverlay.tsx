"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ASPECT, formatTime, PUZZLE } from "@/lib/puzzle";

type Props = {
  seconds: number;
  moves: number;
  pieces: number;
  /** En la campaña el botón principal vuelve al mapa. */
  campaignMode: boolean;
  onReplay: () => void;
  onChangeDifficulty: () => void;
  onNextGame: () => void;
};

const CONFETTI_COLORS = [
  "var(--color-blush)",
  "var(--color-sol)",
  "var(--color-berry)",
  "var(--color-menta-dark)",
  "var(--color-cielo-azul)",
];

/** Confeti determinista: nada de Math.random en el render. */
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 97) % 100}%`,
  delay: `${((i * 13) % 20) / 10}s`,
  duration: `${2.6 + ((i * 7) % 15) / 10}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 8 + ((i * 5) % 9),
}));

export default function WinOverlay({
  seconds,
  moves,
  pieces,
  campaignMode,
  onReplay,
  onChangeDifficulty,
  onNextGame,
}: Props) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-tinta/40 p-4 backdrop-blur-sm"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: c.left,
              width: c.size,
              height: c.size * 1.6,
              background: c.color,
              animation: `confetti-fall ${c.duration} linear ${c.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="animate-rise relative w-full max-w-md rounded-3xl border-[3px] border-tinta bg-crema p-6 text-center shadow-[0_12px_0_rgba(90,42,51,0.3)]">
        <h2 id="win-title" className="text-4xl font-extrabold text-tinta">
          ¡Muy bien! 🎉
        </h2>
        <p className="mt-1 font-bold text-tinta/70">
          Armaste el picnic completo
        </p>

        <div
          className="relative mx-auto mt-4 w-full overflow-hidden rounded-2xl border-[3px] border-tinta"
          style={{ aspectRatio: ASPECT }}
        >
          <Image
            src={PUZZLE.src}
            alt={PUZZLE.alt}
            fill
            sizes="(max-width: 640px) 80vw, 400px"
            className="object-cover"
          />
        </div>

        <dl className="mt-4 flex justify-center gap-3">
          <div className="flex-1 rounded-2xl border-[3px] border-tinta bg-blush/50 px-3 py-2">
            <dt className="text-xs font-bold text-tinta/70">Tiempo</dt>
            <dd className="text-2xl font-extrabold text-tinta">
              {formatTime(seconds)}
            </dd>
          </div>
          <div className="flex-1 rounded-2xl border-[3px] border-tinta bg-menta/70 px-3 py-2">
            <dt className="text-xs font-bold text-tinta/70">Movimientos</dt>
            <dd className="text-2xl font-extrabold text-tinta">{moves}</dd>
          </div>
        </dl>

        <button
          ref={nextRef}
          type="button"
          onClick={onNextGame}
          className="mt-5 w-full cursor-pointer rounded-2xl border-[3px] border-tinta bg-sol px-4 py-3 text-xl font-extrabold text-tinta shadow-[0_5px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
        >
          {campaignMode ? "← Volver al mapa" : "Siguiente juego →"}
        </button>

        {moves > pieces && (
          <p className="mt-2 text-sm font-bold text-tinta/55">
            {moves - pieces} {moves - pieces === 1 ? "pieza" : "piezas"} fuera de
            lugar
          </p>
        )}

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReplay}
            className="flex-1 cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-3 font-extrabold text-tinta shadow-[0_5px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
          >
            Jugar de nuevo
          </button>
          <button
            type="button"
            onClick={onChangeDifficulty}
            className="flex-1 cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-4 py-3 font-extrabold text-tinta shadow-[0_5px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
          >
            {campaignMode ? "← Mapa" : "Cambiar nivel"}
          </button>
        </div>
      </div>
    </div>
  );
}
