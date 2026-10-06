import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryContent from "../../../components/sections/CategoryContent";
import { getCategoryById, getCategoryIds } from "../../../lib/catalog-data";
import { getProjectsPage } from "../../../lib/project-data";
import { getSession } from "../../lib/get-session";

type CategoryPageProps = {
    params: Promise<{ id: string }>;
};

function parseCategoryId(rawId: string): number | null {
    const id = Number(rawId);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function generateStaticParams() {
    const ids = await getCategoryIds();
    return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { id: rawId } = await params;
    const id = parseCategoryId(rawId);
    const category = id ? await getCategoryById(id) : null;
    const name = category?.translations.es?.name;

    if (!category || !name) {
        return {
            title: "Categoría no encontrada",
            description: "La categoría solicitada no está disponible en Colombia Hunt.",
            robots: { index: false, follow: false },
        };
    }

    const description =
        category.translations.es?.description ??
        `Descubre los mejores proyectos de ${name} hechos en Colombia. Software, herramientas y aplicaciones de la industria colombiana de ${name}.`;

    return {
        title: `${name} en Colombia — Proyectos tecnológicos`,
        description,
        keywords: [
            `${name} Colombia`,
            `proyectos ${name} Colombia`,
            `tecnología colombiana ${name}`,
            `software ${name} Colombia`,
            "Colombia Hunt",
            "industria tecnológica colombiana",
        ],
        openGraph: {
            title: `${name} en Colombia — Colombia Hunt`,
            description,
            type: "website",
        },
        alternates: { canonical: `https://colombiahunt.co/categorias/${category.id}` },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { id: rawId } = await params;
    const id = parseCategoryId(rawId);
    if (!id) notFound();

    const [category, initialPage, session] = await Promise.all([
        getCategoryById(id),
        getProjectsPage({ categoryId: id, limit: 12 }),
        getSession(),
    ]);
    if (!category?.translations.es) notFound();

    const name = category.translations.es.name;
    const description =
        category.translations.es.description ??
        `Proyectos de ${name} desarrollados en Colombia por la comunidad tecnológica colombiana.`;

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${name} en Colombia — Proyectos tecnológicos`,
        description,
        inLanguage: "es",
        url: `https://colombiahunt.co/categorias/${category.id}`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: initialPage.items.length,
            itemListElement: initialPage.items.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.title,
                url: `https://colombiahunt.co/proyectos/${project.id}`,
            })),
        },
    };

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <CategoryContent
                category={category}
                initialPage={initialPage}
                hasSession={Boolean(session?.user)}
            />
        </main>
    );
}