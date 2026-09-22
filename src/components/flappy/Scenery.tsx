import type { Ref } from "react";
import { WORLD } from "@/lib/flappy";
import { TILE } from "@/hooks/useFlappyEngine";

const GRASS_H = 42;

type House = { x: number; w: number; h: number; body: string; roof: string };

const HOUSES: House[] = [
  { x: 40, w: 150, h: 130, body: "var(--color-crema)", roof: "var(--color-blush)" },
  { x: 300, w: 120, h: 105, body: "#fdeef3", roof: "var(--color-cielo-azul)" },
  { x: 560, w: 145, h: 120, body: "var(--color-crema)", roof: "var(--color-menta-dark)" },
  { x: 800, w: 115, h: 95, body: "#fbe0e9", roof: "var(--color-blush)" },
];

const TREES = [200, 480, 730, 950];
const CLOUDS = [
  { x: 120, y: 90, s: 1 },
  { x: 430, y: 55, s: 1.3 },
  { x: 700, y: 120, s: 0.85 },
  { x: 880, y: 70, s: 1.1 },
];

function House({ x, w, h, body, roof }: House) {
  const top = WORLD.groundY - h;
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      <rect x={x} y={top} width={w} height={h} fill={body} />
      <path
        d={`M ${x - 16} ${top} L ${x + w / 2} ${top - 62} L ${x + w + 16} ${top} Z`}
        fill={roof}
      />
      <rect
        x={x + w / 2 - 18}
        y={WORLD.groundY - 46}
        width={36}
        height={46}
        rx={6}
        fill={roof}
        opacity={0.75}
      />
    </g>
  );
}

function Tree({ x }: { x: number }) {
  const base = WORLD.groundY;
  return (
    <g stroke="var(--color-tinta)" strokeWidth={5} strokeLinejoin="round">
      <rect x={x - 7} y={base - 90} width={14} height={90} fill="var(--color-madera)" />
      <circle cx={x - 22} cy={base - 108} r={26} fill="var(--color-blush)" />
      <circle cx={x + 20} cy={base - 116} r={24} fill="var(--color-blush)" />
      <circle cx={x - 2} cy={base - 140} r={28} fill="var(--color-blush)" />
    </g>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" opacity={0.95}>
      <ellipse cx={0} cy={0} rx={52} ry={22} />
      <ellipse cx={-30} cy={8} rx={34} ry={17} />
      <ellipse cx={26} cy={9} rx={30} ry={15} />
    </g>
  );
}

function Flower({ x }: { x: number }) {
  const y = WORLD.groundY + 20;
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={x}
          cy={y - 6}
          rx={3.4}
          ry={5.5}
          fill="#ffffff"
          transform={`rotate(${angle} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={2.6} fill="var(--color-sol)" />
    </g>
  );
}

type Props = {
  backRef: Ref<SVGGElement>;
  midRef: Ref<SVGGElement>;
  groundRef: Ref<SVGGElement>;
};

/**
 * Tres capas de parallax. Cada una dibuja su franja repetida y el motor la
 * desplaza con `-(offset % ancho)`, así el loop no tiene costuras.
 */
export default function Scenery({ backRef, midRef, groundRef }: Props) {
  const backTiles = [0, TILE.back];
  const midTiles = [0, TILE.mid];
  const groundTiles = Array.from(
    { length: Math.ceil(WORLD.width / TILE.ground) + 1 },
    (_, i) => i * TILE.ground,
  );

  return (
    <>
      {/* Cielo: fijo, sin costuras posibles */}
      <rect x={0} y={0} width={WORLD.width} height={WORLD.height} fill="var(--color-cielo)" />

      {/* Capa lejana: sol y nubes */}
      <g ref={backRef}>
        {backTiles.map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            <circle
              cx={740}
              cy={110}
              r={62}
              fill="var(--color-sol)"
              stroke="var(--color-tinta)"
              strokeWidth={5}
            />
            {CLOUDS.map((cloud) => (
              <Cloud key={cloud.x} {...cloud} />
            ))}
          </g>
        ))}
      </g>

      {/* Capa media: casitas y arbolitos */}
      <g ref={midRef}>
        {midTiles.map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            {TREES.map((x) => (
              <Tree key={x} x={x} />
            ))}
            {HOUSES.map((house) => (
              <House key={house.x} {...house} />
            ))}
          </g>
        ))}
      </g>

      {/* Piso: los rellenos van fijos y solo se mueven los detalles */}
      <rect
        x={0}
        y={WORLD.groundY}
        width={WORLD.width}
        height={GRASS_H}
        fill="var(--color-menta)"
      />
      <rect
        x={0}
        y={WORLD.groundY + GRASS_H}
        width={WORLD.width}
        height={WORLD.height - WORLD.groundY - GRASS_H}
        fill="#e8c9a0"
      />
      <line
        x1={0}
        y1={WORLD.groundY}
        x2={WORLD.width}
        y2={WORLD.groundY}
        stroke="var(--color-tinta)"
        strokeWidth={6}
      />
      <line
        x1={0}
        y1={WORLD.groundY + GRASS_H}
        x2={WORLD.width}
        y2={WORLD.groundY + GRASS_H}
        stroke="var(--color-tinta)"
        strokeWidth={5}
      />

      <g ref={groundRef}>
        {groundTiles.map((x) => (
          <g key={x}>
            <line
              x1={x}
              y1={WORLD.groundY + GRASS_H}
              x2={x}
              y2={WORLD.height}
              stroke="var(--color-tinta)"
              strokeWidth={4}
              opacity={0.55}
            />
            <Flower x={x + 96} />
          </g>
        ))}
      </g>
    </>
  );
}
