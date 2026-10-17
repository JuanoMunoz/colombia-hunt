import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";
import { auth } from "../../lib/auth";

const f = createUploadthing();

/**
 * Router de subida de imágenes (ver `design.md` §4).
 * El cliente ya comprime en lossless antes de subir
 * (`lib/images/compress.ts`); aquí se valida auth + límites.
 * Además registra el archivo en `uploaded_files` para poder borrar
 * huérfanos (reemplazo o subida abandonada) en `lib/uploadthing-files.ts`.
 */
export const uploadRouter = {
    avatarImage: f({
        image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
    })
        .middleware(async ({ req }) => {
            const session = await auth.api.getSession({ headers: req.headers });
            if (!session?.user) {
                throw new Error("Autenticación requerida.");
            }
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .insert(uploadedFiles)
                .values({ key: file.key, url: file.url, userId: metadata.userId })
                .onConflictDoNothing();
            return {
                uploadedBy: metadata.userId,
                fileKey: file.key,
                fileSize: file.size,
            };
        }),
    projectImage: f({
        image: { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 1 },
    })
        .middleware(async ({ req }) => {
            const session = await auth.api.getSession({ headers: req.headers });
            if (!session?.user) {
                throw new Error("Autenticación requerida.");
            }
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .insert(uploadedFiles)
                .values({ key: file.key, url: file.url, userId: metadata.userId })
                .onConflictDoNothing();
            return {
                uploadedBy: metadata.userId,
                fileKey: file.key,
                fileSize: file.size,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
