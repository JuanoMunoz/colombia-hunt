<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Protocolo de trabajo: memoria obligatoria

Para CADA task dada por el usuario, el agente DEBE seguir este flujo. Sin excepción.

## 1. Al iniciar la task

1. Leer `checklist.md` y `session.md` completos antes de escribir código.
2. Desglosar la task en subtareas concretas y registrarlas en `checklist.md` con estado `pending`.
3. Actualizar `session.md` → sección `Objetivo actual` con lo que pide el usuario en esta task.

## 2. Durante la task

- Avanzar subtarea por subtarea en el orden de `checklist.md`.
- Marcar cada subtarea como `in_progress` al empezarla y `completed` solo con verificación (lectura, build, test o ejecución real).
- No marcar `completed` por intención, solo por evidencia.

## 3. Al finalizar la task

1. Actualizar `checklist.md` con el estado final real de cada subtarea.
2. Actualizar `session.md`:
   - Añadir entrada en `Lo ya hecho (auditoría)`: qué se hizo, archivos tocados (`ruta:línea`), cómo se verificó y fecha.
   - Actualizar `Objetivo actual` → siguiente paso o `Completado`.
   - Anotar decisiones, bloqueadores y deuda si existen.
3. Nunca dejar `session.md` desactualizado: es la memoria entre sesiones.

## Formatos

- `checklist.md`: tabla `ID | Task | Subtarea | Estado | Verificación`. Estados permitidos: `pending | in_progress | completed | blocked | cancelled`.
- `session.md`: secciones fijas `Objetivo actual | Contexto | Lo ya hecho (auditoría) | Decisiones | Bloqueadores | Siguiente paso`. Cada entrada de auditoría lleva fecha `YYYY-MM-DD`.
- `design.md`: sistema de diseño (paleta, tipografía, espaciado, componentes, temas, a11y). Especifica tokens y reglas vigentes.

# Sistema de diseño y skills UI/UX: obligatorio

Antes de CUALQUIER cambio visual (CSS, Tailwind, layout, componentes, textos visibles), el agente DEBE:

1. Leer `design.md` completo y usar SOLO sus tokens/valores. Prohibido inventar colores, fuentes o espaciados fuera de él.
2. Si falta un valor (ej. color primario nuevo), proponerlo y registrarlo en `design.md` primero; solo después usarlo en código.
3. Cargar y seguir las skills disponibles de UI/UX vía la herramienta `skill` (u otro mecanismo de skills del entorno). Si existe skill de UI, UX, diseño, accesibilidad o Tailwind, invocarla antes de implementar. Si no hay ninguna disponible, dejarlo anotado en `session.md` → `Decisiones`.
4. Verificar cada cambio en light + dark, con contraste AA y foco visible; citar en el resumen la sección de `design.md` que lo autoriza.

# Desarrollo mobile-first: obligatorio

1. Diseñar y codificar primero para móvil (viewport ~360px): layout a una columna, táctil ≥44px, sin scroll horizontal.
2. Escalar con `min-width` (`sm:`, `md:`, `lg:`) solo cuando el contenido lo pida. Prohibido fijar anchos de escritorio como base.
3. Imágenes responsive (`sizes`, `priority` solo above-the-fold), fuentes Lexend legibles en pequeño, y verificar cada vista en móvil antes que en desktop.

# SEO y GEO: obligatorio

1. Cada ruta: `title` + `description` únicos en español, un solo `h1`, jerarquía `h2/h3` lógica, URLs y slugs en español.
2. HTML semántico (`header/main/nav/footer`), `lang="es"`, `alt` descriptivos en español, Open Graph + `metadataBase` canónica.
3. Rendimiento: Server Components por defecto, `loading`/`error` donde aplique, sin JS innecesario en cliente.
4. GEO (respuestas para IA/buscadores generativos): contenido factual y autocontenido por sección, datos estructurados JSON-LD (`WebSite`, `WebPage`/`Article`/`FAQPage` según aplique), y texto en español claro citable sin contexto.

# i18n: español prioritario

1. Idioma por defecto y prioritario: **español (`es`)**. Todo texto visible, `metadata`, `alt`, `aria-label`, slugs y SEO se escriben primero en español.
2. `html lang="es"`. Si se añade otro idioma después, el español sigue siendo canónico (`hreflang="es"` + `x-default` → `es`).
3. Sin mezclar idiomas en la misma vista. Los términos de marca en inglés se dejan como están, sin traducir a medias.
4. Formatos `es` (fecha, moneda, números) salvo que la vista indique otra locale.
