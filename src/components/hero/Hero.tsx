"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { CONNECTION_EDGES, CONNECTION_NODES, NODE_STEP_BY_ID } from "@/lib/site";
import { FIELD_DRIFT_END, MARK_SCALE_END } from "@/lib/scene";
import { attachPointerParallax } from "@/lib/pointerParallax";
import BrandMark from "./BrandMark";
import GradientField from "./GradientField";
import ConnectionNode from "./ConnectionNode";
import ConnectionLines from "./ConnectionLines";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   Ritmo de la timeline. Todo normalizado a 100 = 100% del progreso de scroll.

   Cada nodo entra en DOS tiempos consecutivos (no simultáneos: dos tweens
   solapados sobre la misma propiedad hacen saltar el scrub al ir hacia atrás):

     INSINUAR  → opacity .45, blur a 5px, 40% del drift restante
     CONSOLIDAR→ opacity 1, blur 0, drift 0

   El solapamiento vive ENTRE nodos, no dentro de uno: con STEP 6 y ciclo
   completo de 22, hay ~3,5 nodos en tránsito en cualquier momento. Por eso
   no se lee como PowerPoint.
   -------------------------------------------------------------------------- */
const NODE_START = 22; // MARCA empieza a insinuarse mientras el headline todavía está
const NODE_STEP = 6; // separación entre nodos consecutivos
const NODE_HINT_DURATION = 10;
const NODE_SETTLE_DURATION = 12;
const NODE_CYCLE = NODE_HINT_DURATION + NODE_SETTLE_DURATION; // 22
const HINT_DRIFT = 0.4; // fracción del desplazamiento que queda tras insinuar
const LINE_DELAY = 1.5; // respiro entre "nodo consolidado" y "línea empieza"
const LINE_DURATION = 10;

/** Momento en el que un nodo termina de consolidarse. */
const nodeEndsAt = (step: number) => NODE_START + step * NODE_STEP + NODE_CYCLE;

/**
 * Progreso del timeline en el que CONEXIÓN ya se lee como escena: MARCA y
 * AUDIENCIA consolidados y la primera arista terminada de dibujar. Sale de las
 * constantes de arriba, no está elegido a ojo — si se retoca el ritmo de los
 * nodos, este valor se mueve solo.
 *
 * Lo usa la navegación del Header: MÉTODO tiene que aterrizar en la ESCENA,
 * no en el borde de la sección, porque CONEXIÓN vive dentro del scrub del Hero.
 */
export const CONNECTION_PROGRESS =
  (nodeEndsAt(1) + LINE_DELAY + LINE_DURATION) / 100;

