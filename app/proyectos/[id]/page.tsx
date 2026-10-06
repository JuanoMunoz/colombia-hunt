import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetails from "../../../components/sections/ProjectDetails";
import { getProjectById, getProjectIds } from "../../../lib/project-data";
import { getSession } from "../../lib/get-session";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
};

function parseProjectId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function generateStaticParams() {
  const ids = await getProjectIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseProjectId(rawId);
  const project = id ? await getProjectById(id) : null;

  if (!project) {
    return {
      title: "Proyecto no encontrado",
      description: "El proyecto solicitado no está disponible en Colombia Hunt.",
      robots: { index: false, follow: false },
    };
  }

  const description =
    project.description
      ? `${project.description.slice(0, 155)}${project.description.length > 155 ? "…" : ""}`
      : `Conoce ${project.title}, un proyecto tecnológico de ${project.city.name} publicado en Colombia Hunt.`;

  return {
    title: project.title,
    description,
    keywords: [
      project.title,
      project.city.name,
      "proyecto tecnológico Colombia",
      "software Colombia",
      ...(project.categories.map((c) => c.name)),
    ],
    openGraph: {
      title: `${project.title} — Colombia Hunt`,
      description,
      type: "article",
      ...(project.imageUrl ? { images: [{ url: project.imageUrl, alt: project.title }] } : {}),
    },
    twitter: {
      card: project.imageUrl ? "summary_large_image" : "summary",
      title: `${project.title} — Colombia Hunt`,
      description,
    },
    alternates: { canonical: `https://colombiahunt.co/proyectos/${project.id}` },
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { id: rawId } = await params;
  const { creado } = await searchParams;
  const id = parseProjectId(rawId);
  if (!id) notFound();

  const [project, session] = await Promise.all([
    getProjectById(id),
    getSession(),
  ]);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    inLanguage: "es",
    url: `https://colombiahunt.co/proyectos/${project.id}`,
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
    ...(project.pageUrl ? { sameAs: project.pageUrl } : {}),
    applicationCategory: project.categories[0]?.name ?? "SoftwareApplication",
    author: {
      "@type": "Person",
      name: project.creator.name,
    },
    locationCreated: {
      "@type": "City",
      name: project.city.name,
      addressCountry: "CO",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectDetails
        project={project}
        created={creado === "1"}
        hasSession={Boolean(session?.user)}
      />
    </>
  );
}