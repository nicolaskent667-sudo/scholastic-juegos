"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  areAdjacent,
  emptyPaths,
  endpointAt,
  isConnected,
  isSolved,
  ownerAt,
  sameCell,
  truncateAt,
  type Cell,
  type FlowLevel,
  type FlowPaths,
} from "@/lib/flow";

/** Lee el `data-flow="fila-columna"` que está debajo del puntero. */
function cellAt(x: number, y: number): Cell | null {
  const hit = document
    .elementsFromPoint(x, y)
    .find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.flow !== undefined,
    );
  if (!hit) return null;
  const [row, col] = (hit.dataset.flow ?? "").split("-").map(Number);
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  return { row, col };
}

export function useFlowBoard(level: FlowLevel, onSolved: (moves: number) => void) {
  const [paths, setPaths] = useState<FlowPaths>(() => emptyPaths(level));
  /** Tubo que se está dibujando ahora mismo, o -1. */
  const [drawing, setDrawing] = useState(-1);
  const [moves, setMoves] = useState(0);

  // Espejos para leer el estado desde los handlers del puntero sin quedar
  // atrapados en un closure viejo. Se sincronizan en un efecto, no durante el
  // render, para que el render siga siendo puro.
  const pathsRef = useRef(paths);
  const drawingRef = useRef(drawing);
  const movesRef = useRef(moves);
  const pointerIdRef = useRef<number | null>(null);
  const solvedRef = useRef(false);
  const onSolvedRef = useRef(onSolved);

  useEffect(() => {
    pathsRef.current = paths;
    drawingRef.current = drawing;
    movesRef.current = moves;
    onSolvedRef.current = onSolved;
  });

  const solved = isSolved(level, paths);

  const reset = useCallback(() => {
    setPaths(emptyPaths(level));
    setDrawing(-1);
    setMoves(0);
    solvedRef.current = false;
    pointerIdRef.current = null;
  }, [level]);

  /**
   * Empieza a dibujar. Se puede arrancar desde una punta (borra lo que tuviera
   * ese tubo) o desde cualquier celda ya pintada, recortando el resto: así se
   * corrige sin tener que rehacer todo el tubo.
   */
  const startAt = useCallback(
    (cell: Cell, pointerId: number) => {
      if (solvedRef.current) return;

      const endpointIndex = endpointAt(level, cell);
      const owner = ownerAt(pathsRef.current, cell);

      if (endpointIndex !== -1) {
        pointerIdRef.current = pointerId;
        setDrawing(endpointIndex);
        setPaths((prev) => {
          const next = [...prev];
          next[endpointIndex] = [cell];
          return next;
        });
        return;
      }

      if (owner !== -1) {
        pointerIdRef.current = pointerId;
        setDrawing(owner);
        setPaths((prev) => {
          const next = [...prev];
          const cut = truncateAt(next[owner], cell);
          next[owner] = [...cut, cell];
          return next;
        });
      }
    },
    [level],
  );

  const extendTo = useCallback(
    (cell: Cell) => {
      const index = drawingRef.current;
      if (index === -1 || solvedRef.current) return;

      setPaths((prev) => {
        const current = prev[index];
        if (current.length === 0) return prev;

        const head = current[current.length - 1];
        if (sameCell(head, cell)) return prev;

        // Volver sobre el camino propio lo acorta, como una goma de borrar.
        const backIndex = current.findIndex((c) => sameCell(c, cell));
        if (backIndex !== -1) {
          const next = [...prev];
          next[index] = current.slice(0, backIndex + 1);
          return next;
        }

        if (!areAdjacent(head, cell)) return prev;

        // No se puede pasar por la punta de otro tubo.
        const endpointIndex = endpointAt(level, cell);
        if (endpointIndex !== -1 && endpointIndex !== index) return prev;

        // Un tubo ya cerrado no se sigue estirando desde su punta final.
        if (endpointIndex === index && current.length > 1) {
          const [a, b] = level.endpoints[index];
          const start = current[0];
          const other = sameCell(start, a) ? b : a;
          if (!sameCell(cell, other)) return prev;
        }

        const next = [...prev];
        // Pisar otro color lo recorta desde donde se lo cruzó.
        const owner = ownerAt(prev, cell);
        if (owner !== -1 && owner !== index) {
          next[owner] = truncateAt(prev[owner], cell);
        }
        next[index] = [...current, cell];
        return next;
      });
    },
    [level],
  );

  const finish = useCallback(() => {
    const index = drawingRef.current;
    pointerIdRef.current = null;
    setDrawing(-1);
    if (index === -1) return;

    // Un trazo de una sola celda no cuenta como movimiento.
    if (pathsRef.current[index].length > 1) setMoves((value) => value + 1);
  }, []);

  /**
   * El aviso de victoria cuelga del estado ya renderizado, no de lo que haya
   * en los refs al soltar: así no depende de si el último `pointermove` llegó
   * a reflejarse antes del `pointerup`.
   */
  useEffect(() => {
    if (!solved || solvedRef.current) return;
    solvedRef.current = true;
    onSolvedRef.current(movesRef.current);
  }, [solved]);

  // Gestos con el puntero: mouse, dedo y lápiz con el mismo código.
  useEffect(() => {
    if (drawing === -1) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) return;
      event.preventDefault();
      const cell = cellAt(event.clientX, event.clientY);
      if (cell) extendTo(cell);
    };

    const handleUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) return;
      finish();
    };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [drawing, extendTo, finish]);

  const connected = level.endpoints.map((_, i) => isConnected(level, paths, i));

  return {
    paths,
    drawing,
    moves,
    solved,
    connected,
    startAt,
    reset,
  };
}
