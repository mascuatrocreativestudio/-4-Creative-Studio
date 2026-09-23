import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import { EQUATION_TERMS } from "@/lib/scene";
import { PROCESS, SERVICES_CTA, SERVICES_PAGE, SERVICE_DESCRIPTIONS } from "@/lib/services";
import { EMAIL, EMAIL_URL, INSTAGRAM_URL, SITE_NAME, WHATSAPP_URL } from "@/lib/site";
import BrandMark from "@/components/hero/BrandMark";
import styles from "./Servicios.module.css";

/**
 * SERVICIOS — primera página interior.
 *
 * Deliberadamente lo opuesto a la home: sin sticky, sin ScrollTrigger, sin
 * scrub, sin GSAP. La home es una experiencia que se recorre; esto es
 * información que se escanea. Un visitante decidiendo si escribirnos tiene que
 * poder leer todo en treinta segundos, no en catorce pantallas.
 *
 * Server component: no hay estado ni efectos, así que no paga hidratación. Lo
 * único cliente es el Header, que ya lo era.
 *
 * Se queda en el universo oscuro a propósito. El Header es fijo y lee sus
 * colores de html[data-surface], que en la home cambia MEZCLA al llegar a la
 * superficie clara. Acá no hay scroll que lo dispare: sobre fondo cream el nav
 * quedaría blanco sobre blanco. Manteniendo el fondo ink el Header funciona sin
 * ningún interruptor, sin parpadeo al cargar y sin estado que pueda quedar
 * pegado al volver a la home.
 */

export const metadata: Metadata = {
  title: `Servicios — ${SITE_NAME}`,
  description:
    "Estrategia, identidad, contenido y crecimiento. Cuatro disciplinas que trabajan juntas para que tu marca genere demanda.",
  openGraph: {
    title: `Servicios — ${SITE_NAME}`,
    description:
      "Estrategia, identidad, contenido y crecimiento. Cuatro disciplinas que trabajan juntas para que tu marca genere demanda.",
  },
};

export default function ServiciosPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{SERVICES_PAGE.eyebrow}</p>
          <h1 className={styles.title}>
            {SERVICES_PAGE.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.lead}>{SERVICES_PAGE.lead}</p>
        </header>

        {/* Las cuatro disciplinas salen de EQUATION_TERMS, la misma fuente que
            dibuja la ecuación en la home. */}
        <ol className={styles.services}>
          {EQUATION_TERMS.map((term) => (
            <li key={term.id} className={styles.service}>
              <p className={styles.index} aria-hidden="true">
                {term.index}
              </p>

              <div className={styles.serviceBody}>
                <h2 className={styles.serviceTitle}>{term.title}</h2>
                <p className={styles.serviceText}>{SERVICE_DESCRIPTIONS[term.id]}</p>
              </div>

              <ul className={styles.items}>
                {term.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <section className={styles.process} aria-labelledby="process-title">
          <h2 className={styles.sectionTitle} id="process-title">
            Cómo empezamos
          </h2>

          <ol className={styles.steps}>
            {PROCESS.map((step) => (
              <li key={step.index} className={styles.step}>
                <p className={styles.stepIndex} aria-hidden="true">
                  {step.index}
                </p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.cta} aria-labelledby="cta-title">
          <h2 className={styles.ctaTitle} id="cta-title">
            {SERVICES_CTA.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <p className={styles.ctaText}>{SERVICES_CTA.body}</p>

          <a
            className={styles.ctaButton}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactanos.
            <i className={styles.ctaArrow} aria-hidden="true">
              ↗
            </i>
          </a>

          <div className={styles.links}>
            <a
              className={styles.link}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              @mascuatro.studio
            </a>
            <a className={styles.link} href={EMAIL_URL}>
              {EMAIL}
            </a>
          </div>

          <div className={styles.mark}>
            <BrandMark variant="lockup" className={styles.markImage} alt={SITE_NAME} />
          </div>
        </section>
      </main>
    </>
  );
}
