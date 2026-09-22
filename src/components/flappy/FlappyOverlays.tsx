"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { primaryButton, secondaryButton } from "@/components/ui/buttons";
import { formatTime } from "@/lib/puzzle";
import { GOAL_LAMPS } from "@/lib/flappy";

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

type PanelProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  confetti?: boolean;
  /** Se enfoca al aparecer, para que el teclado quede listo. */
  autoFocusRef?: React.RefObject<HTMLButtonElement | null>;
};

function Panel({
  title,
  subtitle,
  children,
  confetti = false,
  autoFocusRef,
}: PanelProps) {
  useEffect(() => {
    autoFocusRef?.current?.focus();
  }, [autoFocusRef]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-tinta/45 p-4 backdrop-blur-[2px]"
    >
      {confetti && (
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
      )}

      <div className="animate-rise relative w-full max-w-sm rounded-3xl border-[3px] border-tinta bg-crema p-6 text-center shadow-[0_12px_0_rgba(90,42,51,0.3)]">
        <h2 className="text-3xl font-extrabold text-tinta sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 font-bold text-tinta/70">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`flex-1 rounded-2xl border-[3px] border-tinta px-2 py-2 ${tone}`}>
      <dt className="text-[10px] font-bold uppercase text-tinta/70">{label}</dt>
      <dd className="text-xl font-extrabold text-tinta">{value}</dd>
    </div>
  );
}

export function ReadyOverlay({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center pb-[12%]">
      <div className="animate-float rounded-3xl border-[3px] border-tinta bg-crema/95 px-6 py-4 text-center shadow-[0_8px_0_rgba(90,42,51,0.25)]">
        <p className="text-2xl font-extrabold text-tinta">Tocá para volar 🐦</p>
        <p className="mt-1 text-sm font-bold text-tinta/70">
          Pasá por la luz de los faroles
        </p>
        <button type="button" onClick={onStart} className="sr-only">
          Empezar a volar
        </button>
      </div>
    </div>
  );
}

export function PausedOverlay({
  onResume,
  onRestart,
  onBack,
}: {
  onResume: () => void;
  onRestart: () => void;
  onBack: () => void;
}) {
  const focusRef = useRef<HTMLButtonElement>(null);
  return (
    <Panel title="Pausa ⏸" autoFocusRef={focusRef}>
      <div className="mt-5 flex flex-col gap-3">
        <button
          ref={focusRef}
          type="button"
          onClick={onResume}
          className={primaryButton}
        >
          Seguir jugando
        </button>
        <button type="button" onClick={onRestart} className={secondaryButton}>
          Empezar de nuevo
        </button>
        <button type="button" onClick={onBack} className={secondaryButton}>
          ← Volver al rompecabezas
        </button>
      </div>
    </Panel>
  );
}

export function GameOverOverlay({
  stars,
  passed,
  onRestart,
  onBack,
}: {
  stars: number;
  passed: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const focusRef = useRef<HTMLButtonElement>(null);
  return (
    <Panel
      title="¡Uy, chocaste!"
      subtitle="Se te acabaron los corazones"
      autoFocusRef={focusRef}
    >
      <dl className="mt-4 flex gap-3">
        <Stat label="Faroles" value={`${passed}/${GOAL_LAMPS}`} tone="bg-menta/70" />
        <Stat label="Estrellas" value={`${stars}`} tone="bg-blush/50" />
      </dl>
      <div className="mt-5 flex flex-col gap-3">
        <button
          ref={focusRef}
          type="button"
          onClick={onRestart}
          className={primaryButton}
        >
          Intentar de nuevo
        </button>
        <button type="button" onClick={onBack} className={secondaryButton}>
          ← Volver al rompecabezas
        </button>
      </div>
    </Panel>
  );
}

export function FlappyWinOverlay({
  stars,
  hearts,
  seconds,
  onRestart,
  onBack,
  onNextGame,
}: {
  stars: number;
  hearts: number;
  seconds: number;
  onRestart: () => void;
  onBack: () => void;
  onNextGame: () => void;
}) {
  const focusRef = useRef<HTMLButtonElement>(null);
  return (
    <Panel
      title="¡Lo lograste! 🎉"
      subtitle={`Cruzaste los ${GOAL_LAMPS} faroles`}
      confetti
      autoFocusRef={focusRef}
    >
      <dl className="mt-4 flex gap-2">
        <Stat label="Tiempo" value={formatTime(seconds)} tone="bg-blush/50" />
        <Stat label="Estrellas" value={`${stars}`} tone="bg-sol/40" />
        <Stat label="Corazones" value={`${hearts}`} tone="bg-menta/70" />
      </dl>
      <div className="mt-5 flex flex-col gap-3">
        <button
          ref={focusRef}
          type="button"
          onClick={onNextGame}
          className={primaryButton}
        >
          Siguiente juego →
        </button>
        <button type="button" onClick={onRestart} className={secondaryButton}>
          Jugar de nuevo
        </button>
        <button type="button" onClick={onBack} className={secondaryButton}>
          ← Volver al rompecabezas
        </button>
      </div>
    </Panel>
  );
}