export default function Hero() {
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

        /* ---------- Movimiento reducido: composición final, estática ---------- */
        if (!motion) {
          gsap.set("[data-field='focused']", { opacity: 1 });
          gsap.set("[data-field-scale]", { scale: 1 });
          gsap.set("[data-mark-inner]", { opacity: 1, filter: "blur(0px)", scale: MARK_SCALE_END });
          gsap.set("[data-headline]", { opacity: 1 });
          gsap.set("[data-node]", { opacity: 1, filter: "blur(0px)", x: 0, y: 0 });
          gsap.set("[data-line]", { strokeDashoffset: 0 });
          gsap.set("[data-focus-scrim]", { opacity: 0.85 });
          gsap.set("[data-closing='1']", { opacity: 0.75, y: 0 });
          gsap.set("[data-closing='2']", { opacity: 1, y: 0 });
          return;
        }

        /* ------------------------------ ENTRADA ------------------------------ */
        /* ~1.7s. El campo difuso ya está visible desde el primer frame. */
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from("[data-mark-inner]", { opacity: 0, scale: 1.09, filter: "blur(24px)", duration: 1.3 }, 0.05)
          .from("[data-intro='eyebrow']", { opacity: 0, y: 10, duration: 0.85 }, 0.45)
          .from("[data-intro='line1']", { yPercent: 110, opacity: 0, duration: 1 }, 0.58)
          .from("[data-intro='line2']", { yPercent: 110, opacity: 0, duration: 1 }, 0.7)
          .from("[data-scroll-hint]", { opacity: 0, y: 8, duration: 0.7 }, 0.98);

        /* --------------------------- SCROLL TIMELINE --------------------------- */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        /* Deriva de las masas. Alcanza a las DOS copias del campo con el mismo
           tween: coherencia estructural, imposible desincronizar. */
        tl.to("[data-blob='orange']", { ...FIELD_DRIFT_END.orange, duration: 68 }, 0)
          .to("[data-blob='blue']", { ...FIELD_DRIFT_END.blue, duration: 68 }, 0)
          .to("[data-blob='cream']", { ...FIELD_DRIFT_END.cream, duration: 68 }, 0)
          .to("[data-blob='deep']", { ...FIELD_DRIFT_END.deep, duration: 68 }, 0)
          .to("[data-field-scale]", { scale: 1, duration: 56 }, 0);

        /* DIFUSO → FOCO: una sola propiedad de composición.
           La capa difusa nunca se toca; la enfocada (opaca) la reemplaza. */
        tl.to("[data-field='focused']", { opacity: 1, duration: 50, ease: "power1.inOut" }, 2);

        /* Acto 1: el logo y el headline toman presencia. */
        tl.to("[data-mark-inner]", { opacity: 1, filter: "blur(0px)", duration: 20 }, 2)
          .to("[data-headline]", { opacity: 1, duration: 20 }, 2)
          .to("[data-scroll-hint]", { opacity: 0, duration: 9 }, 16);

        /* Acto 2 — RELEVO, no corte. El headline empieza a irse en 32, cuando
           MARCA, AUDIENCIA y CONTENIDO ya están insinuados. La salida dura 24
           (antes 14): se contamina, no se apaga. El +4 no se toca en opacidad
           en todo el relevo: es el único elemento presente en los dos estados. */
        tl.to("[data-mark-inner]", { scale: MARK_SCALE_END, duration: 42 }, 20)
          .to("[data-copy-block]", { opacity: 0, y: -26, duration: 24, ease: "power1.in" }, 32)
          .to("[data-focus-scrim]", { opacity: 1, duration: 28 }, 46);

        /* Nodos: secuencia narrativa explícita (step), nunca random.
           MARCA → AUDIENCIA → CONTENIDO → PAUTA → DATOS → NEGOCIO → VENTAS */
        CONNECTION_NODES.forEach((node) => {
          const at = NODE_START + node.step * NODE_STEP;
          const selector = `[data-node='${node.id}']`;

          tl.to(
            selector,
            {
              opacity: 0.45,
              filter: "blur(5px)",
              x: node.drift.x * HINT_DRIFT,
              y: node.drift.y * HINT_DRIFT,
              duration: NODE_HINT_DURATION,
              ease: "power1.out",
            },
            at,
          ).to(
            selector,
            {
              opacity: 1,
              filter: "blur(0px)",
              x: 0,
              y: 0,
              duration: NODE_SETTLE_DURATION,
              ease: "power2.out",
            },
            at + NODE_HINT_DURATION,
          );
        });

        /* Acto 3: cada línea arranca recién cuando SUS DOS extremos están
           consolidados (opacity 1, blur 0). Nunca se dibuja hacia una insinuación. */
        CONNECTION_EDGES.forEach(([from, to]) => {
          const readyAt = Math.max(
            nodeEndsAt(NODE_STEP_BY_ID[from] ?? 0),
            nodeEndsAt(NODE_STEP_BY_ID[to] ?? 0),
          );
          tl.to(
            `[data-edge='${from}-${to}']`,
            { strokeDashoffset: 0, duration: LINE_DURATION, ease: "power1.inOut" },
            readyAt + LINE_DELAY,
          );
        });

        /* Cierre: entra mientras las últimas líneas todavía se están dibujando. */
        tl.to("[data-closing='1']", { opacity: 0.75, y: 0, duration: 9 }, 83)
          .to("[data-closing='2']", { opacity: 1, y: 0, duration: 10 }, 90);

        /* ------------------------- CURSOR (solo desktop) ------------------------- */
        if (!desktop) return;
        return attachPointerParallax(root);
      },
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      data-reduced={reducedMotion ? "true" : undefined}
      aria-labelledby="hero-headline"
    >
      <div className={styles.stage}>
        <GradientField />

        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.focusScrim} data-focus-scrim aria-hidden="true" />

        <div className={styles.lines}>
          <ConnectionLines />
        </div>

        <div className={styles.nodes}>
          {CONNECTION_NODES.map((node) => (
            <ConnectionNode key={node.id} node={node} />
          ))}
        </div>

        <div className={styles.markWrap} data-parallax data-depth="0.4">
          <div className={styles.markInner} data-mark-inner>
            <BrandMark variant="mark" alt="+4" priority />
          </div>
        </div>

        <div className={styles.narrative}>
          <div className={styles.copyBlock} data-copy-block>
            <p className={styles.eyebrow} data-intro="eyebrow">
              Creative Studio / Desarrollo comercial integral
            </p>
            <h1 id="hero-headline" className={styles.headline} data-headline>
              <span className={styles.mask}>
                <span className={styles.line} data-intro="line1">
                  Hacemos que tu marca
                </span>
              </span>
              <span className={styles.mask}>
                <span className={styles.line} data-intro="line2">
                  entre en foco.
                </span>
              </span>
            </h1>
          </div>

          <p className={styles.closing}>
            <span className={styles.closingA} data-closing="1">
              Crecer no es hacer más cosas.
            </span>
            <span className={styles.closingB} data-closing="2">
              Es hacer que todo trabaje junto.
            </span>
          </p>
        </div>

        <div className={styles.scrollHint} data-scroll-hint>
          <span>Scroll</span>
          <span>para enfocar ↓</span>
        </div>
      </div>
    </section>
  );
}
