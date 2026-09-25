"use client";

import { useProgress } from "@/hooks/useProgress";
import { WORLDS, worldStarTotal, type CampaignWorld } from "@/lib/campaign";

type Props = {
  onPickWorld: (world: CampaignWorld) => void;
  onBack: () => void;
};

export default function WorldSelect({ onPickWorld, onBack }: Props) {
  const { progress } = useProgress();
  const stars = progress.levelStars;

  const grandTotal = WORLDS.reduce((sum, w) => sum + worldStarTotal(w), 0);
  const grandEarned = WORLDS.reduce(
    (sum, w) =>
      sum + w.levels.reduce((s, level) => s + (stars[level.id] ?? 0), 0),
    0,
  );

  return (
    <div className="animate-rise mx-auto w-full max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a la portada"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            ‹
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-tinta sm:text-4xl">
              Mundos
            </h1>
            <p className="text-sm font-bold text-tinta/60">
              Elegí por dónde seguir
            </p>
          </div>
        </div>

        <span className="rounded-full border-[3px] border-tinta bg-sol/25 px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
          ✦ {grandEarned} / {grandTotal}
        </span>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {WORLDS.map((world) => {
          const total = worldStarTotal(world);
          const earned = world.levels.reduce(
            (sum, level) => sum + (stars[level.id] ?? 0),
            0,
          );
          const done = world.levels.every((l) => (stars[l.id] ?? 0) > 0);

          return (
            <li key={world.id}>
              <button
                type="button"
                onClick={() => onPickWorld(world)}
                className="flex w-full cursor-pointer items-center gap-4 rounded-3xl border-[3px] border-tinta bg-crema p-5 text-left shadow-[0_6px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-1 hover:bg-sol/25 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.25)]"
              >
                <span className="text-5xl" aria-hidden>
                  {world.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="rounded-full border-2 border-tinta bg-berry px-2 py-0.5 text-xs font-extrabold text-white">
                      MUNDO {world.id}
                    </span>
                    {done && (
                      <span
                        className="text-sm font-extrabold text-menta-dark"
                        aria-label="Mundo completo"
                      >
                        ✓ completo
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-xl font-extrabold text-tinta">
                    {world.name}
                  </span>
                  <span className="block text-sm font-bold text-tinta/60">
                    {world.hint}
                  </span>

                  <span className="mt-2 block h-2.5 w-full overflow-hidden rounded-full border-2 border-tinta/25 bg-blush/60">
                    <span
                      className="block h-full rounded-full bg-sol transition-[width] duration-300"
                      style={{ width: `${(earned / total) * 100}%` }}
                    />
                  </span>
                  <span className="mt-1 block text-xs font-bold text-tinta/55">
                    {earned} / {total} estrellas · {world.levels.length} niveles
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
