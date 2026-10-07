import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { categories, cities, projectCategories, profiles, projects } from "@/db/schema";
import { auth } from "../../../lib/auth";
import { apiError, parseId } from "../../_lib/catalog";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Context) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return apiError("Autenticación requerida.", 401);
    }

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) {
        return apiError("El identificador debe ser un entero positivo.", 400);
    }

    const [project] = await db
        .select({
            id: projects.id,
            creatorId: projects.creatorId,
            deleted: projects.deleted,
        })
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

    if (!project || project.deleted) {
        return apiError("Proyecto no encontrado.", 404);
    }

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    const isCreator = project.creatorId === session.user.id;
    const isAdmin = profile?.role === "admin";
    if (!isCreator && !isAdmin) {
        return apiError("Solo el creador o un administrador puede eliminar este proyecto.", 403);
    }

    const deletedAt = new Date();
    const [deletedProject] = await db
        .update(projects)
        .set({ deleted: true, deletedAt, updatedAt: deletedAt })
        .where(and(eq(projects.id, id), eq(projects.deleted, false)))
        .returning({ id: projects.id });

    if (!deletedProject) {
        return apiError("Proyecto no encontrado.", 404);
    }

    return new Response(null, { status: 204 });
}

type ProjectPatch = {
    title: string;
    description: string;
    cityId: number;
    categoryIds: number[];
    imageUrl: string | null;
    pageUrl: string | null;
    livecodeUrl: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePositiveId(value: unknown): number | null {
    return typeof value === "number" && Number.isSafeInteger(value) && value > 0
        ? value
        : null;
}

function parseOptionalUrl(value: unknown, field: string): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string" || value.trim().length > 2048) {
        throw new TypeError(`${field} debe tener como máximo 2048 caracteres.`);
    }
    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        throw new TypeError(`${field} debe ser una URL válida.`);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new TypeError(`${field} debe comenzar con http:// o https://.`);
    }
    return url.toString();
}

function parseImageUrl(value: unknown): string | null {
    const imageUrl = parseOptionalUrl(value, "La imagen");
    if (imageUrl === null) return null;
    const url = new URL(imageUrl);
    const isUploadThingHost =
        url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh");
    if (
        url.protocol !== "https:" ||
        !isUploadThingHost ||
        !url.pathname.startsWith("/f/")
    ) {
        throw new TypeError("La imagen debe ser una URL HTTPS válida de UploadThing.");
    }
    return imageUrl;
}

function parseProjectPatch(value: unknown): ProjectPatch {
    const allowedFields = [
        "title",
        "description",
        "cityId",
        "categoryIds",
        "imageUrl",
        "pageUrl",
        "livecodeUrl",
    ];
    if (!isRecord(value) || Object.keys(value).some((key) => !allowedFields.includes(key))) {
        throw new TypeError("El cuerpo contiene campos no permitidos.");
    }
    if (
        typeof value.title !== "string" ||
        !value.title.trim() ||
        value.title.trim().length > 120
    ) {
        throw new TypeError("El nombre es obligatorio y admite hasta 120 caracteres.");
    }
    if (
        typeof value.description !== "string" ||
        !value.description.trim() ||
        value.description.trim().length > 2000
    ) {
        throw new TypeError("La descripción es obligatoria y admite hasta 2000 caracteres.");
    }
    const cityId = parsePositiveId(value.cityId);
    if (cityId === null) {
        throw new TypeError("Selecciona una ciudad válida.");
    }
    if (!Array.isArray(value.categoryIds) || value.categoryIds.length === 0) {
        throw new TypeError("Selecciona al menos una categoría.");
    }
    const categoryIds: number[] = [];
    for (const valueId of value.categoryIds) {
        const id = parsePositiveId(valueId);
        if (id === null) throw new TypeError("Las categorías seleccionadas no son válidas.");
        categoryIds.push(id);
    }
    if (new Set(categoryIds).size !== categoryIds.length) {
        throw new TypeError("Las categorías seleccionadas no son válidas.");
    }
    return {
        title: value.title.trim(),
        description: value.description.trim(),
        cityId,
        categoryIds,
        imageUrl: parseImageUrl(value.imageUrl),
        pageUrl: parseOptionalUrl(value.pageUrl, "El sitio web"),
        livecodeUrl: parseOptionalUrl(value.livecodeUrl, "El repositorio"),
    };
}

export async function PATCH(request: Request, { params }: Context) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return apiError("Autenticación requerida.", 401);
    }

    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) {
        return apiError("El identificador debe ser un entero positivo.", 400);
    }

    const [project] = await db
        .select({
            id: projects.id,
            creatorId: projects.creatorId,
            deleted: projects.deleted,
        })
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

    if (!project) {
        return apiError("Proyecto no encontrado.", 404);
    }

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    const isCreator = project.creatorId === session.user.id;
    const isAdmin = profile?.role === "admin";
    if (!isCreator && !isAdmin) {
        return apiError("Solo el creador o un administrador puede modificar este proyecto.", 403);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return apiError("Cuerpo JSON inválido.", 400);
    }

    // Compatibilidad admin: alternar baja lógica solo con { deleted }.
    // La app de usuario da de baja por DELETE y no ofrece restaurar.
    if (
        isRecord(body) &&
        Object.keys(body).length === 1 &&
        typeof body.deleted === "boolean"
    ) {
        const now = new Date();
        const [toggled] = await db
            .update(projects)
            .set({
                deleted: body.deleted,
                deletedAt: body.deleted ? now : null,
                updatedAt: now,
            })
            .where(eq(projects.id, id))
            .returning({ id: projects.id });
        if (!toggled) {
            return apiError("Proyecto no encontrado.", 404);
        }
        return Response.json({ projectId: toggled.id });
    }

    // La baja del usuario va por DELETE; este PATCH solo edita contenido.
    if (isRecord(body) && "deleted" in body) {
        return apiError("Para dar de baja usa la opción Dar de baja.", 400);
    }

    let patch: ProjectPatch;
    try {
        patch = parseProjectPatch(body);
    } catch (error) {
        if (error instanceof TypeError) return apiError(error.message, 400);
        throw error;
    }

    const [city] = await db
        .select({ id: cities.id })
        .from(cities)
        .where(eq(cities.id, patch.cityId))
        .limit(1);
    if (!city) return apiError("La ciudad seleccionada ya no está disponible.", 400);

    const availableCategories = await db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.id, patch.categoryIds));
    if (availableCategories.length !== patch.categoryIds.length) {
        return apiError("Una o más categorías ya no están disponibles.", 400);
    }

    const now = new Date();
    const [updated] = await db.transaction(async (tx) => {
        const rows = await tx
            .update(projects)
            .set({
                title: patch.title,
                description: patch.description,
                cityId: patch.cityId,
                imageUrl: patch.imageUrl,
                pageUrl: patch.pageUrl,
                livecodeUrl: patch.livecodeUrl,
                updatedAt: now,
            })
            .where(and(eq(projects.id, id), eq(projects.deleted, false)))
            .returning();
        const row = rows[0];
        if (!row) return [];
        await tx
            .delete(projectCategories)
            .where(eq(projectCategories.projectId, id));
        await tx.insert(projectCategories).values(
            patch.categoryIds.map((categoryId) => ({
                projectId: id,
                categoryId,
            })),
        );
        return rows;
    });

    if (!updated) {
        return apiError("Proyecto no encontrado.", 404);
    }

    return Response.json({ projectId: updated.id });
}
