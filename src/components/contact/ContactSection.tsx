import { EMAIL, EMAIL_URL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";
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
        {/* El bloque de texto queda EXACTAMENTE como estaba: el headline es el
            primer hijo de .row y .row ocupa el ancho entero. El lockup no lo
            rodea ni le recorta la columna — se posiciona sobre el vacío. */}
        <div className={styles.row}>
          <h2 className={styles.headline} id="contact-title">
            <span>Tu marca podria</span>
            <span>estar haciendo más.</span>
          </h2>

          {/* El resaltado va en un span y no en el <p>: así la banda mide lo
              que mide el texto, no el ancho de la columna. */}
          <p className={styles.sub}>
            <span className={styles.highlight}>Hagamos que entre en foco.</span>
          </p>

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

          {/* Vías secundarias. Juntas leen como un bloque de contacto, y las
              dos quedan claramente por debajo del botón. */}
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

          {/* La firma chica. Decorativa: el nombre de la marca ya lo anuncia
              el lockup grande, no hace falta repetirlo en el lector. */}
          <div className={styles.mark}>
            <BrandMark variant="mark" alt="" />
          </div>
        </div>

        <div className={styles.lockup}>
          <BrandMark
            variant="lockup"
            className={styles.lockupMark}
            alt="+4 Creative Studio"
          />
        </div>
      </div>
    </section>
  );
}
