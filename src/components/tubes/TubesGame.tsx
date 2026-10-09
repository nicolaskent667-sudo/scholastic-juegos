"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TubeSprite from "@/components/tubes/TubeSprite";
import TubesWin from "@/components/tubes/TubesWin";
import OptionsButton from "@/components/ui/OptionsButton";
import ChickSprite from "@/components/sprites/ChickSprite";
import DogSprite from "@/components/sprites/DogSprite";
import { useTubesBoard } from "@/hooks/useTubesBoard";
import { useProgress } from "@/hooks/useProgress";
import { playEffect } from "@/lib/audio";
import { TUBE_COLORS, findHint, isComplete, type TubesLevel } from "@/lib/tubes";

const MAX_HINTS = 2;
const IDLE_MESSAGE = "¡Mismo color sobre mismo color!";

/** El rótulo de dificultad sale del número de nivel, como el badge del diseño. */
function tierOf(id: number): string {
  if (id <= 3) return "FÁCIL";
  if (id <= 6) return "NORMAL";
  return "DIFÍCIL";
}

export type TubesCampaign = {
  /** Salta al nivel siguiente. Ausente en el último de cada mundo. */
  onNextLevel?: () => void;
  /** Se llama al resolver, con los movimientos usados. */
  onFinish: (moves: number) => void;
};

type Props = {
  level: TubesLevel;
  onBack: () => void;
  campaign?: TubesCampaign;
};

