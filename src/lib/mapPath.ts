/**
 * Posiciones de los nodos del mapa y el camino que los une.
 * Puro: sirve para cualquier cantidad de niveles y de columnas.
 */

export type MapLayout = {
  width: number;
  height: number;
  columns: number;
  marginX: number;
  /** Alto de cada fila del serpenteo. */
  rowHeight: number;
  bottomY: number;
};

/** Pantalla ancha: el mapa es apaisado y entran tres niveles por fila. */
export const MAP_WIDE: MapLayout = {
  width: 1000,
  // 660 y no 640: con la ondita vertical, las estrellitas del nodo mas bajo
  // se cortaban unos pixeles contra el borde de abajo.
  height: 660,
  columns: 3,
  marginX: 150,
  rowHeight: 165,
  bottomY: 545,
};

/**
 * Celular: dos columnas y mapa vertical. Con tres columnas los nodos quedaban
 * de unos 34px en pantalla, por debajo del mínimo cómodo para tocar con el dedo.
 */
export const MAP_NARROW: MapLayout = {
  width: 640,
  height: 1000,
  columns: 2,
  marginX: 165,
  rowHeight: 185,
  bottomY: 880,
};

export type MapPoint = { x: number; y: number };

/**
 * Serpentina de abajo hacia arriba: la fila de abajo va de izquierda a derecha,
 * la siguiente al revés, y así. Es lo que da el zigzag del diseño.
 */
export function nodePositions(count: number, map: MapLayout): MapPoint[] {
  const { columns, marginX, width, rowHeight, bottomY } = map;
  const step = (width - marginX * 2) / (columns - 1);

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / columns);
    const indexInRow = i % columns;
    // Las filas impares se recorren al revés.
    const column = row % 2 === 0 ? indexInRow : columns - 1 - indexInRow;
    return {
      x: marginX + column * step,
      // Una ondita suave para que no queden en una grilla perfecta.
      y: bottomY - row * rowHeight + Math.sin(i * 1.7) * 18,
    };
  });
}

/** El trofeo va después del último nodo, siguiendo el serpenteo. */
export function trophyPosition(count: number, map: MapLayout): MapPoint {
  const [last] = nodePositions(count + 1, map).slice(-1);
  return last;
}

/**
 * Camino suave que pasa por todos los puntos.
 * Catmull-Rom convertido a curvas de Bézier: da la sensación de sendero
 * dibujado a mano, sin los codos de una polilínea.
 */
export function smoothPath(points: readonly MapPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    // Tensión 1/6: el valor clásico para que Catmull-Rom pase por los puntos.
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };

    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}
