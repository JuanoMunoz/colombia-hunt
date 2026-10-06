import type { MetadataRoute } from "next";
import { getCitySlugs, getCategoryIds } from "../lib/catalog-data";

const BASE_URL = "https://colombiahunt.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
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

  // Ciudades dinámicas
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
    // Sin DB disponible en build, continuar solo con estáticas
  }

  // Categorías dinámicas
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
    // Sin DB disponible en build, continuar solo con estáticas
  }

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes];
}
