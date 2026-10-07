import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import OwnProjectsList from "../../components/sections/OwnProjectsList";
import { getAuthPageHref } from "../lib/auth-redirect";
import { getSession } from "../lib/get-session";
import { getOwnProjects } from "../../lib/project-data";

export const metadata: Metadata = {
    title: "Mis proyectos | Colombia Hunt",
    description: "Edita tus proyectos o dalos de baja cuando ya no deban aparecer en el catálogo.",
    robots: { index: false, follow: false },
};

export default async function MyProjectsPage() {
    const session = await getSession();
    if (!session?.user) {
        redirect(getAuthPageHref("/iniciar-sesion", "/mis-proyectos"));
    }

    const own = await getOwnProjects(session.user.id);
    const items = own.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        pageUrl: project.pageUrl,
        livecodeUrl: project.livecodeUrl,
        deleted: project.deleted,
        createdAt: project.createdAt ? project.createdAt.toISOString() : null,
        city: project.city,
        creator: { name: project.creator.name },
        categories: project.categories,
        likesCount: project.likesCount,
    }));

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Mis proyectos",
        description: "Gestión de proyectos propios en Colombia Hunt.",
        inLanguage: "es",
    };

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <div className="border-b border-(--brand)/10 bg-(--brand)/5">
                <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                    <Link
                        href="/perfil"
                        className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        ← Tu perfil
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold leading-10 text-(--brand)">
                        Mis proyectos
                        <span className="text-(--secondary)" aria-hidden="true">.</span>
                    </h1>
                    <p className="mt-2 text-base leading-7 text-(--foreground)/75">
                        Edita tus proyectos o dalos de baja cuando ya no deban aparecer en el catálogo.
                    </p>
                </div>
            </div>
            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                <OwnProjectsList initial={items} />
            </div>
        </main>
    );
}
