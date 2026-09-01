import type { Metadata, Viewport } from "next";
import { archivo, plexMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "+4 Creative Studio — Hacemos que tu marca entre en foco",
  description:
    "Creative studio de desarrollo comercial integral. Conectamos marca, audiencia, contenido, pauta y datos para que todo trabaje junto.",
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
      <body>{children}</body>
    </html>
  );
}
