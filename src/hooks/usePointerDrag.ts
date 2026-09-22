"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Piece } from "@/lib/puzzle";

export type DragState = {
  piece: Piece;
  pointerId: number;
  /** Posición actual del puntero en coordenadas de viewport. */
  x: number;
  y: number;
  /** Dónde se agarró la pieza, para que no salte bajo el dedo. */
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

/** Busca el slot que está debajo del puntero al soltar. */
function slotIndexAt(x: number, y: number): number | null {
  const hit = document
    .elementsFromPoint(x, y)
    .find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.slotIndex !== undefined,
    );
  if (!hit) return null;
  const index = Number(hit.dataset.slotIndex);
  return Number.isInteger(index) ? index : null;
}

/**
 * Arrastre unificado mouse + touch + lápiz.
 *
 * Deliberadamente NO usa la HTML5 Drag & Drop API: esa API no dispara en touch,
 * que es justo donde se va a jugar (tablets). Pointer Events cubre los tres.
 */
export function usePointerDrag(
  onDrop: (piece: Piece, slotIndex: number | null) => void,
) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const onDropRef = useRef(onDrop);
  const originRef = useRef({ x: 0, y: 0 });
  /**
   * Un arrastre real termina disparando también un `click`. Sin esto, soltar una
   * pieza de vuelta en la bandeja la dejaría además "elegida" sin querer.
   */
  const suppressClickRef = useRef(false);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>, piece: Piece) => {
      // Solo botón principal del mouse; touch y pen reportan button 0.
      if (event.button !== 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const next: DragState = {
        piece,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      };
      originRef.current = { x: event.clientX, y: event.clientY };
      suppressClickRef.current = false;
      dragRef.current = next;
      setDrag(next);
    },
    [],
  );

  /** true si el último gesto fue un arrastre y no un simple tap. */
  const consumeClickSuppression = useCallback(() => {
    const suppressed = suppressClickRef.current;
    suppressClickRef.current = false;
    return suppressed;
  }, []);

  const isDragging = drag !== null;

  useEffect(() => {
    if (!isDragging) return;

    document.body.dataset.dragging = "true";

    const handleMove = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || event.pointerId !== current.pointerId) return;
      event.preventDefault();
      const next = { ...current, x: event.clientX, y: event.clientY };
      dragRef.current = next;
      setDrag(next);
    };

    const finish = (event: PointerEvent, cancelled: boolean) => {
      const current = dragRef.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const origin = originRef.current;
      suppressClickRef.current =
        Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8;
      dragRef.current = null;
      setDrag(null);
      onDropRef.current(
        current.piece,
        cancelled ? null : slotIndexAt(event.clientX, event.clientY),
      );
    };

    const handleUp = (event: PointerEvent) => finish(event, false);
    const handleCancel = (event: PointerEvent) => finish(event, true);

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      delete document.body.dataset.dragging;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [isDragging]);

  return { drag, startDrag, consumeClickSuppression };
}
