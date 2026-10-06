"use client";

import { useEffect } from "react";
import { acquireMusic, releaseMusic } from "@/lib/audio";

/**
 * Mantiene la música de fondo sonando en loop mientras la app esté montada.
 *
 * Va una sola vez en `GameShell`, no en cada pantalla: así suena también en la
 * portada, el selector de mundos y el mapa, y ninguna pantalla nueva se olvida
 * de encenderla. El módulo de audio igual lleva el conteo de quién la pide, por
 * si alguna vez hiciera falta silenciarla en una pantalla puntual.
 */
export function useBackgroundMusic(): void {
  useEffect(() => {
    acquireMusic();
    return releaseMusic;
  }, []);
}
