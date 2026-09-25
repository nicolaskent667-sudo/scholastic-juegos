/**
 * El progreso vive en localStorage, que es un store externo a React. Por eso se
 * expone como tal (subscribe / getSnapshot) y se consume con
 * `useSyncExternalStore`, en vez de leerlo con un setState dentro de un efecto.
 *
 * De yapa, escuchar el evento `storage` mantiene sincronizadas dos pestañas
 * abiertas del juego.
 */

import {
  DEFAULT_PROGRESS,
  STARS_GOAL,
  STORAGE_KEY,
  clearProgress,
  isBetterRecord,
  loadProgress,
  saveProgress,
  type AchievementId,
  type MemoRecord,
  type Progress,
  type Settings,
} from "@/lib/progress";
import type { MemoLevelId } from "@/lib/memo";

export type Snapshot = {
  progress: Progress;
  /** false hasta que se leyó localStorage; evita mostrar 0/9 por un frame. */
  loaded: boolean;
};

/**
 * Identidad estable: `useSyncExternalStore` compara por referencia, así que
 * devolver un objeto nuevo en cada lectura provocaría un bucle infinito.
 */
const INITIAL: Snapshot = { progress: DEFAULT_PROGRESS, loaded: false };

let snapshot: Snapshot = INITIAL;
let hydrated = false;
const listeners = new Set<() => void>();

/** Refleja la preferencia de animaciones en el DOM, que también es externo. */
function applyMotionSetting(progress: Progress): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (progress.settings.reducedMotion) {
    root.dataset.motion = "reduced";
  } else {
    delete root.dataset.motion;
  }
}

function setSnapshot(progress: Progress, persist: boolean): void {
  snapshot = { progress, loaded: true };
  if (persist) saveProgress(progress);
  applyMotionSetting(progress);
  for (const listener of listeners) listener();
}

function handleStorage(event: StorageEvent): void {
  // Otra pestaña tocó el progreso: recargamos sin volver a escribir.
  if (event.key !== STORAGE_KEY) return;
  setSnapshot(loadProgress(), false);
}

export function subscribe(listener: () => void): () => void {
  // La primera suscripción ocurre después del montaje, así que acá ya hay
  // window. React vuelve a leer el snapshot al suscribirse y re-renderiza.
  if (!hydrated) {
    hydrated = true;
    const stored = loadProgress();
    snapshot = { progress: stored, loaded: true };
    applyMotionSetting(stored);
  }

  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getSnapshot(): Snapshot {
  return snapshot;
}

/** En el servidor no hay localStorage: siempre los valores por defecto. */
export function getServerSnapshot(): Snapshot {
  return INITIAL;
}

function update(recipe: (prev: Progress) => Progress): void {
  const next = recipe(snapshot.progress);
  if (next === snapshot.progress) return;
  setSnapshot(next, true);
}

export function unlock(...ids: AchievementId[]): void {
  update((prev) => {
    const fresh = ids.filter((id) => !prev.unlocked.includes(id));
    if (fresh.length === 0) return prev;
    return { ...prev, unlocked: [...prev.unlocked, ...fresh] };
  });
}

export function addStars(amount: number): void {
  if (amount <= 0) return;
  update((prev) => {
    const stars = prev.stars + amount;
    const unlocked =
      stars >= STARS_GOAL && !prev.unlocked.includes("flappy-stars")
        ? [...prev.unlocked, "flappy-stars" as AchievementId]
        : prev.unlocked;
    return { ...prev, stars, unlocked };
  });
}

export function markWorldDone(worldId: number, totalWorlds: number): void {
  update((prev) => {
    const worldsDone = [...new Set([...prev.worldsDone, worldId])];
    const unlocked = new Set(prev.unlocked);
    unlocked.add("words-first");
    if (worldsDone.length >= totalWorlds) unlocked.add("words-all");
    return { ...prev, worldsDone, unlocked: [...unlocked] };
  });
}

/** Guarda la marca del memotest si mejora la anterior, y los logros que toque. */
export function recordMemoResult(
  levelId: MemoLevelId,
  result: MemoRecord,
  perfect: boolean,
): void {
  update((prev) => {
    const unlocked = new Set(prev.unlocked);
    unlocked.add("memo-first");
    if (levelId === "experto") unlocked.add("memo-expert");
    if (perfect) unlocked.add("memo-perfect");

    const memoBest = isBetterRecord(result, prev.memoBest[levelId])
      ? { ...prev.memoBest, [levelId]: result }
      : prev.memoBest;

    return { ...prev, memoBest, unlocked: [...unlocked] };
  });
}

/** Guarda las estrellas de un nivel del mapa, sin bajar una marca anterior. */
export function recordLevelStars(levelId: string, stars: number): void {
  update((prev) => {
    const current = prev.levelStars[levelId] ?? 0;
    if (stars <= current) return prev;
    return { ...prev, levelStars: { ...prev.levelStars, [levelId]: stars } };
  });
}

export function setSettings(patch: Partial<Settings>): void {
  update((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
}

export function resetProgress(): void {
  clearProgress();
  setSnapshot(DEFAULT_PROGRESS, false);
}
