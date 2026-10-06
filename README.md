# Colombia Hunt

Iniciativa de código abierto para mostrar nuestro amor por Colombia y por el
desarrollo. Aquí encontrarás los mejores proyectos tecnológicos de Colombia:
software, desarrollo y tecnología hechos en el país, con visibilidad para sus
creadores.

## Qué incluye

- **Hero con buscador**: H1 optimizado para SEO, "Colombia" en gradiente con
  los colores de la bandera y buscador del 80% del ancho (`/?q=`).
- **Chips de categorías**: Finanzas, Open Source, Entretenimiento, Educación,
  Salud e Inteligencia artificial.
- **Páginas por ciudad** (`/[city]`): 3 H1 posibles con la ciudad
  (`?titular=2|3`), el primero priorizado para alcance orgánico.
- **i18n ES/EN**: español por defecto y canónico (metadata y SEO en español),
  inglés con el switch de la navbar. El contenido responde al idioma elegido.
- **Auth con better-auth**: email+password y social (GitHub/Google),
  páginas `/iniciar-sesion`, `/registrarse` y `/contribuir`.
- **Sistema de diseño**: tokens en `design.md` (Lexend, `#003087` / `#FBFAF8` /
  `#931621` / `#FFCD00`), mobile-first, superficies claras fijas.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Lexend (local) ·
better-auth 1.x · pnpm.
UploadThing gestiona las imágenes públicas de proyectos.

## Estructura

```text
app/                  rutas (page, [city], contribuir, iniciar-sesion…), layout, api/
app/fonts/            Lexend local (next/font)
app/i18n/             LanguageContext, diccionarios ES/EN, ciudades
app/lib/              auth.ts (better-auth), auth-client.ts, get-session.ts
components/ui/        primitivas reutilizables (Chip, SearchBar, AuthForm, SocialAuthButtons)
components/layout/    Navbar
components/sections/  contenido de rutas (HeroSection, CityContent, LoginContent…)
public/img/           logos · public/*.svg  assets template
lib/                  auth.cli.ts + backend/ (propiedad del mantenedor)
db/                   schema, seed (propiedad del mantenedor)
checklist.md          desglose de tasks (protocolo en AGENTS.md)
session.md            memoria entre sesiones
design.md             sistema de diseño vigente
```

## Setup

Requisitos: Node.js 20+ y pnpm 11+.

```bash
pnpm install
cp .env.example .env   # y completa las variables
pnpm dev               # http://localhost:3000
```

Build y lint (usa `exec`: el wrapper `pnpm build` falla en algunos
entornos por el pre-check de install):

```bash
pnpm exec next build
pnpm exec eslint
```

Variables de entorno (ver `.env.example`): `BETTER_AUTH_SECRET`
(`openssl rand -base64 32`), `BETTER_AUTH_URL`, `DATABASE_URL`,
`GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET` y `UPLOADTHING_TOKEN`.

### DB

La configuración de la base de datos la mantiene el dueño del proyecto.
Para generar el schema de better-auth a partir de `lib/auth.cli.ts`:

```bash
pnpm dlx @better-auth/cli generate --config lib/auth.cli.ts --output db/auth-schema.ts
```

Aplica el schema a Turso (crea las tablas) y luego corre el seed único
(4 ciudades + 6 categorías ES/EN, idempotente):

```bash
pnpm exec drizzle-kit push
pnpm db:seed
```

### API REST del catálogo

Las colecciones sembradas se exponen con Route Handlers REST:

| Recurso | Listar / crear | Consultar / reemplazar / eliminar |
|---------|----------------|------------------------------------|
| Ciudades | `GET` / `POST /api/cities` | `GET` / `PUT` / `DELETE /api/cities/:id` |
| Categorías | `GET` / `POST /api/categories` | `GET` / `PUT` / `DELETE /api/categories/:id` |
| Proyectos | `POST /api/projects` | `DELETE /api/projects/:id` |
| Perfil propio | `GET /api/profile` | `PATCH /api/profile` |
| Imágenes de proyectos | `POST /api/uploadthing` (UploadThing) | — |

Las lecturas de ciudades y categorías son públicas. Crear un proyecto requiere
una sesión better-auth; el creador se toma de esa sesión, nunca del cuerpo de la
solicitud. El formulario está disponible en `/proyectos/nuevo` y acepta nombre,
descripción, ciudad, categorías, sitio/demo y repositorio. La creación valida
catálogos existentes y persiste el proyecto y sus categorías en una transacción.
La imagen es opcional: se sube directamente a UploadThing mediante una ruta
autenticada, limitada a una imagen de hasta 4 MB. El token requerido es
`UPLOADTHING_TOKEN`; la URL HTTPS resultante se guarda en `projects.image_url`.
Las escrituras de ciudades y categorías requieren una sesión y un registro en
`profiles` con `role: "admin"`. Los perfiles nuevos usan `role: "user"` por
defecto. El rol se administra fuera de esta API; no hay endpoint para asignarlo
ni modificarlo.

Para aprovisionar un administrador, un operador autorizado debe ejecutar este
SQL directamente en la base de datos (sustituye el correo):

```sql
INSERT INTO profiles (user_id, role, created_at, updated_at)
SELECT id, 'admin', unixepoch(), unixepoch()
FROM user
WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin', updated_at = unixepoch();
```

Las escrituras requieren las dos traducciones `es` y `en`. Ejemplo de ciudad:

```json
{
  "code": "medellin",
  "translations": [
    {
      "locale": "es",
      "slug": "medellin",
      "name": "Medellín",
      "description": "Tecnología y desarrollo."
    },
    {
      "locale": "en",
      "slug": "medellin",
      "name": "Medellín",
      "description": "Technology and software development."
    }
  ]
}
```

Las categorías aceptan `code` y `translations` con `locale`, `name` y
`description` (sin `slug`). `PUT` reemplaza el recurso completo. Las respuestas
de error usan `{ "error": "..." }`; un conflicto de código o slug devuelve
`409`, un recurso inexistente `404`, y una ciudad con proyectos asociados no se
puede eliminar (`409`).

El perfil es privado y requiere sesión para `GET` y `PATCH`. El `PATCH`
actualiza parcialmente `name`, `githubUrl`, `linkedinUrl`, `twitterUrl` y
`whatsapp`; rechaza cualquier campo adicional, incluyendo `role`. La página
`/perfil` carga los datos en el servidor y guarda mediante este endpoint REST.

Los proyectos se eliminan con baja lógica: `deleted` pasa a `true` y
`deletedAt` registra la fecha. Solo el creador del proyecto o un administrador
pueden ejecutar `DELETE /api/projects/:id`; los proyectos borrados no aparecen
en las consultas públicas ni en páginas de detalle.

## Rutas

`/` · `/explorar` · `/contribuir` · `/sobre-nosotros` · `/perfil` ·
`/proyectos/nuevo` · `/iniciar-sesion` · `/registrarse` · `/[city]`
(ej. `/medellin`) · `/api/auth/[...all]`
(`/explorar` redirige a `/` preservando `?q`, por ahora).
