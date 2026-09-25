"use client";

import { useEffect, useRef } from "react";
import { primaryButton, secondaryButton } from "@/components/ui/buttons";
import { formatTime } from "@/lib/puzzle";

const CONFETTI_COLORS = [
  "var(--color-blush)",
  "var(--color-sol)",
  "var(--color-berry)",
  "var(--color-menta-dark)",
  "var(--color-cielo-azul)",
];

/** Confeti determinista: nada de Math.random en el render. */
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 97) % 100}%`,
  delay: `${((i * 13) % 20) / 10}s`,
  duration: `${2.6 + ((i * 7) % 15) / 10}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 8 + ((i * 5) % 9),
}));

type Props = {
  worldName: string;
  words: number;
  seconds: number;
  hintsUsed: number;
  hasNextWorld: boolean;
  /** En la campaña no hay "siguiente juego": se vuelve al mapa. */
  campaignMode: boolean;
  onNextWorld: () => void;
  onReplay: () => void;
  onWorlds: () => void;
  onNextGame: () => void;
};

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`flex-1 rounded-2xl border-[3px] border-tinta px-2 py-2 ${tone}`}>
      <dt className="text-[10px] font-bold uppercase text-tinta/70">{label}</dt>
      <dd className="text-xl font-extrabold text-tinta">{value}</dd>
    </div>
  );
}

export default function WordSearchWin({
  worldName,
  words,
  seconds,
  hintsUsed,
  hasNextWorld,
  campaignMode,
  onNextWorld,
  onReplay,
  onWorlds,
  onNextGame,
}: Props) {
  const focusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Mundo ${worldName} completado`}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-tinta/45 p-4 backdrop-blur-sm"
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

      <div className="animate-rise relative w-full max-w-sm rounded-3xl border-[3px] border-tinta bg-crema p-6 text-center shadow-[0_12px_0_rgba(90,42,51,0.3)]">
        <h2 className="text-3xl font-extrabold text-tinta sm:text-4xl">
          ¡Muy bien! 🎉
        </h2>
        <p className="mt-1 font-bold text-tinta/70">
          Completaste {worldName}
        </p>

        <dl className="mt-4 flex gap-2">
          <Stat label="Tiempo" value={formatTime(seconds)} tone="bg-blush/50" />
          <Stat label="Palabras" value={`${words}`} tone="bg-menta/70" />
          <Stat label="Pistas" value={`${hintsUsed}`} tone="bg-sol/40" />
        </dl>

        <div className="mt-5 flex flex-col gap-3">
          {hasNextWorld && (
            <button
              ref={focusRef}
              type="button"
              onClick={onNextWorld}
              className={primaryButton}
            >
              Siguiente mundo →
            </button>
          )}
          <button
            ref={hasNextWorld ? undefined : focusRef}
            type="button"
            onClick={onReplay}
            className={hasNextWorld ? secondaryButton : primaryButton}
          >
            Jugar de nuevo
          </button>
          {!campaignMode && (
            <button type="button" onClick={onNextGame} className={secondaryButton}>
              Siguiente juego →
            </button>
          )}
          <button type="button" onClick={onWorlds} className={secondaryButton}>
            {campaignMode ? "← Volver al mapa" : "← Elegir mundo"}
          </button>
        </div>
      </div>
    </div>
  );
}
