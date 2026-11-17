"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blockerOf, type ArrowsLevel } from "@/lib/arrows";

/** Una flecha en movimiento: saliendo del tablero o chocando y volviendo. */
export type Flight =
  | { id: number; kind: "exit"; nonce: number }
  | { id: number; kind: "crash"; distance: number; nonce: number };

/** Lo que se sacude cuando una flecha le choca: otra flecha o Sieni. */
export type Hit = { what: number | "sieni"; nonce: number };

/** Cuánto tarda en llegar al obstáculo antes de sacudirlo. */
export const CRASH_REACH_MS = 170;

export function useArrowsBoard(
  level: ArrowsLevel,
  onSolved: (crashes: number) => void,
  /** Avisos para los sonidos. */
  events?: { onExit?: () => void; onCrash?: () => void },
) {
  const [remaining, setRemaining] = useState<boolean[]>(() =>
    level.arrows.map(() => true),
  );
  const [crashes, setCrashes] = useState(0);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hit, setHit] = useState<Hit | null>(null);

  const nonce = useRef(0);
  const hitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solvedRef = useRef(false);
  const onSolvedRef = useRef(onSolved);
  const eventsRef = useRef(events);
  const crashesRef = useRef(crashes);

  useEffect(() => {
    onSolvedRef.current = onSolved;
    eventsRef.current = events;
    crashesRef.current = crashes;
  });

  useEffect(
    () => () => {
      if (hitTimer.current) clearTimeout(hitTimer.current);
    },
    [],
  );

  const left = remaining.filter(Boolean).length;
  const solved = left === 0;

  // Igual que en tubos: el aviso cuelga del estado ya renderizado.
  useEffect(() => {
    if (!solved || solvedRef.current) return;
    solvedRef.current = true;
    onSolvedRef.current(crashesRef.current);
  }, [solved]);

  const tapArrow = useCallback(
    (id: number) => {
      if (!remaining[id]) return;
      // Mientras vuelve de un choque no se la puede volver a tocar.
      if (flights.some((f) => f.id === id)) return;

      const arrow = level.arrows[id];
      const blocker = blockerOf(level, remaining, arrow);
      nonce.current += 1;

      if (!blocker) {
        // Sale del tablero en el acto: las demás quedan libres ya, aunque la
        // animación todavía no haya terminado.
        setRemaining((prev) => prev.map((v, i) => (i === id ? false : v)));
        setFlights((prev) => [...prev, { id, kind: "exit", nonce: nonce.current }]);
        eventsRef.current?.onExit?.();
        return;
      }

      setCrashes((value) => value + 1);
      setFlights((prev) => [
        ...prev,
        { id, kind: "crash", distance: blocker.distance, nonce: nonce.current },
      ]);
      const hitNonce = nonce.current;
      if (hitTimer.current) clearTimeout(hitTimer.current);
      hitTimer.current = setTimeout(() => {
        setHit({ what: blocker.what, nonce: hitNonce });
        eventsRef.current?.onCrash?.();
      }, CRASH_REACH_MS);
    },
    [level, remaining, flights],
  );

  /** El sprite avisa cuando termina su animación. */
  const endFlight = useCallback((flightNonce: number) => {
    setFlights((prev) => prev.filter((f) => f.nonce !== flightNonce));
  }, []);

  const reset = useCallback(() => {
    setRemaining(level.arrows.map(() => true));
    setCrashes(0);
    setFlights([]);
    setHit(null);
    if (hitTimer.current) clearTimeout(hitTimer.current);
    solvedRef.current = false;
  }, [level]);

  return {
    remaining,
    left,
    crashes,
    flights,
    hit,
    solved,
    tapArrow,
    endFlight,
    reset,
  };
}
