"use client";

import DogSprite from "@/components/sprites/DogSprite";
import { useProgress } from "@/hooks/useProgress";
import {
  STARS_PER_LEVEL,
  isUnlocked,
  worldStarTotal,
  type CampaignLevel,
  type CampaignWorld,
} from "@/lib/campaign";
import { MAP, nodePositions, smoothPath, trophyPosition } from "@/lib/mapPath";

const NODE_R = 46;

function StarRow({ earned, x, y }: { earned: number; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M 0 -11 Q 2 -2 11 0 Q 2 2 0 11 Q -2 2 -11 0 Q -2 -2 0 -11 Z"
          transform={`translate(${(i - 1) * 26} 0)`}
          fill={i < earned ? "var(--color-sol)" : "#ffffff"}
          stroke="var(--color-tinta)"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#a79ba0">
      <rect x={-13} y={-4} width={26} height={22} rx={5} />
      <path
        d="M -8 -4 v -7 a 8 8 0 0 1 16 0 v 7"
        fill="none"
        stroke="#a79ba0"
        strokeWidth={5}
      />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke="var(--color-tinta)"
      strokeWidth={5}
      strokeLinejoin="round"
    >
      <rect x={-8} y={-2} width={16} height={34} fill="var(--color-madera)" />
      <circle cx={0} cy={-34} r={38} fill="#a8dcc0" />
    </g>
  );
}

function Trophy({ x, y }: { x: number; y: number }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke="var(--color-tinta)"
      strokeWidth={5}
      strokeLinejoin="round"
    >
      <path d="M -30 -38 L 30 -38 L 24 4 L -24 4 Z" fill="var(--color-sol)" />
      <path d="M -30 -32 q -20 0 -20 14 q 0 14 20 14" fill="none" />
      <path d="M 30 -32 q 20 0 20 14 q 0 14 -20 14" fill="none" />
      <rect x={-9} y={4} width={18} height={16} fill="var(--color-sol)" />
      <rect x={-26} y={20} width={52} height={14} rx={5} fill="var(--color-berry)" />
    </g>
  );
}

type Props = {
  world: CampaignWorld;
  onPickLevel: (level: CampaignLevel) => void;
  onBack: () => void;
};

