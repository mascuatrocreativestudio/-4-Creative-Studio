import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasoDoc from "@/components/casos/CasoDoc";
import { CASOS, casoPorSlug } from "@/lib/casos";
import { SITE_NAME } from "@/lib/site";

/**
 * Un caso por ruta. El contenido vive en lib/casos.ts y el molde en
 * components/casos/CasoDoc: sumar un tercer caso es agregar un objeto a CASOS
 * y nada más — la ruta, la metadata y el prerenderizado salen de acá solos.
 */

export async function generateStaticParams() {
  return CASOS.map((caso) => ({ slug: caso.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) return {};

  const titulo = `${caso.cliente} — Caso de éxito — ${SITE_NAME}`;

  return {
    title: titulo,
    description: caso.descripcion,
    alternates: { canonical: `/casos/${caso.slug}` },
    openGraph: {
      title: titulo,
      description: caso.descripcion,
      url: `/casos/${caso.slug}`,
    },
  };
}

export default async function CasoPage({ params }: Props) {
  const { slug } = await params;
  const caso = casoPorSlug(slug);
  if (!caso) notFound();

  return <CasoDoc caso={caso} />;
}
