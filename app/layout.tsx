import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "../components/layout/Navbar";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./globals.css";

const lexend = localFont({
  variable: "--font-lexend",
  display: "swap",
  src: [
    { path: "./fonts/lexend-latin-100-normal.woff2", weight: "100", style: "normal" },
    { path: "./fonts/lexend-latin-200-normal.woff2", weight: "200", style: "normal" },
    { path: "./fonts/lexend-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/lexend-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/lexend-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/lexend-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/lexend-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/lexend-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "./fonts/lexend-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://colombiahunt.co"),
  title: {
    default: "Colombia Hunt — Proyectos tecnológicos de Colombia",
    template: "%s | Colombia Hunt",
  },
  description:
    "Descubre los mejores proyectos tecnológicos de Colombia: software, desarrollo y tecnología hechos en Colombia. Explora, comparte y publica tu proyecto.",
  openGraph: {
    siteName: "Colombia Hunt",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://colombiahunt.co",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbar />
          <div id="contenido" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
