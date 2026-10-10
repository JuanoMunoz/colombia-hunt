import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileAvatar from "../../../components/ui/ProfileAvatar";
import ProjectCard from "../../../components/ui/ProjectCard";
import { SocialIcon } from "../../../components/ui/icons";
import { getDict } from "../../i18n/dictionaries";
import { getSession } from "../../lib/get-session";
import { getProjects, getPublicProfile } from "../../../lib/project-data";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
    const { id } = await params;
    const profile = await getPublicProfile(id);

    if (!profile) {
        return {
            title: "Perfil no encontrado",
            description: "Este perfil no existe o ya no está disponible en Colombia Hunt.",
            robots: { index: false, follow: false },
        };
    }

    const description = `Conoce a ${profile.name}: enlaces y proyectos tecnológicos publicados en Colombia Hunt.`;
    return {
        title: `${profile.name} | Colombia Hunt`,
        description,
        openGraph: {
            title: `${profile.name} — Colombia Hunt`,
            description,
            type: "profile",
            ...(profile.image ? { images: [{ url: profile.image, alt: profile.name }] } : {}),
        },
        twitter: {
            card: profile.image ? "summary_large_image" : "summary",
            title: `${profile.name} — Colombia Hunt`,
            description,
        },
        alternates: { canonical: `https://colombiahunt.co/perfil/${profile.userId}` },
    };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const { id } = await params;
    const t = getDict("es");

    const [profile, session] = await Promise.all([
        getPublicProfile(id),
        getSession(),
    ]);
    if (!profile) notFound();

    const projects = await getProjects({ creatorId: profile.userId, limit: 50 });
    const countLabel =
        projects.length === 1 ? "1 proyecto publicado" : `${projects.length} proyectos publicados`;

    const pageJsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: profile.name,
        description: `Perfil de ${profile.name} en Colombia Hunt.`,
        inLanguage: "es",
        url: `https://colombiahunt.co/perfil/${profile.userId}`,
        mainEntity: {
            "@type": "Person",
            name: profile.name,
            ...(profile.image ? { image: profile.image } : {}),
            sameAs: profile.profileLinks.map((link) => link.url),
        },
        ...(projects.length > 0
            ? {
                hasPart: {
                    "@type": "ItemList",
                    itemListElement: projects.map((project, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        url: `https://colombiahunt.co/proyectos/${project.id}`,
                        name: project.title,
                    })),
                },
            }
            : {}),
    };

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <div className="border-b border-(--brand)/10 bg-(--brand)/5">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-6">
                    <Link
                        href="/"
                        className="self-start inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                        ← {t.home}
                    </Link>
                    <div className="mt-4">
                        <ProfileAvatar
                            name={profile.name}
                            userId={profile.userId}
                            imageUrl={profile.image}
                            fallbackLabel={t.profileAvatarFallback(profile.name)}
                        />
                    </div>
                    <h1 className="mt-4 text-3xl font-bold leading-10 text-(--brand)">
                        {profile.name}
                        <span className="text-(--secondary)" aria-hidden="true">.</span>
                    </h1>
                    <p role="status" className="mt-1 text-sm font-medium text-(--foreground)/70">
                        {countLabel}
                    </p>
                    {profile.profileLinks.length > 0 ? (
                        <ul aria-label={t.profileLinks} className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {profile.profileLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.label}
                                        aria-label={link.label}
                                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-(--brand)/20 px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                    >
                                        <SocialIcon label={link.label} className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </div>

            <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
                <h2 className="text-xl font-semibold leading-7 text-(--foreground)">
                    {t.publicProfileProjects}
                </h2>
                {projects.length === 0 ? (
                    <div className="mt-4 flex flex-col items-start gap-3">
                        <p className="text-base leading-7 text-(--foreground)/75">
                            {t.publicProfileEmpty}
                        </p>
                        <Link
                            href="/explorar"
                            className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                        >
                            {t.publicProfileBack}
                        </Link>
                    </div>
                ) : (
                    <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <li key={project.id}>
                                <ProjectCard
                                    project={project}
                                    hasSession={Boolean(session?.user)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
