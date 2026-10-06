import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { profiles, projects } from "@/db/schema";
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

    if (typeof body !== "object" || body === null) {
        return apiError("Se esperaba un objeto JSON.", 400);
    }

    const payload = body as Record<string, unknown>;
    const updateData: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() };

    if (typeof payload.deleted === "boolean") {
        updateData.deleted = payload.deleted;
        updateData.deletedAt = payload.deleted ? new Date() : null;
    }

    if (typeof payload.title === "string" && payload.title.trim()) {
        updateData.title = payload.title.trim();
    }

    const [updated] = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, id))
        .returning();

    return Response.json(updated);
}
