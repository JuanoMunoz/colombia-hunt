import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../../lib/auth";

const f = createUploadthing();

/**
 * Router de subida de imágenes (ver `design.md` §4).
 * El cliente ya comprime en lossless antes de subir
 * (`lib/images/compress.ts`); aquí se valida auth + límites.
 */
export const uploadRouter = {
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
        .onUploadComplete(async ({ metadata, file }) => ({
            uploadedBy: metadata.userId,
            fileKey: file.key,
            fileSize: file.size,
        })),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