export default function TubesGame({ level, onBack, campaign }: Props) {
  const { unlock } = useProgress();

  const [hintsUsed, setHintsUsed] = useState(0);
  const [hinted, setHinted] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [result, setResult] = useState<number | null>(null);

  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    },
    [],
  );

  const say = useCallback((text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(IDLE_MESSAGE), 2400);
  }, []);

  const handleSolved = useCallback(
    (moves: number) => {
      playEffect("victoria");
      setResult(moves);
      setHinted(null);
      unlock("tubes-first");
      if (hintsUsed === 0) unlock("tubes-nohint");
      campaign?.onFinish(moves);
    },
    [unlock, hintsUsed, campaign],
  );

  const {
    tubes,
    picked,
    moves,
    solved,
    stuck,
    rejected,
    canUndo,
    extraLeft,
    tapTube,
    undo,
    reset,
    addTube,
  } = useTubesBoard(level, handleSolved);

  // Suena al cerrar un tubo, igual que al unir un tubo en "unir colores".
  const doneCount = tubes.filter(isComplete).length;
  const doneRef = useRef(doneCount);
  useEffect(() => {
    if (doneCount > doneRef.current && !solved) playEffect("union");
    doneRef.current = doneCount;
  }, [doneCount, solved]);

  const handleTap = useCallback(
    (index: number) => {
      setHinted(null);
      tapTube(index);
    },
    [tapTube],
  );

  const restart = useCallback(() => {
    reset();
    setHintsUsed(0);
    setHinted(null);
    setResult(null);
    setMessage(IDLE_MESSAGE);
  }, [reset]);

  const useHint = useCallback(() => {
    if (solved || hintsUsed >= MAX_HINTS) return;
    const move = findHint(tubes);
    if (!move) {
      say("No encuentro ninguna jugada");
      return;
    }
    setHinted(move);
    setHintsUsed((value) => value + 1);
    say("Probá volcar de este tubo al otro");
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHinted(null), 4000);
  }, [solved, hintsUsed, tubes, say]);

  // Los tubos (mas el hueco con candado) se reparten en dos filas parejas:
  // con tres filas el tablero no entraba en una pantalla de celular.
  const slots = tubes.length + (extraLeft > 0 ? 1 : 0);
  const columns = Math.min(5, Math.max(4, Math.ceil(slots / 2)));

  const status = solved
    ? "¡Lo lograste!"
    : stuck
      ? "Te quedaste sin jugadas… probá deshacer"
      : message;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-2 sm:px-5 sm:py-4">
      <header className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-berry outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
        >
          ‹
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="rounded-full border-[3px] border-tinta bg-berry px-5 py-0.5 text-sm font-extrabold tracking-wide text-white">
            {tierOf(level.id)}
          </span>
          <h1 className="text-2xl font-extrabold text-berry sm:text-3xl">
            Nivel {level.id}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <OptionsButton />
          <button
            type="button"
            onClick={restart}
            aria-label="Reiniciar el nivel"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl text-berry outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            <span aria-hidden className="block leading-none">
              ↻
            </span>
          </button>
        </div>
      </header>

      <ul
        className="mx-auto grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          // Dos filas de tubos no pueden pasar de ~45vh, y el tubo es 3.1
          // veces mas alto que ancho: de ahi sale el 8vh de ancho maximo.
          maxWidth: `calc(${columns} * min(5.5rem, 8vh) + ${columns - 1} * 0.75rem)`,
        }}
      >
        {tubes.map((tube, i) => {
          const top = tube[tube.length - 1];
          const topName =
            tube.length === 0
              ? ""
              : TUBE_COLORS[top % TUBE_COLORS.length].name;
          return (
            <li key={i}>
              <TubeSprite
                tube={tube}
                picked={picked === i}
                rejected={rejected === i}
                hinted={hinted !== null && (hinted[0] === i || hinted[1] === i)}
                onTap={() => handleTap(i)}
                label={
                  tube.length === 0
                    ? `Tubo ${i + 1}, vacío`
                    : `Tubo ${i + 1}, ${tube.length} porciones, arriba ${topName}`
                }
              />
            </li>
          );
        })}

        {/* El hueco con candado: se abre con el botón de tubo extra */}
        {extraLeft > 0 && (
          <li>
            <div
              aria-hidden
              className="flex w-full items-center justify-center rounded-b-[2.2rem] rounded-t-xl border-[3px] border-dashed border-tinta/30 bg-white/40"
              style={{ aspectRatio: "1 / 3.1" }}
            >
              <span className="text-3xl opacity-40">🔒</span>
            </div>
          </li>
        )}
      </ul>

      {/* Mascotas, globo de diálogo y el botón de tubo extra */}
      <div className="mt-4 flex items-end justify-center gap-3">
        <svg
          viewBox="-110 -110 220 200"
          className="hidden h-24 w-auto shrink-0 sm:block"
          aria-hidden
        >
          <g transform="translate(-45 0) scale(0.78)">
            <DogSprite />
          </g>
          <g transform="translate(48 18) scale(0.66)">
            <ChickSprite />
          </g>
        </svg>

        <p
          aria-live="polite"
          className="max-w-xs rounded-2xl border-[3px] border-tinta bg-white px-4 py-2 text-center text-base font-extrabold text-berry"
        >
          {status}
        </p>

        <button
          type="button"
          onClick={addTube}
          disabled={extraLeft === 0 || solved}
          className="flex shrink-0 cursor-pointer flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-tinta bg-sol text-3xl font-extrabold text-tinta shadow-[0_4px_0_rgba(90,42,51,0.3)] transition hover:-translate-y-0.5">
            +
          </span>
          <span className="text-xs font-bold text-tinta/60">+ tubo</span>
        </button>
      </div>

      {/* Barra inferior */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl border-[3px] border-tinta bg-crema px-4 py-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo || solved}
          className="flex cursor-pointer flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-tinta bg-white text-2xl text-tinta/70 transition hover:bg-blush/40">
            <span aria-hidden className="block leading-none">
              ↺
            </span>
          </span>
          <span className="text-xs font-bold text-tinta/60">Deshacer</span>
        </button>

        <div className="rounded-2xl border-[3px] border-tinta bg-white px-5 py-1 text-center">
          <p className="text-xs font-bold text-tinta/60">Movimientos</p>
          <p className="text-xl font-extrabold tabular-nums text-tinta">{moves}</p>
        </div>

        <button
          type="button"
          onClick={useHint}
          disabled={hintsUsed >= MAX_HINTS || solved}
          className="flex cursor-pointer flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-tinta bg-sol text-2xl transition hover:-translate-y-0.5">
            <span aria-hidden className="block leading-none">
              💡
            </span>
            <span className="absolute -right-2 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-tinta bg-white text-xs font-extrabold text-tinta">
              {MAX_HINTS - hintsUsed}
            </span>
          </span>
          <span className="text-xs font-bold text-tinta/60">Pista</span>
        </button>
      </div>

      {solved && result !== null && (
        <TubesWin
          levelId={level.id}
          moves={result}
          par={level.par}
          hintsUsed={hintsUsed}
          usedExtra={extraLeft === 0}
          campaignMode={campaign !== undefined}
          onNextLevel={campaign?.onNextLevel}
          onReplay={restart}
          onBack={onBack}
        />
      )}
    </div>
  );
}
