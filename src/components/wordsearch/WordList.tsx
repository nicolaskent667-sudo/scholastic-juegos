"use client";

type Props = {
  words: string[];
  found: string[];
  onHint: () => void;
  hintsLeft: number;
};

export default function WordList({ words, found, onHint, hintsLeft }: Props) {
  const remaining = words.length - found.length;
  const progress = words.length === 0 ? 0 : found.length / words.length;

  return (
    <div className="rounded-3xl border-[3px] border-tinta bg-white p-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-extrabold tracking-wide text-berry">
          PALABRAS
        </h2>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-blush">
          <div
            className="h-full rounded-full bg-sol transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-1">
        {words.map((word) => {
          const done = found.includes(word);
          return (
            <li key={word} className="flex items-center gap-2 py-0.5">
              <span
                aria-hidden
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[3px] border-tinta text-xs font-black text-white ${
                  done ? "bg-berry" : "bg-crema"
                }`}
              >
                {done ? "✓" : ""}
              </span>
              <span
                className={`text-base font-extrabold tracking-wide sm:text-lg ${
                  done ? "text-tinta/40 line-through" : "text-tinta"
                }`}
              >
                {word}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-sm font-bold text-tinta/60">
          {remaining === 0
            ? "¡Las encontraste todas!"
            : `Quedan ${remaining} ${remaining === 1 ? "palabra" : "palabras"}`}
        </p>
        <button
          type="button"
          onClick={onHint}
          disabled={hintsLeft === 0 || remaining === 0}
          className="cursor-pointer rounded-full border-[3px] border-tinta bg-cielo-azul px-5 py-2 font-extrabold tracking-wide text-white shadow-[0_4px_0_rgba(90,42,51,0.3)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-berry active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          PISTA {hintsLeft > 0 && `(${hintsLeft})`}
        </button>
      </div>
    </div>
  );
}
