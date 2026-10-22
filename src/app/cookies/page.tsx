import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import { COOKIES } from "@/lib/legal";
import { SITE_NAME } from "@/lib/site";

/**
 * Página legal. Todo el contenido vive en lib/legal.ts y el molde en
 * components/legal/LegalDoc: acá sólo quedan la ruta y la metadata.
 */

const TITULO = `${COOKIES.nombreCorto} — ${SITE_NAME}`;

export const metadata: Metadata = {
  title: TITULO,
  description: COOKIES.descripcion,
  openGraph: {
    title: TITULO,
    description: COOKIES.descripcion,
  },
};

export default function CookiesPage() {
  return <LegalDoc doc={COOKIES} />;
}
