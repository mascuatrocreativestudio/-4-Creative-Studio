import type { Metadata } from "next";
import Header from "@/components/navigation/Header";
import Hero from "@/components/hero/Hero";
import MixSection from "@/components/mix/MixSection";
import TransformationSection from "@/components/transformation/TransformationSection";
import FocusSection from "@/components/focus/FocusSection";
import ContactSection from "@/components/contact/ContactSection";

/* El título y la descripción los hereda del layout, que son los de la marca.
   Acá sólo se declara la canónica.

   Va en la página y no en el layout a propósito: en el layout la heredarían
   TODAS las rutas, y una página nueva que se olvidara de declarar la suya
   diría que la versión buena de sí misma es la home. Cada ruta declara la
   propia; si falta, no hay canónica, que es un problema mucho más chico que
   una canónica equivocada. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* ESCENA 01–02 — DIFUSO → CONEXIÓN */}
        <Hero />
        {/* ESCENA 03 — CONEXIÓN → MEZCLA (solapa el último frame del Hero) */}
        <MixSection />
        {/* ESCENA 04 — MEZCLA → TRANSFORMACIÓN (solapa el último frame de MEZCLA) */}
        <TransformationSection />
        {/* ESCENA 05 — TRANSFORMACIÓN → FOCO (solapa el último frame de TRANSFORMACIÓN) */}
        <FocusSection />
        {/* CIERRE — CTA. Sección normal, sin scroll jacking. Fin de la narrativa. */}
        <ContactSection />
      </main>
    </>
  );
}
