import { ImageResponse } from "next/og";
import { brandMarkDataUri } from "@/lib/brandMarkData";

/* iOS no acepta SVG para el icono de pantalla de inicio, así que este sí tiene
   que ser PNG. Lo genera `next/og` en build a partir del mismo símbolo real que
   usa icon.svg — misma composición, sólo cambia el tamaño y el radio, porque
   iOS aplica su propia máscara. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const mark = await brandMarkDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff7524",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" width={148} height={148} />
      </div>
    ),
    size,
  );
}
