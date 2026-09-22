"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BIRD,
  GOAL_LAMPS,
  INVULNERABLE_MS,
  LAMP,
  MAX_HEARTS,
  PHYSICS,
  STARS_PER_HEART,
  WORLD,
  birdRotation,
  clamp,
  createLamps,
  lampCollision,
  resetLamp,
  speedFor,
  starCollected,
  type LampState,
} from "@/lib/flappy";

export type FlappyStatus = "ready" | "playing" | "paused" | "over" | "won";

/** Anchos de las franjas que loopean en cada capa de parallax. */
export const TILE = { back: 1000, mid: 1000, ground: 200 } as const;
const LAYER_SPEED = { back: 0.15, mid: 0.45, ground: 1 } as const;

/** Paso fijo de física: sin esto, con framerate bajo el pájaro atraviesa faroles. */
const STEP = 1 / 120;
const MAX_FRAME_DELTA = 0.05;

export type FlappyOutcome = { stars: number; hearts: number; seconds: number };

/**
 * `onWin` se dispara dentro del bucle, en el momento exacto en que se cruza el
 * último farol. Se avisa así, y no con un efecto sobre `status`, para no meter
 * un setState en el cuerpo de un efecto.
 */
export function useFlappyEngine(onWin?: (outcome: FlappyOutcome) => void) {
  // --- Estado que se muestra en el HUD: cambia poco, vive en React.
  const [status, setStatus] = useState<FlappyStatus>("ready");
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [stars, setStars] = useState(0);
  const [passed, setPassed] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // --- Estado de simulación: cambia a 60 fps, vive en refs y nunca re-renderiza.
  const statusRef = useRef<FlappyStatus>("ready");
  const birdRef = useRef({ y: WORLD.height / 2, vy: 0 });
  const lampsRef = useRef<LampState[]>([]);
  const offsetsRef = useRef({ back: 0, mid: 0, ground: 0 });
  const timeRef = useRef(0);
  const invulnUntilRef = useRef(0);
  const heartsRef = useRef(MAX_HEARTS);
  const starsRef = useRef(0);
  const passedRef = useRef(0);
  /** Último segundo entero publicado al HUD: evita un render por frame. */
  const shownSecondRef = useRef(0);

  // --- Nodos que el bucle mueve a mano, sin pasar por React.
  const birdNodeRef = useRef<SVGGElement | null>(null);
  const lampNodesRef = useRef<(SVGGElement | null)[]>([]);
  const fixtureNodesRef = useRef<(SVGGElement | null)[]>([]);
  const starNodesRef = useRef<(SVGGElement | null)[]>([]);
  const backNodeRef = useRef<SVGGElement | null>(null);
  const midNodeRef = useRef<SVGGElement | null>(null);
  const groundNodeRef = useRef<SVGGElement | null>(null);

  const onWinRef = useRef(onWin);
  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

  const changeStatus = useCallback((next: FlappyStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const reset = useCallback(() => {
    birdRef.current = { y: WORLD.height / 2, vy: 0 };
    lampsRef.current = createLamps();
    offsetsRef.current = { back: 0, mid: 0, ground: 0 };
    timeRef.current = 0;
    invulnUntilRef.current = 0;
    heartsRef.current = MAX_HEARTS;
    starsRef.current = 0;
    passedRef.current = 0;
    shownSecondRef.current = 0;
    setHearts(MAX_HEARTS);
    setStars(0);
    setPassed(0);
    setSeconds(0);
    changeStatus("ready");
  }, [changeStatus]);

  const flap = useCallback(() => {
    const current = statusRef.current;
    if (current === "over" || current === "won" || current === "paused") return;
    if (current === "ready") {
      // Los faroles se generan con Math.random acá, ya en el cliente.
      lampsRef.current = createLamps();
      birdRef.current = { y: WORLD.height / 2, vy: 0 };
      timeRef.current = 0;
      shownSecondRef.current = 0;
      changeStatus("playing");
    }
    birdRef.current.vy = PHYSICS.flapImpulse;
  }, [changeStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") changeStatus("paused");
    else if (statusRef.current === "paused") changeStatus("playing");
  }, [changeStatus]);

  useEffect(() => {
    let rafId = 0;
    let last = 0;
    let accumulator = 0;

    // Primera generación, ya en el cliente: sin esto los 5 faroles del pool
    // quedarían dibujados encimados en el origen hasta el primer toque.
    if (lampsRef.current.length === 0) {
      lampsRef.current = createLamps();
    }

    const loseHeart = () => {
      if (timeRef.current < invulnUntilRef.current) return;
      const next = heartsRef.current - 1;
      heartsRef.current = next;
      setHearts(next);
      if (next <= 0) {
        setSeconds(Math.floor(timeRef.current));
        changeStatus("over");
        return;
      }
      // Invulnerable un rato: parpadea y atraviesa el farol en el que quedó.
      invulnUntilRef.current = timeRef.current + INVULNERABLE_MS / 1000;
      birdRef.current.vy = PHYSICS.flapImpulse * 0.6;
    };

    const step = (dt: number) => {
      const bird = birdRef.current;
      const lamps = lampsRef.current;
      timeRef.current += dt;

      bird.vy = Math.min(PHYSICS.maxFallSpeed, bird.vy + PHYSICS.gravity * dt);
      bird.y += bird.vy * dt;

      const speed = speedFor(passedRef.current);
      const shift = speed * dt;
      const offsets = offsetsRef.current;
      offsets.back += shift * LAYER_SPEED.back;
      offsets.mid += shift * LAYER_SPEED.mid;
      offsets.ground += shift * LAYER_SPEED.ground;

      for (const lamp of lamps) {
        lamp.x -= shift;

        if (lamp.x < LAMP.recycleX) {
          let rightmost = lamps[0];
          for (const other of lamps) {
            if (other.x > rightmost.x) rightmost = other;
          }
          resetLamp(lamp, rightmost.x + LAMP.spacing, rightmost.gapY);
          continue;
        }

        if (!lamp.passed && lamp.x < BIRD.x) {
          lamp.passed = true;
          passedRef.current += 1;
          setPassed(passedRef.current);
          if (passedRef.current >= GOAL_LAMPS) {
            const seconds = Math.floor(timeRef.current);
            setSeconds(seconds);
            changeStatus("won");
            onWinRef.current?.({
              stars: starsRef.current,
              hearts: heartsRef.current,
              seconds,
            });
            return;
          }
        }

        if (lamp.hasStar && !lamp.starTaken && starCollected(bird.y, lamp)) {
          lamp.starTaken = true;
          starsRef.current += 1;
          setStars(starsRef.current);
          if (
            starsRef.current % STARS_PER_HEART === 0 &&
            heartsRef.current < MAX_HEARTS
          ) {
            heartsRef.current += 1;
            setHearts(heartsRef.current);
          }
        }

        if (
          timeRef.current >= invulnUntilRef.current &&
          lampCollision(bird.y, lamp)
        ) {
          loseHeart();
          if (statusRef.current !== "playing") return;
        }
      }

      // Techo y piso
      if (bird.y < BIRD.radius) {
        bird.y = BIRD.radius;
        loseHeart();
        // loseHeart empuja hacia arriba, que contra el techo es al revés:
        // acá el rebote tiene que ser hacia abajo.
        bird.vy = 80;
      } else if (bird.y > WORLD.groundY - BIRD.radius) {
        bird.y = WORLD.groundY - BIRD.radius;
        loseHeart();
      }
    };

    const draw = () => {
      const bird = birdRef.current;
      const time = timeRef.current;

      if (birdNodeRef.current) {
        const rotation =
          statusRef.current === "ready" ? 0 : birdRotation(bird.vy);
        birdNodeRef.current.setAttribute(
          "transform",
          `translate(${BIRD.x} ${bird.y.toFixed(2)}) rotate(${rotation.toFixed(1)})`,
        );
        const blinking =
          time < invulnUntilRef.current && Math.floor(time * 10) % 2 === 0;
        birdNodeRef.current.style.opacity = blinking ? "0.35" : "1";
      }

      lampsRef.current.forEach((lamp, i) => {
        const node = lampNodesRef.current[i];
        if (node) {
          node.setAttribute(
            "transform",
            `translate(${lamp.x.toFixed(2)} ${lamp.gapY.toFixed(2)})`,
          );
        }
        // La tapa y la base siguen al poste en x pero quedan pegadas al techo
        // y al piso, así que su transform no lleva gapY.
        fixtureNodesRef.current[i]?.setAttribute(
          "transform",
          `translate(${lamp.x.toFixed(2)} 0)`,
        );
        const starNode = starNodesRef.current[i];
        if (starNode) {
          const visible = lamp.hasStar && !lamp.starTaken;
          starNode.style.display = visible ? "" : "none";
          if (visible) {
            starNode.setAttribute(
              "transform",
              `translate(${lamp.x.toFixed(2)} ${(lamp.gapY + lamp.starDy).toFixed(2)})`,
            );
          }
        }
      });

      const offsets = offsetsRef.current;
      const layers = [
        [backNodeRef.current, offsets.back % TILE.back],
        [midNodeRef.current, offsets.mid % TILE.mid],
        [groundNodeRef.current, offsets.ground % TILE.ground],
      ] as const;
      for (const [node, offset] of layers) {
        node?.setAttribute("transform", `translate(${-offset.toFixed(2)} 0)`);
      }
    };

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);
      if (last === 0) last = now;
      const delta = Math.min(MAX_FRAME_DELTA, (now - last) / 1000);
      last = now;

      if (statusRef.current === "playing") {
        accumulator += delta;
        while (accumulator >= STEP) {
          step(STEP);
          accumulator -= STEP;
          if (statusRef.current !== "playing") {
            accumulator = 0;
            break;
          }
        }
        // Solo publicamos el cronómetro cuando cambia el segundo entero.
        const whole = Math.floor(timeRef.current);
        if (whole !== shownSecondRef.current) {
          shownSecondRef.current = whole;
          setSeconds(whole);
        }
      } else if (statusRef.current === "ready") {
        // Bobeo suave mientras espera el primer toque.
        timeRef.current += delta;
        birdRef.current.y =
          WORLD.height / 2 + Math.sin(timeRef.current * 2.2) * 14;
        birdRef.current.vy = 0;
        accumulator = 0;
      } else {
        accumulator = 0;
      }

      draw();
    };

    rafId = requestAnimationFrame(frame);

    // Cambiar de pestaña pausa en vez de matar al jugador al volver.
    const handleVisibility = () => {
      if (document.hidden && statusRef.current === "playing") {
        changeStatus("paused");
      }
      last = 0;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [changeStatus]);

  return {
    status,
    hearts,
    stars,
    passed,
    seconds,
    progress: clamp(passed / GOAL_LAMPS, 0, 1),
    flap,
    reset,
    togglePause,
    nodes: {
      birdNodeRef,
      lampNodesRef,
      fixtureNodesRef,
      starNodesRef,
      backNodeRef,
      midNodeRef,
      groundNodeRef,
    },
  };
}

export type FlappyNodes = ReturnType<typeof useFlappyEngine>["nodes"];
