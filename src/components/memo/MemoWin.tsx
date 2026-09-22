"use client";

import { useEffect, useRef } from "react";
import { primaryButton, secondaryButton } from "@/components/ui/buttons";
import { formatTime } from "@/lib/puzzle";
import type { MemoRecord } from "@/lib/progress";

const CONFETTI_COLORS = [
  "var(--color-blush)",
  "var(--color-sol)",
  "var(--color-berry)",
  "var(--color-menta-dark)",
  "var(--color-cielo-azul)",
];

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 97) % 100}%`,
  delay: `${((i * 13) % 20) / 10}s`,
  duration: `${2.6 + ((i * 7) % 15) / 10}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 8 + ((i * 5) % 9),
}));

type Props = {
  levelName: string;
  tries: number;
  seconds: number;
  pairs: number;
  /** Marca anterior, para decir si se superó. */
  previousBest?: MemoRecord;
  isNewBest: boolean;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevels: () => void;
};

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`flex-1 rounded-2xl border-[3px] border-tinta px-2 py-2 ${tone}`}>
      <dt className="text-[10px] font-bold uppercase text-tinta/70">{label}</dt>
      <dd className="text-xl font-extrabold text-tinta">{value}</dd>
    </div>
  );
}

export default function MemoWin({
  levelName,
  tries,
  seconds,
  pairs,
  previousBest,
  isNewBest,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevels,
}: Props) {
  const focusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const perfect = tries === pairs;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Memotest ${levelName} completado`}
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
          {perfect ? "¡Sin errar ni una! ✨" : "¡Muy bien! 🎉"}
        </h2>
        <p className="mt-1 font-bold text-tinta/70">
          Encontraste las {pairs} parejas · {levelName}
        </p>

        <dl className="mt-4 flex gap-2">
          <Stat label="Intentos" value={`${tries}`} tone="bg-blush/50" />
          <Stat label="Tiempo" value={formatTime(seconds)} tone="bg-menta/70" />
        </dl>

        {isNewBest ? (
          <p className="mt-3 rounded-2xl border-[3px] border-tinta bg-sol/40 px-3 py-2 text-sm font-extrabold text-tinta">
            🏅 ¡Nuevo récord en {levelName}!
          </p>
        ) : (
          previousBest && (
            <p className="mt-3 text-sm font-bold text-tinta/55">
              Tu mejor marca sigue siendo {previousBest.tries} intentos en{" "}
              {formatTime(previousBest.seconds)}
            </p>
          )
        )}

        <div className="mt-5 flex flex-col gap-3">
          {hasNextLevel && (
            <button
              ref={focusRef}
              type="button"
              onClick={onNextLevel}
              className={primaryButton}
            >
              Siguiente nivel →
            </button>
          )}
          <button
            ref={hasNextLevel ? undefined : focusRef}
            type="button"
            onClick={onReplay}
            className={hasNextLevel ? secondaryButton : primaryButton}
          >
            Jugar de nuevo
          </button>
          <button type="button" onClick={onLevels} className={secondaryButton}>
            ← Elegir nivel
          </button>
        </div>
      </div>
    </div>
  );
}
