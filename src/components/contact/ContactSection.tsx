import { EMAIL, EMAIL_URL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";
import BrandMark from "@/components/hero/BrandMark";
import LeadForm from "./LeadForm";
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
        {/* El headline cruza las dos columnas y se dimensiona a su contenido
            (justify-self: start), que es exactamente lo que hacía dentro del
            flex de .row. Sale de la columna para que abrirle una al formulario
            no le cambie el corte de línea. */}
        <h2 className={styles.headline} id="contact-title">
          <span>Tu marca podria</span>
          <span>estar haciendo más.</span>
        </h2>

        <div className={styles.row}>
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

          {/* Cierra la home mandando a la página que contesta lo que este final
              no puede contestar. Va fuera del bloque de arriba a propósito: no
              es una vía de contacto, es otra página. */}
          <a className={styles.faqLink} href="/preguntas-frecuentes">
            Preguntas frecuentes
            <i className={styles.faqArrow} aria-hidden="true">
              →
            </i>
          </a>

          {/* La firma chica. Decorativa: el nombre de la marca ya lo anuncia
              el lockup grande, no hace falta repetirlo en el lector. */}
          <div className={styles.mark}>
            <BrandMark variant="mark" alt="" />
          </div>
        </div>

        {/* Columna derecha: el lockup arriba y, debajo, la vía para quien no
            quiere abrir una conversación todavía y prefiere que lo llamen.
            Juntos ocupan el vacío que quedaba a la derecha del cierre. */}
        <div className={styles.aside}>
          <div className={styles.lockup}>
            <BrandMark
              variant="lockup"
              className={styles.lockupMark}
              alt="+4 Creative Studio"
            />
          </div>

          <div className={styles.lead}>
            <p className={styles.leadEyebrow}>Dejanos tus datos</p>
            <h3 className={styles.leadTitle}>Te escribimos nosotros.</h3>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
