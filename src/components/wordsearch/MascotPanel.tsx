"use client";

import BirdSprite from "@/components/flappy/BirdSprite";
import ChickSprite from "@/components/wordsearch/ChickSprite";
import DogSprite from "@/components/wordsearch/DogSprite";

type Props = {
  message: string;
};

/**
 * Perrita, pajarito y pollito animando desde abajo. El pajarito es exactamente
 * el mismo `BirdSprite` que vuela en el nivel 2.
 */
export default function MascotPanel({ message }: Props) {
  return (
    <div className="rounded-3xl border-[3px] border-tinta bg-blush/60 p-3">
      <p
        aria-live="polite"
        className="mx-auto w-full rounded-2xl border-[3px] border-tinta bg-white px-4 py-2 text-center text-lg font-extrabold text-berry"
      >
        {message}
      </p>

      <svg
        viewBox="-130 -80 460 180"
        className="mt-2 h-24 w-full sm:h-28"
        aria-hidden
      >
        <g transform="translate(-50 10)">
          <DogSprite />
        </g>
        <g transform="translate(120 34) scale(0.72)">
          <ChickSprite />
        </g>
        <g transform="translate(250 -10) scale(0.95)">
          <BirdSprite nodeRef={null} />
        </g>
      </svg>
    </div>
  );
}
