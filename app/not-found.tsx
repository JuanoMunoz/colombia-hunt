import type { Metadata } from "next";
import NotFoundContent from "../components/sections/NotFoundContent";

export const metadata: Metadata = {
    title: "Página no encontrada | Colombia Hunt",
    description:
        "La página solicitada no existe. Vuelve a explorar proyectos tecnológicos de Colombia.",
    robots: { index: false, follow: false },
};

const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Página no encontrada",
    description: "La página solicitada no existe en Colombia Hunt.",
    inLanguage: "es",
};

export default function NotFound() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <NotFoundContent />
        </>
    );
}