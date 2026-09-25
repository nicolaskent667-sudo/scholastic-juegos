"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MemoCard from "@/components/memo/MemoCard";
import MemoLevelPicker from "@/components/memo/MemoLevelPicker";
import MemoWin from "@/components/memo/MemoWin";
import { toolButton } from "@/components/ui/buttons";
import { useProgress } from "@/hooks/useProgress";
import {
  MEMO_LEVELS,
  buildDeck,
  type MemoLevel,
  type MemoLevelId,
  type MemoTile,
} from "@/lib/memo";
import { isBetterRecord, type MemoRecord } from "@/lib/progress";
import { formatTime } from "@/lib/puzzle";

/** Cuánto quedan visibles dos cartas que no coinciden. */
const PEEK_MS = 900;

export type MemoCampaign = {
  levelId: MemoLevelId;
  pairs: number;
  /** Se llama al completar, con los intentos usados. */
  onFinish: (tries: number) => void;
};

type Props = {
  onBack: () => void;
  campaign?: MemoCampaign;
};

export default function MemoGame({ onBack, campaign }: Props) {
  const { progress, recordMemoResult } = useProgress();

  /**
   * En modo campaña se entra directo al nivel, con la cantidad de parejas que
   * pide el mapa. El reparto va en un initializer perezoso: este subárbol nunca
   * se renderiza en el servidor, así que el Math.random no rompe la hidratación.
   */
  const [seed] = useState(() => {
    if (!campaign) return null;
    const base = MEMO_LEVELS.find((l) => l.id === campaign.levelId);
    if (!base) return null;
    const tuned: MemoLevel = { ...base, pairs: campaign.pairs };
    return { level: tuned, deck: buildDeck(tuned), startedAt: Date.now() };
  });

  const [level, setLevel] = useState<MemoLevel | null>(seed?.level ?? null);
  const [deck, setDeck] = useState<MemoTile[]>(seed?.deck ?? []);
  /** Claves de las cartas levantadas ahora mismo (0, 1 o 2). */
  const [picked, setPicked] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(
    seed?.startedAt ?? null,
  );
  const [now, setNow] = useState(seed?.startedAt ?? 0);
  /** Se congela al ganar para que el cartel muestre la marca correcta. */
  const [result, setResult] = useState<MemoRecord | null>(null);
  /**
   * El récord tal como estaba al empezar la partida. Hay que guardarlo acá
   * porque `recordMemoResult` ya pisó el del store cuando se muestra el cartel.
   */
  const [bestAtStart, setBestAtStart] = useState<MemoRecord | undefined>();

  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const won = level !== null && matched.length === level.pairs;

  useEffect(
    () => () => {
      if (peekTimer.current) clearTimeout(peekTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (startedAt === null || won) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, won]);

  const elapsed =
    startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));

  /** `buildDeck` usa Math.random: solo desde handlers del cliente. */
  const startLevel = useCallback(
    (next: MemoLevel, previous: MemoRecord | undefined) => {
    const startTime = Date.now();
    if (peekTimer.current) clearTimeout(peekTimer.current);
    setBestAtStart(previous);
    setLevel(next);
    setDeck(buildDeck(next));
    setPicked([]);
    setMatched([]);
    setWrong([]);
    setTries(0);
    setResult(null);
    setStartedAt(startTime);
    setNow(startTime);
    },
    [],
  );

  /** Envoltorio: siempre arranca con el récord que hay en este momento. */
  const beginLevel = useCallback(
    (next: MemoLevel) => startLevel(next, progress.memoBest[next.id]),
    [startLevel, progress.memoBest],
  );

  const flip = useCallback(
    (tile: MemoTile) => {
      if (!level || won) return;
      // Con dos cartas arriba no se puede levantar una tercera.
      if (picked.length >= 2) return;
      if (picked.includes(tile.key) || matched.includes(tile.card.id)) return;

      const next = [...picked, tile.key];
      setPicked(next);
      if (next.length < 2) return;

      const [firstKey, secondKey] = next;
      const first = deck.find((t) => t.key === firstKey);
      const second = deck.find((t) => t.key === secondKey);
      const attempt = tries + 1;
      setTries(attempt);

      if (first && second && first.card.id === second.card.id) {
        const nextMatched = [...matched, first.card.id];
        setMatched(nextMatched);
        setPicked([]);

        if (nextMatched.length === level.pairs) {
          const seconds = startedAt
            ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
            : 0;
          const record: MemoRecord = { tries: attempt, seconds };
          setResult(record);
          // Perfecto = un intento por pareja, sin un solo error.
          recordMemoResult(level.id, record, attempt === level.pairs);
          campaign?.onFinish(attempt);
        }
        return;
      }

      // Fallo: se ven un rato y se dan vuelta solas.
      setWrong(next);
      if (peekTimer.current) clearTimeout(peekTimer.current);
      peekTimer.current = setTimeout(() => {
        setPicked([]);
        setWrong([]);
      }, PEEK_MS);
    },
    [level, won, picked, matched, deck, tries, startedAt, recordMemoResult, campaign],
  );

  const backToLevels = useCallback(() => {
    if (peekTimer.current) clearTimeout(peekTimer.current);
    // En la campaña no hay selector de niveles: se vuelve al mapa.
    if (campaign) {
      onBack();
      return;
    }
    setLevel(null);
    setDeck([]);
    setStartedAt(null);
    setResult(null);
  }, [campaign, onBack]);

  const nextLevel = useCallback(() => {
    if (!level) return;
    const index = MEMO_LEVELS.findIndex((l) => l.id === level.id);
    const next = MEMO_LEVELS[index + 1];
    if (next) beginLevel(next);
  }, [level, beginLevel]);

  if (!level) {
    return (
      <MemoLevelPicker
        onPick={beginLevel}
        onBack={onBack}
        best={progress.memoBest}
      />
    );
  }

  const currentBest = progress.memoBest[level.id];
  const levelIndex = MEMO_LEVELS.findIndex((l) => l.id === level.id);
  const hasNextLevel = levelIndex >= 0 && levelIndex < MEMO_LEVELS.length - 1;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={backToLevels}
            aria-label="Elegir otro nivel"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            ‹
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-berry sm:text-3xl">
              MEMOTEST
            </h1>
            <p className="text-xs font-bold text-tinta/55">
              {level.name} · {level.hint}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border-[3px] border-tinta bg-white px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            🕐 {formatTime(elapsed)}
          </span>
          <span className="rounded-full border-[3px] border-tinta bg-blush/50 px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            🔁 {tries}
          </span>
          <span className="rounded-full border-[3px] border-tinta bg-sol/30 px-4 py-1 text-lg font-extrabold tabular-nums text-tinta">
            ✦ {matched.length}/{level.pairs}
          </span>
        </div>
      </header>

      <ul
        className={`grid gap-2 grid-cols-3 sm:gap-3 sm:grid-cols-4 ${
          level.columns >= 5 ? "lg:grid-cols-5" : ""
        }`}
      >
        {deck.map((tile) => {
          const isMatched = matched.includes(tile.card.id);
          return (
            <li key={tile.key}>
              <MemoCard
                card={tile.card}
                showLabel={level.showLabels}
                faceUp={picked.includes(tile.key) || isMatched}
                matched={isMatched}
                wrong={wrong.includes(tile.key)}
                disabled={picked.length >= 2 || won}
                onFlip={() => flip(tile)}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => beginLevel(level)}
            className={toolButton}
          >
            ↻ Mezclar de nuevo
          </button>
          <button type="button" onClick={onBack} className={toolButton}>
            ← Juego anterior
          </button>
        </div>
        {currentBest && (
          <p className="text-sm font-bold text-tinta/55">
            🏅 Tu récord: {currentBest.tries} intentos ·{" "}
            {formatTime(currentBest.seconds)}
          </p>
        )}
      </div>

      {won && result && (
        <MemoWin
          levelName={level.name}
          tries={result.tries}
          seconds={result.seconds}
          pairs={level.pairs}
          previousBest={bestAtStart}
          isNewBest={isBetterRecord(result, bestAtStart)}
          hasNextLevel={hasNextLevel && !campaign}
          campaignMode={campaign !== undefined}
          onNextLevel={nextLevel}
          onReplay={() => beginLevel(level)}
          onLevels={backToLevels}
        />
      )}
    </div>
  );
}
