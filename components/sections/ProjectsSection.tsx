"use client";

import { useEffect, useRef, useCallback, useState, useTransition, useId } from "react";
import Link from "next/link";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import type { ProjectRecord, ProjectsPage } from "../../lib/project-data";
import ProjectCard from "../ui/ProjectCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/icons";

const PAGE_SIZE = 12;

type CategoryFilter = { id: number; name: string };

type ProjectsSectionProps = {
  heading?: string;
  /** Initial page (SSR) */
  initialPage: ProjectsPage;
  /** Available categories for chip filtering */
  categories?: CategoryFilter[];
  /** Initial category filter — also used when categoryId is set externally */
  initialCategory?: number;
  /** Fixed category filter (from a category page — not shown as chip) */
  categoryId?: number;
  /** Whether the current user has a session */
  hasSession?: boolean;
  /** City filter */
  cityId?: number;
  /** Search query filter */
  query?: string;
};

async function fetchProjects(params: {
  offset: number;
  limit: number;
  category?: number;
  city?: number;
  q?: string;
}): Promise<ProjectsPage> {
  const url = new URL("/api/projects", window.location.origin);
  url.searchParams.set("offset", String(params.offset));
  url.searchParams.set("limit", String(params.limit));
  if (params.category) url.searchParams.set("category", String(params.category));
  if (params.city) url.searchParams.set("city", String(params.city));
  if (params.q) url.searchParams.set("q", params.q);
  const res = await fetch(url.toString(), { method: "POST" });
  if (!res.ok) throw new Error("Error cargando proyectos");
  return res.json() as Promise<ProjectsPage>;
}

export default function ProjectsSection({
  heading,
  initialPage,
  categories = [],
  initialCategory,
  categoryId,
  hasSession = false,
  cityId,
  query,
}: ProjectsSectionProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const sectionHeading = heading ?? t.projectsHeading;

  // categoryId (external fixed filter) takes precedence over initialCategory
  const [activeCategory, setActiveCategory] = useState<number | undefined>(categoryId ?? initialCategory);
  const [projects, setProjects] = useState<ProjectRecord[]>(initialPage.items);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [offset, setOffset] = useState(initialPage.items.length);
  const [isLoading, startTransition] = useTransition();
  const [filterLoading, setFilterLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const categoriesId = useId();
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateCategoryScrollControls = useCallback(() => {
    const carousel = categoriesRef.current;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollPrevious(carousel.scrollLeft > 0);
    setCanScrollNext(carousel.scrollLeft < maxScrollLeft - 1);
  }, []);

  // When category chip changes — reset and fetch fresh
  const handleCategoryChange = useCallback(
    (catId: number | undefined) => {
      if (catId === activeCategory) return;
      setActiveCategory(catId);
      setFilterLoading(true);
      fetchProjects({
        offset: 0,
        limit: PAGE_SIZE,
        category: catId,
        city: cityId,
        q: query,
      })
        .then((page) => {
          setProjects(page.items);
          setHasMore(page.hasMore);
          setOffset(page.items.length);
        })
        .catch(console.error)
        .finally(() => setFilterLoading(false));
    },
    [activeCategory, cityId, query],
  );

  // Infinite scroll: load more when sentinel is visible
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    startTransition(async () => {
      try {
        const page = await fetchProjects({
          offset,
          limit: PAGE_SIZE,
          category: activeCategory,
          city: cityId,
          q: query,
        });
        setProjects((prev) => [...prev, ...page.items]);
        setHasMore(page.hasMore);
        setOffset((prev) => prev + page.items.length);
      } catch {
        // Silently fail; user can scroll again
      }
    });
  }, [isLoading, hasMore, offset, activeCategory, cityId, query]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const loading = isLoading || filterLoading;

  useEffect(() => {
    updateCategoryScrollControls();
    window.addEventListener("resize", updateCategoryScrollControls);

    return () => {
      window.removeEventListener("resize", updateCategoryScrollControls);
    };
  }, [categories.length, lang, updateCategoryScrollControls]);

  function scrollCategories(direction: -1 | 1) {
    const carousel = categoriesRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * Math.max(carousel.clientWidth * 0.75, 160),
      behavior: "auto",
    });
    updateCategoryScrollControls();
  }

  return (
    <section
      aria-labelledby="proyectos-destacados"
      className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="proyectos-destacados"
          className="text-2xl font-bold leading-8 text-(--brand)"
        >
          {sectionHeading}
        </h2>
      </div>

      {/* Category chip filters */}
      {categories.length > 0 && (
        <nav aria-label={t.categoriesNavLabel} className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            aria-label={t.categoryPrevious}
            aria-controls={categoriesId}
            disabled={!canScrollPrevious}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-(--brand)/20 text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeftIcon />
          </button>
          <div
            id={categoriesId}
            ref={categoriesRef}
            onScroll={updateCategoryScrollControls}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => handleCategoryChange(undefined)}
              aria-pressed={activeCategory === undefined}
              className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
                activeCategory === undefined
                  ? "border-transparent bg-(--brand) text-(--background)"
                  : "border-(--brand)/25 text-(--brand) hover:bg-(--brand)/5"
              }`}
            >
              {lang === "es" ? "Todos" : "All"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
                  activeCategory === cat.id
                    ? "border-transparent bg-(--secondary) text-(--background)"
                    : "border-(--brand)/25 text-(--brand) hover:bg-(--secondary)/10 hover:border-(--secondary)/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollCategories(1)}
            aria-label={t.categoryNext}
            aria-controls={categoriesId}
            disabled={!canScrollNext}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-(--brand)/20 text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRightIcon />
          </button>
        </nav>
      )}

      {/* Projects grid */}
      <div aria-live="polite" aria-atomic="false">
        {loading && projects.length === 0 ? (
          /* Skeleton while filter is loading */
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4"
                aria-hidden="true"
              >
                <div className="aspect-[16/10] animate-pulse rounded-lg bg-(--brand)/8" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-(--brand)/8" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-(--brand)/5" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasSession={hasSession}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-4 py-8">
            <p className="max-w-2xl text-pretty text-base leading-7 text-(--foreground)/75">
              {t.projectsEmpty}
            </p>
            <Link
              href="/proyectos/nuevo"
              className="inline-flex min-h-11 items-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            >
              {t.projectsEmptyCta}
            </Link>
          </div>
        )}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-1" />

      {/* Loading spinner */}
      {loading && projects.length > 0 && (
        <div
          role="status"
          aria-label={lang === "es" ? "Cargando más proyectos…" : "Loading more projects…"}
          className="mt-8 flex justify-center"
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--brand)/20 border-t-(--brand)" />
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && projects.length > 0 && (
        <p className="mt-8 text-center text-sm text-(--foreground)/50">
          {lang === "es" ? "Has visto todos los proyectos." : "You've seen all projects."}
        </p>
      )}
    </section>
  );
}