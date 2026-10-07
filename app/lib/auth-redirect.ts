// Lista cerrada de destinos post-login (misma app, rutas relativas).
// Evita open redirects: nunca se acepta una URL arbitraria.
const exactAllowedNext = new Set([
    "/proyectos/nuevo",
    "/mis-proyectos",
    "/perfil",
    "/admin",
]);

const editProjectPattern = /^\/proyectos\/[1-9]\d*\/editar$/;

export function isAllowedPostAuthRedirect(next: string | undefined): next is string {
    if (!next) return false;
    if (exactAllowedNext.has(next)) return true;
    return editProjectPattern.test(next);
}

export function getPostAuthRedirect(next: string | undefined): string {
    return isAllowedPostAuthRedirect(next) ? next : "/";
}

export function getAuthPageHref(path: string, next: string): string {
    return isAllowedPostAuthRedirect(next) ? `${path}?next=${encodeURIComponent(next)}` : path;
}
