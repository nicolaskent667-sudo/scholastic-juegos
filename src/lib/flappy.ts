/**
 * Lógica pura del nivel de vuelo. Sin React y sin DOM: todo se calcula en las
 * coordenadas fijas del viewBox, así la física es idéntica en cualquier pantalla.
 */

export const WORLD = {
  width: 1000,
  height: 600,
  /** Altura del pasto: por debajo de esto el pájaro toca el suelo. */
  groundY: 520,
} as const;

export const PHYSICS = {
  gravity: 1500,
  flapImpulse: -430,
  maxFallSpeed: 750,
  baseSpeed: 210,
  speedPerLamp: 6,
  maxSpeed: 300,
} as const;

export const LAMP = {
  spacing: 340,
  /** Constante a propósito: deja la geometría del farol fija (ver LampPost). */
  gap: 210,
  poolSize: 5,
  /** Media anchura de la pantalla del farol (la parte ancha, junto al hueco). */
  halfShadeWidth: 55,
  /** Media anchura del caño (la parte finita que sube y baja). */
  halfPoleWidth: 22,
  /** Alto de la pantalla del farol medido desde el borde del hueco. */
  shadeHeight: 95,
  minGapY: 130,
  maxGapY: 400,
  /** Salto vertical máximo entre faroles seguidos: el recorrido siempre es justo. */
  maxGapDelta: 120,
  starChance: 0.8,
  /** Desplazamiento vertical de la estrella respecto del centro del hueco. */
  starOffset: 55,
  /** A partir de acá el farol ya salió de pantalla y se recicla. */
  recycleX: -120,
} as const;

export const BIRD = {
  x: 240,
  /** Radio de colisión, más chico que el dibujo: margen a favor del jugador. */
  radius: 26,
  drawRadius: 34,
} as const;

export const GOAL_LAMPS = 15;
export const MAX_HEARTS = 3;
export const STARS_PER_HEART = 10;
export const INVULNERABLE_MS = 1500;
export const STAR_RADIUS = 30;

export type LampState = {
  x: number;
  /** Centro vertical del hueco. */
  gapY: number;
  /** Ya sumó al contador de faroles pasados. */
  passed: boolean;
  hasStar: boolean;
  starTaken: boolean;
  /** Desplazamiento de la estrella respecto de gapY. */
  starDy: number;
};

export type BirdState = {
  y: number;
  vy: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Reposiciona un farol en `x` con un hueco nuevo. Se llama tanto al armar el
 * nivel como al reciclar, siempre desde el cliente (nunca durante el render).
 */
export function resetLamp(lamp: LampState, x: number, prevGapY: number): void {
  const min = Math.max(LAMP.minGapY, prevGapY - LAMP.maxGapDelta);
  const max = Math.min(LAMP.maxGapY, prevGapY + LAMP.maxGapDelta);

  lamp.x = x;
  lamp.gapY = randomBetween(min, max);
  lamp.passed = false;
  lamp.hasStar = Math.random() < LAMP.starChance;
  lamp.starTaken = false;
  // La estrella se corre dentro del hueco para que juntarla exija apuntar.
  lamp.starDy = randomBetween(-LAMP.starOffset, LAMP.starOffset);
}

export function createLamps(): LampState[] {
  const lamps: LampState[] = [];
  let prevGapY = (LAMP.minGapY + LAMP.maxGapY) / 2;

  for (let i = 0; i < LAMP.poolSize; i++) {
    const lamp: LampState = {
      x: 0,
      gapY: prevGapY,
      passed: false,
      hasStar: false,
      starTaken: false,
      starDy: 0,
    };
    // El primer farol arranca lejos para dar tiempo a acomodarse.
    resetLamp(lamp, WORLD.width + 160 + i * LAMP.spacing, prevGapY);
    prevGapY = lamp.gapY;
    lamps.push(lamp);
  }

  return lamps;
}

/** Colisión círculo vs rectángulo por el punto más cercano. */
export function circleHitsRect(
  cx: number,
  cy: number,
  r: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
): boolean {
  const nearestX = clamp(cx, left, right);
  const nearestY = clamp(cy, top, bottom);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy < r * r;
}

/**
 * Cuatro cajas por farol: caño finito y pantalla ancha, arriba y abajo.
 * Con una sola caja ancha el pájaro chocaría "contra el aire" al pasar bien
 * alto, donde visualmente solo hay un caño angosto.
 */
export function lampCollision(birdY: number, lamp: LampState): boolean {
  const { halfPoleWidth, halfShadeWidth, shadeHeight, gap } = LAMP;
  const gapTop = lamp.gapY - gap / 2;
  const gapBottom = lamp.gapY + gap / 2;
  const cx = BIRD.x;
  const r = BIRD.radius;

  const shadeLeft = lamp.x - halfShadeWidth;
  const shadeRight = lamp.x + halfShadeWidth;
  const poleLeft = lamp.x - halfPoleWidth;
  const poleRight = lamp.x + halfPoleWidth;

  return (
    // Pantalla de arriba (la que apunta hacia abajo, contra el hueco)
    circleHitsRect(cx, birdY, r, shadeLeft, gapTop - shadeHeight, shadeRight, gapTop) ||
    // Caño de arriba, desde el techo hasta la pantalla
    circleHitsRect(cx, birdY, r, poleLeft, -WORLD.height, poleRight, gapTop - shadeHeight) ||
    // Pantalla de abajo
    circleHitsRect(cx, birdY, r, shadeLeft, gapBottom, shadeRight, gapBottom + shadeHeight) ||
    // Caño de abajo, hasta el piso
    circleHitsRect(cx, birdY, r, poleLeft, gapBottom + shadeHeight, poleRight, WORLD.height * 2)
  );
}

export function starCollected(birdY: number, lamp: LampState): boolean {
  const dx = BIRD.x - lamp.x;
  const dy = birdY - (lamp.gapY + lamp.starDy);
  const reach = BIRD.radius + STAR_RADIUS;
  return dx * dx + dy * dy < reach * reach;
}

/** Velocidad de scroll según cuántos faroles se pasaron. */
export function speedFor(passed: number): number {
  return Math.min(
    PHYSICS.maxSpeed,
    PHYSICS.baseSpeed + passed * PHYSICS.speedPerLamp,
  );
}

/** Inclinación del pájaro a partir de su velocidad vertical. */
export function birdRotation(vy: number): number {
  return clamp((vy / PHYSICS.maxFallSpeed) * 75, -20, 55);
}

export { clamp };
