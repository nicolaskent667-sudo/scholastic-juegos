/**
 * La tienda: cosas para vestir a Sieni y amigos que la acompañan, pagadas
 * con las estrellas de la campaña. Sin React: solo datos y funciones puras.
 *
 * El saldo no se guarda: es lo ganado en los niveles menos lo que cuesta lo
 * comprado. Como las estrellas de un nivel solo suben, nunca da negativo, y
 * no hay un contador aparte que se pueda desincronizar.
 */

import { WORLDS } from "@/lib/campaign";

export type ShopTab = "accesorios" | "vestuarios" | "amigos";

/**
 * Dónde se lleva cada cosa. Los tres accesorios van en lugares distintos
 * (cabeza, ojos, hocico), así que se pueden combinar entre sí.
 */
export type Slot = "cabeza" | "ojos" | "boca" | "ropa" | "amigo";

export type ShopItemId =
  | "sombrero"
  | "anteojos"
  | "barbijo"
  | "vestido"
  | "noel"
  | "malla"
  | "husky"
  | "nene"
  | "gallina";

export type ShopItem = {
  id: ShopItemId;
  name: string;
  tab: ShopTab;
  slot: Slot;
  price: number;
  description: string;
  /** Mundo que hay que terminar antes de poder comprarlo. */
  requiresWorld?: number;
  /** Trae su propio gorro: mientras esté puesto, se esconde el sombrero. */
  coversHead?: boolean;
};

/**
 * Suman 150: con las 153 estrellas de la campaña completa alcanza para todo.
 */
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "sombrero",
    name: "Sombrero de paja",
    tab: "accesorios",
    slot: "cabeza",
    price: 20,
    description: "Para los días de sol en el picnic. Se puede combinar con los anteojos.",
  },
  {
    id: "anteojos",
    name: "Anteojos de sol",
    tab: "accesorios",
    slot: "ojos",
    price: 15,
    description: "Para mirar el sol sin achinar los ojos.",
  },
  {
    id: "barbijo",
    name: "Barbijo",
    tab: "accesorios",
    slot: "boca",
    price: 10,
    description: "Para cuidarse cuando anda resfriada.",
  },
  {
    id: "vestido",
    name: "Vestido blanco",
    tab: "vestuarios",
    slot: "ropa",
    price: 20,
    description: "Con cuello rosa y volados, para ir de fiesta.",
  },
  {
    id: "malla",
    name: "Malla",
    tab: "vestuarios",
    slot: "ropa",
    price: 25,
    description: "Antiparras, malla con estrella y patas de rana.",
  },
  {
    id: "noel",
    name: "Traje Papá Noel",
    tab: "vestuarios",
    slot: "ropa",
    price: 30,
    description: "Gorro, cuello de piel, cinturón y botas para diciembre.",
    coversHead: true,
  },
  {
    id: "gallina",
    name: "Gallina",
    tab: "amigos",
    slot: "amigo",
    price: 10,
    description: "Viene con su huevo, por las dudas.",
    requiresWorld: 1,
  },
  {
    id: "husky",
    name: "Husky",
    tab: "amigos",
    slot: "amigo",
    price: 10,
    description: "Un amigo naranja que la sigue a todos lados.",
    requiresWorld: 3,
  },
  {
    id: "nene",
    name: "Nene",
    tab: "amigos",
    slot: "amigo",
    price: 10,
    description: "Su compañero de aventuras en el picnic.",
    requiresWorld: 5,
  },
];

export const SHOP_TABS: { id: ShopTab; label: string }[] = [
  { id: "accesorios", label: "Accesorios" },
  { id: "vestuarios", label: "Vestuarios" },
  { id: "amigos", label: "Amigos" },
];

export const SLOTS: Slot[] = ["cabeza", "ojos", "boca", "ropa", "amigo"];

/** Lo que tiene puesto: a lo sumo una cosa por lugar. */
export type Equipped = Partial<Record<Slot, ShopItemId>>;

const BY_ID = new Map(SHOP_ITEMS.map((item) => [item.id, item]));

export function findItem(id: string): ShopItem | undefined {
  return BY_ID.get(id as ShopItemId);
}

export function isItemId(id: unknown): id is ShopItemId {
  return typeof id === "string" && BY_ID.has(id as ShopItemId);
}

type Stars = Readonly<Record<string, number>>;

export function earnedStars(levelStars: Stars): number {
  return Object.values(levelStars).reduce((sum, n) => sum + n, 0);
}

export function spentStars(owned: readonly ShopItemId[]): number {
  return owned.reduce((sum, id) => sum + (BY_ID.get(id)?.price ?? 0), 0);
}

export function balance(levelStars: Stars, owned: readonly ShopItemId[]): number {
  return Math.max(0, earnedStars(levelStars) - spentStars(owned));
}

/** Un mundo está terminado cuando todos sus niveles tienen al menos una estrella. */
export function isWorldDone(worldId: number, levelStars: Stars): boolean {
  const world = WORLDS.find((w) => w.id === worldId);
  return world ? world.levels.every((l) => (levelStars[l.id] ?? 0) > 0) : false;
}

/** El mundo que falta terminar para desbloquearlo, o null si ya se puede. */
export function lockedBy(item: ShopItem, levelStars: Stars): number | null {
  if (item.requiresWorld === undefined) return null;
  return isWorldDone(item.requiresWorld, levelStars) ? null : item.requiresWorld;
}

export type BuyCheck =
  | { ok: true }
  | { ok: false; reason: "owned" }
  | { ok: false; reason: "locked"; world: number }
  | { ok: false; reason: "stars"; missing: number };

export function canBuy(
  item: ShopItem,
  levelStars: Stars,
  owned: readonly ShopItemId[],
): BuyCheck {
  if (owned.includes(item.id)) return { ok: false, reason: "owned" };
  const world = lockedBy(item, levelStars);
  if (world !== null) return { ok: false, reason: "locked", world };
  const left = balance(levelStars, owned);
  if (left < item.price) return { ok: false, reason: "stars", missing: item.price - left };
  return { ok: true };
}

/**
 * Lo que efectivamente se dibuja: un traje con gorro propio tapa el
 * sombrero, pero no lo saca de lo puesto. Vuelve al cambiar de traje.
 */
export function visibleLook(equipped: Equipped): Equipped {
  const ropa = equipped.ropa ? BY_ID.get(equipped.ropa) : undefined;
  if (ropa?.coversHead && equipped.cabeza) {
    const rest = { ...equipped };
    delete rest.cabeza;
    return rest;
  }
  return equipped;
}

/** Valida lo guardado: solo cosas compradas, cada una en su lugar. */
export function sanitizeEquipped(raw: unknown, owned: readonly ShopItemId[]): Equipped {
  if (typeof raw !== "object" || raw === null) return {};
  const out: Equipped = {};
  for (const slot of SLOTS) {
    const id = (raw as Record<string, unknown>)[slot];
    if (!isItemId(id) || !owned.includes(id)) continue;
    if (BY_ID.get(id)?.slot === slot) out[slot] = id;
  }
  return out;
}
