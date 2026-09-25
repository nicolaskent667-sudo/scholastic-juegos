"use client";

import { useEffect } from "react";
import { acquireMusic, releaseMusic } from "@/lib/audio";

/**
 * Enciende la música de fondo mientras la pantalla esté montada.
 * La usan los cuatro minijuegos; el mapa y la portada quedan en silencio.
 *
 * El módulo de audio lleva el conteo, así que pasar de un nivel a otro no
 * corta ni reinicia la música.
 */
export function useGameMusic(): void {
  useEffect(() => {
    acquireMusic();
    return releaseMusic;
  }, []);
}
