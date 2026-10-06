# Checklist de tasks

> Desglose obligatorio de cada task. El agente lo actualiza al iniciar (crea filas en `pending`), durante (`in_progress`) y al finalizar (`completed` / `blocked` / `cancelled`) cada subtarea. Verificación = evidencia real, no intención.

## Estados

`pending | in_progress | completed | blocked | cancelled`

## Formato de tabla

| ID | Task | Subtarea | Estado | Verificación |
|----|------|----------|--------|--------------|
| T1-01 | (ejemplo) Configurar memoria | Crear `session.md` inicial | completed | Archivo leído el 2026-10-06 |
| T1-02 | (ejemplo) Configurar memoria | Actualizar `AGENTS.md` con protocolo | pending | — |

## Tasks activas

| ID | Task | Subtarea | Estado | Verificación |
|----|------|----------|--------|--------------|
| T1-01 | Setup memoria del proyecto | Crear `checklist.md`, `session.md` y protocolo en `AGENTS.md` | completed | Archivos creados/leídos el 2026-10-06 |
| T2-01 | Sistema de diseño | Crear `design.md` con paleta, tipografía, espaciado, componentes | completed | `design.md` creado y leído el 2026-10-06 |
| T2-02 | Sistema de diseño | Actualizar `AGENTS.md` para exigir `design.md` + skills UI/UX | completed | `AGENTS.md:40-51` verificado por lectura el 2026-10-06 |
| T2-03 | Sistema de diseño | Cerrar `checklist.md` y `session.md` con auditoría | completed | Tablas y lectura verificadas el 2026-10-06 |
| T3-01 | Paleta + Lexend usuario | Registrar paleta y Lexend en `design.md` | completed | `design.md:1-60` leído el 2026-10-06 |
| T3-02 | Paleta + Lexend usuario | Implementar Lexend + tokens en `layout`/`globals` | completed | `app/layout.tsx` + `app/globals.css` editados el 2026-10-06 |
| T3-03 | Paleta + Lexend usuario | Verificar build + cerrar memoria | completed | `pnpm build` + `pnpm lint` OK el 2026-10-06 |
| T4-01 | Mobile-first + SEO/GEO + i18n | Añadir a `AGENTS.md` mobile-first + SEO/GEO + sección i18n (es) | completed | `AGENTS.md` leído el 2026-10-06 |
| T4-02 | Mobile-first + SEO/GEO + i18n | Aplicar `lang="es"` + verificar build/lint | completed | `pnpm build` + `pnpm lint` OK el 2026-10-06 |
| T4-03 | Mobile-first + SEO/GEO + i18n | Cerrar `checklist.md` y `session.md` con auditoría | completed | Tablas y lectura verificadas el 2026-10-06 |
| T5-01 | Navbar sticky + i18n | Ficha navbar en `design.md` + context idioma ES/EN | completed | `design.md:38-46`, `app/i18n/` creados el 2026-10-06 |
| T5-02 | Navbar sticky + i18n | Crear componente `Navbar` sticky (logo + Explorar + Sobre nosotros) | completed | `app/components/Navbar.tsx` creado el 2026-10-06 |
| T5-03 | Navbar sticky + i18n | Integrar en `layout` + metadata ES + rutas `/explorar` `/sobre-nosotros` | completed | `app/layout.tsx`, `app/explorar/page.tsx`, `app/sobre-nosotros/page.tsx` el 2026-10-06 |
| T5-04 | Navbar sticky + i18n | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6, 4 rutas) + `pnpm lint` OK el 2026-10-06 |
| T6-01 | Hero + navbar blanca | Ficha en `design.md`: navbar blanca + hero + buscador | completed | `design.md:44-48` verificado por lectura el 2026-10-06 |
| T6-02 | Hero + navbar blanca | Navbar fondo blanco + textos brand | completed | `app/components/Navbar.tsx` verificado por lectura el 2026-10-06 |
| T6-03 | Hero + navbar blanca | Hero H1 + Colombia gradiente + punto rojo + SEO/JSON-LD | completed | `app/page.tsx` escrito el 2026-10-06 |
| T6-04 | Hero + navbar blanca | Buscador 80% bottom-center con icono | completed | `app/components/SearchBar.tsx` creado el 2026-10-06 |
| T6-05 | Hero + navbar blanca | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6) + `pnpm lint` OK el 2026-10-06 |
| T7-01 | Fix bg blanco + logo color | Ficha en `design.md`: logo colorido + superficies claras fijas | completed | `design.md:44-55` verificado por lectura el 2026-10-06 |
| T7-02 | Fix bg blanco + logo color | Navbar: logo colorido + superficie clara fija | completed | `app/components/Navbar.tsx` + `app/globals.css` el 2026-10-06 |
| T7-03 | Fix bg blanco + logo color | Hero + buscador: superficie clara fija | completed | `app/page.tsx` + `app/components/SearchBar.tsx` el 2026-10-06, grep `dark:` en `app/` = 0 |
| T7-04 | Fix bg blanco + logo color | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6) + `pnpm lint` OK el 2026-10-06 (verificado en turno T7) |
| T8-01 | Wordmark navbar | Ficha en `design.md` + nombre Colombia Hunt junto al logo (solo sm+) | completed | `design.md:44` + `app/components/Navbar.tsx` el 2026-10-06 |
| T8-02 | Wordmark navbar | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6) + `pnpm lint` OK el 2026-10-06 |
| T9-01 | Chips categorías | Ficha en `design.md` + componente `Chip` (hover rojo, icono opcional) | completed | `design.md:46` + `app/components/Chip.tsx` el 2026-10-06 |
| T9-02 | Chips categorías | Chips Finanzas/Open Source/Entretenimiento/+ bajo el buscador | completed | `app/page.tsx` el 2026-10-06 |
| T9-03 | Chips categorías | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6) + `pnpm lint` OK el 2026-10-06 |
| T10-01 | Sobre nosotros real | Ficha en `design.md` + bg blanco y contenido (iniciativa, amor por Colombia y el desarrollo) | completed | `design.md` + `app/sobre-nosotros/page.tsx` el 2026-10-06 |
| T10-02 | Sobre nosotros real | Verificar build/lint + cerrar memoria | completed | `pnpm build` (6/6) + `pnpm lint` OK el 2026-10-06 |
| T11-01 | Page [city] + dropdown | Ficha en `design.md` + page `[city]` (3 H1, `generateStaticParams`, metadata ES) | completed | `design.md` + `app/[city]/page.tsx` el 2026-10-06 |
| T11-02 | Page [city] + dropdown | Dropdown Ciudades vacío en navbar + dict es/en | completed | `app/components/Navbar.tsx` + `app/i18n/dictionaries.ts` el 2026-10-06 |
| T11-03 | Page [city] + dropdown | Verificar build/lint + cerrar memoria | completed | `pnpm build` (12/12, `/[city]` ƒ on-demand) + `pnpm lint` OK el 2026-10-06 |
| T12-01 | i18n contenido total | Dict es/en completo + `cities.ts` compartido | completed | `app/i18n/dictionaries.ts` + `app/i18n/cities.ts` el 2026-10-06 |
| T12-02 | i18n contenido total | Hero i18n + subtítulo Proyectos "q" con `?q` | completed | `HeroSection` + `page.tsx` + `SearchBar action="/"` el 2026-10-06 |
| T12-03 | i18n contenido total | Sobre nosotros i18n + explorar redirige a index (preserva q) | completed | `SobreNosotrosContent` + `explorar/page.tsx` redirect el 2026-10-06 |
| T12-04 | i18n contenido total | `[city]` i18n (3 H1 por idioma) | completed | `app/components/CityContent.tsx` + `app/[city]/page.tsx` el 2026-10-06 |
| T12-05 | i18n contenido total | Verificar build/lint + cerrar memoria | completed | `pnpm build` (12/12) + `pnpm lint` OK el 2026-10-06 |
| T13-01 | Boilerplate better-auth | Instalar `better-auth` (doc oficial `installation`) | completed | `better-auth@1.7.7` vía `pnpm add` el 2026-10-06 |
| T13-02 | Boilerplate better-auth | Back: `lib/auth.ts` (TODO db) + `/api/auth` handler + session helper | completed | `app/lib/auth.ts`, `app/api/auth/[...all]/route.ts`, `app/lib/get-session.ts` el 2026-10-06 |
| T13-03 | Boilerplate better-auth | Front: `auth-client` + `.env.example` | completed | `app/lib/auth-client.ts`, `.env.example`, `.gitignore` el 2026-10-06 |
| T13-04 | Boilerplate better-auth | Verificar build/lint + cerrar memoria | completed | `app/lib/*` creados el 2026-10-06; verificación movida a T14-02 (reestructura intermedia) |
| T14-00 | Reestructura raíz | Reparar imports (`components/`, `assets/` movidos a raíz por usuario) | completed | `app/layout.tsx`, `app/[city]`, `app/sobre-nosotros`, 3 contenidos; `pnpm exec next build` OK (12/12) |
| T14-01 | Contribuir + auth UI | Ficha en `design.md` + dict contribuir/auth es/en | completed | `design.md` + `app/i18n/dictionaries.ts` el 2026-10-06 |
| T14-02 | Contribuir + auth UI | Navbar link Contribuir + page `/contribuir` | completed | `components/Navbar.tsx` + `ContribuirContent` + `app/contribuir/page.tsx` el 2026-10-06 |
| T14-03 | Contribuir + auth UI | Pages `/iniciar-sesion` + `/registrarse` + `SocialAuthButtons` compartido | completed | `AuthForm`, `SocialAuthButtons`, `Login/RegisterContent`, 2 pages, `auth.ts` social, `.env.example` el 2026-10-06 |
| T14-04 | Contribuir + auth UI | Verificar build/lint + cerrar memoria | completed | `pnpm exec next build` (15/15) + `pnpm exec eslint` (0 errores) OK el 2026-10-06 |
| T15-01 | README + setup | README: descripción + setup + DB con comando exacto | completed | `README.md` + `lib/auth.cli.ts` (re-exporta `app/lib/auth`) el 2026-10-06 |
| T15-02 | README + setup | Cerrar memoria | completed | README verificado por lectura; build ROTO por archivos del usuario (`db/auth-schema.ts` + `app/lib/auth.cli.ts`), no tocados |
| T16-01 | Seed único | Script `db/seed.ts` (4 ciudades + 6 categorías ES/EN, idempotente) | completed | `db/seed.ts` + script `db:seed` en `package.json` el 2026-10-06 |
| T16-02 | Seed único | Ejecutar seed una vez + README | completed | Script listo + README; ejecución BLOQUEADA: `no such table: cities` (falta push del schema, zona usuario) |
| T16-03 | Seed único | Cerrar memoria | completed | Seed no ejecutado (bloqueador real); memoria cerrada con deuda el 2026-10-06 |
| T17-01 | Estructura production-grade | Research (doc Next + guías) + esquema `components/{ui,layout,sections}`, `app/fonts`, `public/img` | completed | Doc oficial `project-structure` + `src-folder` + guías SaaS el 2026-10-06 |
| T17-02 | Estructura production-grade | Mover archivos + reparar imports | completed | 11 componentes + fuentes + logos movidos; 12 imports reparados el 2026-10-06 |
| T17-03 | Estructura production-grade | Actualizar `design.md` + README + memoria, build/lint | completed | Docs al día; `pnpm exec eslint` 0 errores; build bloqueado por `relations` inexistente en `drizzle-orm@1.0.0-rc.4` (zona usuario, con diagnóstico) |
| T18-01 | Fix drizzle v1 relations | Eliminar relaciones legacy de `auth-schema.ts` y validar `schema.ts` | completed | Verificación actual: schema conserva tablas; importa/reexporta user; sin relaciones legacy |
| T18-02 | Fix drizzle v1 relations | Definir relaciones RQB v2 y conectar `db/index.ts` | completed | `db/relations.ts` usa `defineRelations`; `db/index.ts` pasa `relations` |
| T18-03 | Fix drizzle v1 relations | Buscar usos legacy y ejecutar `pnpm tsc --noEmit` | completed | `pnpm tsc --noEmit` sin salida; búsqueda global no encontró usos legacy |
| T18-04 | Fix drizzle v1 relations | Ejecutar `pnpm drizzle-kit push` | completed | Salida: `[✓] Pulling schema from database...` y `[✓] Changes applied` |
| T19-01 | Proyectos + perfil | Leer skills y registrar ficha de cards/forms en `design.md` | completed | Skills cargadas; reglas de card, detalle y perfil añadidas a `design.md` §4 |
| T19-02 | Proyectos + perfil | Crear datos mock, `ProjectCard` y grid en el index | completed | Cards mock y componente implementados; `pnpm tsc --noEmit` OK |
| T19-03 | Proyectos + perfil | Crear detalle por slug con repo, demo, descripción y autor | completed | Ruta dinámica implementada; detalle devuelve 200 y muestra descripción |
| T19-04 | Proyectos + perfil | Crear página `/perfil` para editar nombre y enlaces | completed | Acción protegida implementada; sin sesión `/perfil` redirige a `/iniciar-sesion` |
| T19-05 | Proyectos + perfil | Verificar tipos/build y cerrar memoria | completed | `pnpm tsc --noEmit`, ESLint y `pnpm exec next build` OK |
| T20-01 | Refinamiento cards + 404 | Actualizar ficha de diseño y revisar estado editado | completed | `design.md` §4 describe card minimalista, byline y 404 |
| T20-02 | Refinamiento cards + 404 | Dejar card con imagen, título, autor pequeño y likes; validar catch-all de ciudad y 404 | completed | Card sin bordes/descripcion/tecnologías; autor secundario; proyectos y ciudades desconocidos devuelven 404 |
| T20-03 | Refinamiento cards + 404 | Verificar lint/types y cerrar memoria | completed | ESLint, TypeScript y build OK; vista móvil sin scroll horizontal |
| T21-01 | Navbar mobile hamburger | Registrar patrón responsive y controles en `design.md` | in_progress | Skills `antislop-ui`/`laws-of-ux` y navbar actuales revisados |
| T21-01 | Navbar mobile hamburger | Registrar patrón responsive y controles en `design.md` | completed | `design.md` §4 registra menú `lg` móvil, controles táctiles, cierre y accesibilidad |
| T21-02 | Navbar mobile hamburger | Colapsar navegación móvil con menú accesible | in_progress | — |
| T21-02 | Navbar mobile hamburger | Colapsar navegación móvil con menú accesible | completed | Botón accesible, panel, cierre por Escape, navegación y selector de idioma implementados |
| T21-03 | Navbar mobile hamburger | Verificar tipos, lint y build; cerrar memoria | completed | TypeScript, ESLint y build OK; sin Playwright por petición del usuario |
| T22-01 | Transición + detalles card | Registrar shared view transition, byline compacto y cursor global | completed | Documentación de Next y design.md consultadas |
| T22-02 | Transición + detalles card | Aplicar morph al abrir proyecto, acercar autor y colorear corazón rojo | completed | ViewTransition comparte nombre de imagen por slug; byline compacto; corazón `--secondary` |
| T22-03 | Transición + detalles card | Aplicar cursor pointer global y validar tipos/lint/build | completed | CSS global, TypeScript, ESLint y build OK |
| T23-01 | livecodeUrl + seed | Revisar el estado del seed y añadir `livecodeUrl` al esquema `Project` | completed | Historial previo confirmó que no había ejecución exitosa; `db/schema.ts` ya declara el campo |
| T23-02 | livecodeUrl + seed | Aplicar/validar el cambio de esquema y ejecutar el seed si el estado de la base lo permite | completed | Push aplicado; TypeScript y ESLint OK; ejecución y reejecución del seed dieron 4 ciudades/8 traducciones, 6 categorías/12 traducciones |
| T23-03 | livecodeUrl + seed | Cerrar memoria con resultados y bloqueadores reales | completed | Checklist y auditoría actualizados el 2026-10-05 |
| T24-01 | Hero páginas informativas + ciudades | Registrar ficha de hero y ruta `/ciudades/[city]` | completed | Ficha en `design.md` §4; skills y guía Next dynamic-routes consultadas |
| T24-02 | Hero páginas informativas + ciudades | Centrar H1 en hero de Sobre nosotros y Contribuir | completed | H1 centrado en banda full-width; párrafos/CTA quedan en sección de lectura |
| T24-03 | Hero páginas informativas + ciudades | Añadir `/ciudades/[city]` con metadata y 404 | completed | Ruta valida `KNOWN_CITIES`, define metadata ES/JSON-LD y usa `notFound()` |
| T24-04 | Hero páginas informativas + ciudades | Ejecutar tipos, lint, build y cerrar memoria | completed | `pnpm tsc --noEmit`, ESLint focal y `pnpm exec next build` OK; Next reporta ruta dinámica |
| T25-01 | API REST catálogo + roles | Añadir `profiles.role` con default `user` y admin guard sin endpoint de cambio de rol | completed | Drizzle push aplicado; TypeScript OK; guard revisa sesión y perfil `admin` |
| T25-02 | API REST catálogo + roles | Implementar CRUD REST para ciudades y categorías con traducciones ES/EN | completed | GET/POST colección + GET/PUT/DELETE por id; escritura autenticada y con rol admin |
| T25-03 | API REST catálogo + roles | Verificar migración, tipos, lint y rutas; documentar contratos | completed | Drizzle push, TypeScript, ESLint y build OK; smoke GET ciudades (4)/categorías (6), POST anónimo 401; README documenta contratos |
| T25-04 | API REST catálogo + roles | Cerrar checklist y memoria con archivos y pruebas | completed | Checklist y auditoría actualizados el 2026-10-06 |
| T26-01 | Ciudades + HTTP client | Registrar diseño y confirmar contratos de catálogo | completed | `design.md` §4 actualizado; GET `/api/cities` público y traducciones ES/EN revisados |
| T26-02 | Ciudades + HTTP client | Hero centrado, texto `text-pretty` y cards mock en `/ciudades/[city]` | completed | H1 hero centrado, CTA retirado y grilla de mocks con nota de muestra |
| T26-03 | Ciudades + HTTP client | Crear cliente HTTP central y consumir GET ciudades desde navbar | completed | `lib/http-client.ts`; navbar consume `/api/cities` y usa traducción activa |
| T26-04 | Ciudades + HTTP client | Verificar tipos, lint/build y cerrar memoria | completed | `pnpm tsc --noEmit`, ESLint focal y `pnpm exec next build` OK |
| T26-01 | Ciudades + HTTP client | Registrar diseño y confirmar contratos de catálogo | completed | GET `/api/cities` público; `translations` es/en confirmado en el serializador |
| T26-02 | Ciudades + HTTP client | Hero centrado, texto `text-pretty` y cards mock en `/ciudades/[city]` | in_progress | — |
| T26-03 | Ciudades + HTTP client | Crear cliente HTTP central y consumir GET ciudades desde navbar | pending | — |
| T26-04 | Ciudades + HTTP client | Verificar tipos, lint/build y cerrar memoria | pending | — |
| T28-01 | Perfil API + refactor | Añadir GET/PATCH autenticado `/api/profile` con validación editable y persistencia atómica | completed | Handler autenticado; PATCH valida campos permitidos y actualiza user+profile en transacción, preservando role |
| T28-02 | Perfil API + refactor | Refactorizar `/perfil` para guardar por HTTP y retirar Server Action | completed | `ProfileForm` usa cliente HTTP y `actions.ts` eliminado; mensajes de expiración ES/EN añadidos |
| T28-03 | Perfil API + refactor | Verificar tipos, lint, build y smoke de autorización/validación | completed | TypeScript, ESLint y build OK; `GET` y `PATCH /api/profile` responden 401 sin sesión |
| T28-04 | Perfil API + refactor | Cerrar checklist y sesión con alcance verificado | completed | Memoria actualizada el 2026-10-06; escritura autenticada no probada para no modificar datos de usuario |
| T29-01 | Proyectos reales + categorías SEO | Revisar APIs/datos y registrar páginas sin mocks | in_progress | BD contiene projects/project_categories/project_likes; no hay endpoint de proyectos |
| T29-01 | Proyectos reales + categorías SEO | Revisar APIs/datos y registrar páginas sin mocks | completed | Se confirmó DB directa desde Server Components y API de catálogos; sin fixtures de proyectos |
| T29-02 | Proyectos reales + categorías SEO | Sustituir mocks por consultas DB en home, ciudades y detalle | completed | Consultas Drizzle; grep global sin MOCK_PROJECTS/MockProject/mock-projects |
| T29-03 | Proyectos reales + categorías SEO | Añadir `/categorias/[id]` con SEO y proyectos relacionados | completed | Route genera slugs desde categories y usa metadata/CollectionPage desde DB |
| T29-04 | Proyectos reales + categorías SEO | Alinear slugs del navbar/rutas con catálogos de BD | completed | Navbar lee ambas colecciones API; ciudades enlazan su slug ES y categorías el ID |
| T29-05 | Proyectos reales + categorías SEO | Validar tipos, lint/build y cerrar memoria | completed | TSC, ESLint y build local OK; seis rutas de categoría generadas |
| T27-05 | Navbar según sesión | Mostrar Perfil con sesión y Iniciar sesión sin sesión | completed | `useSession()` controla ambos menús; oculta el acceso mientras carga; tsc, ESLint y build OK |
| T30-01 | Baja lógica de proyectos | Añadir `deleted` y `deletedAt` a `projects` y aplicar el esquema | completed | Campos agregados a `db/schema.ts`; Drizzle push aplicado |
| T30-02 | Baja lógica de proyectos | Añadir DELETE autenticado para dueño del proyecto o admin | completed | `DELETE /api/projects/[id]` comprueba sesión, propiedad/rol y marca borrado con timestamp |
| T30-03 | Baja lógica de proyectos | Excluir proyectos borrados de consultas públicas y documentar permisos | completed | `getProjects` y `getProjectIds` filtran `deleted=false`; README documenta baja lógica y autorización |
| T30-04 | Baja lógica de proyectos | Validar tipos, lint/build y cerrar memoria | completed | `pnpm exec tsc --noEmit`, ESLint focal y build OK; DELETE anónimo devuelve 401; no se ejecutó DELETE autenticado sobre datos reales |
| T31-01 | Perfil como onboarding | Definir onboarding contextual en perfil y actualizar ficha de diseño | completed | Skills UI/UX, `design.md` y guías Next.js de Route Handlers/mutaciones leídos; ficha añadida en `design.md` §4 |
| T31-02 | Perfil como onboarding | Implementar creación de proyectos autenticada con validación y persistencia | completed | `POST /api/projects` valida catálogos e inserta proyecto/categorías en transacción; build y POST anónimo 401. No se mutaron datos con sesión real |
| T31-03 | Perfil como onboarding | Integrar onboarding en `/perfil` y conectar editar, crear y explorar proyectos | completed | `/perfil` enlaza al formulario funcional `/proyectos/nuevo`; visitante anónimo recibe redirect 307 a iniciar sesión |
| T32-01 | Imagen de proyecto con UploadThing | Revisar estructura del router, auth y flujo de creación vigente | completed | Inspeccionados `CreateProjectForm`, `POST /api/projects`, `/proyectos/nuevo`, auth, tipos instalados y guía Next.js de Route Handlers |
| T32-02 | Imagen de proyecto con UploadThing | Añadir ruta tipada y autenticada con validación de imágenes | completed | Router limita a una imagen de 4 MB y exige sesión; GET `/api/uploadthing` 200; TypeScript, ESLint y build OK. No se realizó una subida real |
| T32-03 | Imagen de proyecto con UploadThing | Integrar selección, vista previa y URL en el formulario de proyecto | completed | Selector, progreso/errores accesibles, vista previa y `imageUrl` conectados al POST; TypeScript y build OK |
| T32-04 | Imagen de proyecto con UploadThing | Validar y documentar configuración sin inspeccionar `.ENV`; cerrar memoria | completed | `.env.example`, README y `design.md` actualizados; GET UploadThing 200, POST anónimo 401 y formulario anónimo 307; `.ENV` intacto |
| T31-04 | Perfil como onboarding | Verificar responsive, tipos, lint/build y cerrar memoria | blocked | TypeScript, ESLint y build OK; falta inspección visual autenticada móvil/light/dark y subida real, que requieren sesión de prueba y token |
| T33-01 | SEO + contenido + FAQ | Registrar plan en checklist/session + leer skills | completed | Skills seo-audit y antislop-ui leídas el 2026-10-06 |
| T33-02 | SEO + contenido + FAQ | metadataBase + OG + sitemap.ts + robots.ts en layout | completed | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` creados el 2026-10-06; build genera `/robots.txt` y `/sitemap.xml` estáticos |
| T33-03 | SEO + contenido + FAQ | Contenido rico en /sobre-nosotros: misión blockquote, historia, valores grid | completed | `SobreNosotrosContent.tsx` reescrito; JSON-LD WebPage en `sobre-nosotros/page.tsx`; ESLint 0 errores el 2026-10-06 |
| T33-04 | SEO + contenido + FAQ | Contenido rico en /contribuir: pasos, beneficios, FAQ acordeón, JSON-LD FAQPage | completed | `ContribuirContent.tsx` reescrito; `FaqAccordion.tsx` creado; `contribuir/page.tsx` con FAQPage+WebPage JSON-LD; ESLint 0 errores el 2026-10-06 |
| T33-05 | SEO + contenido + FAQ | AboutBanner GEO-friendly en home + SearchAction JSON-LD + meta optimizadas en todas rutas | completed | `AboutBanner.tsx` integrado en home; `page.tsx` con SearchAction + keywords ampliadas; ESLint 0 errores el 2026-10-06 |
| T33-06 | SEO + contenido + FAQ | Verificar tipos, lint/build y cerrar memoria | completed | `pnpm exec next build` OK (33 páginas) + ESLint 0 errores en archivos tocados el 2026-10-06 |
| T34-01 | Rate limit + pagination + infinite scroll + likes | Registrar plan y leer estado actual | completed | API projects y schema leídos el 2026-10-06 |
| T34-02 | Rate limit + pagination + infinite scroll + likes | GET/POST /api/projects/list paginado (offset/limit) + rate limit headers | completed | Implementado con sliding window IP (30 req/min), headers X-RateLimit-* y paginación |
| T34-03 | Rate limit + pagination + infinite scroll + likes | POST /api/projects/[id]/like toggle atómico + 401 sin sesión | completed | `app/api/projects/[id]/like/route.ts` autenticado con Drizzle transaction |
| T34-04 | Rate limit + pagination + infinite scroll + likes | ProjectsSection: infinite scroll + chips sin recarga (POST /api/projects) | completed | `ProjectsSection.tsx` usa IntersectionObserver y filtra reactivamente por POST sin recargar |
| T34-05 | Rate limit + pagination + infinite scroll + likes | ProjectCard: iconos SVG redes sociales + botón like (redirect a login si no hay sesión) | completed | `ProjectCard.tsx`, `icons.tsx` (SVG titles/aria-labels), `useLike` redirect silencioso |
| T34-06 | Rate limit + pagination + infinite scroll + likes | ProjectDetails: iconos SVG + like interactivo + metadata dinámica | completed | `ProjectDetails.tsx` integrado con `useLike`, redes del creador con title/aria-label |
| T34-07 | Rate limit + pagination + infinite scroll + likes | Verificar tipos, lint/build y cerrar memoria | completed | `pnpm exec tsc --noEmit` y `pnpm exec next build` (34/34) OK el 2026-10-06 |
| T35-01 | SEO categorías + acentos tricolor + unificación diseño | H1 SEO categorías centrados en Colombia, tecnología colombiana e industria | completed | `dictionaries.ts:176-180` y `CategoryContent.tsx` con 3 variantes H1 SEO ricas |
| T35-02 | SEO categorías + acentos tricolor + unificación diseño | Integrar acentos mínimos de amarillo (--flourish) y rojo (--secondary), predominio azul | completed | Micro-franja tricolor en hero y pills amarillo ("Industria colombiana"), rojo ("Tecnología colombiana"), azul ("Software") |
| T35-03 | SEO categorías + acentos tricolor + unificación diseño | Unificar diseño de /perfil y /proyectos/nuevo con hero full-width de la app | completed | Removidos contenedores restrictivos y negative margins; hero full-width idéntico a sobre-nosotros/contribuir |
| T35-04 | SEO categorías + acentos tricolor + unificación diseño | Verificar tipos, ESLint (0 advertencias) y build (34/34) | completed | `pnpm exec tsc --noEmit`, ESLint (0 errors/0 warnings) y Next.js build 34/34 OK el 2026-10-06 |
| T36-01 | Editor Markdown con preview y visualizador | Crear componente `MarkdownEditor` con barra de herramientas e iconos SVG | completed | `components/ui/MarkdownEditor.tsx` creado con 10 acciones, pestañas y preview |
| T36-02 | Editor Markdown con preview y visualizador | Integrar `MarkdownEditor` en `CreateProjectForm.tsx` con soporte i18n y guardado MD | completed | `CreateProjectForm.tsx:135` sustituye textarea plano por `MarkdownEditor` controlado |
| T36-03 | Editor Markdown con preview y visualizador | Crear `MarkdownRenderer.tsx` y renderizar MD formateado en `ProjectDetails.tsx` | completed | `MarkdownRenderer.tsx:1` creado y conectado en `ProjectDetails.tsx:118` |
| T36-04 | Editor Markdown con preview y visualizador | Estilos CSS `.markdown-preview` con tokens de `design.md` en `globals.css` | completed | `app/globals.css:51-147` incluye estilos de tipografía, listas, tablas y código |
| T36-05 | Editor Markdown con preview y visualizador | Verificar tipos, ESLint (0 advertencias) y build (34/34) | completed | `pnpm exec tsc --noEmit` OK, ESLint 0 errores/warnings, `pnpm exec next build` 34/34 OK el 2026-10-06 |
| T37-01 | Compartir proyectos | Definir en `design.md` el botón de compartir para tarjeta y detalle | completed | `design.md` §4: ubicación, visibilidad móvil/teclado, 44×44, tokens y fallback documentados |
| T37-02 | Compartir proyectos | Implementar acción compartir con alternativa de copiar enlace y textos ES/EN | completed | En vista de detalle, el botón copió el enlace y anunció "Enlace del proyecto copiado." en el navegador |
| T37-03 | Compartir proyectos | Integrar acción en tarjeta y detalle, y validar tipos/lint/build | blocked | Vista de detalle copió el enlace; tarjeta mide 44×44 en móvil; ESLint focal y diagnósticos de archivos tocados limpios. Build/typecheck final bloqueados por import faltante en `app/api/admin/projects/route.ts`, fuera de esta tarea |
| T38-01 | Categorías sin duplicar + carrusel | Actualizar la ficha de diseño: solo categorías backend y navegación horizontal | completed | `design.md` §4: se documentan categorías del catálogo, scroll-snap, gestos táctiles y controles accesibles |
| T38-02 | Categorías sin duplicar + carrusel | Retirar las categorías estáticas del hero y conservar los filtros del backend | completed | `HeroSection` ya no renderiza categorías; diccionarios ya no contienen la lista estática |
| T38-03 | Categorías sin duplicar + carrusel | Añadir carrusel horizontal táctil con controles accesibles ES/EN | completed | En navegador, a 360 px el control siguiente desplazó `scrollLeft` 0→198; filtros actualizan `aria-pressed`; una sola navegación de categorías, sin overflow horizontal |
| T38-04 | Categorías sin duplicar + carrusel | Validar tipos, lint, build y navegación responsive | blocked | ESLint focal, diagnósticos de archivos tocados y `git diff --check` OK; build/typecheck final bloqueados por import faltante en `app/api/admin/projects/route.ts`, fuera de esta tarea |
| T39-01 | Dashboard Admin protegido | Estructura `/admin` protegida con guard de servidor y sidebar responsive (Ciudades, Categorías, Proyectos) | completed | `app/admin/layout.tsx` protege el acceso por rol `admin`, redirecciona o muestra 403; `AdminSidebar` navega responsive a las 3 secciones |
| T39-02 | Dashboard Admin protegido | CRUD UI de Ciudades (`/admin/ciudades` o tab) con listado, creación, edición y eliminación | completed | `AdminCitiesManager.tsx` permite listar, crear, editar y eliminar ciudades con traducciones ES/EN y validaciones de API |
| T39-03 | Dashboard Admin protegido | CRUD UI de Categorías (`/admin/categorias` o tab) con listado, creación, edición y eliminación | completed | `AdminCategoriesManager.tsx` permite listar, crear, editar y eliminar categorías con traducciones ES/EN y validaciones de API |
| T39-04 | Dashboard Admin protegido | CRUD UI de Proyectos (`/admin/proyectos` o tab) con listado, edición/baja lógica | completed | `AdminProjectsManager.tsx` lista proyectos con filtro (todos, activos, baja lógica), opción para dar de baja o restaurar y ver detalle |
| T39-05 | Dashboard Admin protegido | Verificar tipos, ESLint, Next build y cerrar memoria | completed | `pnpm exec tsc --noEmit` OK, ESLint 0 errores/warnings, `pnpm exec next build` 39/39 OK el 2026-10-06 |
| T40-01 | Documentación refinada | Refinar `README.md` con arquitectura, características, setup y DB | completed | `README.md` actualizado con badges, características, enlaces a nuevas guías, tabla de endpoints y guía de setup |
| T40-02 | Documentación refinada | Crear `CONTRIBUTING.md` con guía de contribución, flujo de PRs y reglas de código | completed | `CONTRIBUTING.md` creado con requisitos, flujo de ramas Git, estándares a11y/i18n/diseño y PRs |
| T40-03 | Documentación refinada | Crear `TECH-STACK.md` con detalle exhaustivo de la pila tecnológica del proyecto | completed | `TECH-STACK.md` creado con tablas de Next 16, React 19, Tailwind v4, Turso, Drizzle, Better Auth, UploadThing, Markdown e i18n |
| T40-04 | Documentación refinada | Verificar compilación, cerrar memoria y entregar la descripción para GitHub | completed | `pnpm exec tsc --noEmit` OK, `pnpm exec next build` 39/39 OK el 2026-10-06; descripción para GitHub preparada |
