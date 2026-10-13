"use client";

import { useSyncExternalStore } from "react";

/** Mismo corte que `sm:` de Tailwind. */
const QUERY = "(max-width: 639px)";

function subscribe(listener: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * En el servidor no hay ventana. Se asume pantalla ancha y, si resulta ser un
 * celular, React vuelve a leer el valor al suscribirse y re-renderiza. Eso
 * evita el hydration mismatch que daría adivinar.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * true en pantallas de celular. Se usa solo donde el diseño cambia de verdad
 * y no alcanza con una clase de Tailwind, como la cantidad de columnas del
 * mapa, que determina la geometría del SVG.
 */
export function useIsNarrow(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
