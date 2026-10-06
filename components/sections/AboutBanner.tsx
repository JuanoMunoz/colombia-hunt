"use client";

import Link from "next/link";
import { useLanguage } from "../../app/i18n/LanguageContext";

export default function AboutBanner() {
  const { lang } = useLanguage();

  const heading =
    lang === "es"
      ? "¿Qué es Colombia Hunt?"
      : "What is Colombia Hunt?";
  const body =
    lang === "es"
      ? "Colombia Hunt es el directorio de proyectos tecnológicos hechos en Colombia. Desde aplicaciones web hasta herramientas de inteligencia artificial, recopilamos y damos visibilidad a todo lo que el talento colombiano está construyendo. Busca por ciudad, categoría o tecnología y descubre el ecosistema tech de Colombia."
      : "Colombia Hunt is the directory of tech projects made in Colombia. From web apps to artificial intelligence tools, we collect and give visibility to everything Colombian talent is building. Search by city, category or technology and discover Colombia's tech ecosystem.";
  const cta = lang === "es" ? "Explorar proyectos" : "Explore projects";
  const ctaSecondary = lang === "es" ? "Publicar mi proyecto" : "Publish my project";

  return (
    <section
      aria-labelledby="que-es-colombia-hunt"
      className="border-t border-(--brand)/10 bg-(--brand)/3"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
          <div className="flex-1">
            <h2
              id="que-es-colombia-hunt"
              className="text-2xl font-bold tracking-tight text-(--brand) sm:text-3xl"
            >
              {heading}
            </h2>
            <p className="mt-4 text-base leading-7 text-(--foreground)/80 text-pretty">
              {body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contribuir"
                className="flex min-h-11 items-center rounded-full bg-(--brand) px-5 text-sm font-semibold text-[#FBFAF8] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
              >
                {ctaSecondary}
              </Link>
              <Link
                href="/"
                className="flex min-h-11 items-center rounded-full border border-(--brand)/25 px-5 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
              >
                {cta}
              </Link>
            </div>
          </div>
          <aside className="flex flex-col gap-4 sm:w-56" aria-label={lang === "es" ? "Cifras del ecosistema" : "Ecosystem figures"}>
            {(lang === "es"
              ? [
                  { stat: "6+", label: "ciudades colombianas" },
                  { stat: "6", label: "categorías tech" },
                  { stat: "100%", label: "gratuito para siempre" },
                ]
              : [
                  { stat: "6+", label: "Colombian cities" },
                  { stat: "6", label: "tech categories" },
                  { stat: "100%", label: "free forever" },
                ]
            ).map(({ stat, label }) => (
              <div key={label} className="rounded-xl border border-(--brand)/15 bg-(--background) px-5 py-4">
                <p className="text-2xl font-extrabold text-(--brand)">{stat}</p>
                <p className="mt-0.5 text-sm text-(--foreground)/65">{label}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
