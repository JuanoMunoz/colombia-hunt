"use client";

import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import type { CityRecord } from "../../lib/catalog-data";
import type { ProjectRecord, ProjectsPage } from "../../lib/project-data";
import ProjectsSection from "./ProjectsSection";

type CityContentProps = {
  city: CityRecord;
  initialPage?: ProjectsPage;
  projects?: ProjectRecord[];
  titular?: string;
  hasSession?: boolean;
};

function pickVariant(titular?: string): 0 | 1 | 2 {
  if (titular === "2") return 1;
  if (titular === "3") return 2;
  return 0;
}

export default function CityContent({
  city,
  initialPage,
  projects,
  titular,
  hasSession = false,
}: CityContentProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const translation = city.translations[lang] ?? city.translations.es;
  const cityName = translation?.name ?? city.name;
  const cityDescription = translation?.description ?? t.cityP(cityName);
  const h1 = t.cityH1[pickVariant(titular)](cityName);

  const resolvedPage: ProjectsPage =
    initialPage ?? { items: projects ?? [], hasMore: false };

  return (
    <>
      <section
        aria-labelledby="titulo-ciudad"
        className="border-b border-(--brand)/10 bg-(--brand)/5"
      >
        <div className="mx-auto flex min-h-[36svh] w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1
            id="titulo-ciudad"
            className="max-w-4xl text-3xl font-semibold leading-10 text-(--brand) sm:text-4xl"
          >
            {h1}
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="max-w-3xl text-pretty text-base leading-7 text-(--foreground) sm:text-lg sm:leading-8">
            {cityDescription}
          </p>
        </div>
      </section>
      <ProjectsSection
        heading={t.projectsInCity(cityName)}
        initialPage={resolvedPage}
        cityId={city.id}
        hasSession={hasSession}
      />
    </>
  );
}
