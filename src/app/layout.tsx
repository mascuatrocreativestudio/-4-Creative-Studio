import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { archivo, plexMono } from "@/lib/fonts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  /* Sólo para resolver a absolutas las URLs que Open Graph exige absolutas
     (la preview la genera opengraph-image.tsx y se enlaza sola). El dominio
     es temporal y vive únicamente en site.ts.

     A propósito NO hay `alternates.canonical`: fijar el dominio de Vercel como
     canónico ahora obligaría a migrarlo después. Se agrega al conectar el
     dominio definitivo. Tampoco hay meta keywords: no aportan nada. */
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#090b10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
