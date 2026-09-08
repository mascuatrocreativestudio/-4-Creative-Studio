"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { attachPointerParallax } from "@/lib/pointerParallax";
import {
  EQUATION_TERMS,
  FIELD_DRIFT_MIX_END,
  FIELD_DRIFT_TF_END,
  MARK_MIX_END,
  MIX_DEMOTE,
  MIX_WORD_END,
  TRANSFORMATION_PIECES,
} from "@/lib/scene";
import GradientField from "@/components/hero/GradientField";
import BrandMark from "@/components/hero/BrandMark";
import MixEquationTerm from "@/components/mix/MixEquationTerm";
import mixStyles from "@/components/mix/MixSection.module.css";
import TransformationPiece from "./TransformationPiece";
import styles from "./TransformationSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   RITMO — normalizado a 100 sobre 310svh (mobile 280svh).

    0 – 12   RELEVO      la ecuación de MEZCLA se disuelve; "= UN SISTEMA."
                         aguanta hasta el 12 con las primeras láminas ya en
                         cuadro. Sin titular intermedio.
    5 – 27   ACTO 1      entran las CUATRO piezas principales (las dos
                         dominantes y dos medianas). Sólo ellas: el collage
                         todavía no se puede leer completo.
   24 – 45   ACTO 2      esas cuatro se acercan y se relacionan entre sí.
   34 – 62   ACTO 3      recién ahí aparecen las cuatro secundarias, una cada
                         cuatro unidades, y van DIRECTO a su lugar final: no se
                         dispersan, completan. Al 62 están las ocho.
   58 – 66   el cluster toma transform propia y crece: deja de haber ocho
                         piezas y pasa a haber un objeto.
   66 – 79   PERMANENCIA trece unidades sin un solo tween para mirar el
                         sistema ya formado.
   79 – 86   SALIDA      el grupo se comprime y las láminas se retiran POR
                         COMPLETO, cada label junto a su lámina.
   87 – 100  PAYOFF      con la pantalla limpia, trece unidades (≈40svh) para
                         DEL SISTEMA AL RESULTADO. No es un frame de tránsito:
                         es el puente conceptual hacia FOCO.
   -------------------------------------------------------------------------- */

/** Un estado de una lámina. x/y son fracciones del viewport desde su centro. */
type Spot = { x: number; y: number; rot: number; s: number };
type Layout = Record<string, { off: Spot; apart: Spot; collage: Spot }>;

/* --------------------------------------------------------------------------
   COMPOSICIÓN — DESKTOP

   Ocho piezas con tres pesos. No es una grilla: es una constelación con centro.
     dominantes  CONTENIDO (el rostro) y DEMANDA (el verde con el +4).
     medianas    ESTUDIO, DISTRIBUCIÓN, IDENTIDAD — el universo azul.
     satélites   EXPERIENCIA (magenta), ESTRATEGIA (azul) y EQUIPO (las manos).

   Se arma en tres bandas encadenadas, no en tres grupos sueltos:
     banda alta   DISTRIBUCIÓN → EQUIPO → ESTRATEGIA → ESTUDIO, cada una
                  tocando a la siguiente, sin el hueco que quedaba al centro.
     banda media  CONTENIDO → EXPERIENCIA → DEMANDA, el eje del collage.
     banda baja   IDENTIDAD, apoyada bajo CONTENIDO.
   Las tres bandas se solapan verticalmente, así que el conjunto ocupa ~63vw ×
   68svh con las piezas realmente tocándose: el espacio negativo queda en el
   contorno, que es donde tiene que estar, y no adentro. Las rotaciones bajan
   al acercarse pero nunca llegan a cero.
   -------------------------------------------------------------------------- */
