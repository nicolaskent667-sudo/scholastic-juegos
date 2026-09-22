"use client";

import { WORLDS, type World } from "@/lib/wordsearch";

type Props = {
  onPick: (world: World) => void;
  onBack: () => void;
  /** Mundos ya completados en esta sesión, para la tilde. */
  completed: number[];
};

/** Cuántas direcciones admite el mundo, en iconos. */
function dirBadge(world: World): string {
  if (world.dirs.length <= 2) return "→ ↓";
  if (world.dirs.length <= 3) return "→ ↓ ↘";
  return "8 direcciones";
}

export default function WorldPicker({ onPick, onBack, completed }: Props) {
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
            SOPA DE LETRAS
          </h1>
          <p className="text-sm font-bold text-tinta/60">
            Elegí un mundo para empezar
          </p>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORLDS.map((world) => {
          const done = completed.includes(world.id);
          return (
            <li key={world.id}>
              <button
                type="button"
                onClick={() => onPick(world)}
                className="flex w-full cursor-pointer flex-col items-start gap-1 rounded-3xl border-[3px] border-tinta bg-crema p-4 text-left shadow-[0_6px_0_rgba(90,42,51,0.25)] outline-none transition hover:-translate-y-1 hover:bg-sol/25 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.25)]"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="rounded-full border-[3px] border-tinta bg-berry px-3 py-0.5 text-sm font-extrabold text-white">
                    MUNDO {world.id}
                  </span>
                  {done && (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-tinta bg-menta-dark text-xs font-black text-white"
                      aria-label="Completado"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xl font-extrabold text-tinta">
                  {world.name}
                </span>
                <span className="text-sm font-bold text-tinta/60">
                  {world.hint}
                </span>
                <span className="mt-1 text-xs font-bold text-tinta/50">
                  {world.words.length} palabras · {world.size}×{world.size} ·{" "}
                  {dirBadge(world)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
