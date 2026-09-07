/**
 * Genera los PNG de marca que se versionan en el repo:
 *
 *   src/app/opengraph-image.png   1200x630   preview social
 *   src/app/apple-icon.png         180x180   icono de pantalla de inicio iOS
 *
 * Se corre A MANO, no en el build:
 *
 *   node scripts/generate-brand-images.mjs
 *
 * Es deliberado. Cuando estas imágenes se generaban durante el build (rutas
 * opengraph-image.tsx / apple-icon.tsx), el build dependía de bajar las
 * tipografías de Google en ese momento. En Vercel esa descarga falla y Satori
 * reventaba con "Cannot read properties of undefined (reading 'split')",
 * tumbando el deploy entero. Generarlas acá y commitear el PNG saca esa
 * dependencia de red del camino crítico: el build sólo copia un archivo.
 *
 * Usa next/og, que ya viene con Next. No agrega ninguna dependencia.
 */

import { ImageResponse } from "next/og.js";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();

const INK = "#090b10";
const ORANGE = "#ff7524";
const BLUE = "#27489f";
const CREAM = "#f5eee4";
const DIM = "rgba(247, 246, 242, 0.72)";

const MONO_LINE = "+4 CREATIVE STUDIO";
const HEADLINE = ["HACEMOS QUE TU MARCA", "ENTRE EN FOCO."];

/** El símbolo +4 REAL, el mismo archivo que usa la web. No se redibuja nada. */
async function brandMark() {
  const svg = await readFile(join(ROOT, "public", "brand", "plus4-mark-white.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Baja una fuente de Google como TTF.
 *
 * Pide con un User-Agent viejo a propósito: con uno moderno Google devuelve
 * woff2, que Satori no lee. Acá sí puede tirar error si falla — es un script
 * manual, y prefiero enterarme en el momento antes que commitear una imagen
 * con la tipografía equivocada.
 */
async function googleFont(family, weight, text) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
  ).then((res) => res.text());

  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`No pude resolver el TTF de ${family}. Respuesta:\n${css.slice(0, 300)}`);

  return await fetch(url).then((res) => res.arrayBuffer());
}

async function write(name, image) {
  const buffer = Buffer.from(await image.arrayBuffer());
  const path = join(ROOT, "src", "app", name);
  await writeFile(path, buffer);
  console.log(`  ${name.padEnd(22)} ${(buffer.length / 1024).toFixed(1)} KB`);
}

async function main() {
  const [mark, archivo, mono] = await Promise.all([
    brandMark(),
    googleFont("Archivo", 700, HEADLINE.join("")),
    googleFont("IBM+Plex+Mono", 500, MONO_LINE),
  ]);

  const opengraph = new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: INK,
          // El mismo campo de gradientes que respira detrás del Hero.
          backgroundImage: `radial-gradient(85% 95% at -5% 105%, ${ORANGE}8c 0%, ${INK}00 58%), radial-gradient(75% 85% at 105% -5%, ${BLUE}99 0%, ${INK}00 56%)`,
        },
        children: [
          { type: "img", props: { src: mark, width: 132, height: 132 } },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontFamily: "Plex",
                      fontSize: 24,
                      letterSpacing: "0.22em",
                      color: DIM,
                      marginBottom: 30,
                    },
                    children: MONO_LINE,
                  },
                },
                ...HEADLINE.map((line) => ({
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontFamily: "Archivo",
                      fontSize: 78,
                      fontWeight: 700,
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                      color: CREAM,
                    },
                    children: line,
                  },
                })),
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "Plex", data: mono, weight: 500, style: "normal" },
      ],
    },
  );

  // iOS no acepta SVG para el icono de pantalla de inicio: ése sí tiene que ser
  // PNG. Misma composición que icon.svg, sin texto.
  const appleIcon = new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ORANGE,
        },
        children: [{ type: "img", props: { src: mark, width: 148, height: 148 } }],
      },
    },
    { width: 180, height: 180 },
  );

  console.log("Generando imágenes de marca:");
  await write("opengraph-image.png", opengraph);
  await write("apple-icon.png", appleIcon);
  console.log("Listo. Acordate de commitear los PNG.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
