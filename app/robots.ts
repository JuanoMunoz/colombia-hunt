import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/perfil",
          "/mis-proyectos",
          "/proyectos/nuevo",
          "/iniciar-sesion",
          "/registrarse",
        ],
      },
    ],
    sitemap: "https://colombiahunt.co/sitemap.xml",
  };
}
