import { UTApi } from "uploadthing/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";

/**
 * Gestión de archivos subidos a UploadThing (ver `design.md` §4).
 *
 * Cada subida queda registrada en `uploaded_files` (ver
 * `app/api/uploadthing/core.ts`). Solo el dueño puede borrar, y por defecto
 * solo archivos no adjuntos (imagen reemplazada o subida abandonada). Los
 * archivos en uso se marcan como adjuntos con `attachProjectImage` /
 * `attachUserImage`.
 */

const utapi = new UTApi();

const MAX_KEY_LENGTH = 200;

/** Extrae la clave de archivo de una URL pública de UploadThing. */
export function deriveKeyFromUploadThingUrl(value: string): string | null {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        return null;
    }
    const isUploadThingHost =
        url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh");
    if (!isUploadThingHost || !url.pathname.startsWith("/f/")) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    const key = segments[segments.length - 1];
    if (!key || key.length > MAX_KEY_LENGTH) return null;
    return key;
}

function normalizeKeys(keys: readonly string[]): string[] {
    return [
        ...new Set(
            keys.filter(
                (key) =>
                    typeof key === "string" &&
                    key.length > 0 &&
                    key.length <= MAX_KEY_LENGTH,
            ),
        ),
    ];
}

/**
 * Borra en UploadThing los archivos indicados si pertenecen al usuario.
 * Por defecto ignora los adjuntos (en uso); con `allowAttached` permite
 * borrar la imagen que el proyecto acaba de dejar de usar.
 */
export async function deleteOwnedFiles(
    userId: string,
    keys: readonly string[],
    options: { allowAttached?: boolean } = {},
): Promise<{ deleted: number; skipped: number }> {
    const unique = normalizeKeys(keys);
    if (unique.length === 0) return { deleted: 0, skipped: 0 };

    const rows = await db
        .select({ key: uploadedFiles.key, attached: uploadedFiles.attached })
        .from(uploadedFiles)
        .where(and(eq(uploadedFiles.userId, userId), inArray(uploadedFiles.key, unique)));

    const owned = new Map(rows.map((row) => [row.key, row.attached]));
    const deletable = unique.filter(
        (key) => owned.has(key) && (options.allowAttached || owned.get(key) === false),
    );

    if (deletable.length === 0) return { deleted: 0, skipped: unique.length };

    try {
        await utapi.deleteFiles(deletable);
    } catch {
        // Si el proveedor falla, conservamos las filas para poder reintentar.
        return { deleted: 0, skipped: unique.length };
    }

    await db
        .delete(uploadedFiles)
        .where(and(eq(uploadedFiles.userId, userId), inArray(uploadedFiles.key, deletable)));

    return { deleted: deletable.length, skipped: unique.length - deletable.length };
}

/** Marca la imagen de un proyecto como adjunta (no borrable). */
export async function attachProjectImage(
    userId: string,
    projectId: number,
    imageUrl: string,
): Promise<void> {
    const key = deriveKeyFromUploadThingUrl(imageUrl);
    if (!key) return;
    await db
        .update(uploadedFiles)
        .set({ attached: true, projectId })
        .where(and(eq(uploadedFiles.userId, userId), eq(uploadedFiles.key, key)));
}

/** Marca la imagen de perfil (avatar) como adjunta (no borrable). */
export async function attachUserImage(userId: string, imageUrl: string): Promise<void> {
    const key = deriveKeyFromUploadThingUrl(imageUrl);
    if (!key) return;
    await db
        .update(uploadedFiles)
        .set({ attached: true })
        .where(and(eq(uploadedFiles.userId, userId), eq(uploadedFiles.key, key)));
}
