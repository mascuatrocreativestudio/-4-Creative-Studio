"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import styles from "./BrandMark.module.css";

export type BrandMarkVariant = "mark" | "lockup";

const SOURCES: Record<BrandMarkVariant, string> = {
  mark: "/brand/plus4-mark-white.svg",
  lockup: "/brand/plus4-lockup-white.svg",
};

const FALLBACK_TEXT: Record<BrandMarkVariant, string> = {
  mark: "+4",
  lockup: "+4 / CREATIVE STUDIO",
};

type Props = {
  variant?: BrandMarkVariant;
  className?: string;
  /** Texto alternativo. Vacío => decorativo. */
  alt?: string;
  priority?: boolean;
};

/**
 * Único punto de verdad del logo.
 *
 * Tres modos de falla cubiertos, ninguno silencioso:
 *  1. el archivo no existe            → onError → placeholder + warning en dev
 *  2. el SVG no tiene dimensiones     → le damos caja, NO caemos a tipografía
 *     intrínsecas (width="100%" sin      (el logo real siempre gana sobre el
 *     viewBox, export mal configurado)   placeholder)
 *  3. el SVG carga pero renderiza 0px → misma caja forzada
 */
export default function BrandMark({
  variant = "mark",
  className,
  alt = "+4 Creative Studio",
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [needsBox, setNeedsBox] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);

  /* Red de seguridad: si por lo que sea el logo termina midiendo 0px, se avisa
     en consola en vez de dejar un hueco silencioso. */
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const id = window.setTimeout(() => {
      const el = wrapperRef.current;
      if (el && (el.offsetWidth === 0 || el.offsetHeight === 0)) {
        console.warn(
          `[BrandMark] El logo "${variant}" está renderizando 0px ` +
            `(${el.offsetWidth}×${el.offsetHeight}). Revisá el contenedor padre.`,
        );
      }
    }, 600);
    return () => window.clearTimeout(id);
  }, [variant, failed, needsBox]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    /* Un SVG sin width/height intrínsecos reporta naturalWidth 0 y con
       height:auto colapsa a 0px de alto: se ve un hueco. No es un error de
       carga, así que forzamos la caja en vez de descartar el logo. */
    if (img.naturalWidth === 0 || img.naturalHeight === 0 || img.offsetHeight === 0) {
      setNeedsBox(true);
    }
  };

  const handleError = () => {
    setFailed(true);
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[BrandMark] No se pudo cargar ${SOURCES[variant]}. ` +
          `Colocá el SVG en public${SOURCES[variant]}. ` +
          `Mientras tanto se muestra el placeholder tipográfico.`,
      );
    }
  };

  const wrapperClass = [
    styles.root,
    variant === "lockup" ? styles.lockup : styles.mark,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (failed) {
    /* Placeholder del SÍMBOLO como SVG con viewBox, no como texto suelto.
       Así hereda exactamente la misma geometría que tendrá el SVG real
       (ratio intrínseco 1:1, width:100% / height:auto) y no depende de vw
       ni de container queries para saber cuánto medir. */
    if (variant === "mark") {
      return (
        <span
          ref={wrapperRef}
          className={wrapperClass}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        >
          <svg
            className={styles.img}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <text
              x="60"
              y="62"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-archivo), Helvetica, Arial, sans-serif"
              fontWeight="700"
              fontSize="74"
              letterSpacing="-4"
              fill="currentColor"
            >
              +4
            </text>
          </svg>
        </span>
      );
    }

    return (
      <span
        ref={wrapperRef}
        className={`${wrapperClass} ${styles.fallback}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {FALLBACK_TEXT[variant]}
      </span>
    );
  }

  return (
    <span ref={wrapperRef} className={`${wrapperClass}${needsBox ? ` ${styles.boxed}` : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SOURCES[variant]}
        alt={alt}
        className={styles.img}
        draggable={false}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