export default function LevelMap({ world, onPickLevel, onBack }: Props) {
  const { progress } = useProgress();
  const stars = progress.levelStars;

  const points = nodePositions(world.levels.length);
  const trophy = trophyPosition(world.levels.length);
  const path = smoothPath([...points, trophy]);

  const earned = world.levels.reduce(
    (total, level) => total + (stars[level.id] ?? 0),
    0,
  );
  const total = worldStarTotal(world);

  // El nodo actual es el primero sin terminar; si están todos, ninguno.
  const currentIndex = world.levels.findIndex(
    (level) => (stars[level.id] ?? 0) === 0 && isUnlocked(level, stars),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5">
      <header className="mb-3 flex items-center justify-between gap-3 rounded-3xl border-[3px] border-tinta bg-white px-3 py-2 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver a los mundos"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[3px] border-tinta bg-white text-xl font-extrabold text-tinta outline-none transition hover:bg-blush/50 focus-visible:ring-4 focus-visible:ring-cielo-azul"
          >
            ‹
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-tinta sm:text-3xl">
              Niveles
            </h1>
            <p className="truncate text-sm font-bold text-tinta/60">
              Mundo {world.id} · {world.name}
            </p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-2 rounded-full border-[3px] border-tinta bg-sol/25 px-4 py-1">
          <svg viewBox="-16 -16 32 32" className="h-5 w-5" aria-hidden>
            <path
              d="M 0 -13 Q 2 -2 13 0 Q 2 2 0 13 Q -2 2 -13 0 Q -2 -2 0 -13 Z"
              fill="var(--color-sol)"
              stroke="var(--color-tinta)"
              strokeWidth={3}
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-extrabold tabular-nums text-tinta">
            {earned} / {total}
          </span>
        </span>
      </header>

      <div className="relative overflow-hidden rounded-3xl border-[3px] border-tinta">
        <svg
          viewBox={`0 0 ${MAP.width} ${MAP.height}`}
          className="block h-full w-full"
        >
          <title>Mapa de niveles de {world.name}</title>

          <rect x={0} y={0} width={MAP.width} height={MAP.height} fill="var(--color-cielo)" />
          <path
            d={`M 0 ${MAP.height * 0.58} C 240 ${MAP.height * 0.5}, 460 ${MAP.height * 0.68}, 760 ${MAP.height * 0.6} C 880 ${MAP.height * 0.56}, 950 ${MAP.height * 0.62}, ${MAP.width} ${MAP.height * 0.58} L ${MAP.width} ${MAP.height} L 0 ${MAP.height} Z`}
            fill="#d8eede"
          />
          <path
            d={`M 0 ${MAP.height * 0.72} C 300 ${MAP.height * 0.66}, 520 ${MAP.height * 0.82}, 820 ${MAP.height * 0.74} C 920 ${MAP.height * 0.71}, 960 ${MAP.height * 0.76}, ${MAP.width} ${MAP.height * 0.73} L ${MAP.width} ${MAP.height} L 0 ${MAP.height} Z`}
            fill="var(--color-menta)"
          />

          {/* Decorado */}
          <Tree x={70} y={330} s={0.8} />
          <Tree x={930} y={470} s={0.85} />
          <g fill="#ffffff" opacity={0.9}>
            <ellipse cx={210} cy={430} rx={58} ry={20} />
            <ellipse cx={168} cy={440} rx={36} ry={15} />
            <ellipse cx={830} cy={280} rx={54} ry={19} />
            <ellipse cx={872} cy={290} rx={34} ry={14} />
          </g>

          {/* Sendero: trazo blanco ancho con la línea punteada rosa encima */}
          <path
            d={path}
            fill="none"
            stroke="#ffffff"
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={path}
            fill="none"
            stroke="var(--color-blush)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="2 22"
          />

          <Trophy x={trophy.x} y={trophy.y} />

          {world.levels.map((level, i) => {
            const point = points[i];
            const levelStars = stars[level.id] ?? 0;
            const unlocked = isUnlocked(level, stars);
            const isCurrent = i === currentIndex;

            return (
              <g key={level.id}>
                {isCurrent && (
                  <>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={NODE_R + 12}
                      fill="none"
                      stroke="var(--color-blush)"
                      strokeWidth={5}
                      strokeDasharray="10 10"
                    />
                    {/* Sieni asomando sobre el nivel actual */}
                    <g transform={`translate(${point.x} ${point.y - NODE_R - 42}) scale(0.52)`}>
                      <DogSprite />
                    </g>
                  </>
                )}

                <circle
                  cx={point.x}
                  cy={point.y}
                  r={NODE_R}
                  fill={
                    !unlocked
                      ? "#d9d2d4"
                      : levelStars > 0
                        ? "var(--color-berry)"
                        : "#ffffff"
                  }
                  stroke={unlocked ? "var(--color-tinta)" : "#b8adb1"}
                  strokeWidth={5}
                />

                {unlocked ? (
                  <text
                    x={point.x}
                    y={point.y + 13}
                    textAnchor="middle"
                    fontSize={38}
                    fontWeight={800}
                    fill={levelStars > 0 ? "#ffffff" : "var(--color-tinta)"}
                    fontFamily="var(--font-display)"
                  >
                    {level.index}
                  </text>
                ) : (
                  <Lock x={point.x} y={point.y - 7} />
                )}

                {levelStars > 0 && (
                  <StarRow
                    earned={levelStars}
                    x={point.x}
                    y={point.y + NODE_R + 22}
                  />
                )}

                {/* El botón va al final para quedar por encima de todo */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={NODE_R}
                  fill="transparent"
                  className={unlocked ? "cursor-pointer" : "cursor-not-allowed"}
                  onClick={() => unlocked && onPickLevel(level)}
                  role="button"
                  tabIndex={unlocked ? 0 : -1}
                  aria-label={
                    unlocked
                      ? `Nivel ${level.index}, ${level.label}, ${levelStars} de ${STARS_PER_LEVEL} estrellas`
                      : `Nivel ${level.index} bloqueado`
                  }
                  onKeyDown={(event) => {
                    if (unlocked && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      onPickLevel(level);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-center text-sm font-bold text-tinta/60">
        {currentIndex === -1
          ? "¡Completaste todos los niveles de este mundo! 🏆"
          : `Siguiente: nivel ${world.levels[currentIndex].index} · ${world.levels[currentIndex].label}`}
      </p>
    </div>
  );
}
