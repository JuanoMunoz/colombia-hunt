"use client";

import Link from "next/link";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import FaqAccordion from "../ui/FaqAccordion";

const FAQ_ES = [
  {
    question: "¿Qué tipo de proyectos puedo publicar?",
    answer:
      "Cualquier proyecto tecnológico hecho en Colombia: aplicaciones web o móviles, librerías, APIs, herramientas de productividad, bots, plataformas SaaS, proyectos de datos, inteligencia artificial, videojuegos… Si tiene código y se hizo en Colombia, tiene un lugar aquí.",
  },
  {
    question: "¿Necesito que mi proyecto sea open source?",
    answer:
      "No. Puedes publicar proyectos propietarios, freemium o de código cerrado. Lo importante es que el proyecto sea tecnológico y esté vinculado a Colombia: equipo, creación o alcance.",
  },
  {
    question: "¿Es gratuito publicar?",
    answer:
      "Sí, completamente. Colombia Hunt es gratuito para siempre para publicar y explorar proyectos. Nuestra misión es dar visibilidad, no monetizar tu trabajo.",
  },
  {
    question: "¿Cómo creo una cuenta?",
    answer:
      "Puedes registrarte con tu correo electrónico y una contraseña, o con tu cuenta de GitHub o Google en un solo clic. El proceso tarda menos de un minuto.",
  },
  {
    question: "¿Puedo editar o eliminar mi proyecto después de publicarlo?",
    answer:
      "Sí. Desde tu perfil puedes actualizar los datos de tu proyecto en cualquier momento. Si quieres eliminarlo, también puedes hacerlo; la baja es lógica para mantener la integridad de la plataforma.",
  },
  {
    question: "¿Colombia Hunt es de código abierto?",
    answer:
      "Sí. El código de Colombia Hunt está disponible públicamente. Puedes ver, sugerir mejoras o contribuir directamente al desarrollo de la plataforma.",
  },
  {
    question: "¿Cómo consigo más visibilidad para mi proyecto?",
    answer:
      "Completa toda la información del proyecto (imagen, descripción, categorías, ciudad, demo y repositorio), compártelo en tus redes y con tu comunidad. Los proyectos con información completa aparecen mejor posicionados.",
  },
];

const FAQ_EN = [
  {
    question: "What kind of projects can I publish?",
    answer:
      "Any tech project made in Colombia: web or mobile apps, libraries, APIs, productivity tools, bots, SaaS platforms, data projects, AI, games… If it has code and was made in Colombia, it belongs here.",
  },
  {
    question: "Does my project need to be open source?",
    answer:
      "No. You can publish proprietary, freemium, or closed-source projects. What matters is that the project is tech-related and connected to Colombia: team, creation, or reach.",
  },
  {
    question: "Is publishing free?",
    answer:
      "Yes, completely. Colombia Hunt is free forever for publishing and exploring projects. Our mission is visibility, not monetizing your work.",
  },
  {
    question: "How do I create an account?",
    answer:
      "You can sign up with your email and a password, or with your GitHub or Google account in one click. It takes less than a minute.",
  },
  {
    question: "Can I edit or delete my project after publishing?",
    answer:
      "Yes. From your profile you can update your project details at any time. If you want to remove it, you can do that too; the deletion is logical to maintain platform integrity.",
  },
  {
    question: "Is Colombia Hunt open source?",
    answer:
      "Yes. Colombia Hunt's code is publicly available. You can view it, suggest improvements, or contribute directly to the platform's development.",
  },
  {
    question: "How do I get more visibility for my project?",
    answer:
      "Complete all project information (image, description, categories, city, demo, and repository), share it on your networks and with your community. Projects with complete information rank better.",
  },
];

const STEPS_ES = [
  { label: "Crea tu cuenta", detail: "Regístrate gratis con email o con GitHub/Google." },
  { label: "Completa tu proyecto", detail: "Nombre, descripción, ciudad, categorías e imagen." },
  { label: "Publica y comparte", detail: "Tu proyecto estará visible para toda la comunidad." },
];

const STEPS_EN = [
  { label: "Create your account", detail: "Sign up free with email or GitHub/Google." },
  { label: "Fill in your project", detail: "Name, description, city, categories and image." },
  { label: "Publish and share", detail: "Your project will be visible to the whole community." },
];

