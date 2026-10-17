---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Tu proyecto merece vitrina — Colombia es país de desarrollo"
destination: x-feed
aspect: 1080x1080
language: es
length: 18s
angle: promo
audience: creadores de producto colombiano
---

## Intent

Promo explosiva 1:1 y corta para incitar a creadores de producto colombiano a subir su proyecto en Colombia Hunt. Vender el beneficio (vitrina + comunidad), no tour paso a paso. Hook fuerte en los primeros 2s. Tono directo, orgullo colombiano, cierre con CTA claro a /proyectos/nuevo.

## Assets

- assets/logo_H_colombia_colorido.webp — logo colorido real (`public/img/`), escena vitrina + cierre.
- assets/logo_H_colombia_blanco.webp — logo blanco real, escena final sobre brand.
- Textos reales ES de `app/i18n/dictionaries.ts`: heroTitleA + heroCityWord, heroSub, contributeP1/P2, contributeCta, createProjectTitle.
- Tokens reales `design.md` §1: --background #FBFAF8, --brand #003087, --secondary #931621, --flourish #FFCD00; Lexend.

## Customizations

- Formato 1:1 1080x1080 para feed (X/LinkedIn/Instagram).
- Hook explosivo 0–2s + micro-franja tricolor (flourish/brand/secondary) como en categorías.
- CTA final visible ≥3s: colombiahunt.co/proyectos/nuevo.

## Notes

- Sin footage stock: solo assets reales del repo. Sin emojis decorativos (antislop-ui). Táctil/contraste no aplica a video, pero texto grande legible en móvil. Español canónico.
- `npx hyperframes usage --json` → status unknown (unsupported_harness); skills update falla por `npx` roto en este entorno (se usa `pnpm dlx`). Proyecto en `video-launch/` porque `init` rehúsa directorios no vacíos.
