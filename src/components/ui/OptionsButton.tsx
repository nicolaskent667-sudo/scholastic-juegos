"use client";

import { useState } from "react";
import OptionsPanel from "@/components/start/OptionsPanel";

type Props = {
  /** Avisa al juego que se abrió, por si tiene que pausarse. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * Abre el mismo panel de Opciones de la portada, pero desde adentro de un
 * minijuego. Se trae su propio estado para que cada pantalla solo tenga que
 * soltarlo en su encabezado.
 */
export default function OptionsButton({ onOpenChange, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => change(true)}
        aria-label="Opciones"
        title="Opciones"
        className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-lg outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul ${className}`}
      >
        <span aria-hidden>⚙</span>
      </button>

      {open && <OptionsPanel onClose={() => change(false)} />}
    </>
  );
}
