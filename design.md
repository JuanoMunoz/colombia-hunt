**Última actualización:** 2026-10-06 — identidad usuario: Lexend + `#003087` / `#FBFAF8` / `#931621` / `#FFCD00`; catálogo de proyectos y categorías basado en DB.
**Última actualización:** 2026-10-06 — identidad usuario: Lexend + `#003087` / `#FBFAF8` / `#931621` / `#FFCD00`; heroes informativos y ruta de ciudad documentados.
# Design — sistema de diseño del proyecto

> Fuente única de verdad visual. El agente DEBE leerla antes de cualquier cambio de UI y NO usar colores, fuentes ni espaciados fuera de aquí. Si falta un valor, preguntar o proponer y registrarlo aquí primero.

**Última actualización:** 2026-10-06 — identidad usuario: Lexend + `#003087` / `#FBFAF8` / `#931621` / `#FFCD00`; compartir proyecto y carrusel de categorías documentados.

## 1. Paleta

| Token | Light | Dark (provisional) | Uso |
|-------|-------|--------------------|-----|
| `--background` | `#FBFAF8` | `#081226` | Fondo base (`app/globals.css:3-6`) |
| `--foreground` | `#1A1C1E` | `#FBFAF8` | Texto cuerpo |
| `--brand` | `#003087` | `#9AB9F0` | Primario: títulos, links, botones, focos |
| `--secondary` | `#931621` | `#D97A84` | Detalles secundarios — uso puntual, NO exagerar (badges, alertas, un solo acento por vista) |
| `--flourish` | `#FFCD00` | `#FFCD00` | Detalles coquetos SOLO decorativos (p. ej. punto final). Nunca texto sobre fondo claro (sin contraste AA) |
| zinc-600 / zinc-400 | `text-zinc-600` | `dark:text-zinc-400` | LEGADO template — migrar a tokens de arriba |

Reglas:
- Solo tokens de esta tabla. Nada de hex sueltos en componentes.
- Contraste AA mínimo. `--brand` `#003087` sobre `#FBFAF8` = texto/links OK. `--flourish` `#FFCD00` NO es texto.
- `--secondary` máximo 1 uso destacado por vista.
- Dark es provisional (variantes claras para AA); usuario valida definitivo.

## 2. Tipografía

- **General + títulos:** `Lexend` local en `app/fonts/lexend-latin-{100..900}-normal.woff2`, vía `next/font/local`, variable `--font-lexend` (`app/layout.tsx`). Es la ÚNICA fuente para títulos y texto general.
- **Mono (solo código):** `Geist_Mono`, variable `--font-geist-mono`. Uso exclusivo: bloques `code`.
- **Fallback:** `Arial, Helvetica, sans-serif` si Lexend falla.
- **Escala base (actual):** `h1 text-3xl font-semibold leading-10 tracking-tight`, cuerpo `text-lg leading-8`, botones `text-base font-medium`.

## 3. Espaciado y layout

- Contenedor: `max-w-3xl`, padding `py-32 px-16` (`app/page.tsx:6`).
- Gaps: `gap-6` bloques, `gap-4` acciones, `gap-2` inline (`app/page.tsx:15,41,44`).
- Botones pill: `h-12 rounded-full px-5`, ancho `md:w-[158px]` (`app/page.tsx:43,59`).
- _(pendiente)_ Grid y breakpoints estándar — definir aquí.

## 4. Componentes

