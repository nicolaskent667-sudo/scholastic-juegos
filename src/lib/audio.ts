/**
 * Sonido del juego. Módulo con estado propio, como el store de progreso: el
 * `<audio>` de la música tiene que sobrevivir a los cambios de pantalla para no
 * reiniciarse cada vez que se entra a un nivel.
 */

export const SOUNDS = {
  music: "/sounds/musica-de-fondo.mp3",
  victoria: "/sounds/victoria.mp3",
  bloque: "/sounds/bloque.mp3",
} as const;

export type EffectName = "victoria" | "bloque";

const MUSIC_VOLUME = 0.3;
const EFFECT_VOLUME: Record<EffectName, number> = {
  victoria: 0.7,
  bloque: 0.45,
};

/** Margen antes de pausar: evita el corte al pasar de un nivel a otro. */
const PAUSE_DELAY_MS = 200;

let music: HTMLAudioElement | null = null;
const effectPool = new Map<EffectName, HTMLAudioElement>();

let enabled = true;
/** Cuántas pantallas están pidiendo música ahora mismo. */
let listeners = 0;
let pauseTimer: ReturnType<typeof setTimeout> | null = null;
/** Los navegadores no dejan sonar nada antes del primer gesto del usuario. */
let waitingForGesture = false;

function isClient(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

function getMusic(): HTMLAudioElement | null {
  if (!isClient()) return null;
  if (!music) {
    music = new Audio(SOUNDS.music);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
    music.preload = "auto";
  }
  return music;
}

function getEffect(name: EffectName): HTMLAudioElement | null {
  if (!isClient()) return null;
  let base = effectPool.get(name);
  if (!base) {
    base = new Audio(SOUNDS[name]);
    base.preload = "auto";
    effectPool.set(name, base);
  }
  return base;
}

/**
 * Si el navegador rechaza el play por falta de gesto, se reintenta una sola vez
 * en el primer toque o tecla que llegue.
 */
function retryOnFirstGesture(): void {
  if (waitingForGesture || !isClient()) return;
  waitingForGesture = true;

  const retry = () => {
    waitingForGesture = false;
    window.removeEventListener("pointerdown", retry);
    window.removeEventListener("keydown", retry);
    if (enabled && listeners > 0) void playMusicNow();
  };

  window.addEventListener("pointerdown", retry, { once: true });
  window.addEventListener("keydown", retry, { once: true });
}

async function playMusicNow(): Promise<void> {
  const element = getMusic();
  if (!element) return;
  try {
    await element.play();
  } catch {
    // Autoplay bloqueado: esperamos al primer gesto.
    retryOnFirstGesture();
  }
}

/** La pantalla pide música. Se llama al montar cada minijuego. */
export function acquireMusic(): void {
  listeners += 1;
  if (pauseTimer) {
    clearTimeout(pauseTimer);
    pauseTimer = null;
  }
  if (!enabled) return;
  void playMusicNow();
}

/** La pantalla deja de pedirla. Se llama en el cleanup del efecto. */
export function releaseMusic(): void {
  listeners = Math.max(0, listeners - 1);
  if (listeners > 0) return;
  if (pauseTimer) clearTimeout(pauseTimer);
  pauseTimer = setTimeout(() => {
    pauseTimer = null;
    // No se reinicia el tiempo: al volver a un nivel sigue donde estaba.
    if (listeners === 0) music?.pause();
  }, PAUSE_DELAY_MS);
}

/**
 * Cada disparo usa un clon: dos piezas colocadas seguidas tienen que sonar las
 * dos, y reusar el mismo elemento cortaría la primera.
 */
export function playEffect(name: EffectName): void {
  if (!enabled) return;
  const base = getEffect(name);
  if (!base) return;
  const node = base.cloneNode() as HTMLAudioElement;
  node.volume = EFFECT_VOLUME[name];
  void node.play().catch(() => {
    // Sin gesto previo todavía: se pierde este efecto y ya.
  });
}

/** Refleja la preferencia de Opciones. */
export function setAudioEnabled(next: boolean): void {
  enabled = next;
  if (!isClient()) return;
  if (!next) {
    music?.pause();
    return;
  }
  if (listeners > 0) void playMusicNow();
}