const DESKTOP: Layout = {
  contenido: {
    off: { x: -0.8, y: 0.1, rot: -2.8, s: 0.9 },
    apart: { x: -0.194, y: 0.125, rot: -2.2, s: 0.9 },
    collage: { x: -0.111, y: 0.078, rot: -1, s: 1.15 },
  },
  demanda: {
    off: { x: 0.84, y: 0.56, rot: -2.6, s: 0.84 },
    apart: { x: 0.317, y: 0.213, rot: -2.2, s: 0.84 },
    /* entra un poco para cerrar el vacío que quedaba entre su borde izquierdo
       y CONTENIDO, por debajo del magenta. */
    collage: { x: 0.165, y: 0.118, rot: 1, s: 1.08 },
  },
  estudio: {
    off: { x: 0.82, y: -0.34, rot: 2.8, s: 0.67 },
    apart: { x: 0.194, y: -0.285, rot: 2.4, s: 0.67 },
    /* el monitor sube y va a la derecha: descomprime la zona donde se juntaban
       el magenta, el laptop naranja y el borde de la verde. */
    collage: { x: 0.137, y: -0.205, rot: 1.2, s: 0.86 },
  },
  distribucion: {
    off: { x: -0.76, y: -0.52, rot: -3, s: 0.624 },
    apart: { x: -0.401, y: -0.298, rot: -2.4, s: 0.624 },
    collage: { x: -0.215, y: -0.186, rot: -1.6, s: 0.8 },
  },
  identidad: {
    off: { x: -0.82, y: 0.6, rot: 3, s: 0.59 },
    apart: { x: -0.4, y: 0.3, rot: 2.6, s: 0.59 },
    collage: { x: -0.257, y: 0.196, rot: 1.6, s: 0.76 },
  },
  experiencia: {
    off: { x: 0.3, y: 0.86, rot: -2.4, s: 0.47 },
    apart: { x: 0.067, y: 0.125, rot: -2, s: 0.47 },
    /* el magenta baja y se corre a la izquierda: deja de apretarse contra el
       monitor y tapa el hueco que quedaba bajo CONTENIDO. */
    collage: { x: 0.03, y: 0.135, rot: -1.2, s: 0.6 },
  },
  equipo: {
    off: { x: -0.34, y: -0.84, rot: 2.6, s: 0.39 },
    apart: { x: -0.194, y: -0.3, rot: 2.2, s: 0.39 },
    collage: { x: -0.095, y: -0.228, rot: 1.4, s: 0.5 },
  },
  estrategia: {
    off: { x: -0.1, y: -0.88, rot: 2.2, s: 0.42 },
    apart: { x: -0.025, y: -0.3, rot: 1.8, s: 0.42 },
    collage: { x: 0.002, y: -0.222, rot: -1.4, s: 0.54 },
  },
};

/* --------------------------------------------------------------------------
   COMPOSICIÓN — MOBILE

   Mismas ocho piezas y mismos pesos, pero la constelación se verticaliza: en
   390×780 no hay ancho para desplegarlas a los costados, así que el eje pasa a
   ser el alto y los desplazamientos laterales bajan. El solape es mayor que en
   desktop —inevitable con ocho— pero lo que se tapa de cada una es su zona
   secundaria, nunca su sujeto.
   -------------------------------------------------------------------------- */
const MOBILE: Layout = {
  contenido: {
    off: { x: -0.92, y: 0.06, rot: -2.8, s: 0.9 },
    apart: { x: -0.24, y: 0.05, rot: -2.2, s: 0.9 },
    collage: { x: -0.115, y: 0.032, rot: -1.4, s: 1.15 },
  },
  demanda: {
    off: { x: 0.66, y: 0.86, rot: -2.6, s: 0.84 },
    apart: { x: -0.06, y: 0.36, rot: -2.2, s: 0.84 },
    collage: { x: -0.085, y: 0.256, rot: 1.2, s: 1.08 },
  },
  estudio: {
    off: { x: 0.94, y: -0.14, rot: 2.8, s: 0.67 },
    apart: { x: 0.34, y: -0.24, rot: 2.4, s: 0.67 },
    collage: { x: 0.24, y: -0.205, rot: 1.4, s: 0.86 },
  },
  distribucion: {
    off: { x: -0.92, y: -0.5, rot: -3, s: 0.624 },
    apart: { x: -0.34, y: -0.35, rot: -2.4, s: 0.624 },
    collage: { x: -0.231, y: -0.276, rot: -1.8, s: 0.8 },
  },
  identidad: {
    off: { x: 0.94, y: 0.5, rot: 3, s: 0.59 },
    apart: { x: 0.34, y: 0.32, rot: 2.6, s: 0.59 },
    collage: { x: 0.205, y: 0.245, rot: 1.8, s: 0.76 },
  },
  experiencia: {
    off: { x: 0.9, y: 0.2, rot: -2.4, s: 0.47 },
    apart: { x: 0.3, y: -0.02, rot: -2, s: 0.47 },
    collage: { x: 0.165, y: 0.025, rot: -1.6, s: 0.6 },
  },
  equipo: {
    off: { x: 0.38, y: -0.9, rot: 2.6, s: 0.39 },
    apart: { x: 0.06, y: -0.36, rot: 2.2, s: 0.39 },
    collage: { x: -0.013, y: -0.276, rot: 1.6, s: 0.5 },
  },
  estrategia: {
    off: { x: -0.9, y: 0.42, rot: 2.2, s: 0.42 },
    apart: { x: -0.32, y: -0.16, rot: 1.8, s: 0.42 },
    collage: { x: -0.192, y: -0.135, rot: -1.6, s: 0.54 },
  },
};

