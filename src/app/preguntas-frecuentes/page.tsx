import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import BrandMark from "@/components/hero/BrandMark";
import { FAQ_CTA, FAQ_ITEMS, FAQ_PAGE } from "@/lib/faq";
import { EMAIL, EMAIL_URL, INSTAGRAM_URL, SITE_NAME, WHATSAPP_URL } from "@/lib/site";
import styles from "./Preguntas.module.css";

/**
 * PREGUNTAS FRECUENTES.
 *
 * Misma familia que /servicios: fondo ink, sin GSAP, sin sticky, sin scrub.
 *
 * El acordeón es <details>/<summary> nativo: se abre y se cierra sin una línea
 * de JavaScript, llega accesible de fábrica (teclado, lectores de pantalla) y
 * el buscador indexa las respuestas aunque estén plegadas. Plegado, alguien ve
 * las diez preguntas de un vistazo; desplegado, lee sólo la que le importa.
 *
 * La primera viene abierta para que se entienda que las demás se abren.
 */

const DESCRIPTION =
  "Alcance, precios, plazos, medición y propiedad del trabajo. Diez respuestas sobre cómo trabajamos en +4 Creative Studio.";

export const metadata: Metadata = {
  title: `Preguntas frecuentes — ${SITE_NAME}`,
  description: DESCRIPTION,
  openGraph: {
    title: `Preguntas frecuentes — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{FAQ_PAGE.eyebrow}</p>
          <h1 className={styles.title}>
            {FAQ_PAGE.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </header>

        <div className={styles.list}>
          {FAQ_ITEMS.map((item, index) => (
            <details key={item.id} className={styles.item} open={index === 0}>
              <summary className={styles.question}>
                <span className={styles.questionText}>{item.question}</span>
                {/* El + de la marca hace de indicador: girado 45° es una ×. */}
                <i className={styles.toggle} aria-hidden="true">
                  +
                </i>
              </summary>

              <div className={styles.answer}>
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>

        <section className={styles.cta} aria-labelledby="faq-cta">
          <h2 className={styles.ctaTitle} id="faq-cta">
            {FAQ_CTA.title}
          </h2>

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
