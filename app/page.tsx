import type { Metadata } from "next";
import HeroSection from "../components/sections/HeroSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import AboutBanner from "../components/sections/AboutBanner";
import { getProjectsPage } from "../lib/project-data";
import { getAllCategories } from "../lib/catalog-data";
import { getSession } from "./lib/get-session";

export const metadata: Metadata = {
  title: "Proyectos tecnológicos de Colombia — Software y desarrollo",
  description:
    "Descubre los mejores proyectos tecnológicos hechos en Colombia: software, startups, herramientas y aplicaciones creadas por talento colombiano. Explora, comparte y publica tu proyecto.",
  keywords: [
    "tecnología Colombia",
    "software Colombia",
    "desarrollo Colombia",
    "proyectos tecnológicos colombianos",
    "startups Colombia",
    "aplicaciones colombianas",
    "Colombia Hunt",
    "proyectos open source Colombia",
  ],
  openGraph: {
    title: "Colombia Hunt — Proyectos tecnológicos de Colombia",
    description:
      "El directorio de proyectos tecnológicos hechos en Colombia. Descubre software, startups y herramientas creadas por talento colombiano.",
    type: "website",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Colombia Hunt",
  url: "https://colombiahunt.com",
  inLanguage: "es",
  description:
    "El directorio de proyectos tecnológicos hechos en Colombia: software, startups, herramientas y aplicaciones creadas por talento colombiano.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://colombiahunt.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;

  const [initialPage, allCategories, session] = await Promise.all([
    getProjectsPage({ limit: 12, query: q }),
    getAllCategories("es"),
    getSession(),
  ]);

  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection query={q} />
      <ProjectsSection
        initialPage={initialPage}
        categories={allCategories}
        hasSession={Boolean(session?.user)}
        query={q}
      />
      <AboutBanner />
    </main>
  );
}
