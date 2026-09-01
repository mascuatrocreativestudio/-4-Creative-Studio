import type { CSSProperties } from "react";
import type { TransformationPiece as Piece } from "@/lib/scene";
import styles from "./TransformationSection.module.css";

/**
 * Una lámina editorial. No es una card ni una ventana: es la pieza completa,
 * con su proporción intrínseca (4:5) y sin un solo pixel recortado.
 *
 * Por eso el <img> va a width:100% / height:auto y NO lleva object-fit: el
 * elemento toma la forma de la imagen, no al revés. El único recorte posible
 * en toda la escena es que otra lámina se le ponga delante, que es lo que hace
 * un collage; el wrapper nunca la corta.
 *
 * Dos capas, y cada una existe por un motivo:
 *   .piece       posición y rotación  → la trayectoria
 *   .pieceMedia  escala               → el "acercarse"
 *
 * El label NO vive acá. Cada lámina crea su propio contexto de apilado (tiene
 * transform), así que un label hijo nunca podría dibujarse por encima de la
 * lámina de al lado: en la cascada de mobile quedaban tres de los cuatro
 * tapados. Viven en su propia capa, encima de las cuatro, con la misma
 * transform de grupo. Ver TransformationSection.
 */
export default function TransformationPiece({ piece }: { piece: Piece }) {
  return (
    <div
      className={styles.piece}
      data-piece={piece.id}
      style={{ "--z": piece.z } as CSSProperties}
    >
      <div className={styles.pieceMedia} data-piece-media={piece.id}>
        {/* <img> y no next/image: se animan transform y escala sobre el
            elemento y hace falta control directo. loading="lazy" y no eager:
            son ocho archivos, y como la posición de layout de todas es el
            centro del stage, el navegador las pide cuando el stage se acerca
            al viewport —durante MEZCLA— y llegan con cientos de svh de
            ventaja sobre el momento en que entran en escena. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={piece.src}
          alt={piece.alt}
          className={styles.pieceImg}
          draggable={false}
          decoding="async"
          loading="lazy"
        />
      </div>
    </div>
  );
}
