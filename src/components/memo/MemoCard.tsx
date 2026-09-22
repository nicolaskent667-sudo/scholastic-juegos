"use client";

import { cardArt } from "@/components/memo/art";
import DogSprite from "@/components/sprites/DogSprite";
import type { MemoCardDef } from "@/lib/memo";

/** Chispita decorativa de la esquina de la carta. */
function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <path
      d="M 0 -9 Q 2 -2 9 0 Q 2 2 0 9 Q -2 2 -9 0 Q -2 -2 0 -9 Z"
      fill="var(--color-sol)"
      stroke="var(--color-tinta)"
      strokeWidth={1.6}
      strokeLinejoin="round"
      transform={`translate(${x} ${y})`}
    />
  );
}

/** El reverso rojo con Sieni, igual para todas las cartas. */
function CardBack() {
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full" aria-hidden>
      <rect x={0} y={0} width={200} height={260} rx={22} fill="var(--color-berry)" />
      <rect
        x={12}
        y={12}
        width={176}
        height={236}
        rx={16}
        fill="none"
        stroke="#ffffff"
        strokeWidth={4}
        strokeDasharray="12 9"
      />
      <circle
        cx={100}
        cy={130}
        r={58}
        fill="var(--color-crema)"
        stroke="var(--color-tinta)"
        strokeWidth={4}
      />
      <g transform="translate(100 134) scale(0.62)">
        <DogSprite />
      </g>
      <g fill="#f8c2d8">
        {[
          [34, 40],
          [166, 40],
          [34, 222],
          [166, 222],
        ].map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d="M 0 10 L -9 1 A 5.4 5.4 0 0 1 0 -6 A 5.4 5.4 0 0 1 9 1 Z"
            transform={`translate(${x} ${y})`}
          />
        ))}
      </g>
    </svg>
  );
}

type Props = {
  card: MemoCardDef;
  showLabel: boolean;
  /** Boca arriba: por estar elegida o por ya estar resuelta. */
  faceUp: boolean;
  matched: boolean;
  /** Se acaba de fallar: parpadea en rojo. */
  wrong: boolean;
  disabled: boolean;
  onFlip: () => void;
};

export default function MemoCard({
  card,
  showLabel,
  faceUp,
  matched,
  wrong,
  disabled,
  onFlip,
}: Props) {
  return (
    <button
      type="button"
      onClick={onFlip}
      disabled={disabled || faceUp}
      aria-label={
        faceUp ? card.label || card.id : "Carta dada vuelta, tocá para descubrirla"
      }
      aria-pressed={faceUp}
      className={[
        "group relative block w-full cursor-pointer rounded-2xl outline-none",
        "transition-transform duration-200 focus-visible:ring-4 focus-visible:ring-cielo-azul",
        matched ? "scale-[0.96] opacity-70" : "",
        wrong ? "animate-shake" : "",
        disabled || faceUp ? "cursor-default" : "hover:-translate-y-1",
      ].join(" ")}
      style={{ aspectRatio: "200 / 260", perspective: "900px" }}
    >
      <span
        className="relative block h-full w-full transition-transform duration-300"
        style={{
          transformStyle: "preserve-3d",
          transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Reverso */}
        <span
          className="absolute inset-0 overflow-hidden rounded-2xl border-[3px] border-tinta"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardBack />
        </span>

        {/* Frente */}
        <span
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl border-[3px] bg-white p-1.5 ${
            matched ? "border-menta-dark" : "border-tinta"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span
            className="relative block flex-1 overflow-hidden rounded-xl border-2"
            style={{ background: card.bg, borderColor: "rgba(90,42,51,0.18)" }}
          >
            <svg viewBox="-100 -100 200 200" className="h-full w-full">
              <g transform="translate(-78 -78) scale(0.9)">
                <Sparkle x={0} y={0} />
              </g>
              {card.dot && (
                <circle cx={78} cy={-78} r={7} fill={card.dot} />
              )}
              <g transform="scale(0.82)">{cardArt(card.id)}</g>
            </svg>
          </span>

          {showLabel && (
            <span className="block truncate px-1 pt-1 text-center text-[clamp(0.55rem,1.6vw,0.85rem)] font-extrabold tracking-wide text-tinta">
              {card.label}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
