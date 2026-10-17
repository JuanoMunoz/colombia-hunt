import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { projectFavorites, projects } from "@/db/schema";
import { auth } from "../../../../lib/auth";
import { apiError, parseId } from "../../../_lib/catalog";
import { rateLimit, getClientIp, rateLimitExceeded } from "../../../_lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

/** GET /api/projects/[id]/favorite — returns { favorited: boolean } */
export async function GET(request: Request, { params }: Context) {
  const { id: rawId } = await params;
  const projectId = parseId(rawId);
  if (!projectId) return apiError("Identificador no válido.", 400);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return Response.json({ favorited: false });

  const [existing] = await db
    .select({ userId: projectFavorites.userId })
    .from(projectFavorites)
    .where(
      and(
        eq(projectFavorites.projectId, projectId),
        eq(projectFavorites.userId, session.user.id),
      ),
    )
    .limit(1);

  return Response.json({ favorited: Boolean(existing) });
}

/** POST /api/projects/[id]/favorite — toggle favorite (requires session) */
export async function POST(request: Request, { params }: Context) {
  const ip = getClientIp(request);
  const { allowed, remaining, resetMs } = rateLimit(`favorite:${ip}`, 30, 60_000);
  if (!allowed) return rateLimitExceeded(resetMs);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return apiError("Autenticación requerida.", 401);

  const { id: rawId } = await params;
  const projectId = parseId(rawId);
  if (!projectId) return apiError("Identificador no válido.", 400);

  // Verify project exists and is not deleted
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.deleted, false)))
    .limit(1);
  if (!project) return apiError("Proyecto no encontrado.", 404);

  const [existing] = await db
    .select({ userId: projectFavorites.userId })
    .from(projectFavorites)
    .where(
      and(
        eq(projectFavorites.projectId, projectId),
        eq(projectFavorites.userId, session.user.id),
      ),
    )
    .limit(1);

  const rlHeaders = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
  };

  if (existing) {
    await db
      .delete(projectFavorites)
      .where(
        and(
          eq(projectFavorites.projectId, projectId),
          eq(projectFavorites.userId, session.user.id),
        ),
      );
    return Response.json({ favorited: false }, { headers: rlHeaders });
  }

  await db
    .insert(projectFavorites)
    .values({ projectId, userId: session.user.id });
  return Response.json({ favorited: true }, { status: 201, headers: rlHeaders });
}
