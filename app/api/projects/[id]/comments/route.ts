import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { projectComments, projects } from "@/db/schema";
import { auth } from "../../../../lib/auth";
import { getProjectComments, type ProjectComment } from "../../../../../lib/project-data";
import { apiError, parseId, readJson } from "../../../_lib/catalog";
import { rateLimit, getClientIp, rateLimitExceeded } from "../../../_lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

const MAX_LENGTH = 1000;

function serialize(comment: ProjectComment) {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
  };
}

/** GET /api/projects/[id]/comments — returns { comments: [...] } */
export async function GET(request: Request, { params }: Context) {
  const { id: rawId } = await params;
  const projectId = parseId(rawId);
  if (!projectId) return apiError("Identificador no válido.", 400);

  const comments = await getProjectComments(projectId);
  return Response.json({ comments: comments.map(serialize) });
}

/** POST /api/projects/[id]/comments — create a comment (requires session) */
export async function POST(request: Request, { params }: Context) {
  const ip = getClientIp(request);
  const { allowed, remaining, resetMs } = rateLimit(`comment:${ip}`, 20, 60_000);
  if (!allowed) return rateLimitExceeded(resetMs);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return apiError("Autenticación requerida.", 401);

  const { id: rawId } = await params;
  const projectId = parseId(rawId);
  if (!projectId) return apiError("Identificador no válido.", 400);

  const body = await readJson(request);
  if (!body.ok) return apiError(body.error, 400);

  const rawContent =
    typeof body.value === "object" && body.value !== null && "content" in body.value
      ? (body.value as { content?: unknown }).content
      : undefined;
  if (typeof rawContent !== "string") {
    return apiError("El comentario debe ser texto.", 400);
  }
  const content = rawContent.trim();
  if (content.length === 0) return apiError("Escribe un comentario antes de enviarlo.", 400);
  if (content.length > MAX_LENGTH) {
    return apiError(`El comentario admite hasta ${MAX_LENGTH} caracteres.`, 400);
  }

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.deleted, false)))
    .limit(1);
  if (!project) return apiError("Proyecto no encontrado.", 404);

  const [created] = await db
    .insert(projectComments)
    .values({ projectId, userId: session.user.id, content })
    .returning({
      id: projectComments.id,
      content: projectComments.content,
      createdAt: projectComments.createdAt,
    });
  if (!created) return apiError("No se pudo publicar el comentario.", 500);

  return Response.json(
    {
      comment: {
        id: created.id,
        content: created.content,
        createdAt: created.createdAt.toISOString(),
        author: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image ?? null,
        },
      },
    },
    {
      status: 201,
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
      },
    },
  );
}
