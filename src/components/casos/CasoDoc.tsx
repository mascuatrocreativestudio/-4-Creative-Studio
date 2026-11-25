import Header from "@/components/navigation/Header";
import BrandMark from "@/components/hero/BrandMark";
import LegalLinks from "@/components/legal/LegalLinks";
import { CASOS, type Bloque, type Caso } from "@/lib/casos";
import { SITE_NAME, WHATSAPP_URL } from "@/lib/site";
import styles from "./Caso.module.css";

/**
 * EL MOLDE DE LOS CASOS.
 *
 * Misma familia que /servicios, /preguntas-frecuentes y las páginas legales:
 * fondo ink, sin GSAP, sin sticky, sin una línea de JavaScript.
 *
 * Lo único que estas páginas tienen y las otras no es la tabla de resultados,
 * y está arriba del todo a propósito. Un caso de éxito se lee al revés que un
 * relato: primero el número, y recién si el número impresiona, el cómo. Quien
 * no baje de la primera pantalla igual se lleva lo importante.
 */

function Cuerpo({ bloque }: { bloque: Bloque }) {
  /* Numerados: son una secuencia y el orden es el argumento —primero la casa
     en orden, después la publicidad—. El número lo cuenta el CSS. */
  if (bloque.tipo === "pasos") {
    return (
      <ol className={styles.pasos}>
        {bloque.items.map((item) => (
          <li key={item.titulo} className={styles.paso}>
            <h3 className={styles.puntoTitulo}>{item.titulo}</h3>
            <p className={styles.puntoTexto}>{item.texto}</p>
          </li>
        ))}
      </ol>
    );
  }

  /* Sin numerar: razones independientes entre sí, cada una se sostiene sola. */
  if (bloque.tipo === "puntos") {
    return (
      <ul className={styles.puntos}>
        {bloque.items.map((item) => (
          <li key={item.titulo} className={styles.punto}>
            <h3 className={styles.puntoTitulo}>{item.titulo}</h3>
            <p className={styles.puntoTexto}>{item.texto}</p>
          </li>
        ))}
      </ul>
    );
  }

  return <p className={styles.parrafo}>{bloque.texto}</p>;
}

export default function CasoDoc({ caso }: { caso: Caso }) {
  const otro = CASOS.find((candidato) => candidato.slug !== caso.slug);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Caso de éxito</p>

          <h1 className={styles.title}>
            {caso.titular.map((linea) => (
              <span key={linea}>{linea}</span>
            ))}
          </h1>

          <p className={styles.cliente}>
            {caso.cliente}
            <span className={styles.rubro}>{caso.rubro}</span>
          </p>

          <p className={styles.resumen}>{caso.resumen}</p>
        </header>

        {/* La tabla de resultados. Lo primero que se ve después del titular:
            son los números del documento, sin redondear. */}
        <section className={styles.resultados} aria-labelledby="resultados">
          <div className={styles.resultadosCabecera}>
            <h2 className={styles.resultadosTitulo} id="resultados">
              Resultado
            </h2>
            <p className={styles.periodo}>{caso.periodo}</p>
          </div>

          <dl className={styles.metricas}>
            {caso.metricas.map((metrica) => (
              <div key={metrica.etiqueta} className={styles.metrica}>
                <dt className={styles.metricaEtiqueta}>{metrica.etiqueta}</dt>
                <dd className={styles.metricaValor}>
                  {metrica.valor}
                  {/* El contraste contra el punto de partida es lo que
                      convierte el número en un resultado. */}
                  {metrica.antes ? (
                    <span className={styles.metricaAntes}>{metrica.antes}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.doc}>
          {caso.secciones.map((seccion, indice) => (
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
                  <Cuerpo key={i} bloque={bloque} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className={styles.pie}>
          <h2 className={styles.pregunta}>{caso.pregunta}</h2>
          <p className={styles.invitacion}>{caso.invitacion}</p>

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

          <nav className={styles.otros} aria-label="Más casos">
            {otro ? (
              <a className={styles.otroLink} href={`/casos/${otro.slug}`}>
                Ver el caso de {otro.cliente}
                <i className={styles.flecha} aria-hidden="true">
                  →
                </i>
              </a>
            ) : null}

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

          <LegalLinks className={styles.legal} />
        </footer>
      </main>
    </>
  );
}