/**
 * Las láminas entran en DOS olas, no en una.
 *
 * Ola 1 (5–27) — las cuatro principales. Entran a una posición dispersa y
 * recién después se acercan entre sí (24–45): durante el primer tercio de la
 * escena hay cuatro piezas relacionándose, no ocho apiladas.
 *
 * Ola 2 (34–62) — las cuatro secundarias. Van DIRECTO de fuera de cuadro a su
 * lugar en el collage, una cada cuatro unidades: no se dispersan, completan.
 * Por eso la composición se termina de entender recién sobre el 62 y no a los
 * 33 como antes.
 */
const WAVE_ONE = ["distribucion", "contenido", "demanda", "identidad"];

const ENTER_AT: Record<string, number> = {
  distribucion: 5,
  contenido: 8,
  demanda: 11,
  identidad: 14,
  estudio: 34,
  experiencia: 38,
  equipo: 42,
  estrategia: 46,
};

/** Sólo para la ola 1: la ola 2 no tiene paso intermedio. */
const CONNECT_AT: Record<string, number> = {
  distribucion: 24,
  contenido: 26,
  demanda: 28,
  identidad: 30,
};

const ENTER_DUR = 13;
const CONNECT_DUR = 15;
/** La ola 2 hace el viaje entero de una: más lenta para que se lea. */
const ARRIVE_DUR = 16;

/**
 * Escala del grupo. `fusion` es la del collage ya armado: en desktop sube por
 * encima de 1 para que el momento "esto es una sola composición" tenga peso.
 * En mobile se queda en 1 — la constelación ya ocupa casi todo el alto.
 */
const CLUSTER = {
  desktop: { fusion: 1.06, lift: 0.015, close: 0.66 },
  mobile: { fusion: 1, lift: 0, close: 0.66 },
} as const;

/** Separación del label respecto del borde inferior de su lámina. */
const LABEL_GAP = 14;

/** Sólo las dominantes y las medianas llevan label. */
const LABELLED = TRANSFORMATION_PIECES.filter((piece) => piece.label);

