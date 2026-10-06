import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCityBySlug, getCitySlugs } from "../../lib/catalog-data";

export async function generateStaticParams() {
  return (await getCitySlugs()).map((city) => ({ city }));
}

type CityProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ titular?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) {
    return {
      title: "Página no encontrada | Colombia Hunt",
      description: "La ciudad solicitada no está disponible en Colombia Hunt.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Proyectos tecnológicos en ${city.name} | Colombia Hunt`,
    description: city.description ?? `Descubre proyectos tecnológicos de ${city.name}, Colombia.`,
    alternates: { canonical: `/ciudades/${city.slug}` },
  };
}

export default async function CityPage({ params, searchParams }: CityProps) {
  const { city: slug } = await params;
  const { titular } = await searchParams;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const query = titular ? `?titular=${encodeURIComponent(titular)}` : "";
  redirect(`/ciudades/${city.slug}${query}`);
}
