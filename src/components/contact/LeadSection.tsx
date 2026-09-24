import LeadForm from "./LeadForm";
import styles from "./LeadSection.module.css";

/**
 * Última franja de la home: la vía para quien no quiere abrir una conversación
 * todavía y prefiere dejar sus datos.
 *
 * Va como sección propia y no dentro de ContactSection a propósito. El lockup
 * del cierre está posicionado contra el borde inferior de ese bloque, así que
 * cualquier cosa agregada ahí adentro lo empujaría hacia arriba y rompería una
 * composición ya aprobada. Como sección aparte —mismo fondo, sin costura
 * visible— el cierre queda intacto y esto simplemente va abajo.
 *
 * Server component: el estado vive sólo en el formulario.
 */
export default function LeadSection() {
  return (
    <section className={styles.lead} aria-labelledby="lead-title">
      <div className={styles.inner}>
        <div className={styles.encabezado}>
          <p className={styles.eyebrow}>Dejanos tus datos</p>
          <h2 className={styles.titulo} id="lead-title">
            Te escribimos nosotros.
          </h2>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}
