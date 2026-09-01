import styles from "./GradientField.module.css";

/**
 * Campo de luz. La MISMA composición se renderiza dos veces:
 *
 *   diffuse  → blur estático alto, siempre a opacity 1, debajo
 *   focused  → blur estático mínimo, opacity 0 → 1 durante el scroll, encima
 *
 * Ambas capas son opacas (background-color: ink), así que el crossfade es
 * un reemplazo real y no una suma de luminancias: no hay bajón de brillo
 * a mitad de transición y no hay doble imagen.
 *
 * La coherencia entre capas es estructural, no coreografiada: los selectores
 * de GSAP ([data-field-scale], [data-blob], [data-parallax]) alcanzan a las
 * dos copias con el mismo tween, así que es imposible que se desincronicen.
 * Lo único que las diferencia es CSS estático.
 */
function Composition() {
  return (
    <div className={styles.scaler} data-field-scale>
      <div className={styles.layer} data-parallax data-depth="1">
        <div className={`${styles.mass} ${styles.orange}`} data-blob="orange" />
      </div>
      <div className={styles.layer} data-parallax data-depth="0.72">
        <div className={`${styles.mass} ${styles.blue}`} data-blob="blue" />
      </div>
      <div className={styles.layer} data-parallax data-depth="0.9">
        <div className={`${styles.mass} ${styles.cream}`} data-blob="cream" />
      </div>
      <div className={styles.layer} data-parallax data-depth="0.35">
        <div className={`${styles.mass} ${styles.deep}`} data-blob="deep" />
      </div>
    </div>
  );
}

type Props = {
  /**
   * "crossfade" (default) → las dos capas, para el Hero.
   * "focused" → solo la capa enfocada. MixSection arranca donde el Hero
   * termina, con el crossfade ya resuelto: renderizar la capa difusa sería
   * una segunda superficie filtrada a pantalla completa que nadie ve.
   */
  mode?: "crossfade" | "focused";
};

export default function GradientField({ mode = "crossfade" }: Props) {
  return (
    <div className={styles.field} aria-hidden="true">
      {mode === "crossfade" && (
        <div className={`${styles.variant} ${styles.diffuse}`} data-field="diffuse">
          <Composition />
        </div>
      )}
      <div className={`${styles.variant} ${styles.focused}`} data-field="focused">
        <Composition />
      </div>
    </div>
  );
}