export default function ContribuirContent() {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const faqItems = lang === "es" ? FAQ_ES : FAQ_EN;
  const steps = lang === "es" ? STEPS_ES : STEPS_EN;

  const faqHeading = lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions";
  const stepsHeading = lang === "es" ? "Cómo publicar tu proyecto" : "How to publish your project";

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="titulo-contribuir"
        className="border-b border-(--brand)/10 bg-(--brand)/5"
      >
        <div className="mx-auto flex min-h-[30svh] w-full max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1
            id="titulo-contribuir"
            className="max-w-3xl text-3xl font-semibold leading-10 text-(--brand) sm:text-4xl"
          >
            {t.contributeTitle}
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-(--foreground)/80">
            {t.contributeP1}
          </p>
        </div>
      </section>

      {/* Cuerpo */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">

        {/* Por qué contribuir */}
        <section aria-labelledby="por-que-contribuir">
          <h2
            id="por-que-contribuir"
            className="mb-4 text-2xl font-bold tracking-tight text-(--brand)"
          >
            {lang === "es" ? "¿Por qué publicar tu proyecto aquí?" : "Why publish your project here?"}
          </h2>
          <p className="text-lg leading-8 text-(--foreground)">{t.contributeP2}</p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(lang === "es"
              ? [
                  { title: "Visibilidad real", desc: "Llega a miles de desarrolladores y empresas que buscan proyectos colombianos." },
                  { title: "Comunidad activa", desc: "Conecta con otros creadores, recibe feedback y construye en red." },
                  { title: "Sin costo", desc: "Publicar es gratuito para siempre. Sin planes, sin límites ocultos." },
                  { title: "SEO incluido", desc: "Cada proyecto tiene su propia página optimizada para buscadores." },
                ]
              : [
                  { title: "Real visibility", desc: "Reach thousands of developers and companies looking for Colombian projects." },
                  { title: "Active community", desc: "Connect with other creators, get feedback and build together." },
                  { title: "Free forever", desc: "Publishing is always free. No plans, no hidden limits." },
                  { title: "SEO included", desc: "Each project has its own search-engine-optimized page." },
                ]
            ).map(({ title, desc }) => (
              <li
                key={title}
                className="rounded-xl border border-(--brand)/15 bg-(--brand)/3 px-5 py-4"
              >
                <p className="font-semibold text-(--brand)">{title}</p>
                <p className="mt-1 text-sm leading-6 text-(--foreground)/75">{desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Pasos */}
        <section aria-labelledby="como-publicar">
          <h2
            id="como-publicar"
            className="mb-6 text-2xl font-bold tracking-tight text-(--brand)"
          >
            {stepsHeading}
          </h2>
          <ol className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            {steps.map(({ label, detail }, idx) => (
              <li key={idx} className="flex flex-1 gap-4 sm:flex-col sm:gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--brand) text-sm font-bold text-[#FBFAF8] sm:h-9 sm:w-9"
                >
                  {idx + 1}
                </span>
                <div>
                  <p className="font-semibold leading-6 text-(--brand)">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-(--foreground)/75">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/proyectos/nuevo"
            className="flex min-h-11 w-fit items-center rounded-full bg-(--brand) px-6 text-sm font-semibold text-[#FBFAF8] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {t.contributeCta}
          </Link>
          <Link
            href="/"
            className="flex min-h-11 w-fit items-center rounded-full border border-(--brand)/25 px-6 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {lang === "es" ? "Ver proyectos" : "Browse projects"}
          </Link>
        </div>

        {/* FAQ */}
        <section aria-labelledby="faq-titulo">
          <h2
            id="faq-titulo"
            className="mb-2 text-2xl font-bold tracking-tight text-(--brand)"
          >
            {faqHeading}
            <span className="text-(--secondary)" aria-hidden="true">.</span>
          </h2>
          <p className="mb-6 text-base leading-7 text-(--foreground)/70">
            {lang === "es"
              ? "Si tienes otra pregunta, escríbenos."
              : "If you have another question, reach out."}
          </p>
          <FaqAccordion items={faqItems} />
        </section>
      </div>
    </>
  );
}
