"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import type { ProjectRecord } from "../../lib/project-data";
import { SocialIcon, HeartIcon } from "./icons";
import ShareProjectButton from "./ShareProjectButton";
import { useLike } from "./use-like";

type ProjectCardProps = {
  project: ProjectRecord;
  /** Pass true when the user has an active session */
  hasSession?: boolean;
  /** Pass true when the current user has already liked this project */
  initialLiked?: boolean;
};

export default function ProjectCard({
  project,
  hasSession = false,
  initialLiked = false,
}: ProjectCardProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const projectHref = `/proyectos/${project.id}`;
  const { liked, count, toggle } = useLike(
    project.id,
    initialLiked,
    project.likesCount,
    hasSession,
  );

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <div className="group relative aspect-[16/10] overflow-hidden rounded-lg">
        <Link
          href={projectHref}
          aria-label={`${t.projectOpen}: ${project.title}`}
          className="absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--brand)"
        >
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </ViewTransition>
          ) : (
            <span className="flex h-full items-center justify-center bg-(--brand)/5 text-sm text-(--foreground)/60">
              {t.projectImageUnavailable}
            </span>
          )}
        </Link>
        <ShareProjectButton
          href={projectHref}
          title={project.title}
          accessibleLabel={t.projectShareAriaLabel(project.title)}
          label={t.projectShareLabel}
          copiedMessage={t.projectShareCopied}
          sharedMessage={t.projectShareDone}
          errorMessage={t.projectShareError}
          className="absolute right-2 top-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-(--brand)/15 bg-(--background) text-(--brand) transition-opacity hover:bg-(--brand) hover:text-(--background) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate text-base font-semibold leading-6 text-(--foreground)">
            <Link
              href={projectHref}
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            >
              {project.title}
            </Link>
          </h3>
          <p className="truncate text-xs leading-4 text-(--foreground)/60">
            {project.creator.name}
            {project.city.name ? ` · ${project.city.name}` : ""}
          </p>

          {project.creator.profileLinks.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-2" aria-label={t.projectAuthor}>
              {project.creator.profileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="inline-flex items-center rounded-sm text-(--brand)/70 transition-colors hover:text-(--brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                >
                  <SocialIcon label={link.label} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Like button */}
        <button
          type="button"
          onClick={toggle}
          aria-label={liked ? t.projectUnlike : t.projectLike}
          aria-pressed={liked}
          className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-full px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
            liked
              ? "text-(--secondary)"
              : "text-(--foreground)/50 hover:text-(--secondary)"
          }`}
        >
          <HeartIcon filled={liked} className="h-5 w-5" />
          <span className="tabular-nums">{count}</span>
        </button>
      </div>
    </article>
  );
}