"use client";

import Link from "next/link";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";

const VALUES_ES = [
  {
    title: "Comunidad primero",
    desc: "Todo lo que construimos nace de y para la comunidad tecnológica colombiana. Las decisiones del producto las guía la gente que usa la plataforma.",
  },
  {
    title: "Código abierto",
    desc: "Colombia Hunt es open source. Creemos que la transparencia genera confianza y que el código abierto nos hace mejores como industria.",
  },
  {
    title: "Visibilidad real",
    desc: "No somos una lista de favoritos: somos un directorio con SEO, JSON-LD y páginas propias por proyecto para que Google también pueda encontrar tu trabajo.",
  },
  {
    title: "Gratuito para siempre",
    desc: "Publicar y explorar proyectos es y seguirá siendo gratuito. La monetización no puede estar antes que la misión.",
  },
];

const VALUES_EN = [
  {
    title: "Community first",
    desc: "Everything we build starts from and for the Colombian tech community. Product decisions are guided by the people who use the platform.",
  },
  {
    title: "Open source",
    desc: "Colombia Hunt is open source. We believe transparency builds trust and open source makes us better as an industry.",
  },
  {
    title: "Real visibility",
    desc: "We are not a favorites list: we are a directory with SEO, JSON-LD and dedicated pages per project so Google can find your work too.",
  },
  {
    title: "Free forever",
    desc: "Publishing and exploring projects is and will remain free. Monetization cannot come before the mission.",
  },
];

export default function SobreNosotrosContent() {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const values = lang === "es" ? VALUES_ES : VALUES_EN;

  const storyHeading = lang === "es" ? "Nuestra historia" : "Our story";
  const valuesHeading = lang === "es" ? "Nuestros valores" : "Our values";
  const missionText =
    lang === "es"
      ? "Dar al talento tecnológico colombiano la visibilidad que merece, sin barreras y sin costo."
      : "Give Colombian tech talent the visibility it deserves — without barriers and without cost.";

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="titulo-sobre-nosotros"
        className="border-b border-(--brand)/10 bg-(--brand)/5"
      >
        <div className="mx-auto flex min-h-[30svh] w-full max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1
            id="titulo-sobre-nosotros"
            className="max-w-3xl text-3xl font-semibold leading-10 text-(--brand) sm:text-4xl"
          >
            {t.aboutTitle}
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-(--foreground)/80">
            {t.aboutP1}
          </p>
        </div>
      </section>

      {/* Cuerpo */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">

        {/* Misión destacada */}
        <section aria-labelledby="mision-titulo">
          <blockquote
            className="border-l-4 border-(--secondary) pl-5 py-1"
            aria-labelledby="mision-titulo"
          >
            <p
              id="mision-titulo"
              className="text-lg font-semibold italic leading-8 text-(--brand)"
            >
              &ldquo;{missionText}&rdquo;
            </p>
            <footer className="mt-2 text-sm text-(--foreground)/60">Colombia Hunt</footer>
          </blockquote>
        </section>

        {/* Historia */}
        <section aria-labelledby="historia-titulo">
          <h2
            id="historia-titulo"
            className="mb-4 text-2xl font-bold tracking-tight text-(--brand)"
          >
            {storyHeading}
          </h2>
          <div className="flex flex-col gap-5 text-lg leading-8 text-(--foreground)">
            <p>{t.aboutP2}</p>
            <p>
              {lang === "es"
                ? "Colombia tiene un ecosistema tecnológico vibrante: startups que nacen en Medellín, herramientas de código abierto desde Bogotá, comunidades de desarrolladores en Cali, Barranquilla, Cartagena y Bucaramanga. Sin embargo, esos proyectos muchas veces no tienen un espacio centralizado donde el resto del mundo pueda encontrarlos. Colombia Hunt nació para ser ese espacio."
                : "Colombia has a vibrant tech ecosystem: startups born in Medellín, open source tools from Bogotá, developer communities in Cali, Barranquilla, Cartagena and Bucaramanga. Yet those projects often lack a centralized space where the rest of the world can find them. Colombia Hunt was born to be that space."}
            </p>
            <p>
              {lang === "es"
                ? "Empezamos como una idea sencilla y la fuimos construyendo en público, con código abierto, escuchando a la comunidad. Hoy cualquier persona puede publicar su proyecto, explorar lo que otros están construyendo y conectar con los creadores directamente."
                : "We started as a simple idea and built it in public, with open source code, listening to the community. Today anyone can publish their project, explore what others are building, and connect with creators directly."}
            </p>
          </div>
        </section>

        {/* Valores */}
        <section aria-labelledby="valores-titulo">
          <h2
            id="valores-titulo"
            className="mb-6 text-2xl font-bold tracking-tight text-(--brand)"
          >
            {valuesHeading}
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map(({ title, desc }) => (
              <li
                key={title}
                className="rounded-xl border border-(--brand)/15 bg-(--brand)/3 px-5 py-5"
              >
                <p className="font-semibold leading-6 text-(--brand)">{title}</p>
                <p className="mt-2 text-sm leading-6 text-(--foreground)/75">{desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="flex min-h-11 w-fit items-center rounded-full bg-(--brand) px-6 text-sm font-semibold text-[#FBFAF8] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {t.aboutCta}
          </Link>
          <Link
            href="/contribuir"
            className="flex min-h-11 w-fit items-center rounded-full border border-(--brand)/25 px-6 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {lang === "es" ? "Contribuir" : "Contribute"}
          </Link>
        </div>
      </div>
    </>
  );
}
