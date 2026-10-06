"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import type { ProjectRecord } from "../../lib/project-data";
import { SocialIcon, HeartIcon, GlobeIcon, CodeIcon } from "../ui/icons";
import ShareProjectButton from "../ui/ShareProjectButton";
import { useLike } from "../ui/use-like";
import MarkdownRenderer from "../ui/MarkdownRenderer";

export default function ProjectDetails({
  project,
  created = false,
  hasSession = false,
  initialLiked = false,
}: {
  project: ProjectRecord;
  created?: boolean;
  hasSession?: boolean;
  initialLiked?: boolean;
}) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const hasDetails = Boolean(
    project.description || project.categories.length || project.pageUrl || project.livecodeUrl,
  );
  const { liked, count, toggle } = useLike(
    project.id,
    initialLiked,
    project.likesCount,
    hasSession,
  );

  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      {/* Hero band — coherente con el resto del sitio */}
      <div className="border-b border-(--brand)/10 bg-(--brand)/5">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            ← {t.home}
          </Link>
          {created ? (
            <p
              role="status"
              className="mt-4 rounded-lg border border-(--brand)/15 bg-(--brand)/5 px-4 py-3 text-sm leading-6 text-(--foreground)"
            >
              {t.createProjectCreated}
            </p>
          ) : null}
          <header className="mt-4 flex flex-col gap-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h1 className="min-w-0 text-3xl font-bold leading-10 text-(--brand)">
                {project.title}
              </h1>
              <div className="flex shrink-0 items-center gap-1">
                <ShareProjectButton
                  href={`/proyectos/${project.id}`}
                  title={project.title}
                  accessibleLabel={t.projectShareAriaLabel(project.title)}
                  label={t.projectShareLabel}
                  copiedMessage={t.projectShareCopied}
                  sharedMessage={t.projectShareDone}
                  errorMessage={t.projectShareError}
                  showLabel
                  className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-(--brand)/20 px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                />
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={liked ? t.projectUnlike : t.projectLike}
                  aria-pressed={liked}
                  className={`mt-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
                    liked
                      ? "border-(--secondary)/30 bg-(--secondary)/10 text-(--secondary)"
                      : "border-(--brand)/20 text-(--foreground)/60 hover:border-(--secondary)/30 hover:bg-(--secondary)/10 hover:text-(--secondary)"
                  }`}
                >
                  <HeartIcon filled={liked} className="h-5 w-5" />
                  <span className="tabular-nums">{count}</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-(--foreground)/70">
              {project.creator.name} · {project.city.name}
            </p>
          </header>
        </div>
      </div>
      <article className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">

        <div className="relative mt-6 aspect-video overflow-hidden rounded-lg">
          {project.imageUrl ? (
            <ViewTransition
              name={`project-image-${project.id}`}
              share="morph"
              default="none"
            >
              <Image
                src={project.imageUrl}
                alt={`${project.title} en ${project.city.name}`}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
                priority
              />
            </ViewTransition>
          ) : (
            <div className="flex h-full items-center justify-center bg-(--brand)/5 text-sm text-(--foreground)/60">
              {t.projectImageUnavailable}
            </div>
          )}
        </div>

        {hasDetails ? (
          <section
            aria-labelledby="descripcion-proyecto"
            className="mt-8 flex flex-col gap-4"
          >
            <h2
              id="descripcion-proyecto"
              className="text-xl font-semibold leading-7 text-(--foreground)"
            >
              {t.projectDetails}
            </h2>
            {project.description ? (
              <MarkdownRenderer
                content={project.description}
                className="text-sm leading-7"
              />
            ) : null}
            {project.categories.length > 0 ? (
              <ul aria-label={t.projectTechnologies} className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categorias/${category.id}`}
                      className="inline-flex min-h-11 items-center rounded-md bg-(--brand)/8 px-2 text-sm font-medium text-(--brand) hover:bg-(--brand)/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {project.pageUrl || project.livecodeUrl ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {project.pageUrl ? (
                  <a
                    href={project.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    {t.projectLiveDemo}
                  </a>
                ) : null}
                {project.livecodeUrl ? (
                  <a
                    href={project.livecodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                  >
                    <CodeIcon className="h-4 w-4" />
                    {t.projectRepository}
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <footer className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--brand)/10 pt-6 text-sm">
          <span className="font-medium text-(--foreground)">
            {project.creator.name}
          </span>
          {project.creator.profileLinks.map((profile) => (
            <a
              key={profile.label}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              title={profile.label}
              aria-label={profile.label}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-sm font-medium text-(--brand) transition-colors hover:text-(--brand)/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            >
              <SocialIcon label={profile.label} className="h-4 w-4" />
              <span>{profile.label}</span>
            </a>
          ))}
          {project.city.slug ? (
            <Link
              href={`/ciudades/${project.city.slug}`}
              className="inline-flex min-h-11 items-center rounded-sm font-medium text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            >
              {project.city.name}
            </Link>
          ) : null}
        </footer>
      </article>
    </main>
  );
}
