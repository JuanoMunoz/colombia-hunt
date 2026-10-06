/**
 * Sitemap dinámico — Colombia Hunt
 *
 * Se evalúa en runtime (no en build) gracias a `force-dynamic`,
 * garantizando que ciudades, categorías y proyectos reflejen
 * siempre el estado actual de la base de datos.
 */
import type { MetadataRoute } from "next";
import { getCategoryIds, getCitySlugs } from "../lib/catalog-data";
import { getProjectsForSitemap } from "../lib/project-data";

export const dynamic = "force-dynamic";

const BASE_URL = "https://colombiahunt.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /** Rutas estáticas del sitio */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contribuir`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  /** Rutas de ciudades — slugs en español desde BD */
  let cityRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getCitySlugs();
    cityRoutes = slugs.map((slug) => ({
      url: `${BASE_URL}/ciudades/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Sin conexión a BD: omitir bloque sin romper el sitemap
  }

  /** Rutas de categorías — IDs desde BD */
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const ids = await getCategoryIds();
    categoryRoutes = ids.map((id) => ({
      url: `${BASE_URL}/categorias/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sin conexión a BD: omitir bloque sin romper el sitemap
  }

  /** Rutas de proyectos activos — con `lastModified` real de BD */
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjectsForSitemap();
    projectRoutes = projects.map(({ id, updatedAt }) => ({
      url: `${BASE_URL}/proyectos/${id}`,
      lastModified: updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sin conexión a BD: omitir bloque sin romper el sitemap
  }

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes, ...projectRoutes];
}
