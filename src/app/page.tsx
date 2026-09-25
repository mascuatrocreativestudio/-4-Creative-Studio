import Header from "@/components/navigation/Header";
import Hero from "@/components/hero/Hero";
import MixSection from "@/components/mix/MixSection";
import TransformationSection from "@/components/transformation/TransformationSection";
import FocusSection from "@/components/focus/FocusSection";
import ContactSection from "@/components/contact/ContactSection";

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
