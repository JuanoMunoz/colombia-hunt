# 🛠️ Pila Tecnológica (Tech Stack) — Colombia Hunt

Documentación técnica detallada de la infraestructura, librerías, arquitectura y herramientas utilizadas en **Colombia Hunt**.

---

## ⚡ Core Framework & Runtime

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **[Next.js](https://nextjs.org/)** | `16.3.8` (App Router) | Framework React con Server Components, Server-Side Rendering (SSR) y Route Handlers optimizados. |
| **[React](https://react.dev/)** | `19.x` | Librería UI para construcción de interfaces de usuario eficientes y reactivas. |
| **[Node.js](https://nodejs.org/)** | `>= 20.x` | Entorno de ejecución de JavaScript en el servidor. |
| **[TypeScript](https://www.typescriptlang.org/)** | `5.x` | Tipado estático estricto para prevención de errores en tiempo de compilación. |

---

## 🎨 Sistema de Diseño & Estilos

| Tecnología | Descripción |
|------------|-------------|
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Framework CSS de utilidades para estilos responsivos y basados en tokens. |
| **Fuente Lexend** | Cargada localmente (`app/fonts/lexend-latin-*.woff2`) vía `next/font/local` para máximo rendimiento sin dependencias externas. |
| **Tokens del Sistema** | Anclados en `design.md` (`--brand`: `#003087`, `--background`: `#FBFAF8`, `--secondary`: `#931621`, `--flourish`: `#FFCD00`). |
| **Iconografía** | Componentes de iconos SVG nativos e hiper-ligeros (`components/ui/icons.tsx`). |

---

## 🗄️ Base de Datos & ORM

| Tecnología | Descripción |
|------------|-------------|
| **[Turso Cloud](https://turso.tech/)** | Base de datos SQLite distribuida globalmente accesible por HTTP/WebSocket. |
| **[Drizzle ORM](https://orm.drizzle.team/)** | ORM de alto rendimiento tipo-seguro con Relaciones RQB v2 (`defineRelations`). |
| **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** | Herramienta CLI para migraciones y synchronización del esquema de base de datos (`drizzle-kit push`). |

---

## 🔐 Autenticación & Seguridad

| Tecnología | Descripción |
|------------|-------------|
| **[Better Auth](https://www.better-auth.com/)** | Solución moderna de autenticación con soporte para email/contraseña y OAuth social. |
| **OAuth Providers** | Integración nativa con proveedores de identidad de **GitHub** y **Google**. |
| **Control de Acceso (RBAC)** | Roles a nivel de perfil (`user` / `admin`) con guards de servidor (`requireAdmin`) y protección de rutas `/admin`. |
| **Rate Limiting** | Algoritmo de Sliding Window por dirección IP (`app/api/_lib/rate-limit.ts`) para proteger la API contra abuso. |

---

## 📁 Almacenamiento de Archivos

| Tecnología | Descripción |
|------------|-------------|
| **[UploadThing](https://uploadthing.com/)** | Servicio de subida de archivos tipo-seguro para aplicaciones Next.js. Permite direct uploads a S3-compatible storage con límite de 4MB por imagen. |

---

## 🌍 i18n, SEO & Datos Estructurados

| Tecnología | Descripción |
|------------|-------------|
| **i18n Nativo** | Sistema de internacionalización bilingüe (Español canónico + Inglés) mediante `LanguageContext` y diccionarios centralizados. |
| **Metadata API** | Configuración dinámica de `title`, `description`, `metadataBase`, OpenGraph y Twitter Cards por cada ruta. |
| **Sitemap & Robots** | `sitemap.ts` dinámico que genera enlaces indexables para ciudades y categorías, y `robots.ts` para directivas de rastreo. |
| **JSON-LD (GEO)** | Generación de schema estructurado para buscadores e IA (`WebSite`, `WebPage`, `FAQPage`, `CollectionPage`). |

---

## 📝 Editor & Renderizado Markdown

| Componente | Descripción |
|------------|-------------|
| **`MarkdownEditor`** | Editor interactivo con barra de 10 herramientas SVG (negrita, cursiva, listas, enlaces, tablas, código, etc.) y pestaña de vista previa instantánea. |
| **`MarkdownRenderer`** | Renderizador personalizado para formatear descripciones enriquecidas de proyectos con estilos responsivos. |

---

## ⚙️ Herramientas de Desarrollo (Dev Tools)

| Herramienta | Descripción |
|-------------|-------------|
| **pnpm** | Gestor de paquetes eficiente y rápido. |
| **ESLint v9** | Linter de código con reglas estrictas de Next.js y React 19. |
