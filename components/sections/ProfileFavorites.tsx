"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import type { ProjectRecord } from "../../lib/project-data";
import ProjectCard from "../ui/ProjectCard";

export default function ProfileFavorites({ initial }: { initial: ProjectRecord[] }) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const [items, setItems] = useState<ProjectRecord[]>(initial);

  if (items.length === 0) {
    return (
      <div className="mt-3 flex flex-col items-start gap-3">
        <p className="max-w-2xl text-base leading-7 text-(--foreground)/75">
          {t.profileFavoritesEmpty}
        </p>
        <Link
          href="/explorar"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
        >
          {t.profileFavoritesExplore}
        </Link>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((project) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            hasSession
            initialLiked={project.likedByMe}
            initialFavorited
            onFavoriteToggle={(favorited) => {
              if (!favorited) {
                setItems((prev) => prev.filter((item) => item.id !== project.id));
              }
            }}
          />
        </li>
      ))}
    </ul>
  );
}
