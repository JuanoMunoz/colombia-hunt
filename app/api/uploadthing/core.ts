import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../../lib/auth";

const f = createUploadthing();

export const uploadRouter = {
    projectImage: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
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
        })),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
