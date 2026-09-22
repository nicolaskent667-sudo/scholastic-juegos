/**
 * Definición de las cartas del memotest y armado del mazo.
 * Sin React ni JSX: los dibujos se resuelven en `components/memo/art.tsx`.
 */

export type MemoLevelId = "facil" | "dificil" | "experto";

export type MemoCardDef = {
  /** Identifica el dibujo y también la pareja. */
  id: string;
  /** Nombre impreso en la carta; vacío en el nivel experto. */
  label: string;
  /** Fondo del recuadro del dibujo. */
  bg: string;
  /** Puntito de la esquina; solo lo usa el nivel fácil. */
  dot?: string;
};

export type MemoLevel = {
  id: MemoLevelId;
  name: string;
  hint: string;
  emoji: string;
  /** Cuántas parejas se sortean para una partida. */
  pairs: number;
  /** Columnas de la grilla en pantalla ancha. */
  columns: number;
  showLabels: boolean;
  cards: MemoCardDef[];
};

/** Crema uniforme: en los niveles 2 y 3 el fondo no ayuda a distinguir. */
const PLAIN = "#fdeedd";

const FACIL: MemoCardDef[] = [
  { id: "sieni", label: "SIENI", bg: "#fbdce4", dot: "var(--color-berry)" },
  { id: "gato", label: "GATO", bg: "#fdf0dc", dot: "var(--color-tinta)" },
  { id: "azulejo", label: "AZULEJO", bg: "#d9e7fa", dot: "var(--color-cielo-azul)" },
  { id: "pato", label: "PATO", bg: "#fdeccb", dot: "var(--color-sol)" },
  { id: "pinguino", label: "PINGÜINO", bg: "#d9e5f5", dot: "#4a6fa5" },
  { id: "lagartija", label: "LAGARTIJA", bg: "#d6f0dc", dot: "var(--color-menta-dark)" },
  { id: "conejito", label: "CONEJITO", bg: "#fbdce4", dot: "var(--color-blush)" },
  { id: "pollito", label: "POLLITO", bg: "#fdeccb", dot: "var(--color-sol)" },
  { id: "ovejita", label: "OVEJITA", bg: "#fdf0dc", dot: "#b08968" },
  { id: "ovillo", label: "OVILLO", bg: "#fbdce4", dot: "var(--color-berry)" },
  { id: "farol", label: "FAROL", bg: "#fdf0dc", dot: "#b08968" },
];

const DIFICIL: MemoCardDef[] = [
  { id: "libro", label: "LIBRO", bg: PLAIN },
  { id: "lapiz", label: "LÁPIZ", bg: PLAIN },
  { id: "mochila", label: "MOCHILA", bg: PLAIN },
  { id: "regla", label: "REGLA", bg: PLAIN },
  { id: "manzana", label: "MANZANA", bg: PLAIN },
  { id: "frutilla", label: "FRUTILLA", bg: PLAIN },
  { id: "canasta", label: "CANASTA", bg: PLAIN },
  { id: "flor", label: "FLOR", bg: PLAIN },
  { id: "sol", label: "SOL", bg: PLAIN },
  { id: "nube", label: "NUBE", bg: PLAIN },
  { id: "estrella", label: "ESTRELLA", bg: PLAIN },
  { id: "corazon", label: "CORAZÓN", bg: PLAIN },
  { id: "mariposa", label: "MARIPOSA", bg: PLAIN },
  { id: "huella", label: "HUELLA", bg: PLAIN },
  { id: "sieni-graduada", label: "SIENI GRADUADA", bg: PLAIN },
  { id: "azulejo-volador", label: "AZULEJO VOLADOR", bg: PLAIN },
];

/**
 * Nivel experto: variantes mínimas del mismo personaje. Los `label` quedan como
 * referencia interna (van al aria-label) pero no se imprimen en la carta.
 */
const EXPERTO: MemoCardDef[] = [
  { id: "sieni-mono-rosa", label: "Moño rosa", bg: PLAIN },
  { id: "sieni-mono-azul", label: "Moño azul", bg: PLAIN },
  { id: "sieni-mono-amarillo", label: "Moño amarillo", bg: PLAIN },
  { id: "sieni-sin-mono", label: "Sin moño", bg: PLAIN },
  { id: "sieni-guino", label: "Guiño", bg: PLAIN },
  { id: "sieni-lentes", label: "Con lentes", bg: PLAIN },
  { id: "sieni-birrete", label: "Con birrete", bg: PLAIN },
  { id: "sieni-collar", label: "Collar estrella", bg: PLAIN },
  { id: "azulejo-izquierda", label: "Mira a la izquierda", bg: PLAIN },
  { id: "azulejo-derecha", label: "Mira a la derecha", bg: PLAIN },
  { id: "azulejo-volando", label: "Volando", bg: PLAIN },
  { id: "azulejo-flor", label: "Con flor", bg: PLAIN },
  { id: "pollito-simple", label: "Pollito", bg: PLAIN },
  { id: "pollito-mono", label: "Con moño", bg: PLAIN },
  { id: "pollito-lentes", label: "Con lentes", bg: PLAIN },
  { id: "pollito-guino", label: "Guiño", bg: PLAIN },
];

export const MEMO_LEVELS: MemoLevel[] = [
  {
    id: "facil",
    name: "Fácil",
    hint: "Cada carta tiene su color y su nombre",
    emoji: "🐶",
    pairs: 6,
    columns: 4,
    showLabels: true,
    cards: FACIL,
  },
  {
    id: "dificil",
    name: "Difícil",
    hint: "Todas con el mismo fondo: hay que mirar el dibujo",
    emoji: "🎒",
    pairs: 8,
    columns: 4,
    showLabels: true,
    cards: DIFICIL,
  },
  {
    id: "experto",
    name: "Experto",
    hint: "Sin nombres y con diferencias mínimas",
    emoji: "🎓",
    pairs: 10,
    columns: 5,
    showLabels: false,
    cards: EXPERTO,
  },
];

export type MemoTile = {
  /** Único por carta en la mesa. */
  key: string;
  card: MemoCardDef;
};

function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Sortea las parejas del nivel y las reparte mezcladas.
 * Usa Math.random: solo desde un handler o efecto del cliente.
 */
export function buildDeck(level: MemoLevel): MemoTile[] {
  const chosen = shuffle(level.cards).slice(0, level.pairs);
  const tiles = chosen.flatMap((card) => [
    { key: `${card.id}-a`, card },
    { key: `${card.id}-b`, card },
  ]);
  return shuffle(tiles);
}

/** Cuántas cartas quedan por descubrir. */
export function pairsLeft(level: MemoLevel, matched: number): number {
  return level.pairs - matched;
}
