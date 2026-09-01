"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { attachPointerParallax } from "@/lib/pointerParallax";
import { CONNECTION_NODES } from "@/lib/site";
import {
  EQUATION_TERMS,
  FIELD_DRIFT_END,
  FIELD_DRIFT_MIX_END,
  MARK_MIX_END,
  MARK_SCALE_END,
  MIX_DEMOTE,
  MIX_WORD_END,
} from "@/lib/scene";
import GradientField from "@/components/hero/GradientField";
import ConnectionNode from "@/components/hero/ConnectionNode";
import ConnectionLines from "@/components/hero/ConnectionLines";
import BrandMark from "@/components/hero/BrandMark";
import MixEquationTerm from "./MixEquationTerm";
import styles from "./MixSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   RITMO — normalizado a 100 sobre 220svh de recorrido.

    0 – 22   TRANSICIÓN    CONEXIÓN se apaga LENTO y el +4 viaja
   10 – 24   MEZCLA nace SOLAPADA con la salida de CONEXIÓN (nunca hay un
             frame con las dos en cero)
   24 – 32   MEZCLA        statement, con respiración
   32 – 44   ESTRATEGIA    protagonismo exclusivo
   44 – 49   +             puente naranja (entra SOLO)
   49 – 61   IDENTIDAD
   61 – 66   +             puente azul
   66 – 78   CONTENIDO
   78 – 83   +             puente off-white
   83 – 90   CRECIMIENTO
   90 – 94   = UN SISTEMA.
   94 – 100  PERMANENCIA   nada se mueve; la ecuación completa se lee entera
   -------------------------------------------------------------------------- */

/** Momento de entrada de cada término: [head, items, signo previo, degradación]. */
const TERM_TIMING = [
  { sign: null, head: 34, items: 36, demote: 51 },
  { sign: 44, head: 51, items: 53, demote: 68 },
  { sign: 61, head: 68, items: 70, demote: 85 },
  { sign: 78, head: 85, items: 86, demote: null },
] as const;

/**
 * La palabra MEZCLA entra acá. Es el primer frame en el que la escena se
 * reconoce —antes sólo se está apagando CONEXIÓN—, así que el Header aterriza
 * justo cuando termina de formarse y no en el solape anterior.
 */
const WORD_AT = 10;
const WORD_DURATION = 14;

/** Progreso del timeline en el que MEZCLA ya está en pantalla. Lo lee el Header. */
export const MIX_VISIBLE_PROGRESS = (WORD_AT + WORD_DURATION) / 100;

/** Los nodos se apagan en orden inverso al que se construyeron en CONEXIÓN. */
const FADE_ORDER = [...CONNECTION_NODES].reverse();

