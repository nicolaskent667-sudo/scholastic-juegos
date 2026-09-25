"use client";

import { useSyncExternalStore } from "react";
import {
  addStars,
  getServerSnapshot,
  getSnapshot,
  markWorldDone,
  recordLevelStars,
  recordMemoResult,
  resetProgress,
  setSettings,
  subscribe,
  unlock,
} from "@/lib/progressStore";

/**
 * Logros y preferencias. Las funciones que mutan son del módulo, no del hook:
 * son estables por definición y se pueden usar en dependencias sin envolverlas.
 */
export function useProgress() {
  const { progress, loaded } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    progress,
    loaded,
    unlock,
    addStars,
    markWorldDone,
    recordLevelStars,
    recordMemoResult,
    setSettings,
    reset: resetProgress,
  };
}
