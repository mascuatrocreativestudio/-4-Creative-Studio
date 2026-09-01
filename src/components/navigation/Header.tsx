"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { CTA_LINK, NAV_LINKS, type NavLink } from "@/lib/site";
import { CONNECTION_PROGRESS } from "@/components/hero/Hero";
import { MIX_VISIBLE_PROGRESS } from "@/components/mix/MixSection";
import BrandMark from "@/components/hero/BrandMark";
import styles from "./Header.module.css";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   NAVEGACIÓN A UNA ESCENA, NO A UNA SECCIÓN

   MÉTODO y SERVICIOS no apuntan al borde de un <section>: apuntan a un frame
   dentro de un timeline scrubbed. CONEXIÓN vive dentro del scroll del Hero y
   MEZCLA recién se reconoce cuando su palabra terminó de entrar, así que saltar
   al offsetTop de la sección aterriza en el frame equivocado (o en el solape
   anterior, que es negro).

   Por eso cada destino se resuelve como un progreso del ScrollTrigger QUE YA
   EXISTE. No hay un segundo timeline ni píxeles hardcodeados: se lee `start` y
   `end` del trigger real en el momento del click, así que sobrevive a resize,
   refresh y a cualquier cambio de altura de las secciones de arriba.

   El progreso de cada escena lo exporta su propia sección, derivado de sus
   constantes de ritmo — si mañana se retoca el timing, el destino se mueve solo.
   -------------------------------------------------------------------------- */

type SceneTarget = {
  /** Selector estable de un elemento que vive dentro de la sección buscada. */
  anchor: string;
  /* El progreso se lee como función y no como valor: page.tsx importa Header
     ANTES que Hero y MixSection, así que en tiempo de módulo estas constantes
     todavía no existen y quedaban en undefined —el destino salía NaN y el
     scroll no se movía—. Al click ya está todo inicializado. */
  progress: () => number;
};

const SCENE_TARGETS: Record<string, SceneTarget> = {
  "#metodo": { anchor: "[data-headline]", progress: () => CONNECTION_PROGRESS },
  "#servicios": { anchor: "[data-mix-stage]", progress: () => MIX_VISIBLE_PROGRESS },
};

/** Posición de scroll del frame buscado, o null si la sección no está montada. */
function sceneScrollTop(target: SceneTarget): number | null {
  const section = document.querySelector(target.anchor)?.closest("section");
  if (!section) return null;

  const box = section as HTMLElement;
  const trigger = ScrollTrigger.getAll().find((st) => st.trigger === section);

  /* Sin timeline: movimiento reducido, donde las secciones son documento normal
     sin pin ni scrub. Ahí el frame correcto ES el principio de la sección. */
  if (!trigger) return Math.round(box.offsetTop);

  /* Camino normal: el rango real del trigger que ya existe. */
  if (Number.isFinite(trigger.start) && Number.isFinite(trigger.end) && trigger.end > trigger.start) {
    return Math.round(trigger.start + (trigger.end - trigger.start) * target.progress());
  }

  /* El trigger existe pero todavía no se refrescó (primer frame, o un navegador
     que no llegó a correr el refresh). Su rango es exactamente este por
     construcción —las dos escenas usan start:"top top" y un end atado al alto de
     su propia sección—, así que no es una estimación: es la misma cuenta. */
  const distance = Math.max(0, box.offsetHeight - window.innerHeight);
  return Math.round(box.offsetTop + distance * target.progress());
}

/** ScrollTrigger ya escucha el scroll; esto sólo cierra el frame final. */
function syncScrollTriggerAfterScroll() {
  const sync = () => ScrollTrigger.update();
  const supportsScrollEnd = typeof window.onscrollend !== "undefined";
  if (supportsScrollEnd) window.addEventListener("scrollend", sync, { once: true });
  else window.setTimeout(sync, 900);
}

function linkProps(link: NavLink) {
  return link.external
    ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: link.href };
}

export default function Header() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  /* Los links siguen siendo <a href> reales: teclado, foco y menú contextual
     intactos. Sólo interceptamos los dos que apuntan a una escena, y sólo si
     pudimos resolver su destino. */
  const navigateToScene = useCallback((event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    setOpen(false);
    if (link.external) return;

    const target = SCENE_TARGETS[link.href];
    if (!target) return;

    const top = sceneScrollTop(target);
    if (top === null) return;

    event.preventDefault();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    syncScrollTriggerAfterScroll();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(root, { opacity: 0, y: -8, duration: 0.7, delay: 0.1, ease: "power3.out" });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Cerrar el menú con Escape y bloquear el scroll mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header ref={rootRef} className={styles.header}>
      <a className={styles.brand} href="/" aria-label="+4 Creative Studio — inicio">
        <BrandMark variant="lockup" alt="" className={styles.lockup} />
        <span className="srOnly">+4 Creative Studio</span>
      </a>

      <nav className={styles.nav} aria-label="Principal">
        <ul className={styles.list}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                className={styles.link}
                {...linkProps(link)}
                onClick={(event) => navigateToScene(event, link)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className={styles.cta} {...linkProps(CTA_LINK)}>
          {CTA_LINK.label}
        </a>
      </nav>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Cerrar" : "Menú"}
      </button>

      <div
        id="menu-panel"
        className={styles.panel}
        data-open={open ? "true" : undefined}
        hidden={!open}
      >
        <ul className={styles.panelList}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                className={styles.panelLink}
                {...linkProps(link)}
                onClick={(event) => navigateToScene(event, link)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className={styles.panelCta} {...linkProps(CTA_LINK)} onClick={() => setOpen(false)}>
          {CTA_LINK.label}
        </a>
      </div>
    </header>
  );
}
