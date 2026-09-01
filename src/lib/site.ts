/**
 * Configuración central de la marca.
 * Todo lo editable (contacto, navegación, nodos) vive acá.
 */

/** Cambiar el número de WhatsApp SOLO acá. Formato internacional sin +, sin espacios. */
export const WHATSAPP_NUMBER = "549XXXXXXXXXX";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const INSTAGRAM_URL = "https://www.instagram.com/mascuatro.studio/";

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "MÉTODO", href: "#metodo" },
  { label: "SERVICIOS", href: "#servicios" },
  { label: "INSTAGRAM", href: INSTAGRAM_URL, external: true },
];

export const CTA_LINK: NavLink = {
  label: "CONTACTANOS ↗",
  href: WHATSAPP_URL,
  external: true,
};

export type NodePoint = { x: number; y: number };

export type ConnectionNodeData = {
  id: string;
  label: string;
  /**
   * Orden narrativo de aparición (0 = primero). No es decorativo:
   * describe la progresión comercial marca → audiencia → contenido →
   * pauta → datos → negocio → ventas.
   */
  step: number;
  /** Posición en % del viewport (desktop). */
  desktop: NodePoint;
  /** Posición en % del viewport (mobile / ≤860px). */
  mobile: NodePoint;
  /** Desplazamiento inicial en px antes de entrar en foco. */
  drift: NodePoint;
};

/**
 * Los nodos NO son una lista: son posiciones en el espacio.
 * La posición en el array es espacial; `step` es el tiempo narrativo.
 */
export const CONNECTION_NODES: ConnectionNodeData[] = [
  { id: "marca",     label: "MARCA",     step: 0, desktop: { x: 22, y: 24 }, mobile: { x: 20, y: 16 }, drift: { x: -14, y: 10 } },
  { id: "audiencia", label: "AUDIENCIA", step: 1, desktop: { x: 47, y: 14 }, mobile: { x: 72, y: 12 }, drift: { x: 8, y: -12 } },
  { id: "contenido", label: "CONTENIDO", step: 2, desktop: { x: 74, y: 22 }, mobile: { x: 78, y: 27 }, drift: { x: 16, y: 8 } },
  { id: "pauta",     label: "PAUTA",     step: 3, desktop: { x: 13, y: 52 }, mobile: { x: 14, y: 44 }, drift: { x: -16, y: -6 } },
  { id: "datos",     label: "DATOS",     step: 4, desktop: { x: 86, y: 47 }, mobile: { x: 82, y: 55 }, drift: { x: 14, y: -8 } },
  { id: "negocio",   label: "NEGOCIO",   step: 5, desktop: { x: 69, y: 68 }, mobile: { x: 24, y: 64 }, drift: { x: 10, y: 14 } },
  { id: "ventas",    label: "VENTAS",    step: 6, desktop: { x: 31, y: 71 }, mobile: { x: 60, y: 80 }, drift: { x: -10, y: 16 } },
];

/** step por id, para calcular cuándo cada arista tiene ambos extremos legibles. */
export const NODE_STEP_BY_ID: Record<string, number> = Object.fromEntries(
  CONNECTION_NODES.map((node) => [node.id, node.step]),
);

/** Red intencionalmente incompleta: no todos con todos. */
export const CONNECTION_EDGES: Array<[string, string]> = [
  ["marca", "audiencia"],
  ["audiencia", "contenido"],
  ["contenido", "datos"],
  ["datos", "negocio"],
  ["negocio", "ventas"],
  ["ventas", "pauta"],
  ["pauta", "marca"],
  ["contenido", "negocio"],
];
