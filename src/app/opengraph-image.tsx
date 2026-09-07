import { ImageResponse } from "next/og";
import { brandMarkDataUri } from "@/lib/brandMarkData";
import { SITE_TITLE } from "@/lib/site";

/* Preview social. Se genera en build con `next/og` (nativo de Next, sin
   dependencias nuevas) a partir del símbolo +4 real de public/brand. */

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#090b10";
const ORANGE = "#ff7524";
const BLUE = "#27489f";
const CREAM = "#f5eee4";
const DIM = "rgba(247, 246, 242, 0.72)";

const MONO_LINE = "+4 CREATIVE STUDIO";
const HEADLINE = ["HACEMOS QUE TU MARCA", "ENTRE EN FOCO."];

/**
 * Trae una fuente de Google como TTF para Satori.
 *
 * Pide con un User-Agent viejo a propósito: con uno moderno Google devuelve
 * woff2, que Satori no sabe leer. Y va con `text` para bajar sólo los glifos
 * que usa esta imagen.
 *
 * Si algo falla devuelve null y la imagen se arma con la fuente por defecto:
 * una preview con otra tipografía es mucho mejor que un build caído.
 */
async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
    ).then((res) => res.text());

    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [mark, archivo, mono] = await Promise.all([
    brandMarkDataUri(),
    googleFont("Archivo", 700, HEADLINE.join("")),
    googleFont("IBM+Plex+Mono", 500, MONO_LINE),
  ]);

  const fonts = [
    archivo && { name: "Archivo", data: archivo, weight: 700 as const, style: "normal" as const },
    mono && { name: "Plex", data: mono, weight: 500 as const, style: "normal" as const },
  ].filter((font): font is NonNullable<typeof font> => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: INK,
          // El mismo campo de gradientes que respira detrás del Hero.
          backgroundImage: `radial-gradient(85% 95% at -5% 105%, ${ORANGE}8c 0%, ${INK}00 58%), radial-gradient(75% 85% at 105% -5%, ${BLUE}99 0%, ${INK}00 56%)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" width={132} height={132} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: fonts.some((f) => f.name === "Plex") ? "Plex" : undefined,
              fontSize: 24,
              letterSpacing: "0.22em",
              color: DIM,
              marginBottom: 30,
            }}
          >
            {MONO_LINE}
          </div>

          {HEADLINE.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                fontFamily: fonts.some((f) => f.name === "Archivo") ? "Archivo" : undefined,
                fontSize: 78,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: CREAM,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
