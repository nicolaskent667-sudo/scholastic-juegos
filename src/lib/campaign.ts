/**
 * La campaña: cuatro mundos, uno por minijuego, con sus niveles y las reglas
 * de estrellas. Sin React: solo datos y funciones puras.
 */

import type { MemoLevelId } from "@/lib/memo";

export type GameKind = "puzzle" | "flappy" | "wordsearch" | "memo" | "flow";

/** Cómo se configura el minijuego cuando se entra desde el mapa. */
export type LevelConfig =
  | { kind: "puzzle"; rows: number; cols: number }
  | { kind: "flappy"; lamps: number; speed: number }
  | { kind: "wordsearch"; worldId: number }
  | { kind: "memo"; levelId: MemoLevelId; pairs: number }
  | { kind: "flow"; levelId: number };

export type CampaignLevel = {
  /** Único en toda la campaña: "2-4". */
  id: string;
  worldId: number;
  /** Posición dentro del mundo, empezando en 1. */
  index: number;
  label: string;
  config: LevelConfig;
};

export type CampaignWorld = {
  id: number;
  name: string;
  hint: string;
  emoji: string;
  kind: GameKind;
  levels: CampaignLevel[];
};

export const STARS_PER_LEVEL = 3;

function makeLevels(
  worldId: number,
  entries: { label: string; config: LevelConfig }[],
): CampaignLevel[] {
  return entries.map((entry, i) => ({
    id: `${worldId}-${i + 1}`,
    worldId,
    index: i + 1,
    label: entry.label,
    config: entry.config,
  }));
}

export const WORLDS: CampaignWorld[] = [
  {
    id: 1,
    name: "Rompecabezas",
    hint: "Armá el picnic pieza por pieza",
    emoji: "🧩",
    kind: "puzzle",
    levels: makeLevels(1, [
      { label: "3 × 3", config: { kind: "puzzle", rows: 3, cols: 3 } },
      { label: "3 × 4", config: { kind: "puzzle", rows: 3, cols: 4 } },
      { label: "4 × 4", config: { kind: "puzzle", rows: 4, cols: 4 } },
      { label: "4 × 5", config: { kind: "puzzle", rows: 4, cols: 5 } },
      { label: "5 × 5", config: { kind: "puzzle", rows: 5, cols: 5 } },
      { label: "5 × 6", config: { kind: "puzzle", rows: 5, cols: 6 } },
    ]),
  },
  {
    id: 2,
    name: "Vuelo",
    hint: "Cruzá la luz de los faroles",
    emoji: "🐦",
    kind: "flappy",
    levels: makeLevels(2, [
      { label: "8 faroles", config: { kind: "flappy", lamps: 8, speed: 180 } },
      { label: "10 faroles", config: { kind: "flappy", lamps: 10, speed: 195 } },
      { label: "12 faroles", config: { kind: "flappy", lamps: 12, speed: 210 } },
      { label: "15 faroles", config: { kind: "flappy", lamps: 15, speed: 225 } },
      { label: "18 faroles", config: { kind: "flappy", lamps: 18, speed: 240 } },
      { label: "22 faroles", config: { kind: "flappy", lamps: 22, speed: 255 } },
    ]),
  },
  {
    id: 3,
    name: "Sopa de letras",
    hint: "Encontrá las palabras escondidas",
    emoji: "🔤",
    kind: "wordsearch",
    levels: makeLevels(3, [
      { label: "Cortitas", config: { kind: "wordsearch", worldId: 1 } },
      { label: "Primeras palabras", config: { kind: "wordsearch", worldId: 2 } },
      { label: "De a cuatro", config: { kind: "wordsearch", worldId: 3 } },
      { label: "De a cinco", config: { kind: "wordsearch", worldId: 4 } },
      { label: "Cinco y seis", config: { kind: "wordsearch", worldId: 5 } },
      { label: "De a seis", config: { kind: "wordsearch", worldId: 6 } },
      { label: "Seis y siete", config: { kind: "wordsearch", worldId: 7 } },
      { label: "De a siete", config: { kind: "wordsearch", worldId: 8 } },
      { label: "Las más largas", config: { kind: "wordsearch", worldId: 9 } },
    ]),
  },
  {
    id: 4,
    name: "Memotest",
    hint: "Encontrá las parejas",
    emoji: "🃏",
    kind: "memo",
    levels: makeLevels(4, [
      { label: "4 parejas", config: { kind: "memo", levelId: "facil", pairs: 4 } },
      { label: "6 parejas", config: { kind: "memo", levelId: "facil", pairs: 6 } },
      { label: "6 parejas", config: { kind: "memo", levelId: "dificil", pairs: 6 } },
      { label: "8 parejas", config: { kind: "memo", levelId: "dificil", pairs: 8 } },
      { label: "8 parejas", config: { kind: "memo", levelId: "experto", pairs: 8 } },
      { label: "10 parejas", config: { kind: "memo", levelId: "experto", pairs: 10 } },
    ]),
  },
  {
    id: 5,
    name: "Unir colores",
    hint: "Conectá los tubos y llená el tablero",
    emoji: "🎨",
    kind: "flow",
    levels: makeLevels(5, [
      { label: "5 × 5 · 4 tubos", config: { kind: "flow", levelId: 1 } },
      { label: "5 × 5 · 5 tubos", config: { kind: "flow", levelId: 2 } },
      { label: "6 × 6 · 5 tubos", config: { kind: "flow", levelId: 3 } },
      { label: "6 × 6 · 6 tubos", config: { kind: "flow", levelId: 4 } },
      { label: "6 × 6 · 6 tubos", config: { kind: "flow", levelId: 5 } },
      { label: "7 × 7 · 6 tubos", config: { kind: "flow", levelId: 6 } },
      { label: "7 × 7 · 7 tubos", config: { kind: "flow", levelId: 7 } },
      { label: "7 × 7 · 7 tubos", config: { kind: "flow", levelId: 8 } },
    ]),
  },
];

