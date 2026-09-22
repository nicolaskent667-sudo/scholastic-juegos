"use client";

import Image from "next/image";
import { ASPECT, DIFFICULTIES, PUZZLE, type Difficulty } from "@/lib/puzzle";

type Props = {
  onStart: (difficulty: Difficulty) => void;
  /** Atajos a los otros niveles, sin tener que completar el rompecabezas. */
  onSkipToFlappy: () => void;
  onSkipToWordSearch: () => void;
};

export default function DifficultyPicker({
  onStart,
  onSkipToFlappy,
  onSkipToWordSearch,
}: Props) {
  return (
    <div className="animate-rise mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-10">
      <header className="text-center">
        <p className="text-lg font-bold tracking-wide text-tinta/60">
          Rompecabezas
        </p>
        <h1 className="text-4xl font-extrabold text-tinta drop-shadow-sm sm:text-6xl">
          {PUZZLE.title}
        </h1>
      </header>

      <div
        className="animate-float relative w-full max-w-md overflow-hidden rounded-3xl border-[3px] border-tinta shadow-[0_12px_0_rgba(90,42,51,0.15)]"
        style={{ aspectRatio: ASPECT }}
      >
        <Image
          src={PUZZLE.src}
          alt={PUZZLE.alt}
          fill
          priority
          sizes="(max-width: 640px) 92vw, 448px"
          className="object-cover"
        />
      </div>

      <div className="w-full">
        <h2 className="mb-4 text-center text-xl font-bold text-tinta">
          Elegí la dificultad
        </h2>
        <ul className="flex flex-wrap justify-center gap-4">
          {DIFFICULTIES.map((difficulty) => (
            <li key={difficulty.id}>
              <button
                type="button"
                onClick={() => onStart(difficulty)}
                className="flex w-36 cursor-pointer flex-col items-center gap-1 rounded-3xl border-[3px] border-tinta bg-crema px-4 py-5 shadow-[0_6px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-1 hover:bg-sol/40 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-[0_2px_0_rgba(90,42,51,0.3)]"
              >
                <span className="text-4xl" aria-hidden>
                  {difficulty.emoji}
                </span>
                <span className="text-xl font-extrabold text-tinta">
                  {difficulty.label}
                </span>
                <span className="text-sm font-bold text-tinta/60">
                  {difficulty.rows} × {difficulty.cols} ={" "}
                  {difficulty.rows * difficulty.cols} piezas
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-bold text-tinta/50">Ir a:</span>
          <button
            type="button"
            onClick={onSkipToFlappy}
            className="cursor-pointer rounded-full border-[3px] border-tinta/30 px-4 py-2 text-sm font-bold text-tinta/60 outline-none transition hover:border-tinta hover:bg-crema hover:text-tinta focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            🐦 Vuelo
          </button>
          <button
            type="button"
            onClick={onSkipToWordSearch}
            className="cursor-pointer rounded-full border-[3px] border-tinta/30 px-4 py-2 text-sm font-bold text-tinta/60 outline-none transition hover:border-tinta hover:bg-crema hover:text-tinta focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            🔤 Sopa de letras
          </button>
        </div>
      </div>
    </div>
  );
}
