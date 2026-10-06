const projectCreationPath = "/proyectos/nuevo";

export function getPostAuthRedirect(next: string | undefined): string {
    return next === projectCreationPath ? projectCreationPath : "/";
}

export function getAuthPageHref(path: string, next: string): string {
    return next === projectCreationPath ? `${path}?next=${encodeURIComponent(next)}` : path;
}