export default function TransformationSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stage = root.querySelector<HTMLElement>("[data-transformation-stage]");
    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        always: "(min-width: 0px)",
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 861px)",
      },
      (context) => {
        const { motion, desktop } = context.conditions as {
          always: boolean;
          motion: boolean;
          desktop: boolean;
        };

        /* -------- COSTURA: arrancamos en el último frame de MEZCLA --------
           Mismos valores que MixSection deja al terminar, leídos del mismo
           lugar (scene.ts). El fondo, el +4 y la ecuación entera se redibujan
           acá idénticos: en el frame del relevo los dos stages muestran el
           mismo pixel y el corte es invisible. */
        const markEnd = desktop ? MARK_MIX_END.desktop : MARK_MIX_END.mobile;
        const wordEnd = desktop ? MIX_WORD_END.desktop : MIX_WORD_END.mobile;

        gsap.set("[data-field='focused']", { opacity: 1 });
        gsap.set("[data-field-scale]", { scale: 1 });
        gsap.set("[data-blob='orange']", FIELD_DRIFT_MIX_END.orange);
        gsap.set("[data-blob='blue']", FIELD_DRIFT_MIX_END.blue);
        gsap.set("[data-blob='cream']", FIELD_DRIFT_MIX_END.cream);
        gsap.set("[data-blob='deep']", FIELD_DRIFT_MIX_END.deep);
        gsap.set("[data-tf-scrim]", { opacity: 1 });
        gsap.set("[data-tf-mark]", { xPercent: markEnd.xPercent, yPercent: markEnd.yPercent });
        gsap.set("[data-tf-mark-inner]", { scale: markEnd.scale });
        gsap.set("[data-echo-word]", { opacity: 1, scale: wordEnd.shrink });
        gsap.set("[data-echo-rule]", { scaleX: 1 });
        gsap.set(["[data-echo-equals]", "[data-echo-result]"], { opacity: 1, y: 0 });

        EQUATION_TERMS.forEach((term, i) => {
          const last = i === EQUATION_TERMS.length - 1;
          gsap.set(`[data-term='${term.id}'] [data-term-head]`, {
            y: 0,
            ...(last ? { opacity: 1, scale: 1 } : MIX_DEMOTE.head),
          });
          gsap.set(`[data-term='${term.id}'] [data-term-items]`, {
            y: 0,
            ...(last ? { opacity: 1 } : MIX_DEMOTE.items),
          });
          if (term.sign) gsap.set(`[data-sign='${term.id}']`, { opacity: 1, y: 0 });
        });

        /* --------------- Movimiento reducido: documento plano --------------- */
        if (!motion) {
          if (stage) stage.classList.add(styles.isLive);
          gsap.set("[data-payoff-line]", { opacity: 1, y: 0 });
          return;
        }

        const layout = desktop ? DESKTOP : MOBILE;
        const cluster = desktop ? CLUSTER.desktop : CLUSTER.mobile;

        /* Alto real de la lámina, sin escalar: offsetHeight ignora transforms,
           así que sirve de base para calcular dónde cae el borde inferior a
           cualquier escala. */
        const mediaHeight = (id: string) =>
          root.querySelector<HTMLElement>(`[data-piece-media='${id}']`)?.offsetHeight ?? 0;

        /* El label NO se escala ni rota con la lámina: la sigue. Y como su
           posición es lineal en (x, y, escala), interpolarla con el mismo ease
           que la lámina lo deja pegado al borde inferior en TODOS los frames,
           no sólo en los keyframes. */
        const labelX = (spot: Spot) => () => window.innerWidth * spot.x;
        const labelY = (id: string, spot: Spot) => () =>
          window.innerHeight * spot.y + (mediaHeight(id) / 2) * spot.s + LABEL_GAP;

        TRANSFORMATION_PIECES.forEach((piece) => {
          const off = layout[piece.id].off;
          gsap.set(`[data-piece='${piece.id}']`, {
            x: () => window.innerWidth * off.x,
            y: () => window.innerHeight * off.y,
            rotation: off.rot,
          });
          gsap.set(`[data-piece-media='${piece.id}']`, { scale: off.s });
          if (!piece.label) return;
          gsap.set(`[data-piece-label='${piece.id}']`, {
            xPercent: -50,
            x: labelX(off),
            y: labelY(piece.id, off),
            opacity: 0,
          });
        });

        /* ------------------------- RANGO AUTÓNOMO -------------------------
           Igual que MEZCLA: el recorrido real es la altura de la sección menos
           la del stage, medida en píxeles sobre el DOM. Sin end:"max" — el
           timing no se ata al scroll máximo del documento, así que sumar FOCO
           abajo no mueve un solo frame de esta escena. */
        const stickyDistance = () =>
          Math.max(1, root.offsetHeight - (stage?.offsetHeight ?? window.innerHeight));

        const showStage = (visible: boolean) => {
          stage?.classList.toggle(styles.isLive, visible);
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => "+=" + stickyDistance(),
            scrub: 1,
            invalidateOnRefresh: true,
            onEnter: () => showStage(true),
            onEnterBack: () => showStage(true),
            onLeave: () => showStage(true),
            onLeaveBack: () => showStage(false),
            onRefresh: (self) => showStage(self.progress > 0),
            onUpdate: () => showStage(true),
          },
        });

        /* Estado de partida dentro de la timeline: invalidateOnRefresh lo
           vuelve a evaluar contra el viewport nuevo al hacer resize. */
        tl.set("[data-echo-word]", { y: () => window.innerHeight * wordEnd.rise }, 0);
        TRANSFORMATION_PIECES.forEach((piece) => {
          const off = layout[piece.id].off;
          tl.set(
            `[data-piece='${piece.id}']`,
            {
              x: () => window.innerWidth * off.x,
              y: () => window.innerHeight * off.y,
              rotation: off.rot,
            },
            0,
          );
        });

        /* El fondo sigue derivando: mismo universo, nunca se congela. */
        tl.to("[data-blob='orange']", { ...FIELD_DRIFT_TF_END.orange, duration: 100 }, 0)
          .to("[data-blob='blue']", { ...FIELD_DRIFT_TF_END.blue, duration: 100 }, 0)
          .to("[data-blob='deep']", { ...FIELD_DRIFT_TF_END.deep, duration: 100 }, 0);

        /* ===================== 0–12 · RELEVO DESDE MEZCLA ==================== */
        EQUATION_TERMS.forEach((term, i) => {
          const at = 0.5 + i * 0.7;
          tl.to(
            `[data-term='${term.id}'] [data-term-head]`,
            { opacity: 0, y: -12, duration: 5, ease: "power1.in" },
            at,
          ).to(
            `[data-term='${term.id}'] [data-term-items]`,
            { opacity: 0, y: -8, duration: 4, ease: "power1.in" },
            at,
          );
          if (term.sign) {
            tl.to(`[data-sign='${term.id}']`, { opacity: 0, duration: 4, ease: "power1.in" }, at);
          }
        });

        tl.to("[data-echo-word]", { opacity: 0, duration: 5, ease: "power1.in" }, 0.5)
          .to("[data-echo-rule]", { scaleX: 0, duration: 4, ease: "power2.in" }, 2)
          .to("[data-echo-equals]", { opacity: 0, duration: 4, ease: "power1.in" }, 5)
          .to("[data-echo-result]", { opacity: 0, y: -12, duration: 6, ease: "power1.in" }, 7);

        /* La atmósfera baja apenas mientras las láminas se acercan: son ellas
           las que cambian la temperatura de la escena, no un fondo nuevo. */
        tl.to("[data-atmosphere]", { opacity: 0.78, duration: 16 }, 12)
          .to("[data-tf-scrim]", { opacity: 0.5, duration: 16 }, 12);

        /* === 5–27 OLA 1 · 24–45 SE RELACIONAN · 34–62 OLA 2 COMPLETA === */
        TRANSFORMATION_PIECES.forEach((piece) => {
          const { apart, collage } = layout[piece.id];
          const isWaveOne = WAVE_ONE.includes(piece.id);

          const move = (spot: Spot, at: number, dur: number, ease: string) => {
            tl.to(
              `[data-piece='${piece.id}']`,
              {
                x: () => window.innerWidth * spot.x,
                y: () => window.innerHeight * spot.y,
                rotation: spot.rot,
                duration: dur,
                ease,
              },
              at,
            ).to(`[data-piece-media='${piece.id}']`, { scale: spot.s, duration: dur, ease }, at);

            if (!piece.label) return;
            tl.to(
              `[data-piece-label='${piece.id}']`,
              { x: labelX(spot), y: labelY(piece.id, spot), duration: dur, ease },
              at,
            );
          };

          /* power3.out en la entrada: llegan rápido y frenan solas. Es la
             diferencia entre "se atraen" y "aparecen con una animación". */
          if (isWaveOne) {
            move(apart, ENTER_AT[piece.id], ENTER_DUR, "power3.out");
            move(collage, CONNECT_AT[piece.id], CONNECT_DUR, "power2.inOut");
          } else {
            move(collage, ENTER_AT[piece.id], ARRIVE_DUR, "power3.out");
          }

          if (!piece.label) return;
          tl.to(
            `[data-piece-label='${piece.id}']`,
            { opacity: 1, duration: 6, ease: "power2.out" },
            ENTER_AT[piece.id] + 6,
          );
        });

        /* ================= 58–66 · EL GRUPO SE VUELVE UNO =================== */
        tl.to(
          ["[data-cluster]", "[data-labels]"],
          {
            scale: cluster.fusion,
            y: () => window.innerHeight * cluster.lift,
            duration: 8,
            ease: "power2.inOut",
          },
          58,
        );

        /* ================== 66–79 · PERMANENCIA DEL COLLAGE =================
           Trece unidades sin un solo tween. Ni el cluster, ni los labels, ni
           las láminas, ni el payoff. Sigue atado al scroll —no es una pausa
           rígida— pero no hay nada que mirar salvo el sistema ya formado. */

        /* ==================== 79–86 · SALIDA DEL COLLAGE ==================== */
        /* El grupo se va ENTERO antes de que entre el payoff: la última lámina
           termina de apagarse en 85,7 y el titular recién arranca en 87. */
        tl.to(
          ["[data-cluster]", "[data-labels]"],
          { scale: cluster.close, y: 0, duration: 8, ease: "power2.inOut" },
          79,
        );

        /* Cada label se apaga en el MISMO tween que su lámina: mismo instante,
           misma duración, mismo ease. Antes eran dos tweens independientes y en
           el tramo final quedaban labels flotando sobre láminas ya invisibles
           —y al subir pasaba lo mismo al revés. */
        TRANSFORMATION_PIECES.forEach((piece, i) => {
          const at = 79 + i * 0.4;
          const out = { opacity: 0, duration: 3.5, ease: "power2.in" };
          tl.to(`[data-piece='${piece.id}']`, out, at);
          if (piece.label) tl.to(`[data-piece-label='${piece.id}']`, out, at);
        });

        tl.to("[data-atmosphere]", { opacity: 1, duration: 9 }, 80)
          .to("[data-tf-scrim]", { opacity: 1, duration: 9 }, 80);

        /* ======================= 87–100 · EL PAYOFF ========================= */
        /* Trece unidades para él solo: entra con la pantalla ya limpia, sube
           más lento (7 en vez de 5) y se queda quieto desde 95. Es el puente
           conceptual hacia FOCO, no un frame de tránsito. */
        tl.to("[data-payoff-line='1']", { opacity: 1, y: 0, duration: 6, ease: "power3.out" }, 87)
          .to("[data-payoff-line='2']", { opacity: 1, y: 0, duration: 6, ease: "power3.out" }, 88);

        /* 95–100: nada se mueve. La timeline tiene que durar 100 igual, si no
           ScrollTrigger reparte el scrub sobre 95 y se come la permanencia. */
        const tail = { hold: 0 };
        tl.to(tail, { hold: 1, duration: 6, ease: "none" }, 94);

        if (!desktop) return;
        return attachPointerParallax(root);
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={styles.transformation}
      data-reduced={reducedMotion ? "true" : undefined}
      aria-labelledby="transformation-title"
    >
      <div className={styles.stage} data-transformation-stage>
        {/* Mismo universo que MEZCLA. Ningún fondo nuevo. */}
        <div className={styles.atmosphere} data-atmosphere aria-hidden="true">
          <GradientField mode="focused" />
        </div>

        <div className={styles.backdrop} aria-hidden="true">
          <div className={mixStyles.grain} />
          <div className={mixStyles.scrim} />
          <div className={mixStyles.focusScrim} />
          <div className={mixStyles.textScrim} data-tf-scrim />
        </div>

        {/* ECO — el último frame de MEZCLA, redibujado con sus propias clases
            para que el relevo sea pixel a pixel. Se disuelve durante el 12%
            inicial mientras entran las primeras láminas. */}
        <div className={styles.echo} data-echo aria-hidden="true">
          <p className={mixStyles.word} data-echo-word>
            Mezcla
          </p>

          <div className={mixStyles.equation}>
            {EQUATION_TERMS.map((term, index) => (
              <MixEquationTerm key={term.id} term={term} order={index} />
            ))}

            <div className={mixStyles.resultRow}>
              <div className={mixStyles.resultRule} data-echo-rule />
              <p className={mixStyles.result}>
                <span className={mixStyles.equals} data-echo-equals>
                  =
                </span>
                <span className={mixStyles.resultText} data-echo-result>
                  Un sistema que funciona.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Las ocho láminas. */}
        <div className={styles.cluster} data-cluster>
          {TRANSFORMATION_PIECES.map((piece) => (
            <TransformationPiece key={piece.id} piece={piece} />
          ))}
        </div>

        {/* Los labels, encima de las ocho. Sólo los llevan las dominantes y las
            medianas: los satélites callan, y ese silencio es parte de la
            jerarquía. aria-hidden porque el alt de cada lámina ya la nombra. */}
        <div className={styles.labels} data-labels aria-hidden="true">
          {LABELLED.map((piece) => (
            <p key={piece.id} className={styles.pieceLabel} data-piece-label={piece.id}>
              [{piece.label}]
            </p>
          ))}
        </div>

        {/* El +4 continúa desde MEZCLA en la misma posición y escala, y no se
            vuelve a tocar: es la firma de marca durante toda la escena y queda
            en el frame final junto al payoff. */}
        <div className={mixStyles.markWrap} data-tf-mark>
          <div className={mixStyles.markInner} data-tf-mark-inner>
            <BrandMark variant="mark" alt="" />
          </div>
        </div>

        <h2 className={styles.payoff} id="transformation-title">
          <span data-payoff-line="1">Del sistema</span>
          <span data-payoff-line="2">al resultado.</span>
        </h2>
      </div>
    </section>
  );
}
