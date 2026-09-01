import type { CSSProperties } from "react";
import type { EquationTerm } from "@/lib/scene";
import styles from "./MixEquationTerm.module.css";

/**
 * Un término de la ecuación. No es una card: no tiene superficie, ni borde,
 * ni caja. Solo tipografía sobre el mismo fondo atmosférico de CONEXIÓN.
 *
 * El signo + que lo precede vive acá para que su color y su posición estén
 * atados al término, pero se alinea a la izquierda del bloque: los tres
 * signos forman una columna, y los términos escalonan hacia la derecha.
 */
export default function MixEquationTerm({
  term,
  order,
}: {
  term: EquationTerm;
  order: number;
}) {
  const style = { "--i": order } as CSSProperties;

  return (
    <div className={styles.term} style={style} data-term={term.id}>
      {term.sign && (
        <span
          className={`${styles.sign} ${styles[term.sign]}`}
          data-sign={term.id}
          aria-hidden="true"
        >
          +
        </span>
      )}

      <p className={styles.head} data-term-head>
        <span className={styles.index}>{term.index} /</span>
        <span className={styles.title}>{term.title}</span>
      </p>

      <ul className={styles.items} data-term-items>
        {term.items.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
