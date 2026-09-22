"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Cell } from "@/lib/wordsearch";

/** Lee el `data-cell="fila-columna"` que está debajo del puntero. */
function cellAt(x: number, y: number): Cell | null {
  const hit = document
    .elementsFromPoint(x, y)
    .find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.cell !== undefined,
    );
  if (!hit) return null;
  const [row, col] = (hit.dataset.cell ?? "").split("-").map(Number);
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null;
  return { row, col };
}

export type ActiveSelection = { from: Cell; to: Cell };

function sameCell(a: Cell, b: Cell): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * Selección de una línea de celdas, por arrastre o por dos toques.
 * Usa Pointer Events (la HTML5 Drag & Drop API no dispara en touch) con la
 * misma técnica de `elementsFromPoint` que el arrastre del rompecabezas.
 */
export function useCellSelection(onCommit: (from: Cell, to: Cell) => void) {
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const [dragging, setDragging] = useState(false);
  /** Primera celda tocada cuando se juega sin arrastrar. */
  const [anchor, setAnchor] = useState<Cell | null>(null);

  const activeRef = useRef<ActiveSelection | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  /** Distingue un arrastre real de un toque, que además dispara un click. */
  const movedRef = useRef(false);
  const onCommitRef = useRef(onCommit);

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  const clear = useCallback(() => {
    activeRef.current = null;
    pointerIdRef.current = null;
    setActive(null);
    setAnchor(null);
    setDragging(false);
  }, []);

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>, cell: Cell) => {
      if (event.button !== 0) return;
      const next = { from: cell, to: cell };
      activeRef.current = next;
      pointerIdRef.current = event.pointerId;
      movedRef.current = false;
      setActive(next);
      setDragging(true);
    },
    [],
  );

  /** Camino sin arrastre: el primer toque marca el inicio, el segundo cierra. */
  const tapCell = useCallback(
    (cell: Cell) => {
      // Un arrastre real termina disparando también un click: lo ignoramos.
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }
      if (anchor === null) {
        setAnchor(cell);
        setActive({ from: cell, to: cell });
        return;
      }
      if (sameCell(anchor, cell)) {
        clear();
        return;
      }
      onCommitRef.current(anchor, cell);
      clear();
    },
    [anchor, clear],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) return;
      const current = activeRef.current;
      if (!current) return;
      event.preventDefault();

      const cell = cellAt(event.clientX, event.clientY);
      if (!cell) return;
      if (!sameCell(cell, current.from)) movedRef.current = true;
      if (sameCell(cell, current.to)) return;

      const next = { from: current.from, to: cell };
      activeRef.current = next;
      setActive(next);
    };

    const finish = (event: PointerEvent, cancelled: boolean) => {
      if (event.pointerId !== pointerIdRef.current) return;
      const current = activeRef.current;
      const moved = movedRef.current;
      pointerIdRef.current = null;
      activeRef.current = null;
      setDragging(false);

      if (cancelled || !current || !moved) {
        // Un toque sin mover no valida: queda para el camino de dos toques,
        // que se resuelve en el click que viene después.
        if (cancelled) setActive(null);
        return;
      }
      setActive(null);
      onCommitRef.current(current.from, current.to);
    };

    const handleUp = (event: PointerEvent) => finish(event, false);
    const handleCancel = (event: PointerEvent) => finish(event, true);

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [dragging]);

  return { active, anchor, startDrag, tapCell, clear };
}
