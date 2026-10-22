import type { ReactNode } from "react";
import Header from "@/components/navigation/Header";
import BrandMark from "@/components/hero/BrandMark";
import { ACTUALIZADO, DOCUMENTOS, type Bloque, type Documento } from "@/lib/legal";
import { EMAIL, EMAIL_URL, SITE_NAME } from "@/lib/site";
import styles from "./Legal.module.css";

/**
 * EL MOLDE DE LAS TRES PÁGINAS LEGALES.
 *
 * Términos, Privacidad y Cookies comparten forma: misma familia visual que
 * /servicios y /preguntas-frecuentes —fondo ink, sin GSAP, sin sticky— y la
 * misma estructura de secciones numeradas. Un solo componente para los tres
 * significa que no pueden divergir entre sí, y que corregir una cláusula es
 * editar lib/legal.ts y nada más.
 *
 * Server component: no hay estado, no hay efectos, no paga hidratación. El
 * índice y las anclas son enlaces normales — cero JavaScript.
 */

/* --------------------------------------------------------------------------
   ENLACES AUTOMÁTICOS

   En los documentos legales el correo y los nombres de las otras dos políticas
   aparecen muchas veces y tienen que ser clicables en todas. Hacerlo a mano
   obligaría a partir cada párrafo en trozos dentro de lib/legal.ts y la prosa
   quedaría ilegible, así que el texto se guarda plano y se enlaza al renderizar.
   -------------------------------------------------------------------------- */

type Enlace = { patron: string; href: string };

const ENLACES: Enlace[] = [
  { patron: EMAIL, href: EMAIL_URL },
  ...DOCUMENTOS.map((doc) => ({ patron: doc.nombreCorto, href: `/${doc.slug}` })),
];

/** El patrón viaja a un RegExp: el punto del dominio no puede ser comodín. */
function escapar(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parte el texto por los patrones conocidos y devuelve los trozos, con los
 * coincidentes envueltos en un enlace. Se excluye el documento actual para que
 * una página no se enlace a sí misma.
 */
function enlazar(texto: string, slugActual: string): ReactNode {
  const activos = ENLACES.filter((enlace) => enlace.href !== `/${slugActual}`);
  const patron = new RegExp(`(${activos.map((e) => escapar(e.patron)).join("|")})`, "g");

  const trozos = texto.split(patron);
  if (trozos.length === 1) return texto;

  return trozos.map((trozo, indice) => {
    const enlace = activos.find((e) => e.patron === trozo);
    if (!enlace) return trozo;

    return (
      <a key={`${trozo}-${indice}`} className={styles.enlace} href={enlace.href}>
        {trozo}
      </a>
    );
  });
}

function Cuerpo({ bloque, slug }: { bloque: Bloque; slug: string }) {
  if (bloque.tipo === "lista") {
    return (
      <ul className={styles.lista}>
        {bloque.items.map((item) => (
          <li key={item}>{enlazar(item, slug)}</li>
        ))}
      </ul>
    );
  }

  /* Las leyendas que la Ley 25.326 obliga a reproducir textualmente. Se
     destacan con un filete naranja para que se lean como cita de la norma y no
     como redacción del Estudio. */
  if (bloque.tipo === "nota") {
    return <p className={styles.nota}>{bloque.texto}</p>;
  }

  return <p className={styles.parrafo}>{enlazar(bloque.texto, slug)}</p>;
}

export default function LegalDoc({ doc }: { doc: Documento }) {
  const otros = DOCUMENTOS.filter((otro) => otro.slug !== doc.slug);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{doc.eyebrow}</p>

          <h1 className={styles.title}>
            {doc.title.map((linea) => (
              <span key={linea}>{linea}</span>
            ))}
          </h1>

          <p className={styles.resumen}>{doc.resumen}</p>
        </header>

        {/* Índice. Los términos tienen doce secciones: conviene poder ir
            directo a la que se está buscando. Son anclas, no JavaScript. */}
        <nav className={styles.indice} aria-label="Contenido de esta página">
          <ol className={styles.indiceLista}>
            {doc.secciones.map((seccion, indice) => (
              <li key={seccion.id}>
                <a className={styles.indiceLink} href={`#${seccion.id}`}>
                  <span className={styles.indiceNumero}>
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  {seccion.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.doc}>
          {doc.secciones.map((seccion, indice) => (
            <section
              key={seccion.id}
              className={styles.seccion}
              id={seccion.id}
              aria-labelledby={`${seccion.id}-titulo`}
            >
              <p className={styles.numero} aria-hidden="true">
                {String(indice + 1).padStart(2, "0")}
              </p>

              <div className={styles.contenido}>
                <h2 className={styles.heading} id={`${seccion.id}-titulo`}>
                  {seccion.titulo}
                </h2>

                {seccion.bloques.map((bloque, i) => (
                  <Cuerpo key={i} bloque={bloque} slug={doc.slug} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className={styles.pie}>
          <p className={styles.fecha}>Última actualización: {ACTUALIZADO}</p>

          <nav className={styles.otros} aria-label="Otros documentos legales">
            {otros.map((otro) => (
              <a key={otro.slug} className={styles.otroLink} href={`/${otro.slug}`}>
                {otro.nombreCorto}
                <i className={styles.flecha} aria-hidden="true">
                  →
                </i>
              </a>
            ))}

            <a className={styles.otroLink} href="/">
              Volver al inicio
              <i className={styles.flecha} aria-hidden="true">
                →
              </i>
            </a>
          </nav>

          <div className={styles.mark}>
            <BrandMark variant="lockup" className={styles.markImage} alt={SITE_NAME} />
          </div>
        </footer>
      </main>
    </>
  );
}
