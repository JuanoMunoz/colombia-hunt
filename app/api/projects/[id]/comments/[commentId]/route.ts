import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { profiles, projectComments } from "@/db/schema";
import { auth } from "../../../../../lib/auth";
import { apiError, parseId } from "../../../../_lib/catalog";

type Context = { params: Promise<{ id: string; commentId: string }> };

/** DELETE /api/projects/[id]/comments/[commentId] — soft delete (author or admin) */
export async function DELETE(request: Request, { params }: Context) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return apiError("Autenticación requerida.", 401);

  const { id: rawProjectId, commentId: rawCommentId } = await params;
  const projectId = parseId(rawProjectId);
  const commentId = parseId(rawCommentId);
  if (!projectId || !commentId) return apiError("Identificador no válido.", 400);

  const [comment] = await db
    .select({ userId: projectComments.userId })
    .from(projectComments)
    .where(
      and(
        eq(projectComments.id, commentId),
        eq(projectComments.projectId, projectId),
        eq(projectComments.deleted, false),
      ),
    )
    .limit(1);
  if (!comment) return apiError("Comentario no encontrado.", 404);

  if (comment.userId !== session.user.id) {
    const [profile] = await db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .limit(1);
    if (profile?.role !== "admin") {
      return apiError("No puedes borrar este comentario.", 403);
    }
  }

  await db
    .update(projectComments)
    .set({ deleted: true, deletedAt: new Date() })
    .where(eq(projectComments.id, commentId));

  return new Response(null, { status: 204 });
}
