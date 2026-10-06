# Guía de Contribución a Colombia Hunt 🇨🇴

¡Gracias por tu interés en contribuir a **Colombia Hunt**! Este proyecto es una iniciativa de código abierto para destacar la tecnología, el software y el talento desarrollador colombiano.

Toda contribución —ya sea reportando errores, mejorando la documentación, proponiendo nuevas características o enviando código— es bienvenida y muy apreciada.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Flujo de Trabajo (Git Workflow)](#-flujo-de-trabajo-git-workflow)
- [Estándares de Código y Diseño](#-estándares-de-código-y-diseño)
- [Pasos para Enviar un Pull Request](#-pasos-para-enviar-un-pull-request)
- [Reporte de Errores y Sugerencias](#-reporte-de-errores-y-sugerencias)

---

## 🚀 Requisitos Previos

Asegúrate de contar con el siguiente entorno instalado en tu máquina:

- **Node.js**: Versión `20.x` o superior (LTS recomendada).
- **pnpm**: Versión `11.x` o superior (gestor de paquetes prioritario).
- **Git**: Configurado en tu terminal.

---

## 🌿 Flujo de Trabajo (Git Workflow)

1. **Fork del Repositorio**: Haz un fork del repositorio oficial a tu cuenta personal de GitHub.
2. **Clona tu Fork**:
   ```bash
   git clone https://github.com/TU_USUARIO/colombia-hunt.git
   cd colombia-hunt
   ```
3. **Instala las Dependencias**:
   ```bash
   pnpm install
   ```
4. **Crea una Rama Explicativa**:
   Usa un prefijo claro según el tipo de cambio:
   - `feature/nueva-funcionalidad`
   - `fix/correccion-de-bug`
   - `docs/mejora-de-documentacion`
   - `style/ajustes-de-diseno`
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```

---

## 🎨 Estándares de Código y Diseño

Para mantener la coherencia y calidad del proyecto, sigue estas directrices obligatorias:

1. **Sistema de Diseño (`design.md`)**:
   - Utiliza exclusivamente la paleta de tokens definida en `design.md` (`--brand`: `#003087`, `--background`: `#FBFAF8`, `--secondary`: `#931621`, `--flourish`: `#FFCD00`).
   - Mantén la tipografía oficial **Lexend** para títulos y cuerpo.

2. **Desarrollo Mobile-First**:
   - Diseña y programa primero para pantallas móviles (`~360px`).
   - Evita el scroll horizontal.
   - Garantiza objetivos táctiles de al menos `44×44 px` para todos los elementos interactivos.

3. **Accesibilidad (a11y)**:
   - Foco visible en todos los botones y enlaces (`outline`).
   - Textos alternativos descriptivos en español para imágenes.
   - Atributos ARIA cuando sea necesario (`aria-expanded`, `aria-live`, etc.).

4. **i18n y SEO**:
   - El idioma canónico y prioritario es el **español (`es`)**.
   - Toda nueva cadena visible debe ser añadida a los diccionarios en `app/i18n/dictionaries.ts` para soportar conmutación a inglés (`en`).

---

## 🧪 Pasos para Enviar un Pull Request

Antes de realizar la confirmación (commit) o enviar tu Pull Request, ejecuta la suite de verificación local:

```bash
# 1. Verificación de tipos TypeScript
pnpm exec tsc --noEmit

# 2. Análisis estático con ESLint
pnpm exec eslint

# 3. Compilación de producción
pnpm exec next build
```

Si todo compila correctamente:

1. Haz commit de tus cambios con mensajes descriptivos:
   ```bash
   git commit -m "feat: añade filtro de búsqueda por tecnologías"
   ```
2. Haz push a tu rama en GitHub:
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
3. Abre un **Pull Request** apuntando a la rama `main` del repositorio principal explicándote brevemente el cambio realizado.

---

## 🐛 Reporte de Errores y Sugerencias

Si encuentras un error o tienes una idea para mejorar la plataforma:

- Abre un **Issue** en GitHub.
- Describe el comportamiento esperado vs el comportamiento actual.
- Incluye capturas de pantalla o pasos para reproducir el problema si aplica.

¡Gracias por construir el futuro del software colombiano juntos! 🇨🇴✨
