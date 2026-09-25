"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { primaryButton } from "@/components/ui/buttons";

type Props = {
  onClose: () => void;
};

export default function OptionsPanel({ onClose }: Props) {
  const { progress, setSettings, reset } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Opciones"
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/45 p-4 backdrop-blur-sm"
    >
      <div className="animate-rise w-full max-w-md rounded-3xl border-[3px] border-tinta bg-crema p-6 shadow-[0_12px_0_rgba(90,42,51,0.3)]">
        <h2 className="text-center text-3xl font-extrabold text-tinta">
          Opciones
        </h2>

        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-[3px] border-tinta bg-white px-4 py-3">
          <span>
            <span className="block font-extrabold text-tinta">
              Sonido
            </span>
            <span className="block text-sm font-bold text-tinta/60">
              Música de fondo y efectos de los juegos
            </span>
          </span>
          <input
            type="checkbox"
            checked={progress.settings.sound}
            onChange={(event) => setSettings({ sound: event.target.checked })}
            className="h-7 w-7 shrink-0 cursor-pointer accent-berry"
          />
        </label>

        <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-[3px] border-tinta bg-white px-4 py-3">
          <span>
            <span className="block font-extrabold text-tinta">
              Menos animaciones
            </span>
            <span className="block text-sm font-bold text-tinta/60">
              Apaga el confeti y los movimientos decorativos
            </span>
          </span>
          <input
            type="checkbox"
            checked={progress.settings.reducedMotion}
            onChange={(event) =>
              setSettings({ reducedMotion: event.target.checked })
            }
            className="h-7 w-7 shrink-0 cursor-pointer accent-berry"
          />
        </label>

        <div className="mt-3 rounded-2xl border-[3px] border-tinta bg-white px-4 py-3">
          <p className="font-extrabold text-tinta">Borrar mi progreso</p>
          <p className="text-sm font-bold text-tinta/60">
            Se pierden los logros, las estrellas y los mundos completados. No se
            puede deshacer.
          </p>
          {confirmingReset ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirmingReset(false);
                }}
                className="flex-1 cursor-pointer rounded-2xl border-[3px] border-tinta bg-berry px-3 py-2 font-extrabold text-white outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul"
              >
                Sí, borrar todo
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="flex-1 cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-3 py-2 font-extrabold text-tinta outline-none transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cielo-azul"
              >
                Mejor no
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="mt-3 w-full cursor-pointer rounded-2xl border-[3px] border-tinta bg-crema px-3 py-2 font-extrabold text-tinta outline-none transition hover:-translate-y-0.5 hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
            >
              Borrar progreso
            </button>
          )}
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`${primaryButton} mt-5 w-full`}
        >
          Listo
        </button>
      </div>
    </div>
  );
}