- Botón primario: `bg-(--brand) text-[#FBFAF8]` (light) / `dark:bg-(--brand) dark:text-[#081226]`; hover oscurecer brand, foco visible `outline --brand`.
- Botón secundario: borde `border-(--brand)/20`, texto `brand`, hover `bg-(--brand)/5`.
- Link énfasis: `text-(--brand) font-medium`.
- Punto final coqueto: `span text-(--flourish)` solo decorativo tras títulos, ej. `Título<span>.</span>`.
- Navbar (`components/layout/Navbar.tsx`): `sticky top-0 z-50` + clase `surface-light` (bg `#FBFAF8` FIJO en ambos temas); borde inferior `border-(--brand)/15`; logo colorido `public/img/logo_H_colombia_colorido.webp` SIN filtros (`h-9 w-auto sm:h-10`, `priority`); wordmark "Colombia Hunt" junto al logo (`hidden sm:block`, `text-lg font-bold tracking-tight text-(--brand)`, Lexend) — solo desktop/tablets, oculto en móvil; links `Explorar → /explorar`, `Sobre nosotros → /sobre-nosotros`, `Contribuir → /contribuir` (slugs español, `min-h-11`, `text-sm font-semibold`, `text-(--brand)`); switcher ES|EN segmentado (`aria-pressed`, `min-h-11`, borde `border-(--brand)/30`, activo `bg-(--brand)/10`); skip-link "Saltar al contenido"; foco visible `outline-(--brand)`. PROHIBIDO `dark:` dentro de superficies claras.
- Navbar móvil (`components/layout/Navbar.tsx`): debajo de `md`, conservar logo y mostrar botón hamburguesa `min-h-11 min-w-11` con nombre accesible, `aria-expanded`, `aria-controls` y cierre con Escape; el panel contiene los enlaces, ciudades y selector ES/EN en columna, con cada destino táctil de al menos 44px. Al navegar o cambiar idioma, el panel se cierra. Desde `md`, se conserva el menú inline actual. Mantener tokens `--brand`/`--foreground`/`--background`, superficie `surface-light` y foco visible; sin añadir colores ni sombras nuevas.
- Navbar móvil (`components/layout/Navbar.tsx`): debajo de `lg`, conservar logo y mostrar botón hamburguesa `min-h-11 min-w-11` con nombre accesible, `aria-expanded`, `aria-controls` y cierre con Escape; el panel contiene enlaces, ciudades y selector ES/EN en columna, con destinos táctiles de al menos 44px. Al navegar o cambiar idioma, el panel se cierra. Desde `lg`, se conserva el menú inline. Mantener tokens actuales, superficie `surface-light` y foco visible; sin colores ni sombras nuevas.
- Cuenta en navbar (`components/layout/Navbar.tsx`): mostrar Perfil → `/perfil` solo con sesión activa; sin sesión mostrar Iniciar sesión → `/iniciar-sesion`. Ocultar el acceso mientras Better Auth resuelve la sesión.
- Hero home (`app/page.tsx`): `main.surface-light` (bg `#FBFAF8` FIJO en ambos temas); sección `aria-labelledby="titulo-hero"`, `min-h-[70svh]`, H1 único "Aquí encontrarás los mejores proyectos tecnológicos de Colombia." — palabra "Colombia" con gradiente bandera `from-(--flourish) via-(--brand) to-(--secondary)` + punto final rojo `text-(--secondary)`; subtítulo ES con keywords software/desarrollo/tecnología; JSON-LD `WebSite` ES; metadata home con keywords.
- Hero de páginas informativas (`SobreNosotrosContent`, `ContribuirContent`): banda de ancho completo `bg-(--brand)/5` con borde inferior sutil `border-(--brand)/10`; contenido centrado en `max-w-5xl`, `min-h-[30svh]`, `px-4 py-14 sm:px-6 sm:py-20`; H1 único centrado (`text-3xl sm:text-4xl`, `text-(--brand)`) y punto rojo decorativo. El relato y CTA siguen debajo en una sección `max-w-3xl`, alineada a la lectura y sin tarjeta.
- Buscador (`components/ui/SearchBar.tsx`): `form role="search" action="/explorar"`, `w-[80%] mx-auto`, pill `h-14 rounded-full border-(--brand)/20 bg-white`, icono lupa SVG `aria-hidden` + `label sr-only` + `placeholder "Buscar proyectos…"`, botón submit brand; al pie del hero (`mt-auto`), sin JS.
- Filtros de categorías (`components/sections/ProjectsSection.tsx`): mostrar únicamente las categorías recibidas del catálogo/backend junto con "Todos"; en una fila horizontal deslizable con `scroll-snap`, desplazamiento táctil, controles anterior/siguiente de 44×44 px con nombres accesibles ES/EN, estados de extremo deshabilitados y foco visible. Reutilizar tokens actuales y mantener el filtro activo. No repetir categorías estáticas en el hero.
- i18n (`app/i18n/`): `LanguageContext` (`es` por defecto + `en`, persiste `colombia-hunt-lang`, sincroniza `document.documentElement.lang`) + `dictionaries.ts` (nav + hero + search + etiquetas de filtros + about + city es/en; ES canónico) + `cities.ts` (slugs→nombre). Contenido client (`HeroSection`, `SobreNosotrosContent`, `CityContent`) responde al switch; metadata + JSON-LD siempre ES.
- Tarjeta de proyecto (`components/ui/ProjectCard.tsx`): solo registros Drizzle; imagen real opcional, título enlazado a `/proyectos/[id]`, autor/perfiles y conteo real de likes de solo lectura. Sin descripción en card. Sin registros, empty state; no se insertan fixtures.
- Estado vacío de proyectos (`components/sections/ProjectsSection.tsx`): explicar que todavía no hay publicaciones y ofrecer CTA real a `/proyectos/nuevo`, que exige sesión y devuelve al flujo de creación después de iniciar sesión.
- Tarjeta de proyecto (`components/ui/ProjectCard.tsx`): usa `ProjectRecord` desde Drizzle; imagen real opcional, título enlazado a `/proyectos/[id]`, autor/perfiles reales y conteo real de likes en solo lectura. Sin descripción en card. Sin registros, mostrar empty state; nunca crear proyectos ficticios.
- Compartir proyecto (`components/ui/ProjectCard.tsx` y `components/sections/ProjectDetails.tsx`): botón con icono en la esquina superior derecha de la imagen de la tarjeta, visible al hover y al foco de teclado; en móvil debe seguir siendo visible/táctil. En el detalle, mostrar la misma acción con etiqueta visible. Objetivo táctil mínimo 44×44 px, foco visible y solo tokens existentes (`--brand`, `--background`, `--foreground`). Usar el diálogo nativo de compartir cuando esté disponible y permitir copiar el enlace como alternativa; informar el resultado con texto accesible en ES/EN.
- Detalle de proyecto (`app/proyectos/[id]/page.tsx`): consulta DB por ID, metadata ES y `notFound()` si no existe; imagen/links solo cuando el registro tiene esos valores; incluye descripción, categorías reales, creador, ciudad y likes.
- Perfil y onboarding (`app/perfil/`): conservar la edición del nombre y enlaces sociales en `max-w-3xl`, con campos agrupados, etiquetas visibles, controles `min-h-11`, `rounded-md` y borde `border-(--brand)/25`; botón guardar y estados con `aria-live`. Después del encabezado, mostrar tres acciones reales: Crear proyecto (`/proyectos/nuevo`, primario), Mis proyectos (`/mis-proyectos`, secundario) y Ver proyectos (`/explorar`, enlace); todas con objetivo táctil ≥44px, foco visible y tokens existentes. La sección resumen `Mis proyectos` muestra conteo real y hasta 3 recientes sin métricas inventadas. No inventar porcentajes de progreso ni datos de actividad.
- Mis proyectos (`app/mis-proyectos/` + `components/sections/OwnProjectsList.tsx`): hero full-width `bg-(--brand)/5` con H1 único + punto rojo; lista una columna en móvil (`max-w-3xl`), filtros locales Activos/Dados de baja con `aria-pressed`; cada fila agrupa imagen mini, título→detalle, ciudad, categorías y likes de solo lectura (tokens existentes). Acciones por proyecto activo: Editar (`/proyectos/[id]/editar`, secundario) y Dar de baja (texto `--secondary`, `min-h-11`); dados de baja en historial solo lectura con distintivo, sin botón restaurar (solo admin restaura en `/admin/proyectos`). Baja con `role=alertdialog` accesible (nombre del proyecto, confirmar/cancelar, Escape, foco gestionado, `aria-live`). Empty state con causa y CTA real a `/proyectos/nuevo`.
- Editar proyecto (`app/proyectos/[id]/editar/` + `components/sections/EditProjectForm.tsx`): reutiliza el formulario de crear (una columna `max-w-3xl`, `MarkdownEditor`, subida `projectImage` con compresión lossless previa (`lib/images/compress.ts` + `useUploadThing`), `fieldset` categorías, mismos `inputClassName` y tokens); precarga valores reales del dueño, valida igual que el POST y guarda por `PATCH /api/projects/[id]`; estados envío/error/éxito con `aria-live`. Sin colores ni sombras nuevas.
- Crear proyecto (`app/proyectos/nuevo/`): formulario móvil de una columna en `max-w-3xl`, con título, descripción, ciudad, categorías, sitio/demo, repositorio e imagen opcional; etiquetas visibles, textarea/select/inputs con tokens existentes y objetivos ≥44px. Agrupar categorías con `fieldset`/`legend`; estados de envío, carga, error y éxito accesibles con `aria-live`. La imagen se carga con UploadThing (una imagen, máximo 4 MB) y se previsualiza en `aspect-video` con `object-cover` y texto alternativo. Reutilizar tokens existentes, sin añadir colores ni sombras.
- Co-autores (`project_coauthors` + `ProjectCard` + `ProjectDetails` + `CreateProjectForm`): personas no registradas con nombre + contactos (GitHub, LinkedIn, X, Instagram, correo, WhatsApp) y flag `showAsCreator`. Autor visible: sin co-authors → creador; sin principal → creador + `+N personas`; con principal → principal (el de menor `id`) + `+N` (excluye al destacado). Card: byline `text-xs truncate` con contador y solo los links del visible; detalle: misma byline en hero + sección `Coautores` (`h2`, lista con nombre + iconos por co-author, `min-h-11`, `target _blank noopener`). Formulario: bloque `fieldset` repetible (máx. 5) con nombre + 6 contactos + checkbox principal, añadir/quitar táctiles ≥44px, nota de desempate. Iconos Instagram/correo SVG propios con `title`, tokens existentes, foco visible; sin colores ni sombras nuevas.
- Perfil: suma `Instagram` (`type="url"`) y `Correo electrónico` (`type="email"`, ≤254) junto a los 4 campos existentes, mismos `inputClassName`, etiquetas visibles y `aria-live`.
- 404 (`app/not-found.tsx`): diseño bilingüe con número 404, explicación breve y enlaces reales de regreso a inicio/explorar; contenido `max-w-3xl`, tokens actuales, foco visible y metadata ES.
- Buscador/chips/CTA ciudad → `/?q=` (index lee `?q` y muestra subtítulo centrado `Proyectos "q"` bajo el hero, `aria-live`); `/explorar` redirige al index preservando `?q` (por ahora).
- Contribuir (`app/contribuir/page.tsx` + `ContribuirContent`): `main.surface-light`; H1 + 2 párrafos ES (código abierto + visibilidad) + CTA brand → `/proyectos/nuevo`; la ruta exige sesión y conserva el retorno después del login; metadata ES.
- Auth (`app/iniciar-sesion/`, `app/registrarse/` + `SocialAuthButtons` compartido en `components/`): `main.surface-light`; card `max-w-md rounded-2xl border-(--brand)/15 p-6`; botones sociales GitHub/Google (`signIn.social`, iconos SVG, `min-h-11`, borde brand/25, hover `bg-(--brand)/5`); divisor "O continúa con"; form email+password (`min-h-11`, `label` visible, error `text-(--secondary)` + `aria-live`); submit brand; link cruzado (`/registrarse` ↔ `/iniciar-sesion`); metadata ES por ruta. Requiere OAuth en `auth.ts` + db del usuario (ver `session.md`).
- Sobre nosotros (`app/sobre-nosotros/page.tsx`): `main.surface-light` (bg `#FBFAF8` FIJO); H1 "Sobre nosotros" + punto rojo; 2 párrafos ES (iniciativa, amor por Colombia y por el desarrollo) + CTA link → `/explorar`; metadata ES sin "provisional".
- Page ciudad (`app/[city]/page.tsx`): `main.surface-light`; 3 H1 con ciudad — 1) "Proyectos tecnológicos en {Ciudad}" (PRIMARIO orgánico, default + metadata canónica), 2) "Descubre el software y la tecnología de {Ciudad}", 3) "Tecnología hecha en {Ciudad}: explora sus proyectos"; variante vía `?titular=2|3`; `generateStaticParams` con 6 ciudades (medellín, bogotá, cali, barranquilla, cartagena, bucaramanga); otros slugs ejecutan `notFound()`; slugs ES sin tildes; JSON-LD `WebPage` ES.
- Ciudad (`app/ciudades/[city]/page.tsx`): resuelve slug ES desde `city_translations`, muestra hero y proyectos reales filtrados por `cityId`; metadata y JSON-LD en español; sin proyectos, empty state con CTA para contribuir.
- Categoría (`app/categorias/[id]/page.tsx`): ID de base validado, traducción ES para metadata/H1, proyectos reales por `project_categories`, JSON-LD `CollectionPage` y `notFound()` para IDs desconocidos o inválidos.
- Página categoría (`app/categorias/[id]/page.tsx`): H1 y descripción ES desde `category_translations`, proyectos relacionados por `project_categories`, metadata única y JSON-LD `CollectionPage`; ID numérico validado y `notFound()` si no existe.
- Rutas de ciudad (`app/[city]/page.tsx` y `app/ciudades/[city]/page.tsx`): ambas aceptan solo slugs de `KNOWN_CITIES`, usan params async, `generateStaticParams`, metadata única ES, JSON-LD `WebPage` y `notFound()` para slugs desconocidos; `/ciudades/[city]` es la ruta explícita/canónica.
- Rutas de ciudad (`app/[city]/page.tsx` y `app/ciudades/[city]/page.tsx`): resuelven slugs ES desde `city_translations`, filtran proyectos reales por `cityId`, usan params async, metadata ES y JSON-LD; desconocidos → `notFound()`.
- Página categoría (`app/categorias/[id]/page.tsx`): ID de DB, traducción ES para title/description/H1, proyectos relacionados por `project_categories`, metadata y JSON-LD `CollectionPage`; ID inválido o ausente → `notFound()`.
- Dropdown Ciudades (navbar): botón `min-h-11` + menú absoluto (`aria-expanded`, cierra con Escape); VACÍO por ahora (item deshabilitado "Próximamente"); dict `ciudades`/`proximamente` es/en; al poblarse, enlazar a `/[slug]`.
- Dropdowns de catálogo (navbar): ciudades y categorías vienen de `catalogApi` y enlazan a `/ciudades/{city_translations.slug}` y `/categorias/{id}`; fallback vacío indica que no hay elementos disponibles.
- FAQ acordeón (`components/ui/FaqAccordion.tsx`): lista controlada (`role="list"`) con un solo ítem abierto a la vez; botón `aria-expanded`/`aria-controls`, panel `role="region"`/`aria-labelledby`; icono `+` rota 45° al abrirse (`transition-transform 200ms`); divide-y `--brand/10`; texto pregunta `font-semibold text-(--brand)`, respuesta `text-(--foreground)/80`. Sin colores nuevos.
- Dashboard Admin (`/admin`, `/admin/ciudades`, `/admin/categorias`, `/admin/proyectos`): acceso protegido por rol de servidor `admin` (no admin o anónimo recibe 401/403/redirect). Sidebar lateral responsive en desktop y navegación por pestañas deslizable/colapsable en móvil. Vistas CRUD con tablas adaptables y formularios accesibles para Ciudades (código + traducciones ES/EN name, slug, description), Categorías (código + traducciones ES/EN name, description) y Proyectos (listado, estado deleted y baja lógica/eliminación). Tokens existentes `--brand`, `--background`, `--secondary` y objetivos táctiles ≥44px.
- Sección `AboutBanner` (`components/sections/AboutBanner.tsx`): banda `border-t border-(--brand)/10 bg-(--brand)/3`, `max-w-5xl`, layout dos columnas en `sm+` (texto largo izq. + aside stats der.); stats son 3 fichas `rounded-xl border border-(--brand)/15 bg-(--background)` sin porcentajes de actividad inventados; dos CTAs pill brand primario + borde secundario. Contenido GEO-friendly (factual, autocontenido).
- SEO global (`app/layout.tsx`): `metadataBase` = `https://colombiahunt.com`; title template `"%s | Colombia Hunt"`; OG `siteName`, `locale es_CO`, `type website`; `twitter card summary_large_image`.
- Imágenes (`lib/images/`, `components/ui/OptimizedImage.tsx`): compresión lossless híbrida. Cliente: redimensión al borde largo (`proyecto 1920px`, `avatar futuro 512px`), strip de metadatos EXIF vía canvas, salida `image/webp` calidad `1.0` (flag `quality` reservado para futuro lossy) con fallback `image/png`; GIF animado no se recomprime (preserva animación). Servidor/CDN: Next `Image` optimizado (`avif`+`webp`, `remotePatterns` UploadThing, sin `unoptimized`). Estáticos `public/img` optimizados lossless con `scripts/optimize-images.mjs`. Auditoría 2026-10-07: `logo_H_colombia_blanco.webp` 6944 B, `logo_H_colombia_colorido.webp` 14380 B; 3 usos de `unoptimized` a retirar (card, detalle, preview formulario).
- Sitemap dinámico (`app/sitemap.ts`): rutas estáticas + slugs ES de ciudades + IDs de categorías; fall-back sin DB para el build.
- `robots.ts`: permite `/`, bloquea `/api/`, `/perfil`, `/proyectos/nuevo`, `/iniciar-sesion`, `/registrarse`; referencia sitemap.
- JSON-LD mejorado: home usa `WebSite` + `SearchAction` (`potentialAction`); `/sobre-nosotros` usa `WebPage`; `/contribuir` usa `FAQPage` (6 preguntas ES) + `WebPage`.
- _(pendiente)_ Footer — añadir ficha antes de implementarlo.

