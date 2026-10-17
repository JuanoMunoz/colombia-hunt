import { headers } from "next/headers";
import { auth } from "../../../../lib/auth";
import { apiError, readJson } from "../../../_lib/catalog";
import { deleteOwnedFiles } from "@/lib/uploadthing-files";

const MAX_KEYS = 5;

/**
 * Borra archivos huérfanos de UploadThing del usuario autenticado.
 * Solo elimina archivos que no están adjuntos (imagen reemplazada o
 * subida abandonada). Ver `lib/uploadthing-files.ts`.
 */
export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return apiError("Autenticación requerida.", 401);
    }

    const body = await readJson(request);
    if (!body.ok) return apiError(body.error, 400);
    if (
        typeof body.value !== "object" ||
        body.value === null ||
        Array.isArray(body.value)
    ) {
        return apiError("El cuerpo debe ser un objeto con los archivos a borrar.", 400);
    }

    const keys = (body.value as Record<string, unknown>).keys;
    if (!Array.isArray(keys) || keys.length === 0 || keys.length > MAX_KEYS) {
        return apiError(`Debes indicar entre 1 y ${MAX_KEYS} archivos.`, 400);
    }
    if (keys.some((key) => typeof key !== "string" || key.length === 0 || key.length > 200)) {
        return apiError("Los identificadores de archivo no son válidos.", 400);
    }

    const result = await deleteOwnedFiles(session.user.id, keys as string[]);
    return Response.json(result);
}
