"use client";

import SearchBar from "../ui/SearchBar";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";

type HeroSectionProps = {
  query?: string;
};

export default function HeroSection({ query = "" }: HeroSectionProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const q = query.trim().slice(0, 60);

  return (
    <>
      <section
        aria-labelledby="titulo-hero"
        className="mx-auto flex min-h-[70svh] w-full max-w-5xl flex-1 flex-col px-4 pt-14 pb-8 sm:px-6 sm:pt-20"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <h1
            id="titulo-hero"
            className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-(--brand) sm:text-5xl lg:text-6xl"
          >
            {t.heroTitleA}{" "}
            <span className="bg-gradient-to-r from-(--flourish) via-(--brand) to-(--secondary) bg-clip-text text-transparent">
              {t.heroCityWord}
            </span>
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-(--foreground)">
            {t.heroSub}
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <SearchBar
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            button={t.searchButton}
          />
        </div>
      </section>
      {q ? (
        <section
          aria-live="polite"
          className="mx-auto w-full max-w-5xl px-4 pb-10 text-center sm:px-6"
        >
          <h2 className="text-2xl font-bold tracking-tight text-(--brand) sm:text-3xl">
            {t.projectsFor(q)}
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h2>
        </section>
      ) : null}
    </>
  );
}
