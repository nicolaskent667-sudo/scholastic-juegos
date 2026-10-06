"use client";

import { useState } from "react";
import OptionsPanel from "@/components/start/OptionsPanel";

type Props = {
  /** Avisa al juego que se abrió, por si tiene que pausarse. */
  onOpenChange?: (open: boolean) => void;
  /** Un punto más chico, para que entre junto al botón de pausa del vuelo. */
  compact?: boolean;
  className?: string;
};

/**
 * Abre el mismo panel de Opciones de la portada, pero desde adentro de un
 * minijuego. Se trae su propio estado de abierto/cerrado para que cada
 * pantalla solo tenga que soltarlo en su encabezado.
 */
export default function OptionsButton({
  onOpenChange,
  compact = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  // El tamaño sale de acá y no de `className`: pasar h-10 por fuera chocaba
  // con el h-11 de la base, y en Tailwind gana la del stylesheet, no la última
  // escrita en el atributo.
  const size = compact ? "h-10 w-10 text-2xl" : "h-11 w-11 text-[1.6rem]";

  return (
    <>
      <button
        type="button"
        onClick={() => change(true)}
        aria-label="Opciones"
        title="Opciones"
        className={`flex ${size} shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul ${className}`}
      >
        {/* `leading-none` saca el espacio que el glifo arrastra debajo y lo
            deja realmente centrado dentro del círculo. */}
        <span aria-hidden className="block leading-none">
          ⚙
        </span>
      </button>

      {open && <OptionsPanel onClose={() => change(false)} />}
    </>
  );
}
