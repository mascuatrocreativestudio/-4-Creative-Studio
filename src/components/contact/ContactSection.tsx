import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";
import BrandMark from "@/components/hero/BrandMark";
import styles from "./ContactSection.module.css";

/**
 * El cierre. Sección normal: sin sticky, sin ScrollTrigger, sin timeline. No es
 * un footer con columnas y links repetidos — es el último lugar de la
 * experiencia, y por eso tiene el mismo aire que las escenas anteriores pero
 * ninguna de su coreografía.
 *
 * Server component a propósito: no necesita estado ni efectos, así que no paga
 * hidratación. El único comportamiento es el hover del CTA, y eso es CSS.
 *
 * El botón sale hacia WhatsApp con la configuración que ya vive en site.ts
 * (WHATSAPP_NUMBER → wa.me). El número sigue siendo el placeholder: cuando se
 * cambie ahí, este botón lo toma solo.
 */
export default function ContactSection() {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.row}>
          <h2 className={styles.headline} id="contact-title">
            <span>Tu marca puede</span>
            <span>estar haciendo más.</span>
          </h2>

          <p className={styles.sub}>Hagamos que entre en foco.</p>

          <a
            className={styles.cta}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactanos.
            <i className={styles.ctaArrow} aria-hidden="true">
              ↗
            </i>
          </a>

          <a
            className={styles.instagram}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            @mascuatro.studio
          </a>

          <div className={styles.mark}>
            <BrandMark variant="mark" alt="+4 Creative Studio" />
          </div>
        </div>
      </div>
    </section>
  );
}
