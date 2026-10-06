import type { Metadata } from "next";
import ContribuirContent from "../../components/sections/ContribuirContent";

export const metadata: Metadata = {
  title: "Contribuir",
  description:
    "Publica tu proyecto tecnológico en Colombia Hunt de forma gratuita y llega a miles de desarrolladores. Aprende cómo contribuir en tres sencillos pasos.",
  keywords: [
    "publicar proyecto Colombia",
    "contribuir Colombia Hunt",
    "subir proyecto tecnológico",
    "directorio software Colombia",
    "dar visibilidad proyecto",
  ],
  openGraph: {
    title: "Contribuir — Colombia Hunt",
    description:
      "Publica tu proyecto tecnológico en el directorio de Colombia Hunt. Gratis, sin límites y con visibilidad real.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué tipo de proyectos puedo publicar en Colombia Hunt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cualquier proyecto tecnológico hecho en Colombia: aplicaciones web o móviles, librerías, APIs, herramientas de productividad, bots, plataformas SaaS, proyectos de datos, inteligencia artificial, videojuegos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito que mi proyecto sea open source para publicarlo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Puedes publicar proyectos propietarios, freemium o de código cerrado. Lo importante es que sea tecnológico y esté vinculado a Colombia.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es gratuito publicar en Colombia Hunt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, completamente. Colombia Hunt es gratuito para siempre para publicar y explorar proyectos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo creo una cuenta en Colombia Hunt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes registrarte con tu correo electrónico y una contraseña, o con tu cuenta de GitHub o Google en un solo clic. El proceso tarda menos de un minuto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo editar o eliminar mi proyecto después de publicarlo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Desde tu perfil puedes actualizar los datos de tu proyecto en cualquier momento o eliminar el proyecto si lo necesitas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Colombia Hunt es de código abierto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. El código de Colombia Hunt está disponible públicamente. Puedes ver, sugerir mejoras o contribuir directamente al desarrollo de la plataforma.",
      },
    },
  ],
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Contribuir — Colombia Hunt",
  description:
    "Publica tu proyecto tecnológico en Colombia Hunt de forma gratuita y llega a miles de desarrolladores.",
  inLanguage: "es",
  url: "https://colombiahunt.com/contribuir",
};

export default function ContribuirPage() {
  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <ContribuirContent />
    </main>
  );
}