export const ALL_LEVELS: CampaignLevel[] = WORLDS.flatMap((w) => w.levels);

export function findWorld(worldId: number): CampaignWorld | undefined {
  return WORLDS.find((w) => w.id === worldId);
}

export function findLevel(levelId: string): CampaignLevel | undefined {
  return ALL_LEVELS.find((l) => l.id === levelId);
}

export function worldStarTotal(world: CampaignWorld): number {
  return world.levels.length * STARS_PER_LEVEL;
}

/** Lo que devuelve cada minijuego al terminar, para calcular las estrellas. */
export type LevelResult =
  | { kind: "puzzle"; moves: number; pieces: number }
  | { kind: "flappy"; hearts: number }
  | { kind: "wordsearch"; hints: number }
  | { kind: "memo"; tries: number; pairs: number }
  | { kind: "flow"; moves: number; pipes: number };

/**
 * Una estrella por terminar; las otras dos por hacerlo bien.
 * Cada juego mide lo suyo, pero el criterio es el mismo: sin errores son tres.
 */
export function starsFor(result: LevelResult): 1 | 2 | 3 {
  switch (result.kind) {
    case "puzzle": {
      // Cada movimiento de más es una pieza puesta en el lugar equivocado.
      const errors = Math.max(0, result.moves - result.pieces);
      if (errors === 0) return 3;
      return errors <= Math.ceil(result.pieces / 2) ? 2 : 1;
    }
    case "flappy":
      if (result.hearts >= 3) return 3;
      return result.hearts === 2 ? 2 : 1;
    case "wordsearch":
      if (result.hints === 0) return 3;
      return result.hints === 1 ? 2 : 1;
    case "memo": {
      const errors = Math.max(0, result.tries - result.pairs);
      if (errors === 0) return 3;
      return errors <= 2 ? 2 : 1;
    }
    case "flow": {
      // Lo ideal es un trazo por tubo; cada rehecho cuenta como movida extra.
      const extra = Math.max(0, result.moves - result.pipes);
      if (extra === 0) return 3;
      return extra <= result.pipes ? 2 : 1;
    }
  }
}

/** El primer nivel sin terminar de un mundo, o null si está completo. */
export function nextLevelOf(
  world: CampaignWorld,
  stars: Readonly<Record<string, number>>,
): CampaignLevel | null {
  return world.levels.find((level) => (stars[level.id] ?? 0) === 0) ?? null;
}

/**
 * Se desbloquea el primero de cada mundo y el que sigue al último terminado:
 * nunca se traba el avance por no haber sacado las tres estrellas.
 */
export function isUnlocked(
  level: CampaignLevel,
  stars: Readonly<Record<string, number>>,
): boolean {
  if (level.index === 1) return true;
  const world = findWorld(level.worldId);
  const previous = world?.levels[level.index - 2];
  return previous ? (stars[previous.id] ?? 0) > 0 : false;
}
