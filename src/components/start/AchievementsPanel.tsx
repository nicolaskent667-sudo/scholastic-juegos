"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/hooks/useProgress";
import { primaryButton } from "@/components/ui/buttons";
import { ACHIEVEMENTS, STARS_GOAL } from "@/lib/progress";

type Props = {
  onClose: () => void;
};

export default function AchievementsPanel({ onClose }: Props) {
  const { progress, loaded } = useProgress();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = progress.unlocked.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Logros"
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/45 p-4 backdrop-blur-sm"
    >
      <div className="animate-rise flex max-h-[90vh] w-full max-w-md flex-col rounded-3xl border-[3px] border-tinta bg-crema p-6 shadow-[0_12px_0_rgba(90,42,51,0.3)]">
        <h2 className="text-center text-3xl font-extrabold text-tinta">Logros</h2>
        <p className="mt-1 text-center font-bold text-tinta/60">
          {loaded
            ? `${done} de ${ACHIEVEMENTS.length} desbloqueados`
            : "Cargando…"}
        </p>

        <div className="mt-3 h-3 w-full overflow-hidden rounded-full border-2 border-tinta/30 bg-blush">
          <div
            className="h-full rounded-full bg-sol transition-[width] duration-300"
            style={{ width: `${(done / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>

        <ul className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = progress.unlocked.includes(achievement.id);
            const isStars = achievement.id === "flappy-stars";
            return (
              <li
                key={achievement.id}
                className={`flex items-center gap-3 rounded-2xl border-[3px] border-tinta px-3 py-2 ${
                  unlocked ? "bg-white" : "bg-crema/60"
                }`}
              >
                <span
                  aria-hidden
                  className={`text-2xl ${unlocked ? "" : "opacity-30 grayscale"}`}
                >
                  {unlocked ? achievement.emoji : "🔒"}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-extrabold ${
                      unlocked ? "text-tinta" : "text-tinta/50"
                    }`}
                  >
                    {achievement.name}
                  </span>
                  <span className="block text-sm font-bold text-tinta/55">
                    {achievement.how}
                    {isStars && !unlocked && (
                      <> · vas {progress.stars}/{STARS_GOAL}</>
                    )}
                  </span>
                </span>
                {unlocked && (
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-tinta bg-menta-dark text-xs font-black text-white"
                    aria-label="Desbloqueado"
                  >
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`${primaryButton} mt-5 w-full`}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