export default function MixSection() {
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

    const stage = root.querySelector<HTMLElement>("[data-mix-stage]");
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

        /* ---------- COSTURA: arrancamos en el último frame de CONEXIÓN ---------- */
        gsap.set("[data-field='focused']", { opacity: 1 });
        gsap.set("[data-field-scale]", { scale: 1 });
        gsap.set("[data-blob='orange']", FIELD_DRIFT_END.orange);
        gsap.set("[data-blob='blue']", FIELD_DRIFT_END.blue);
        gsap.set("[data-blob='cream']", FIELD_DRIFT_END.cream);
        gsap.set("[data-blob='deep']", FIELD_DRIFT_END.deep);
        gsap.set("[data-node]", { opacity: 1, filter: "blur(0px)", x: 0, y: 0 });
        gsap.set("[data-line]", { strokeDashoffset: 0 });
        gsap.set("[data-mix-mark-inner]", { scale: MARK_SCALE_END });

        /* Trayectoria del +4: UN solo movimiento, del centro a la esquina
           superior izquierda, y ahí se queda fijo el resto de la escena.
           Su opacity NUNCA se anima: era la vía por la que se apagaba. */
        const markEnd = desktop ? MARK_MIX_END.desktop : MARK_MIX_END.mobile;
        const markX = markEnd.xPercent;
        const markY = markEnd.yPercent;
        const markScale = markEnd.scale;

        /* La palabra pasa de titular a encabezado: sube y achica hasta la
           misma escala que los títulos de los términos, debajo del +4. */
        const wordEnd = desktop ? MIX_WORD_END.desktop : MIX_WORD_END.mobile;
        const wordRise = wordEnd.rise;
        const wordShrink = wordEnd.shrink;

        /* ---------------- Movimiento reducido: composición final --------------- */
        if (!motion) {
          if (stage) gsap.set(stage, { visibility: "visible" });
          gsap.set(["[data-network]", "[data-inherited]"], { autoAlpha: 0 });
          gsap.set("[data-text-scrim]", { opacity: 1 });
          gsap.set("[data-mix-mark]", { xPercent: markX, yPercent: markY });
          gsap.set("[data-mix-mark-inner]", { scale: markScale });
          gsap.set("[data-word]", { opacity: 1, scale: 1, y: 0 });
          gsap.set("[data-claim]", { opacity: 1, y: 0 });
          gsap.set("[data-term-head]", { opacity: 1, y: 0 });
          gsap.set("[data-term-items]", { opacity: 1, y: 0 });
          gsap.set("[data-sign]", { opacity: 1, y: 0 });
          gsap.set("[data-result-rule]", { scaleX: 1 });
          gsap.set(["[data-equals]", "[data-result]"], { opacity: 1, y: 0 });
          return;
        }

        /* ------------------------- RANGO AUTÓNOMO -------------------------
           El stage es sticky dentro de .mix, así que el recorrido real en el
           que permanece pegado es exactamente:

               altura de la sección − altura del stage

           Medido en píxeles reales sobre el DOM, no en svh declarados: eso
           resuelve solo la discrepancia svh/vh de la barra de URL en mobile.
           Y no depende del documento: agregar TRANSFORMACIÓN debajo no cambia
           ni un frame del timing de MEZCLA. */
        const stickyDistance = () =>
          Math.max(1, root.offsetHeight - (stage?.offsetHeight ?? window.innerHeight));

        /* Un ÚNICO ScrollTrigger controla timeline y visibilidad del stage.
           La regla clave: al pasar el final NO se oculta (onLeave lo mantiene
           visible). Solo se oculta al volver por encima del inicio, que es
           cuando el Hero recupera la pantalla. */
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
            /* Red de seguridad: onUpdate corre en cada tick mientras el trigger
               está activo, así que aunque se perdiera un onEnter el stage se
               corrige en el frame siguiente en vez de quedar oculto. */
            onUpdate: () => showStage(true),
          },
        });

        /* ================== 0–20 · TRANSICIÓN DESDE CONEXIÓN ================== */
        /* El fondo NO cambia. Sigue derivando lento, mismo universo. */
        tl.to("[data-blob='orange']", { ...FIELD_DRIFT_MIX_END.orange, duration: 100 }, 0)
          .to("[data-blob='blue']", { ...FIELD_DRIFT_MIX_END.blue, duration: 100 }, 0)
          .to("[data-blob='deep']", { ...FIELD_DRIFT_MIX_END.deep, duration: 100 }, 0);

        /* 1 · las líneas pierden opacity — más lento que antes: CONEXIÓN tiene
           que seguir en pantalla cuando MEZCLA empieza a nacer. */
        tl.to("[data-lines-layer]", { opacity: 0, duration: 13, ease: "power1.in" }, 1);

        /* 2 · los nodos se apagan de a uno, con stagger largo (1.4). El último
           recién termina en 21,4: hay presencia de CONEXIÓN durante todo el
           tramo en que MEZCLA está subiendo. */
        FADE_ORDER.forEach((node, i) => {
          tl.to(
            `[data-node='${node.id}']`,
            { opacity: 0, filter: "blur(6px)", duration: 9, ease: "power1.in" },
            4 + i * 1.4,
          );
        });

        tl.to("[data-network]", { scale: 0.88, duration: 22, ease: "power1.inOut" }, 0)
          .to("[data-inherited]", { opacity: 0, y: -16, duration: 10, ease: "power1.in" }, 2);

        /* 3 · el +4 sobrevive a los nodos. Un único viaje al ángulo superior
           izquierdo, terminado antes de que MEZCLA aparezca, y después queda
           fijo: no vuelve a moverse ni a cambiar de opacity en toda la escena. */
        tl.to("[data-mix-mark]", { xPercent: markX, yPercent: markY, duration: 19, ease: "power2.inOut" }, 1)
          .to("[data-mix-mark-inner]", { scale: markScale, duration: 19, ease: "power2.inOut" }, 1);

        /* Capa oscura muy sutil detrás del texto. Gradiente, no caja. */
        tl.to("[data-text-scrim]", { opacity: 1, duration: 18 }, 6);

        /* ======================= 20–42 · MEZCLA LEGIBLE ======================= */
        /* Sin clip-path: ninguna letra se corta en la primera aparición. */
        tl.fromTo(
          "[data-word]",
          { opacity: 0, y: 26, scale: 1.04 },
          { opacity: 1, y: 0, scale: 1, duration: WORD_DURATION, ease: "power3.out" },
          WORD_AT,
        );

        tl.to("[data-claim='1']", { opacity: 0.86, y: 0, duration: 6 }, 23)
          .to("[data-claim='2']", { opacity: 1, y: 0, duration: 6 }, 26);

        /* ==================== 44–88 · CONSTRUCCIÓN DE LA ECUACIÓN ============= */
        /* La palabra se retira arriba y se achica: pasa a ser encabezado.
           El +4 la acompaña hacia la esquina y baja su opacity, sin irse. */
        tl.to(
          "[data-word]",
          {
            y: () => window.innerHeight * wordRise,
            scale: wordShrink,
            duration: 9,
            ease: "power2.inOut",
          },
          32,
        );

        tl.to("[data-claim='1']", { opacity: 0, y: -10, duration: 5 }, 32)
          .to("[data-claim='2']", { opacity: 0, y: -10, duration: 5 }, 33);

        EQUATION_TERMS.forEach((term, i) => {
          const t = TERM_TIMING[i];

          if (t.sign !== null) {
            /* El signo entra SOLO, antes que su disciplina: es el puente. */
            tl.to(
              `[data-sign='${term.id}']`,
              { opacity: 1, y: 0, duration: 4, ease: "power2.out" },
              t.sign,
            );
          }

          tl.to(
            `[data-term='${term.id}'] [data-term-head]`,
            { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
            t.head,
          ).to(
            `[data-term='${term.id}'] [data-term-items]`,
            { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
            t.items,
          );

          /* El término anterior cede jerarquía cuando entra el siguiente:
             baja opacity y apenas cede escala (0.96, origen izquierdo) para que
             se lea como "pasó a formar parte de la suma", no como que se apagó.
             Sigue perfectamente legible. */
          if (t.demote !== null) {
            tl.to(
              `[data-term='${term.id}'] [data-term-head]`,
              { ...MIX_DEMOTE.head, duration: 5, ease: "power1.inOut" },
              t.demote,
            ).to(
              `[data-term='${term.id}'] [data-term-items]`,
              { ...MIX_DEMOTE.items, duration: 5, ease: "power1.inOut" },
              t.demote,
            );
          }
        });

        /* ========================= 88–100 · RESULTADO ========================= */
        /* Todo el movimiento termina en 94. Quedan 6 unidades (~22svh) en las
           que NADA se mueve: la ecuación completa, con "= UN SISTEMA.", es el
           último frame visible de la sección. No hay tramo vacío después. */
        tl.to("[data-result-rule]", { scaleX: 1, duration: 4, ease: "power2.out" }, 88)
          .to("[data-equals]", { opacity: 1, y: 0, duration: 3, ease: "power2.out" }, 90)
          .to("[data-result]", { opacity: 1, y: 0, duration: 4, ease: "power2.out" }, 90);

        /* La timeline tiene que durar 100 aunque el último keyframe visual caiga
           en 94, si no ScrollTrigger reparte el scrub sobre 94 y se come la
           permanencia final. Un tween sobre un objeto suelto es la forma
           determinista de fijar la duración (un .set vacío no siempre la
           extiende). De 94 a 100 no se mueve nada: la ecuación completa queda
           quieta hasta el último pixel del recorrido de MixSection. */
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
      className={styles.mix}
      data-reduced={reducedMotion ? "true" : undefined}
      aria-labelledby="mix-title"
    >
      <div className={styles.stage} data-mix-stage>
        {/* Mismo universo que CONEXIÓN. Ningún fondo nuevo. */}
        <GradientField mode="focused" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.focusScrim} aria-hidden="true" />
        <div className={styles.textScrim} data-text-scrim aria-hidden="true" />

        {/* Red heredada: se apaga, no se corta */}
        <div className={styles.network} data-network aria-hidden="true">
          <div className={styles.lines} data-lines-layer>
            <ConnectionLines />
          </div>
          <div className={styles.nodes}>
            {CONNECTION_NODES.map((node) => (
              <ConnectionNode key={node.id} node={node} />
            ))}
          </div>
        </div>

        <p className={styles.inherited} data-inherited aria-hidden="true">
          <span className={styles.inheritedA}>Crecer no es hacer más cosas.</span>
          <span className={styles.inheritedB}>Es hacer que todo trabaje junto.</span>
        </p>

        {/* Ancla: reduce escala y opacity, nunca desaparece */}
        <div className={styles.markWrap} data-mix-mark>
          <div className={styles.markInner} data-mix-mark-inner>
            <BrandMark variant="mark" alt="" />
          </div>
        </div>

        {/* Primer frame de MEZCLA */}
        <h2 className={styles.word} data-word id="mix-title">
          Mezcla
        </h2>

        <p className={styles.claimA} data-claim="1">
          No trabajamos áreas aisladas.
        </p>
        <p className={styles.claimB} data-claim="2">
          Diseñamos un sistema.
        </p>

        {/* La ecuación */}
        <div className={styles.equation}>
          {EQUATION_TERMS.map((term, index) => (
            <MixEquationTerm key={term.id} term={term} order={index} />
          ))}

          <div className={styles.resultRow}>
            <div className={styles.resultRule} data-result-rule aria-hidden="true" />
            <p className={styles.result}>
              <span className={styles.equals} data-equals aria-hidden="true">
                =
              </span>
              <span className={styles.resultText} data-result>
                Un sistema.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
