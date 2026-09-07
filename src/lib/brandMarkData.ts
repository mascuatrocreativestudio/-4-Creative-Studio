import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * El símbolo +4 real, como data URI, para las imágenes generadas con
 * `next/og` (favicon Apple y preview social).
 *
 * Se lee el MISMO archivo que usa la web —no hay una segunda versión del logo
 * ni una reconstrucción tipográfica—, y se sirve como data URI porque Satori
 * resuelve `<img>` sin red: en build no hay servidor al que pedirle /brand/*.
 */
export async function brandMarkDataUri(): Promise<string> {
  const svg = await readFile(
    join(process.cwd(), "public", "brand", "plus4-mark-white.svg"),
    "utf8",
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
