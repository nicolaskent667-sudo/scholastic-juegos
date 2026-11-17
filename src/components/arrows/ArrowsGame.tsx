"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ArrowSprite from "@/components/arrows/ArrowSprite";
import ArrowsWin from "@/components/arrows/ArrowsWin";
import OptionsButton from "@/components/ui/OptionsButton";
import DogSprite from "@/components/sprites/DogSprite";
import { useArrowsBoard } from "@/hooks/useArrowsBoard";
import { useProgress } from "@/hooks/useProgress";
import { playEffect } from "@/lib/audio";
import { exitRay, findHint, type ArrowsLevel } from "@/lib/arrows";
import { starsFor } from "@/lib/campaign";

const MAX_HINTS = 2;
const IDLE_MESSAGE = "¡Y liberá a Sieni!";
/** Margen para ver salir la última flecha antes del cartel de victoria. */
const WIN_DELAY_MS = 650;

export type ArrowsCampaign = {
  /** Salta al nivel siguiente. Ausente en el último de cada mundo. */
  onNextLevel?: () => void;
  /** Se llama al resolver, con los choques. */
  onFinish: (crashes: number) => void;
};

type Props = {
  level: ArrowsLevel;
  onBack: () => void;
  campaign?: ArrowsCampaign;
};

/** Estrellas en vivo, con la misma regla que guarda la campaña. */
function arrowsStars(crashes: number) {
  return starsFor({ kind: "arrows", crashes });
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function ArrowsGame({ level, onBack, campaign }: Props) {
  const { progress, unlock } = useProgress();
  const systemReduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
  const reduced = progress.settings.reducedMotion || systemReduced;

  const [hintsUsed, setHintsUsed] = useState(0);
  const [hinted, setHinted] = useState<number | null>(null);
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [result, setResult] = useState<number | null>(null);

  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      for (const timer of [hintTimer, messageTimer, winTimer]) {
        if (timer.current) clearTimeout(timer.current);
      }
    },
    [],
  );

  const say = useCallback((text: string) => {
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(IDLE_MESSAGE), 2200);
  }, []);

  const handleSolved = useCallback(
    (crashes: number) => {
      setHinted(null);
      unlock("arrows-first");
      if (hintsUsed === 0) unlock("arrows-nohint");
      campaign?.onFinish(crashes);
      if (winTimer.current) clearTimeout(winTimer.current);
      winTimer.current = setTimeout(() => {
        playEffect("victoria");
        setResult(crashes);
      }, WIN_DELAY_MS);
    },
    [unlock, hintsUsed, campaign],
  );

  const { remaining, left, crashes, flights, hit, solved, tapArrow, endFlight, reset } =
    useArrowsBoard(level, handleSolved, {
      onExit: () => playEffect("flecha"),
      onCrash: () => playEffect("bloque"),
    });

  const handleTap = useCallback(
    (id: number) => {
      if (hinted === id) setHinted(null);
      tapArrow(id);
    },
    [hinted, tapArrow],
  );

  // El mensaje del choque sale del golpe ya registrado, no del toque.
  const lastHit = useRef<number | null>(null);
  useEffect(() => {
    if (!hit || lastHit.current === hit.nonce) return;
    lastHit.current = hit.nonce;
    say(hit.what === "sieni" ? "¡Cuidado con Sieni!" : "¡Uy! Chocó con otra flecha");
  }, [hit, say]);

  const restart = useCallback(() => {
    reset();
    setHintsUsed(0);
    setHinted(null);
    setResult(null);
    setMessage(IDLE_MESSAGE);
    if (winTimer.current) clearTimeout(winTimer.current);
  }, [reset]);

  const useHint = useCallback(() => {
    if (solved || hintsUsed >= MAX_HINTS) return;
    const id = findHint(level, remaining);
    if (id === null) return;
    setHinted(id);
    setHintsUsed((value) => value + 1);
    say("Probá con esta flecha");
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHinted(null), 4000);
  }, [solved, hintsUsed, level, remaining, say]);

  const stars = arrowsStars(crashes);
  const [sc, sr] = level.sieni;
  const hintArrow = hinted !== null && remaining[hinted] ? level.arrows[hinted] : null;
  const hintTrail = hintArrow ? exitRay(level, hintArrow) : [];
  const hintHead = hintArrow?.cells[hintArrow.cells.length - 1];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center overflow-x-clip px-3 py-2 sm:px-5 sm:py-4">
      <header className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-berry outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
        >
          ‹
        </button>

        <h1 className="rounded-full border-[3px] border-tinta bg-berry px-8 py-1 text-xl font-extrabold text-white sm:text-2xl">
          Nivel {level.id}
        </h1>

        <OptionsButton />
      </header>

      <div className="mt-2 flex items-center gap-2">
        <span
          className="flex items-center gap-1 rounded-full border-[3px] border-tinta bg-sol/25 px-4 py-0.5 text-lg font-extrabold tabular-nums text-tinta"
          aria-label={`${stars} de 3 estrellas`}
        >
          <span aria-hidden className="text-sol">✦</span> {stars}/3
        </span>
        <span className="flex items-center gap-3 rounded-full border-[3px] border-tinta bg-white px-4 py-0.5 text-lg font-extrabold tabular-nums text-tinta">
          <span className="text-tinta/60">Faltan</span> {left}
        </span>
      </div>

      {/* El tablero. Las flechas salen volando por encima del borde. */}
      <div
        className="mt-4 w-full rounded-[2rem] border-[3px] border-tinta bg-crema p-3 sm:p-4"
        style={{
          // Lo que sobra de la pantalla después del resto de la interfaz.
          maxWidth: `min(100%, calc((100dvh - 19rem) * ${level.cols / level.rows} + 2rem))`,
        }}
      >
        <svg
          viewBox={`-0.5 -0.5 ${level.cols} ${level.rows}`}
          className="block w-full touch-manipulation select-none overflow-visible"
          role="group"
          aria-label={`Tablero con ${left} flechas`}
        >
          {Array.from({ length: level.cols * level.rows }, (_, i) => (
            <circle
              key={i}
              cx={i % level.cols}
              cy={Math.floor(i / level.cols)}
              r={0.05}
              fill="var(--color-blush)"
            />
          ))}

          {/* Sieni, en el medio, esperando que la liberen */}
          <g transform={`translate(${sc + 0.5} ${sr + 0.5})`}>
            <g
              key={hit?.what === "sieni" ? hit.nonce : "quieta"}
              style={{
                animation:
                  hit?.what === "sieni"
                    ? "arrow-shake 0.35s ease-in-out"
                    : solved
                      ? "arrow-hint 0.9s ease-in-out infinite"
                      : undefined,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              <circle r={0.98} fill="white" stroke="var(--color-tinta)" strokeWidth={0.07} />
              <circle r={0.82} fill="var(--color-cielo)" />
              <g transform="translate(0 0.08) scale(0.0085)">
                <DogSprite />
              </g>
            </g>
          </g>

          {/* El camino de salida de la pista */}
          {hintHead && hintTrail.length > 0 && (
            <line
              x1={hintHead[0]}
              y1={hintHead[1]}
              x2={hintTrail[hintTrail.length - 1][0]}
              y2={hintTrail[hintTrail.length - 1][1]}
              stroke="#ef8fb1"
              strokeWidth={0.09}
              strokeDasharray="0.3 0.3"
              strokeLinecap="round"
              style={{ animation: "trail-march 0.6s linear infinite" }}
            />
          )}

          {level.arrows.map((arrow) => {
            const flight = flights.find((f) => f.id === arrow.id) ?? null;
            if (!remaining[arrow.id] && !flight) return null;
            return (
              <ArrowSprite
                key={arrow.id}
                level={level}
                arrow={arrow}
                flight={flight}
                hitNonce={hit?.what === arrow.id ? hit.nonce : null}
                hinted={hinted === arrow.id}
                reduced={reduced}
                onTap={() => handleTap(arrow.id)}
                onDone={endFlight}
              />
            );
          })}
        </svg>
      </div>

      {/* El cartel del diseño; el renglón de abajo cuenta lo que pasa */}
      <div className="mt-4 w-full rounded-[1.75rem] border-[3px] border-tinta bg-blush/70 p-1.5">
        <div className="rounded-3xl border-[3px] border-tinta/80 bg-cielo px-4 py-2 text-center">
          <p className="text-2xl font-extrabold tracking-tight text-tinta sm:text-3xl">
            SACÁ LAS FLECHAS
          </p>
          <p aria-live="polite" className="text-lg font-extrabold text-sol [text-shadow:_0_2px_0_var(--color-tinta)]">
            {solved ? "¡Sieni es libre!" : message}
          </p>
        </div>
      </div>

      <div className="mt-4 flex w-full items-center justify-center gap-4">
        <button
          type="button"
          onClick={restart}
          className="flex-1 cursor-pointer rounded-full border-[3px] border-tinta bg-berry px-6 py-3 text-lg font-extrabold text-white shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none sm:max-w-xs"
        >
          REINICIAR
        </button>

        <button
          type="button"
          onClick={useHint}
          disabled={hintsUsed >= MAX_HINTS || solved}
          aria-label={`Pista, quedan ${MAX_HINTS - hintsUsed}`}
          className="relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-sol text-2xl outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden className="block leading-none">
            💡
          </span>
          <span className="absolute -right-2 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-tinta bg-white text-xs font-extrabold text-tinta">
            {MAX_HINTS - hintsUsed}
          </span>
        </button>
      </div>

      {solved && result !== null && (
        <ArrowsWin
          levelId={level.id}
          crashes={result}
          stars={arrowsStars(result)}
          hintsUsed={hintsUsed}
          campaignMode={campaign !== undefined}
          onNextLevel={campaign?.onNextLevel}
          onReplay={restart}
          onBack={onBack}
        />
      )}
    </div>
  );
}
