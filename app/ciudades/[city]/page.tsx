import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityContent from "../../../components/sections/CityContent";
import { getCityBySlug, getCitySlugs } from "../../../lib/catalog-data";
import { getProjectsPage } from "../../../lib/project-data";
import { getSession } from "../../lib/get-session";

type CityPageProps = {
    params: Promise<{ city: string }>;
    searchParams: Promise<{ titular?: string }>;
};

export async function generateStaticParams() {
    return (await getCitySlugs()).map((city) => ({ city }));
}

export async function generateMetadata({
    params,
}: CityPageProps): Promise<Metadata> {
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

export default async function CityPage({
    params,
    searchParams,
}: CityPageProps) {
    const { city: slug } = await params;
    const { titular } = await searchParams;
    const city = await getCityBySlug(slug);

    if (!city) notFound();

    const [initialPage, session] = await Promise.all([
        getProjectsPage({ cityId: city.id, limit: 12 }),
        getSession(),
    ]);

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Proyectos tecnológicos en ${city.name}`,
        description: `Proyectos tecnológicos, software y desarrollo en ${city.name}, Colombia.`,
        inLanguage: "es",
        url: `/ciudades/${city.slug}`,
    };

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <CityContent
                city={city}
                initialPage={initialPage}
                titular={titular}
                hasSession={Boolean(session?.user)}
            />
        </main>
    );
}