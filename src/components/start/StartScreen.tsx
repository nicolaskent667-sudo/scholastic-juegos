"use client";

import { useState } from "react";
import AchievementsPanel from "@/components/start/AchievementsPanel";
import OptionsPanel from "@/components/start/OptionsPanel";
import StartScene from "@/components/start/StartScene";
import DogSprite from "@/components/sprites/DogSprite";
import { useProgress } from "@/hooks/useProgress";
import { ACHIEVEMENTS } from "@/lib/progress";

const APP_VERSION = "v1.0";

type Props = {
  /** Entra al mapa de mundos. */
  onPlay: () => void;
  /** Modo libre: los juegos sueltos, sin campaña. */
  onFreePlay: () => void;
};

export default function StartScreen({ onPlay, onFreePlay }: Props) {
  const [panel, setPanel] = useState<"options" | "achievements" | null>(null);
  const { progress, loaded } = useProgress();

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5">
      <div className="relative min-h-[min(88vh,760px)] w-full overflow-hidden rounded-3xl border-[3px] border-tinta shadow-[0_10px_0_rgba(90,42,51,0.18)]">
        <StartScene />

        <div className="relative z-10 flex min-h-[min(88vh,760px)] flex-col items-center justify-between gap-3 px-4 py-6 sm:py-8">
          <header className="flex flex-col items-center gap-2">
            <h1
              className="text-center text-5xl font-black tracking-tight text-tinta sm:text-7xl"
              style={{
                WebkitTextStroke: "3px var(--color-tinta)",
                paintOrder: "stroke fill",
              }}
            >
              Scholastic
            </h1>
            <p className="rounded-full border-[3px] border-tinta bg-white px-8 py-1 text-lg font-bold text-tinta sm:text-xl">
              con Sieni
            </p>
          </header>

          {/* La perrita es el mismo DogSprite que aparece en la sopa de letras */}
          <svg
            viewBox="-110 -130 220 230"
            className="h-44 w-auto sm:h-64"
            role="img"
            aria-label="Sieni, la perrita del juego"
          >
            <DogSprite />
          </svg>

          <div className="flex w-full max-w-md flex-col items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="w-full cursor-pointer rounded-full border-[3px] border-tinta bg-berry px-8 py-4 text-3xl font-extrabold text-white shadow-[0_6px_0_rgba(90,42,51,0.35)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.35)] sm:text-4xl"
            >
              Jugar
            </button>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setPanel("options")}
                className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-white px-4 py-2.5 text-lg font-bold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                Opciones
              </button>
              <button
                type="button"
                onClick={() => setPanel("achievements")}
                className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-white px-4 py-2.5 text-lg font-bold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                Logros
                {loaded && progress.unlocked.length > 0 && (
                  <span className="ml-2 rounded-full bg-sol px-2 py-0.5 text-sm font-extrabold text-tinta">
                    {progress.unlocked.length}/{ACHIEVEMENTS.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onFreePlay}
          className="absolute bottom-3 left-4 z-10 cursor-pointer rounded-full border-2 border-tinta/25 px-3 py-1 text-xs font-bold text-tinta/55 outline-none transition hover:border-tinta hover:bg-white hover:text-tinta focus-visible:ring-4 focus-visible:ring-cielo-azul"
        >
          Juego libre
        </button>

        <span className="absolute bottom-3 right-4 z-10 text-sm font-bold text-tinta/60">
          {APP_VERSION}
        </span>
      </div>

      {panel === "options" && <OptionsPanel onClose={() => setPanel(null)} />}
      {panel === "achievements" && (
        <AchievementsPanel onClose={() => setPanel(null)} />
      )}
    </div>
  );
}
