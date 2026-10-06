import type { Metadata } from "next";
import SobreNosotrosContent from "../../components/sections/SobreNosotrosContent";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Colombia Hunt es una iniciativa creada por y para la comunidad tecnológica de Colombia. Conoce nuestra misión: dar visibilidad al software y la tecnología hecha en el país.",
  keywords: [
    "Colombia Hunt",
    "sobre Colombia Hunt",
    "tecnología colombiana",
    "comunidad tecnológica Colombia",
    "software hecho en Colombia",
  ],
  openGraph: {
    title: "Sobre nosotros — Colombia Hunt",
    description:
      "Conoce la iniciativa que da visibilidad al software y la tecnología hechos en Colombia.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sobre nosotros — Colombia Hunt",
  description:
    "Colombia Hunt es una iniciativa para mostrar el talento tecnológico colombiano y dar visibilidad a los proyectos de software y tecnología del país.",
  inLanguage: "es",
  url: "https://colombiahunt.co/sobre-nosotros",
};

export default function SobreNosotrosPage() {
  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SobreNosotrosContent />
    </main>
  );
}