## 5. Temas y modo oscuro

- Tokens `background/foreground/brand/secondary` conmutan por `prefers-color-scheme` (`app/globals.css`) + clases `dark:` de Tailwind.
- EXCEPCIÓN — superficies claras fijas: navbar y hero llevan la clase `surface-light` (`app/globals.css`), que re-ancla los tokens a sus valores light (`#FBFAF8`/`#1A1C1E`/`#003087`/`#931621`/`#FFCD00`) + `color-scheme: light`. Quedan blancas en ambos temas por petición explícita. Dentro de ellas PROHIBIDO `dark:`.
- Todo componente nuevo debe verse bien en ambos temas. `--flourish` vale en ambos; `--brand`/`--secondary` usan variante clara en dark (ver §1).

## 6. Accesibilidad y UX

- Foco visible siempre. No quitar `outline` sin reemplazo.
- Foco visible siempre. No quitar `outline` sin reemplazo.
- Botones habilitados en toda la app: `cursor: pointer`; los deshabilitados conservan cursor de estado no disponible.
- Imágenes con `alt` (`Image` con `priority` solo above-the-fold).
- Enlaces externos con `target="_blank" rel="noopener noreferrer"`.

## 7. Cómo ampliar este archivo

1. El usuario edita directamente las tablas de arriba (paleta, tipografía, etc.).
2. El agente propone valores nuevos aquí primero y espera confirmación antes de usarlos en código.
3. Cada cambio visual en código debe citar la sección de este archivo que lo autoriza.
