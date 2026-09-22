/**
 * Logros y preferencias, guardados en el navegador.
 * Sin React: solo lectura/escritura y las definiciones.
 */

import type { MemoLevelId } from "@/lib/memo";

export type AchievementId =
  | "memo-first"
  | "memo-expert"
  | "memo-perfect"
  | "puzzle-first"
  | "puzzle-hard"
  | "puzzle-fast"
  | "flappy-win"
  | "flappy-perfect"
  | "flappy-stars"
  | "words-first"
  | "words-nohint"
  | "words-all";

export type Achievement = {
  id: AchievementId;
  emoji: string;
  name: string;
  how: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "puzzle-first", emoji: "🧩", name: "Primer rompecabezas", how: "Armá la imagen completa una vez" },
  { id: "puzzle-hard", emoji: "🖼️", name: "Maestra del 5×5", how: "Completá el rompecabezas difícil" },
  { id: "puzzle-fast", emoji: "⚡", name: "Manos rápidas", how: "Armá un 3×3 en menos de un minuto" },
  { id: "flappy-win", emoji: "🐦", name: "Cruzaste el parque", how: "Pasá los 15 faroles" },
  { id: "flappy-perfect", emoji: "💖", name: "Vuelo perfecto", how: "Ganá el vuelo sin perder corazones" },
  { id: "flappy-stars", emoji: "⭐", name: "Cazaestrellas", how: "Juntá 30 estrellas en total" },
  { id: "words-first", emoji: "🔤", name: "Primera sopa", how: "Completá un mundo de la sopa de letras" },
  { id: "words-nohint", emoji: "🧠", name: "Sin ayuda", how: "Completá un mundo sin usar pistas" },
  { id: "words-all", emoji: "🏆", name: "Las 52 palabras", how: "Completá los nueve mundos" },
  { id: "memo-first", emoji: "🃏", name: "Buena memoria", how: "Completá un memotest" },
  { id: "memo-expert", emoji: "🎓", name: "Ojo de lince", how: "Completá el memotest experto" },
  { id: "memo-perfect", emoji: "✨", name: "Memoria perfecta", how: "Completá un memotest sin errar ni una" },
];

export const STARS_GOAL = 30;

export type Settings = {
  /** Apaga las animaciones decorativas para quien se marea o se distrae. */
  reducedMotion: boolean;
};

/** Mejor marca de un nivel de memotest: menos intentos primero. */
export type MemoRecord = { tries: number; seconds: number };
export type MemoBest = Partial<Record<MemoLevelId, MemoRecord>>;

export type Progress = {
  unlocked: AchievementId[];
  /** Estrellas acumuladas entre todas las partidas del nivel de vuelo. */
  stars: number;
  /** Mundos de la sopa de letras ya completados. */
  worldsDone: number[];
  memoBest: MemoBest;
  settings: Settings;
};

export const DEFAULT_PROGRESS: Progress = {
  unlocked: [],
  stars: 0,
  worldsDone: [],
  memoBest: {},
  settings: { reducedMotion: false },
};

const MEMO_LEVEL_IDS = new Set<string>(["facil", "dificil", "experto"]);

/** Una marca mejora a otra si usó menos intentos, o los mismos en menos tiempo. */
export function isBetterRecord(next: MemoRecord, prev?: MemoRecord): boolean {
  if (!prev) return true;
  if (next.tries !== prev.tries) return next.tries < prev.tries;
  return next.seconds < prev.seconds;
}

export const STORAGE_KEY = "scholastic-juegos:progreso:v1";

const VALID_IDS = new Set<string>(ACHIEVEMENTS.map((a) => a.id));

/**
 * Lo que vuelve de localStorage es dato ajeno: puede estar corrupto, ser de una
 * versión vieja o venir de otra pestaña. Se valida campo por campo.
 */
function sanitize(raw: unknown): Progress {
  if (typeof raw !== "object" || raw === null) return DEFAULT_PROGRESS;
  const data = raw as Record<string, unknown>;

  const unlocked = Array.isArray(data.unlocked)
    ? data.unlocked.filter(
        (id): id is AchievementId => typeof id === "string" && VALID_IDS.has(id),
      )
    : [];

  const worldsDone = Array.isArray(data.worldsDone)
    ? data.worldsDone.filter(
        (n): n is number => typeof n === "number" && Number.isInteger(n),
      )
    : [];

  const stars =
    typeof data.stars === "number" && Number.isFinite(data.stars) && data.stars >= 0
      ? Math.floor(data.stars)
      : 0;

  const settings = (data.settings ?? {}) as Record<string, unknown>;

  const memoBest: MemoBest = {};
  if (typeof data.memoBest === "object" && data.memoBest !== null) {
    for (const [key, value] of Object.entries(data.memoBest)) {
      if (!MEMO_LEVEL_IDS.has(key) || typeof value !== "object" || value === null) {
        continue;
      }
      const record = value as Record<string, unknown>;
      if (
        typeof record.tries === "number" &&
        Number.isFinite(record.tries) &&
        typeof record.seconds === "number" &&
        Number.isFinite(record.seconds)
      ) {
        memoBest[key as MemoLevelId] = {
          tries: Math.max(0, Math.floor(record.tries)),
          seconds: Math.max(0, Math.floor(record.seconds)),
        };
      }
    }
  }

  return {
    unlocked: [...new Set(unlocked)],
    stars,
    worldsDone: [...new Set(worldsDone)],
    memoBest,
    settings: { reducedMotion: settings.reducedMotion === true },
  };
}

/** Solo en el cliente. Devuelve los valores por defecto si algo falla. */
export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return sanitize(JSON.parse(raw));
  } catch {
    // Modo privado, almacenamiento bloqueado o JSON roto: seguimos sin guardar.
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Que no se pueda guardar no debe romper el juego.
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ídem.
  }
}
