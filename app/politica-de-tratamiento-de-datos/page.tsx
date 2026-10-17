import type { Metadata } from "next";
import PoliticaTratamientoContent from "../../components/sections/PoliticaTratamientoContent";
import { PRIVACY_POLICY_VERSION } from "../../lib/legal";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description:
    "Conoce cómo Colombia Hunt recolecta, usa y protege tus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013, y cómo ejercer tus derechos como titular.",
  keywords: [
    "política de tratamiento de datos",
    "protección de datos personales Colombia",
    "Ley 1581 de 2012",
    "Decreto 1377 de 2013",
    "derechos del titular",
  ],
  alternates: {
    canonical: "https://colombiahunt.co/politica-de-tratamiento-de-datos",
  },
  openGraph: {
    title: "Política de tratamiento de datos — Colombia Hunt",
    description:
      "Cómo tratamos y protegemos tus datos personales y cómo ejercer tus derechos como titular.",
    locale: "es_CO",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Política de tratamiento de datos personales — Colombia Hunt",
  description:
    "Política de tratamiento de datos personales de Colombia Hunt conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.",
  inLanguage: "es",
  url: "https://colombiahunt.co/politica-de-tratamiento-de-datos",
  datePublished: PRIVACY_POLICY_VERSION,
  dateModified: PRIVACY_POLICY_VERSION,
};

export default function PoliticaTratamientoPage() {
  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PoliticaTratamientoContent />
    </main>
  );
}
