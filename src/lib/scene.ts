/**
 * Estado compartido entre escenas.
 *
 * El único motivo por el que este archivo existe: MixSection tiene que
 * ARRANCAR exactamente en el frame en el que Hero TERMINA. Si los valores
 * vivieran duplicados en los dos componentes, cualquier retoque futuro del
 * Hero rompería la costura sin avisar.
 */

/** Transform final de cada masa al terminar la timeline del Hero. */
export const FIELD_DRIFT_END = {
  orange: { xPercent: 9, yPercent: -7, scale: 0.84 },
  blue: { xPercent: -8, yPercent: 9, scale: 0.9 },
  cream: { xPercent: 6, yPercent: -5, scale: 0.72, opacity: 0.55 },
  deep: { yPercent: -8, opacity: 0.85 },
} as const;

/** Escala del símbolo +4 al terminar el Hero. MixSection continúa desde acá. */
export const MARK_SCALE_END = 0.66;

export type SignTone = "orange" | "blue" | "off";

export type EquationTerm = {
  id: string;
  index: string;
  title: string;
  items: string[];
  /**
   * Color del signo + que PRECEDE a este término.
   * null = primer término de la ecuación, no lleva signo.
   * El + es el único elemento gráfico de la escena: conecta la idea de
   * sumar capacidades con el nombre +4.
   */
  sign: SignTone | null;
};

export const EQUATION_TERMS: EquationTerm[] = [
  {
    id: "estrategia",
    index: "01",
    title: "Estrategia",
    sign: null,
    items: ["Desarrollo comercial", "Planificación", "Generación de demanda"],
  },
  {
    id: "identidad",
    index: "02",
    title: "Identidad",
    sign: "orange",
    items: ["Branding", "Diseño", "Fotografía"],
  },
  {
    id: "contenido",
    index: "03",
    title: "Contenido",
    sign: "blue",
    items: ["Social media", "Producción", "Influencers"],
  },
  {
    id: "crecimiento",
    index: "04",
    title: "Crecimiento",
    sign: "off",
    items: ["Pauta", "Mailing", "Web", "Optimización"],
  },
];

/* ---------------------------------------------------------------------------
   COSTURA MEZCLA → TRANSFORMACIÓN

   Mismo motivo que arriba, un escalón más abajo: TransformationSection tiene
   que ARRANCAR en el frame exacto en el que MixSection TERMINA, así que el
   estado final de MEZCLA no puede vivir como literales sueltos dentro de
   MixSection. Vive acá y lo leen las dos escenas.
   --------------------------------------------------------------------------- */

/** Transform de cada masa al terminar la timeline de MEZCLA. */
export const FIELD_DRIFT_MIX_END = {
  orange: { xPercent: 4, yPercent: -3, scale: FIELD_DRIFT_END.orange.scale },
  blue: { xPercent: -4, yPercent: 4, scale: FIELD_DRIFT_END.blue.scale },
  cream: { ...FIELD_DRIFT_END.cream },
  deep: { yPercent: -13, opacity: FIELD_DRIFT_END.deep.opacity },
} as const;

/**
 * Posición y escala del +4 al terminar MEZCLA. El símbolo llega ahí en el 20%
 * de la escena y no se vuelve a tocar: TRANSFORMACIÓN lo recibe idéntico.
 */
export const MARK_MIX_END = {
  desktop: { xPercent: -44, yPercent: -36, scale: 0.185 },
  mobile: { xPercent: -39, yPercent: -36, scale: 0.28 },
} as const;

/** "MEZCLA" convertida en encabezado. rise = fracción de window.innerHeight. */
export const MIX_WORD_END = {
  desktop: { rise: -0.23, shrink: 0.32 },
  mobile: { rise: -0.27, shrink: 0.55 },
} as const;

/** Jerarquía que cede un término cuando entra el siguiente. */
export const MIX_DEMOTE = {
  head: { opacity: 0.55, scale: 0.96 },
  items: { opacity: 0.45 },
} as const;

