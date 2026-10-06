import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/perfil", "/proyectos/nuevo", "/iniciar-sesion", "/registrarse"],
      },
    ],
    sitemap: "https://colombiahunt.com/sitemap.xml",
  };
}
