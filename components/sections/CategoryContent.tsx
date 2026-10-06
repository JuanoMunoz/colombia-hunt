"use client";

import Link from "next/link";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import type { CategoryRecord } from "../../lib/catalog-data";
import type { ProjectsPage } from "../../lib/project-data";
import ProjectsSection from "./ProjectsSection";

// Rotación determinista de variantes de H1 por id de categoría
function pickH1(
  variants: [(cat: string) => string, (cat: string) => string, (cat: string) => string],
  categoryId: number,
  name: string,
): string {
  return variants[categoryId % 3](name);
}

export default function CategoryContent({
  category,
  initialPage,
  hasSession = false,
}: {
  category: CategoryRecord;
  initialPage: ProjectsPage;
  hasSession?: boolean;
}) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const translation = category.translations[lang] ?? category.translations.es;
  const name = translation?.name ?? category.code;
  const h1 = pickH1(t.categoryH1, category.id, name);
  const sub = t.categorySub(name);
  const intro = translation?.description ?? t.categoryIntro(name);

  return (
    <>
      {/* Hero de categoría */}
      <section
        aria-labelledby="titulo-categoria"
        className="border-b border-(--brand)/10 bg-(--brand)/5"
      >
        <div className="mx-auto flex min-h-[30svh] w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-14 text-center sm:px-6 sm:py-20">
          {/* Acento tricolor colombiano sutil (amarillo/azul/rojo mínimo) */}
          <div className="flex h-1 w-16 overflow-hidden rounded-full opacity-90 shadow-xs" aria-hidden="true">
            <span className="w-1/2 bg-(--flourish)" />
            <span className="w-1/4 bg-(--brand)" />
            <span className="w-1/4 bg-(--secondary)" />
          </div>

          <h1
            id="titulo-categoria"
            className="max-w-4xl text-3xl font-semibold leading-10 text-(--brand) sm:text-4xl"
          >
            {h1}
            <span className="text-(--secondary)" aria-hidden="true">.</span>
          </h1>
          <p className="max-w-3xl text-pretty text-base leading-7 text-(--foreground)/80 sm:text-lg sm:leading-8">
            {sub}
          </p>
        </div>
      </section>

      {/* Contexto adicional GEO-friendly */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
        <p className="max-w-3xl text-sm leading-7 text-(--foreground)/65 sm:text-base">
          {intro}
        </p>

        {/* Acentos de color: amarillo y rojo mínimos, predominio azul */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {/* Amarillo: industria colombiana */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--flourish)/40 bg-(--flourish)/15 px-3 py-1 text-xs font-semibold text-(--foreground)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--flourish)" aria-hidden="true" />
            {lang === "es" ? "Industria colombiana" : "Colombian industry"}
          </span>

          {/* Rojo: tecnología nacional */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--secondary)/25 bg-(--secondary)/8 px-3 py-1 text-xs font-semibold text-(--secondary)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--secondary)" aria-hidden="true" />
            {lang === "es" ? "Tecnología colombiana" : "Colombian technology"}
          </span>

          {/* Azul predominante: software colombiano */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--brand)/20 bg-(--brand)/5 px-3 py-1 text-xs font-semibold text-(--brand)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--brand)" aria-hidden="true" />
            {lang === "es" ? "Software hecho en Colombia" : "Software made in Colombia"}
          </span>

          <Link
            href="/contribuir"
            className="inline-flex items-center gap-1.5 rounded-full border border-(--brand)/25 bg-transparent px-3 py-1 text-xs font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {lang === "es" ? "+ Publicar mi proyecto" : "+ Publish my project"}
          </Link>
        </div>
      </div>

      {/* Grid de proyectos */}
      <ProjectsSection
        heading={t.categoryProjectsHeading(name)}
        initialPage={initialPage}
        hasSession={hasSession}
        categoryId={category.id}
      />
    </>
  );
}