/* ---------------------------------------------------------------------------
   ESCENA 04 — TRANSFORMACIÓN

   Cuatro piezas editoriales completas. NO son fondos ni recortes: cada archivo
   es una lámina terminada (composición + fotografía + tipografía integrada) y
   se muestra entera, con su ratio 4:5 intacto. Por eso acá no hay
   objectPosition ni crops: lo único que se decide es el orden de apilado.

   El z sale de la composición real de cada JPG, no del gusto:

   1 IDENTIDAD     la más oscura. Va al fondo: se funde con el universo de
                   MEZCLA y sólo pierde su borde derecho.
   2 DISTRIBUCIÓN  su identidad está en el titular verde de arriba y en la
                   gente cruzando del medio; lo que se tapa es el pie.
   3 EQUIPO        las manos están al centro: pierde el borde inferior.
   4 ESTUDIO       el laptop con el +4 está abajo a la izquierda, así que lo
                   que cede es la esquina inferior derecha.
   5 ESTRATEGIA    tipografía sobre degradado azul: tolera perder un borde.
   6 CONTENIDO     el rostro es el sujeto fotográfico más fuerte de las ocho.
                   Sólo cede su margen derecho.
   7 EXPERIENCIA   el magenta es el único acento cálido del collage y es chico:
                   va casi adelante para que su tipografía se lea entera.
   8 DEMANDA       la más luminosa y la que lleva el +4 en pantalla. Adelante
                   del todo: su logo no puede quedar cubierto.
   --------------------------------------------------------------------------- */

export type TransformationTier = "dominant" | "medium" | "satellite";

export type TransformationPiece = {
  id: string;
  /**
   * Jerarquía de la pieza dentro del collage. No es decorativa: define escala,
   * orden de apilado y si lleva label. Dos dominantes, tres medianas, tres
   * satélites — una composición pensada, no ocho imágenes puestas.
   */
  tier: TransformationTier;
  /** Sólo lo llevan las CUATRO categorías del sistema. Las otras cuatro
      sostienen la composición en silencio. */
  label?: string;
  src: string;
  alt: string;
  /** Orden de apilado. 8 = adelante. */
  z: number;
};

export const TRANSFORMATION_PIECES: TransformationPiece[] = [
  {
    id: "contenido",
    tier: "dominant",
    label: "Contenido",
    src: "/transformation/transformation-content.jpg",
    alt: "Pieza de contenido: un rostro atravesado por estelas de luz azul y naranja.",
    z: 6,
  },
  {
    id: "demanda",
    tier: "dominant",
    label: "Demanda",
    src: "/transformation/transformation-demand.jpg",
    alt: "Pieza de demanda: una computadora retro con el logo +4 en pantalla, en medio de un campo florecido.",
    z: 8,
  },
  {
    id: "estudio",
    tier: "medium",
    src: "/transformation/transformation-studio.jpg",
    alt: "Pieza de estudio: un sillón de cuero azul y una notebook con el logo +4 en pantalla.",
    z: 4,
  },
  {
    id: "distribucion",
    tier: "medium",
    label: "Distribución",
    src: "/transformation/transformation-distribution.jpg",
    alt: "Pieza de distribución: personas cruzando una avenida, capturadas en movimiento.",
    z: 2,
  },
  {
    id: "identidad",
    tier: "medium",
    label: "Identidad",
    src: "/transformation/transformation-identity.jpg",
    alt: "Pieza de identidad: una silueta desenfocada recortada contra una superficie de luz.",
    z: 1,
  },
  {
    id: "experiencia",
    tier: "satellite",
    src: "/transformation/transformation-ux.jpg",
    alt: "Pieza de experiencia: una composición tipográfica sobre un degradado magenta.",
    z: 7,
  },
  {
    id: "equipo",
    tier: "satellite",
    src: "/transformation/transformation-team.jpg",
    alt: "Pieza de equipo: manos superpuestas en naranja y azul sobre fondo negro.",
    z: 3,
  },
  {
    id: "estrategia",
    tier: "satellite",
    src: "/transformation/transformation-strategy.jpg",
    alt: "Pieza de estrategia: una composición tipográfica sobre un degradado azul.",
    z: 5,
  },
];

/* ---------------------------------------------------------------------------
   COSTURA TRANSFORMACIÓN → FOCO
   Último eslabón de la cadena: FocusSection tiene que arrancar en el frame
   exacto en el que TransformationSection termina.
   --------------------------------------------------------------------------- */

/** Transform de cada masa al terminar TRANSFORMACIÓN. */
export const FIELD_DRIFT_TF_END = {
  orange: { xPercent: 0, yPercent: 2, scale: FIELD_DRIFT_MIX_END.orange.scale },
  blue: { xPercent: 1, yPercent: 0, scale: FIELD_DRIFT_MIX_END.blue.scale },
  cream: { ...FIELD_DRIFT_MIX_END.cream },
  deep: { yPercent: -4, opacity: FIELD_DRIFT_MIX_END.deep.opacity },
} as const;

/**
 * ESCENA 05 — FOCO. Los cuatro resultados son CUALITATIVOS a propósito: no hay
 * métricas, porcentajes ni casos. No forman una secuencia: se revelan juntos
 * bajo el mismo barrido y se definen juntos.
 */
export const FOCUS_RESULTS = ["Atención", "Demanda", "Oportunidades", "Crecimiento"] as const;
