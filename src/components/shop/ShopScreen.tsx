"use client";

import { useState } from "react";
import ItemArt from "@/components/shop/ItemArt";
import SieniSprite, { FRIEND_X } from "@/components/sprites/SieniSprite";
import { useProgress } from "@/hooks/useProgress";
import { playEffect } from "@/lib/audio";
import {
  SHOP_ITEMS,
  SHOP_TABS,
  balance,
  canBuy,
  lockedBy,
  type ShopItem,
  type ShopTab,
} from "@/lib/shop";

/** Fondo de cada tarjeta, alternado como en el diseño. */
const CARD_TONES = ["bg-[#dde8f7]", "bg-menta/60", "bg-blush/45", "bg-[#f8ead6]"];

type Props = {
  onBack: () => void;
};

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden>
      <path
        d="M 0 -10 L 2.9 -3.9 L 9.5 -3.1 L 4.6 1.5 L 5.9 8.1 L 0 4.8 L -5.9 8.1 L -4.6 1.5 L -9.5 -3.1 L -2.9 -3.9 Z"
        fill="var(--color-sol)"
        stroke="var(--color-tinta)"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ShopScreen({ onBack }: Props) {
  const { progress, buyItem, toggleItem } = useProgress();
  const { levelStars, owned, equipped } = progress;

  const [tab, setTab] = useState<ShopTab>("accesorios");
  const [selectedId, setSelectedId] = useState(SHOP_ITEMS[0].id);
  /** Cambia en cada compra: reinicia el saltito del probador. */
  const [celebrate, setCelebrate] = useState(0);

  const items = SHOP_ITEMS.filter((item) => item.tab === tab);
  const selected =
    items.find((item) => item.id === selectedId) ?? items[0];
  const stars = balance(levelStars, owned);

  const isOwned = (item: ShopItem) => owned.includes(item.id);
  const isWorn = (item: ShopItem) => equipped[item.slot] === item.id;

  // El probador muestra lo que tiene puesto más lo elegido, sin comprarlo.
  const tryOn = { ...equipped, [selected.slot]: selected.id };
  const showFriend = selected.tab === "amigos";

  const pickTab = (next: ShopTab) => {
    setTab(next);
    setSelectedId(SHOP_ITEMS.find((item) => item.tab === next)!.id);
  };

  const check = canBuy(selected, levelStars, owned);

  const act = () => {
    if (isOwned(selected)) {
      toggleItem(selected.id);
      playEffect("pop");
      return;
    }
    if (buyItem(selected.id)) {
      playEffect("union");
      setCelebrate((n) => n + 1);
    }
  };

  let action: { label: string; disabled: boolean; tone: string };
  if (isOwned(selected)) {
    action = isWorn(selected)
      ? { label: "SACAR", disabled: false, tone: "bg-white text-tinta" }
      : { label: "PONER", disabled: false, tone: "bg-berry text-white" };
  } else if (check.ok) {
    action = { label: "COMPRAR", disabled: false, tone: "bg-berry text-white" };
  } else if (check.reason === "locked") {
    action = { label: `Terminá el mundo ${check.world}`, disabled: true, tone: "bg-white text-tinta/50" };
  } else {
    const missing = check.reason === "stars" ? check.missing : 0;
    action = { label: `Te faltan ${missing}`, disabled: true, tone: "bg-white text-tinta/50" };
  }

  return (
    <div className="mx-auto w-full max-w-xl px-3 py-3 sm:px-5 sm:py-5">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-2xl font-extrabold text-berry outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
        >
          ‹
        </button>
        <h1 className="flex-1 text-3xl font-black tracking-wide text-berry sm:text-4xl">
          TIENDA
        </h1>
        <span
          className="flex items-center gap-2 rounded-full border-[3px] border-tinta bg-[#f8ead6] px-4 py-1 text-2xl font-extrabold tabular-nums text-tinta"
          aria-label={`Tenés ${stars} estrellas`}
        >
          <StarIcon className="h-7 w-7" />
          {stars}
        </span>
      </header>

      <div role="tablist" aria-label="Secciones de la tienda" className="mt-4 grid grid-cols-3 gap-2">
        {SHOP_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => pickTab(id)}
            className={`cursor-pointer rounded-full border-[3px] border-tinta px-2 py-1.5 text-base font-extrabold outline-none transition focus-visible:ring-4 focus-visible:ring-cielo-azul sm:text-lg ${
              tab === id ? "bg-berry text-white" : "bg-white text-tinta/70 hover:bg-blush/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* El probador: Sieni con lo elegido puesto, aunque no esté comprado */}
      <section className="mt-4 flex gap-3 rounded-3xl border-[3px] border-tinta bg-white p-3 sm:gap-4 sm:p-4">
        <div className="flex aspect-square w-2/5 shrink-0 items-center justify-center rounded-2xl border-2 border-blush bg-blush/35">
          <svg
            key={celebrate}
            // Con amigo se achica un poco para que entren los dos.
            viewBox={showFriend ? `-56 -80 ${FRIEND_X * 0.85 + 92} 158` : "-75 -105 150 190"}
            className={`h-full w-full ${celebrate > 0 ? "animate-pop" : ""}`}
            role="img"
            aria-label={`Sieni con ${selected.name.toLowerCase()}`}
          >
            <g transform={showFriend ? "scale(0.85)" : undefined}>
              <SieniSprite look={tryOn} withFriend={showFriend} />
            </g>
          </svg>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold leading-tight text-tinta sm:text-2xl">
              {selected.name}
            </h2>
            <p className="mt-1 text-sm font-bold leading-snug text-tinta/60 sm:text-base">
              {selected.description}
            </p>
          </div>

          {!isOwned(selected) && (
            <span className="flex w-fit items-center gap-2 rounded-full border-[3px] border-tinta bg-[#f8ead6] px-3 py-0.5 text-lg font-extrabold tabular-nums text-tinta">
              <StarIcon className="h-5 w-5" />
              {selected.price}
            </span>
          )}

          <button
            type="button"
            onClick={act}
            disabled={action.disabled}
            className={`w-full cursor-pointer rounded-full border-[3px] border-tinta px-3 py-2.5 text-lg font-extrabold shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 ${action.tone}`}
          >
            {action.label}
          </button>
        </div>
      </section>

      <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
        {items.map((item, i) => {
          const worn = isWorn(item);
          const has = isOwned(item);
          const world = lockedBy(item, levelStars);
          const missing = item.price - stars;
          const chosen = item.id === selected.id;

          return (
            <li key={item.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                aria-pressed={chosen}
                className={`flex h-full w-full cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-[3px] border-tinta bg-white p-1.5 outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul sm:p-2 ${
                  chosen ? "ring-4 ring-sol" : ""
                }`}
              >
                {/* Cuadro fijo: los dibujos altos no lo estiran */}
                <span
                  className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 border-blush ${
                    CARD_TONES[i % CARD_TONES.length]
                  } ${world !== null ? "opacity-60 grayscale" : ""}`}
                >
                  <ItemArt id={item.id} className="absolute inset-[10%] h-[80%] w-[80%]" />
                </span>
                {/* Dos renglones siempre, para que las tarjetas queden parejas */}
                <span className="flex min-h-[2.5em] flex-1 items-center text-center text-sm font-extrabold leading-tight text-tinta sm:text-base">
                  {item.name}
                </span>

                {worn ? (
                  <span className="w-full rounded-full border-2 border-tinta bg-berry py-0.5 text-sm font-extrabold text-white">
                    Puesto
                  </span>
                ) : has ? (
                  <span className="w-full rounded-full border-2 border-tinta bg-menta py-0.5 text-sm font-extrabold text-tinta">
                    ✓ Comprado
                  </span>
                ) : world !== null ? (
                  <span className="w-full rounded-full border-2 border-tinta/40 bg-tinta/5 py-0.5 text-sm font-extrabold text-tinta/50">
                    🔒 Mundo {world}
                  </span>
                ) : (
                  <span
                    className={`flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-tinta bg-[#f8ead6] py-0.5 text-sm font-extrabold tabular-nums ${
                      missing > 0 ? "text-tinta/45" : "text-tinta"
                    }`}
                  >
                    <StarIcon className="h-4 w-4" />
                    {item.price}
                  </span>
                )}
              </button>
              {/* El renglón queda reservado aunque esté vacío: tarjetas parejas */}
              <p
                className={`mt-1 text-center text-xs font-bold text-tinta/50 ${
                  !has && world === null && missing > 0 ? "" : "invisible"
                }`}
              >
                Te faltan {Math.max(0, missing)}
              </p>
            </li>
          );
        })}
      </ul>

      <aside className="mt-5 flex items-center gap-4 rounded-3xl border-[3px] border-tinta bg-[#fff1e3] p-4">
        <span aria-hidden className="flex shrink-0 items-end">
          <StarIcon className="h-8 w-8" />
          <StarIcon className="-mx-1 h-12 w-12" />
          <StarIcon className="h-8 w-8" />
        </span>
        <div>
          <p className="text-lg font-extrabold text-berry">¿Te faltan estrellas?</p>
          <p className="text-sm font-bold text-tinta/60">
            Ganá hasta 3 por cada nivel. Volvé a jugar uno para mejorar sus estrellas.
          </p>
        </div>
      </aside>
    </div>
  );
}
