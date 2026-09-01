"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import {
  FIELD_DRIFT_TF_END,
  FOCUS_RESULTS,
  MARK_MIX_END,
} from "@/lib/scene";
import GradientField from "@/components/hero/GradientField";
import BrandMark from "@/components/hero/BrandMark";
import mixStyles from "@/components/mix/MixSection.module.css";
import tfStyles from "@/components/transformation/TransformationSection.module.css";
import styles from "./FocusSection.module.css";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   RITMO — normalizado a 100 sobre 155svh (mobile 150svh). Sigue siendo la
   escena más corta, pero ahora el gesto se puede mirar.

    0 – 26   RELEVO      "DEL SISTEMA AL RESULTADO." sigue en pantalla y se
                         comprime en vertical hasta quedar reducida a una barra.
   16 – 28   la línea toma esa barra y se extiende a lo ancho del viewport.
   26 – 38   la luz se abre HACIA ARRIBA desde la línea, y la línea vira de
                         off-white a ink para no perder contraste al cambiar de
                         fondo. No es un fade: es un borde que se mueve.
   36 – 76   BARRIDO     un solo gesto descendente, cuarenta unidades: sobre
                         155svh son ~62svh de recorrido, el doble que antes.
                         Encima de la línea el mundo ya es claro; debajo sigue
                         el universo oscuro.
   76 – 87   las cuatro palabras pasan de gris suave a ink, LAS CUATRO JUNTAS.
   87 – 93   entra + RESULTADOS., dentro de la misma composición.
   93 – 100  PERMANENCIA: siete unidades limpias (≈11svh contra las 7,7 de
                         antes) para leer el payoff antes de que el stage se
                         despegue y el CTA entre por abajo. Sale de redistribuir
                         la timeline, no de sumar altura.
   -------------------------------------------------------------------------- */

/** Altura (fracción del stage) donde nace la línea: el centro de la frase. */
const LINE_START = { desktop: 0.45, mobile: 0.35 };

/** Progreso de scroll a partir del cual el Header pasa a su estado claro. */
const SURFACE_AT = 0.5;

