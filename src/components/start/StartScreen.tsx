"use client";

import { useState } from "react";
import AchievementsPanel from "@/components/start/AchievementsPanel";
import OptionsPanel from "@/components/start/OptionsPanel";
import StartScene from "@/components/start/StartScene";
import SieniSprite, { FRIEND_X } from "@/components/sprites/SieniSprite";
import { useProgress } from "@/hooks/useProgress";
import { ACHIEVEMENTS } from "@/lib/progress";

const APP_VERSION = "v1.0";

type Props = {
  /** Entra al mapa de mundos. */
  onPlay: () => void;
  onShop: () => void;
};

export default function StartScreen({ onPlay, onShop }: Props) {
  const [panel, setPanel] = useState<"options" | "achievements" | null>(null);
  const { progress, loaded } = useProgress();
  const hasFriend = loaded && progress.equipped.amigo !== undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5">
      <div className="relative min-h-[min(88dvh,760px)] w-full overflow-hidden rounded-3xl border-[3px] border-tinta shadow-[0_10px_0_rgba(90,42,51,0.18)]">
        <StartScene />

        <div className="relative z-10 flex min-h-[min(88dvh,760px)] flex-col items-center justify-between gap-3 px-4 py-6 sm:py-8">
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

          {/* Sieni con lo que tenga puesto de la tienda, y su amigo al lado */}
          <svg
            viewBox={hasFriend ? `-110 -130 ${220 + FRIEND_X} 230` : "-110 -130 220 230"}
            className="h-44 w-auto sm:h-64"
            role="img"
            aria-label="Sieni, la perrita del juego"
          >
            <SieniSprite withFriend />
          </svg>

          <div className="flex w-full max-w-md flex-col items-center gap-3">
            <button
              type="button"
              onClick={onPlay}
              className="w-full cursor-pointer rounded-full border-[3px] border-tinta bg-berry px-8 py-4 text-3xl font-extrabold text-white shadow-[0_6px_0_rgba(90,42,51,0.35)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.35)] sm:text-4xl"
            >
              Jugar
            </button>

            <div className="flex w-full gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setPanel("options")}
                className="flex flex-1 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white px-2 py-2.5 text-base font-bold sm:px-4 sm:text-lg text-tinta shadow-[0_4px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                Opciones
              </button>
              <button
                type="button"
                onClick={onShop}
                className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-sol px-2 py-2.5 text-base font-bold sm:px-4 sm:text-lg text-tinta shadow-[0_4px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                Tienda
              </button>
              <button
                type="button"
                onClick={() => setPanel("achievements")}
                className="flex flex-1 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white px-2 py-2.5 text-base font-bold sm:px-4 sm:text-lg text-tinta shadow-[0_4px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-0.5 hover:bg-blush/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none"
              >
                Logros
                {loaded && progress.unlocked.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-sol px-1.5 py-0.5 text-xs font-extrabold text-tinta sm:ml-2 sm:px-2 sm:text-sm">
                    {progress.unlocked.length}/{ACHIEVEMENTS.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

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
