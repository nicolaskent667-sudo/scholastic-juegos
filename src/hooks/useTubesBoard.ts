"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  cloneTubes,
  isSolved,
  isStuck,
  pour,
  pourAmount,
  type TubesLevel,
  type TubesState,
} from "@/lib/tubes";

/** Una sola vez por nivel, como el hueco con candado del diseño. */
export const EXTRA_TUBES = 1;

export function useTubesBoard(
  level: TubesLevel,
  onSolved: (moves: number) => void,
) {
  const [tubes, setTubes] = useState<TubesState>(() => cloneTubes(level.tubes));
  /** Tubo levantado esperando destino, o -1. */
  const [picked, setPicked] = useState(-1);
  const [moves, setMoves] = useState(0);
  const [extraUsed, setExtraUsed] = useState(0);
  /** Para el sacudón cuando la jugada no vale. */
  const [rejected, setRejected] = useState(-1);
  const [history, setHistory] = useState<TubesState[]>([]);

  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solvedRef = useRef(false);
  const onSolvedRef = useRef(onSolved);
  const movesRef = useRef(moves);

  useEffect(() => {
    onSolvedRef.current = onSolved;
    movesRef.current = moves;
  });

  useEffect(
    () => () => {
      if (rejectTimer.current) clearTimeout(rejectTimer.current);
    },
    [],
  );

  const solved = isSolved(tubes);
  const stuck = isStuck(tubes);

  /**
   * El aviso de victoria cuelga del estado ya renderizado, no del handler:
   * así da igual por qué camino se llegó (volcar, deshacer, tubo extra).
   */
  useEffect(() => {
    if (!solved || solvedRef.current) return;
    solvedRef.current = true;
    onSolvedRef.current(movesRef.current);
  }, [solved]);

  const flashRejected = useCallback((index: number) => {
    setRejected(index);
    if (rejectTimer.current) clearTimeout(rejectTimer.current);
    rejectTimer.current = setTimeout(() => setRejected(-1), 420);
  }, []);

  const reset = useCallback(() => {
    setTubes(cloneTubes(level.tubes));
    setPicked(-1);
    setMoves(0);
    setExtraUsed(0);
    setHistory([]);
    setRejected(-1);
    solvedRef.current = false;
  }, [level]);

  /** Un toque levanta el tubo; el segundo vuelca, si la jugada vale. */
  const tapTube = useCallback(
    (index: number) => {
      if (solved) return;

      if (picked === -1) {
        // No tiene sentido levantar un tubo vacío ni uno ya terminado.
        if (tubes[index].length === 0) return;
        setPicked(index);
        return;
      }

      if (picked === index) {
        setPicked(-1);
        return;
      }

      if (pourAmount(tubes, picked, index) === 0) {
        flashRejected(index);
        setPicked(-1);
        return;
      }

      setHistory((prev) => [...prev, cloneTubes(tubes)]);
      setTubes(pour(tubes, picked, index));
      setMoves((value) => value + 1);
      setPicked(-1);
    },
    [solved, picked, tubes, flashRejected],
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setTubes(last);
      setPicked(-1);
      // Deshacer descuenta el movimiento: no queremos castigar al que corrige.
      setMoves((value) => Math.max(0, value - 1));
      return prev.slice(0, -1);
    });
  }, []);

  /** Suma un tubo vacío. Es la ayuda del hueco con candado del diseño. */
  const addTube = useCallback(() => {
    if (extraUsed >= EXTRA_TUBES || solved) return;
    setHistory((prev) => [...prev, cloneTubes(tubes)]);
    setTubes((prev) => [...prev, []]);
    setExtraUsed((value) => value + 1);
    setPicked(-1);
  }, [extraUsed, solved, tubes]);

  return {
    tubes,
    picked,
    moves,
    solved,
    stuck,
    rejected,
    canUndo: history.length > 0,
    extraLeft: EXTRA_TUBES - extraUsed,
    tapTube,
    undo,
    reset,
    addTube,
  };
}
