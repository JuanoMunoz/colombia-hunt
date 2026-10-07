# 🇨🇴 Colombia Hunt

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Turso](https://img.shields.io/badge/Turso-SQLite-4460F7?logo=turso)](https://turso.tech/)
[![Licencia](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Iniciativa de código abierto para visibilizar el talento y el ecosistema tecnológico de **Colombia**. Una plataforma centralizada donde creadores, desarrolladores y startups colombianas pueden exhibir sus proyectos de software, aplicaciones, herramientas open source e innovaciones tecnológicas.

---

## 🌟 Características Principales

- 🔍 **Buscador & Filtros por Categoría**: Búsqueda reactiva en tiempo real con chips navegables en carrusel horizontal táctil.
- 🏙️ **Fichas por Ciudad**: Páginas optimizadas para SEO orgánico por ciudad ([/ciudades/bogota](https://colombiahunt.com/ciudades/bogota), Medellín, Cali, Barranquilla, etc.).
- 🛡️ **Dashboard de Admin Protegido (`/admin`)**: Sección restringida exclusivamente a administradores con sidebar responsive para la gestión y moderación CRUD de **Ciudades**, **Categorías** y **Proyectos**.
- 🌐 **Internacionalización (i18n ES/EN)**: Español como idioma prioritario y canónico, con soporte completo para conmutar a inglés desde la barra de navegación.
- ✍️ **Editor Markdown con Preview**: Creación y edición de descripciones enriquecidas de proyectos con herramientas de formateo y vista previa instantánea.
- 🖼️ **Carga de Imágenes con UploadThing**: Subida directa y segura de capturas de proyectos en la nube.
- 🔒 **Autenticación con Better Auth**: Registro e inicio de sesión por correo/contraseña y proveedores sociales (GitHub y Google).
- 🚀 **SEO & GEO Optimizado**: Metadatos enriquecidos, Open Graph, Twitter Cards, `sitemap.xml`, `robots.txt` y datos estructurados JSON-LD (`WebSite`, `WebPage`, `FAQPage`, `CollectionPage`).
- 🎨 **Sistema de Diseño Consistente**: Paleta oficial colombiana (`#003087`, `#FBFAF8`, `#931621`, `#FFCD00`) con tipografía **Lexend** cargada localmente.

---

## 📚 Documentación Adicional

- 🛠️ **[Pila Tecnológica Detallada (TECH-STACK.md)](./TECH-STACK.md)**: Infraestructura, base de datos, ORM, autenticación y librerías utilizadas.
- 🤝 **[Guía de Contribución (CONTRIBUTING.md)](./CONTRIBUTING.md)**: Flujo de Git, estándares de código, accesibilidad y cómo enviar Pull Requests.
- 🎨 **[Sistema de Diseño (design.md)](./design.md)**: Guía única de tokens, colores, tipografía y reglas UI/UX.

---

## 📁 Estructura del Proyecto

```text
colombia-hunt/
├── app/                  # Rutas del App Router (páginas, layouts, API Route Handlers)
│   ├── admin/            # Dashboard del Admin (Inicio, Ciudades, Categorías, Proyectos)
│   ├── api/              # Route Handlers REST (cities, categories, projects, profile, uploadthing)
│   ├── ciudades/         # Rutas dinámicas de proyectos por ciudad
│   ├── categorias/       # Rutas dinámicas de proyectos por categoría
│   ├── proyectos/        # Detalle de proyectos y formulario de creación (/nuevo)
│   ├── i18n/             # Contexto de idioma, diccionarios ES/EN y listado de ciudades
│   └── fonts/            # Archivos WOFF2 de la fuente Lexend local
├── components/           # Componentes de la aplicación
│   ├── ui/               # Componentes de interfaz (Buttons, SearchBar, MarkdownEditor, Cards)
│   ├── layout/           # Componentes de layout (Navbar, AdminSidebar)
│   └── sections/         # Secciones completas de la interfaz y administradores CRUD
├── db/                   # Esquema de base de datos Drizzle ORM, migraciones y seed
├── lib/                  # Helpers de cliente HTTP, consultas de datos y autenticación
├── public/               # Assets estáticos e imágenes oficiales del sitio
├── CONTRIBUTING.md       # Guía de contribución para la comunidad
├── TECH-STACK.md         # Detalle técnico de la pila tecnológica
├── design.md             # Especificación técnica del sistema de diseño
├── checklist.md          # Desglose de tareas del proyecto
└── session.md            # Memoria del estado del desarrollo
```

---

## ⚙️ Instalación y Configuración Local

### Requisitos Previos

- **Node.js**: Versión `20.x` o superior.
- **pnpm**: Versión `11.x` o superior.

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/TU_USUARIO/colombia-hunt.git
cd colombia-hunt
pnpm install
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y completa las credenciales necesarias:

```bash
cp .env.example .env
```

Variables principales en `.env`:
- `BETTER_AUTH_SECRET`: Secreto aleatorio (generado con `openssl rand -base64 32`).
- `BETTER_AUTH_URL`: URL base local (ej. `http://localhost:3000`).
- `DATABASE_URL`: URI de la base de datos Turso SQLite.
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: Credenciales OAuth de GitHub.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Credenciales OAuth de Google.
- `UPLOADTHING_TOKEN`: Token de autenticación de UploadThing.

### 3. Base de Datos & Seed

Genera el esquema y aplica las tablas a Turso Cloud:

```bash
pnpm exec drizzle-kit push
```

Puebla la base de datos con las ciudades y categorías por defecto (idempotente):

```bash
pnpm db:seed
```

#### Aprovisionamiento de Administradores

Para otorgarle el rol de administrador a un usuario registrado, ejecuta este comando SQL directamente en la base de datos:

```sql
INSERT INTO profiles (user_id, role, created_at, updated_at)
SELECT id, 'admin', unixepoch(), unixepoch()
FROM user
WHERE email = 'tu_correo@ejemplo.com'
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin', updated_at = unixepoch();
```

### 4. Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🛠️ Comandos de Verificación

```bash
# Verificación de tipos con TypeScript
pnpm exec tsc --noEmit

# Análisis de código con ESLint
pnpm exec eslint

# Compilación de producción
pnpm exec next build
```

---

## 📡 Endpoints de la API REST

| Colección | Método & Ruta | Descripción | Acceso |
|-----------|---------------|-------------|--------|
| **Ciudades** | `GET /api/cities` | Lista todas las ciudades con sus traducciones ES/EN | Público |
| **Ciudades** | `POST /api/cities` | Crea una nueva ciudad | Solo Admin |
| **Ciudades** | `PUT / DELETE /api/cities/:id` | Actualiza o elimina una ciudad existente | Solo Admin |
| **Categorías** | `GET /api/categories` | Lista todas las categorías con sus traducciones | Público |
| **Categorías** | `POST /api/categories` | Crea una nueva categoría | Solo Admin |
| **Categorías** | `PUT / DELETE /api/categories/:id` | Actualiza o elimina una categoría existente | Solo Admin |
| **Proyectos** | `GET /api/projects/list` | Obtiene listado paginado con búsqueda y filtros | Público |
| **Proyectos** | `POST /api/projects` | Registra un nuevo proyecto en el catálogo | Autenticado |
| **Proyectos** | `GET /api/projects/mine` | Lista los proyectos del usuario activo (activos + dados de baja) | Autenticado |
| **Proyectos** | `PATCH /api/projects/:id` | Edita título, descripción, ciudad, categorías e URLs del proyecto | Creador o Admin |
| **Proyectos** | `DELETE /api/projects/:id` | Aplica baja lógica al proyecto | Creador o Admin |
| **Proyectos** | `PATCH /api/projects/:id` (`{ deleted }`) | Restaura un proyecto dado de baja (solo panel admin) | Creador o Admin |
| **Proyectos** | `POST /api/projects/:id/like` | Alterna me gusta en un proyecto | Autenticado |
| **Perfil** | `GET / PATCH /api/profile` | Obtiene o actualiza el perfil del usuario activo | Autenticado |
| **Imágenes** | `POST /api/uploadthing` | Handler para subida de imágenes de proyectos | Autenticado |

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.

Hecho con ❤️ y ☕ en **Colombia** 🇨🇴.
