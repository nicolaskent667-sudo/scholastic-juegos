"use client";

import { MEMO_LEVELS, type MemoLevel } from "@/lib/memo";
import { formatTime } from "@/lib/puzzle";
import type { MemoBest } from "@/lib/progress";

type Props = {
  onPick: (level: MemoLevel) => void;
  onBack: () => void;
  best: MemoBest;
};

export default function MemoLevelPicker({ onPick, onBack, best }: Props) {
  return (
    <div className="animate-rise mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
        >
          ‹
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-berry sm:text-4xl">
            MEMOTEST
          </h1>
          <p className="text-sm font-bold text-tinta/60">
            Encontrá las parejas dando vuelta las cartas
          </p>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {MEMO_LEVELS.map((level) => {
          const record = best[level.id];
          return (
            <li key={level.id}>
              <button
                type="button"
                onClick={() => onPick(level)}
                className="flex h-full w-full cursor-pointer flex-col items-center gap-1 rounded-3xl border-[3px] border-tinta bg-crema p-5 text-center shadow-[0_6px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-1 hover:bg-sol/25 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.25)]"
              >
                <span className="text-4xl" aria-hidden>
                  {level.emoji}
                </span>
                <span className="text-xl font-extrabold text-tinta">
                  {level.name}
                </span>
                <span className="text-sm font-bold text-tinta/60">
                  {level.hint}
                </span>
                <span className="mt-1 text-xs font-bold text-tinta/50">
                  {level.pairs} parejas · {level.pairs * 2} cartas
                </span>
                {record && (
                  <span className="mt-2 rounded-full border-2 border-tinta/25 px-3 py-0.5 text-xs font-bold text-tinta/70">
                    🏅 {record.tries} intentos · {formatTime(record.seconds)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
