import { CONNECTION_EDGES, CONNECTION_NODES } from "@/lib/site";
import styles from "./ConnectionLines.module.css";

type Segment = { id: string; edge: string; d: string };

/**
 * El viewBox es 0–100 en ambos ejes con preserveAspectRatio="none", así que
 * una unidad NO mide lo mismo en X que en Y. Recortar por "unidades" produce
 * huecos enormes en horizontal y casi nulos en vertical.
 *
 * En vez de eso, cada nodo tiene una zona de exclusión ELÍPTICA en píxeles
 * (rx ≈ media caja de texto + aire, ry ≈ media altura + aire) y el recorte se
 * calcula en espacio de píxeles usando un viewport de referencia. El hueco
 * queda pegado a la caja del texto en cualquier dirección.
 */
/* rx/ry recalculados para el cuerpo nuevo de los nodos (V1.2).
   El trazo NO crece con el texto: solo crece el hueco. */
const REFERENCE = {
  desktop: { w: 1440, h: 900, rx: 76, ry: 20 },
  mobile: { w: 390, h: 844, rx: 52, ry: 17 },
} as const;

function segment(
  a: { x: number; y: number },
  b: { x: number; y: number },
  ref: (typeof REFERENCE)[keyof typeof REFERENCE],
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dxPx = (dx * ref.w) / 100;
  const dyPx = (dy * ref.h) / 100;
  const lenPx = Math.hypot(dxPx, dyPx) || 1;

  // radio de la elipse en la dirección del segmento
  const ux = dxPx / lenPx;
  const uy = dyPx / lenPx;
  const padPx = 1 / Math.hypot(ux / ref.rx, uy / ref.ry);

  // el mismo factor t sirve para las deltas en unidades del viewBox
  const t = Math.min(padPx / lenPx, 0.45);

  const x1 = a.x + dx * t;
  const y1 = a.y + dy * t;
  const x2 = b.x - dx * t;
  const y2 = b.y - dy * t;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function build(which: "desktop" | "mobile"): Segment[] {
  const byId = new Map(CONNECTION_NODES.map((n) => [n.id, n]));
  return CONNECTION_EDGES.flatMap(([from, to]) => {
    const a = byId.get(from);
    const b = byId.get(to);
    if (!a || !b) return [];
    return [
      {
        id: `${which}-${from}-${to}`,
        edge: `${from}-${to}`,
        d: segment(a[which], b[which], REFERENCE[which]),
      },
    ];
  });
}

/**
 * non-scaling-stroke mantiene el trazo en 1px real.
 * pathLength={1} hace que el dashoffset sea 1 → 0 sin medir el path.
 */
export default function ConnectionLines() {
  const desktop = build("desktop");
  const mobile = build("mobile");

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.desktopOnly}>
        {desktop.map((s) => (
          <path
            key={s.id}
            d={s.d}
            pathLength={1}
            className={styles.line}
            data-line
            data-edge={s.edge}
          />
        ))}
      </g>
      <g className={styles.mobileOnly}>
        {mobile.map((s) => (
          <path
            key={s.id}
            d={s.d}
            pathLength={1}
            className={styles.line}
            data-line
            data-edge={s.edge}
          />
        ))}
      </g>
    </svg>
  );
}
