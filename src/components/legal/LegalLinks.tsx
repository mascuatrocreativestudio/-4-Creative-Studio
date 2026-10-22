import { LEGAL_LINKS } from "@/lib/legal";
import styles from "./LegalLinks.module.css";

/**
 * La línea legal: Términos, Privacidad y Cookies.
 *
 * Se usa en el cierre de la home y al pie de las páginas interiores. No tiene
 * variantes de color a propósito: hereda el color del contexto y lo atenúa con
 * opacidad, así la misma línea funciona sobre el off-white del cierre y sobre
 * el ink de las interiores sin una sola media query ni un segundo módulo.
 *
 * Jerarquía deliberadamente mínima: es información obligatoria, no una vía de
 * contacto. Tiene que estar siempre disponible y no competir nunca con el CTA.
 */
export default function LegalLinks({ className }: { className?: string }) {
  return (
    <nav
      className={className ? `${styles.legal} ${className}` : styles.legal}
      aria-label="Información legal"
    >
      {LEGAL_LINKS.map((link) => (
        <a key={link.href} className={styles.link} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