export default function FocusSection() {
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

    const stage = root.querySelector<HTMLElement>("[data-focus-stage]");
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

        /* El Header ya trae los tokens del estado claro y sus transiciones
           (globals.css + Header.module.css). Lo único que faltaba era que
           alguien encendiera el interruptor: lo enciende el barrido. */
        const setSurface = (light: boolean) => {
          if (light) document.documentElement.dataset.surface = "light";
          else delete document.documentElement.dataset.surface;
        };

        /* -------- COSTURA: arrancamos en el último frame de TRANSFORMACIÓN ----
           Mismos valores, leídos del mismo lugar (scene.ts). El fondo, el +4 y
           la frase se redibujan acá idénticos: en el frame del relevo los dos
           stages muestran el mismo pixel. */
        const markEnd = desktop ? MARK_MIX_END.desktop : MARK_MIX_END.mobile;

        gsap.set("[data-field='focused']", { opacity: 1 });
        gsap.set("[data-field-scale]", { scale: 1 });
        gsap.set("[data-blob='orange']", FIELD_DRIFT_TF_END.orange);
        gsap.set("[data-blob='blue']", FIELD_DRIFT_TF_END.blue);
        gsap.set("[data-blob='cream']", FIELD_DRIFT_TF_END.cream);
        gsap.set("[data-blob='deep']", FIELD_DRIFT_TF_END.deep);
        gsap.set("[data-focus-scrim]", { opacity: 1 });
        gsap.set("[data-focus-mark]", { xPercent: markEnd.xPercent, yPercent: markEnd.yPercent });
        gsap.set("[data-focus-mark-inner]", { scale: markEnd.scale });
        gsap.set("[data-echo-line]", { opacity: 1, y: 0 });

        /* --------------- Movimiento reducido: documento plano --------------- */
        if (!motion) {
          if (stage) stage.classList.add(styles.isLive);
          setSurface(true);
          gsap.set("[data-focus-line]", { opacity: 1, y: 0 });
          return;
        }

        const lineStart = desktop ? LINE_START.desktop : LINE_START.mobile;

        const lightEl = root.querySelector<HTMLElement>("[data-focus-light]");
        const lineEl = root.querySelector<HTMLElement>("[data-focus-line]");

        /* ------------------------- EL MOTOR DEL REVEAL ----------------------
           Un solo objeto y una sola función escriben el recorte de la capa
           clara Y la posición de la línea. Por eso el filo del reveal y la
           línea no pueden desalinearse: son el mismo número en el mismo frame.
             top    borde superior del recorte (se abre hacia arriba)
             bottom borde inferior — ES la línea
             grow   cuánto de ancho tiene la línea (0 → 1) */
        const sweep = { top: lineStart, bottom: lineStart, grow: 0 };

        const applySweep = () => {
          if (!lightEl || !lineEl || !stage) return;
          lightEl.style.clipPath =
            `inset(${sweep.top * 100}% 0 ${(1 - sweep.bottom) * 100}% 0)`;
          const y = sweep.bottom * stage.offsetHeight - 1.5;
          lineEl.style.transform = `translate3d(0, ${y}px, 0) scaleX(${sweep.grow})`;
        };
        applySweep();

        /* ------------------------- RANGO AUTÓNOMO -------------------------
           Igual que las tres anteriores: el recorrido real es la altura de la
           sección menos la del stage, en píxeles sobre el DOM. Sin end:"max",
           así que montar el CTA debajo no mueve un solo frame. */
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
            onLeave: () => {
              showStage(true);
              setSurface(true);
            },
            onLeaveBack: () => {
              showStage(false);
              setSurface(false);
            },
            onRefresh: (self) => {
              showStage(self.progress > 0);
              setSurface(self.progress > SURFACE_AT);
            },
            onUpdate: (self) => {
              showStage(true);
              setSurface(self.progress > SURFACE_AT);
            },
          },
        });

        /* El fondo sigue derivando hasta que la luz lo tapa. */
        tl.to("[data-blob='orange']", { yPercent: 5, duration: 70 }, 0)
          .to("[data-blob='deep']", { yPercent: 0, duration: 70 }, 0);

        /* ============== 0–19 · LA FRASE SE CONVIERTE EN UNA LÍNEA ============ */
        /* Sin morph de SVG: la frase se aplasta en vertical sobre su propio
           centro hasta quedar reducida a una barra, y la línea —un elemento
           aparte— toma esa barra y la extiende. La ilusión la hace la
           coordinación, no un path. */
        tl.to(
          "[data-echo-payoff]",
          { scaleY: 0.06, duration: 16, ease: "power2.inOut" },
          8,
        ).to("[data-echo-payoff]", { opacity: 0, duration: 8, ease: "power1.in" }, 18);

        tl.to(sweep, { grow: 1, duration: 12, ease: "power2.out", onUpdate: applySweep }, 16);

        /* ================== 20–30 · LA LUZ SE ABRE DESDE LA LÍNEA ============ */
        tl.to(sweep, { top: 0, duration: 12, ease: "power2.out", onUpdate: applySweep }, 26);

        /* La línea vira de off-white a ink: mantiene contraste durante todo el
           cambio de universo, y termina siendo una regla ink sobre cream. */
        tl.to("[data-focus-line]", { backgroundColor: "#090b10", duration: 10 }, 28);

        /* El +4 no cambia de SVG: pasa de blanco a ink con brightness, que en un
           logo monocromo blanco es exacto y no invierte tonos. */
        tl.to("[data-focus-mark-inner]", { filter: "brightness(0)", duration: 10 }, 30);

        /* ========================= 28–68 · EL BARRIDO ======================= */
        /* Un solo gesto. No rebota, no vuelve, no hay un segundo barrido. */
        tl.to(sweep, { bottom: 1, duration: 40, ease: "power1.inOut", onUpdate: applySweep }, 36);

        tl.to("[data-focus-line]", { opacity: 0, duration: 6, ease: "power1.in" }, 74);

        /* Con la pantalla ya cubierta, el universo oscuro deja de pintarse. */
        tl.to("[data-focus-dark]", { autoAlpha: 0, duration: 2 }, 76);

        /* ==================== 70–79 · TODO QUEDA DEFINIDO =================== */
        /* Las cuatro, juntas, en el mismo tween. No hay stagger: no es una
           secuencia de cuatro etapas, es una composición que se resuelve. */
        tl.to("[data-result]", { opacity: 1, duration: 11, ease: "power2.out" }, 76)
          .to("[data-statement]", { opacity: 0.52, duration: 11, ease: "power2.out" }, 76);

        /* ======================= 84–91 · + RESULTADOS. ====================== */
        tl.to(
          "[data-focus-payoff] span",
          { opacity: 1, y: 0, duration: 6, ease: "power3.out" },
          87,
        );

        /* 91–100: nada se mueve. La timeline tiene que durar 100 igual, si no
           ScrollTrigger reparte el scrub sobre 91. */
        const tail = { hold: 0 };
        tl.to(tail, { hold: 1, duration: 7, ease: "none" }, 93);

        return () => setSurface(false);
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={styles.focus}
      data-reduced={reducedMotion ? "true" : undefined}
      aria-labelledby="focus-title"
    >
      <div className={styles.stage} data-focus-stage>
        {/* El último frame de TRANSFORMACIÓN, redibujado con sus propias clases.
            No se desvanece: la capa clara lo tapa físicamente. */}
        <div className={styles.dark} data-focus-dark aria-hidden="true">
          <div className={tfStyles.atmosphere}>
            <GradientField mode="focused" />
          </div>

          <div className={tfStyles.backdrop}>
            <div className={mixStyles.grain} />
            <div className={mixStyles.scrim} />
            <div className={mixStyles.focusScrim} />
            <div className={mixStyles.textScrim} data-focus-scrim />
          </div>

          <p className={tfStyles.payoff} data-echo-payoff>
            <span data-echo-line="1">Del sistema</span>
            <span data-echo-line="2">al resultado.</span>
          </p>
        </div>

        {/* El mundo claro. Existe entero desde el primer frame; lo que cambia es
            cuánto de él deja ver el recorte. */}
        <div className={styles.light} data-focus-light>
          <p className={styles.statement} data-statement>
            <span>No medimos lo que hacemos.</span>
            <span>Miramos lo que mueve.</span>
          </p>

          <ul className={styles.results}>
            {FOCUS_RESULTS.map((result) => (
              <li key={result} className={styles.result} data-result>
                {result}
              </li>
            ))}
          </ul>

          <h2 className={styles.payoff} id="focus-title" data-focus-payoff>
            <span>
              <i className={styles.plus} aria-hidden="true">
                +
              </i>
              Resultados.
            </span>
          </h2>
        </div>

        <div className={styles.line} data-focus-line aria-hidden="true" />

        {/* El +4 continúa desde TRANSFORMACIÓN en la misma posición y escala.
            Sólo cambia de color cuando el fondo debajo ya es claro. */}
        <div className={mixStyles.markWrap} data-focus-mark>
          <div className={mixStyles.markInner} data-focus-mark-inner>
            <BrandMark variant="mark" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
