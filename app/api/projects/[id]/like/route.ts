import { and, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { projectLikes, projects } from "@/db/schema";
import { auth } from "../../../../lib/auth";
import { apiError, parseId } from "../../../_lib/catalog";
import { rateLimit, getClientIp, rateLimitExceeded } from "../../../_lib/rate-limit";

type Context = { params: Promise<{ id: string }> };

async function getLikeCount(projectId: number): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(projectLikes)
    .where(eq(projectLikes.projectId, projectId));
  return row?.count ?? 0;
}

/** GET /api/projects/[id]/like — returns { liked: boolean, count: number } */
export async function GET(request: Request, { params }: Context) {
  const { id: rawId } = await params;
  const projectId = parseId(rawId);
  if (!projectId) return apiError("Identificador no válido.", 400);

  const session = await auth.api.getSession({ headers: await headers() });

  const currentCount = await getLikeCount(projectId);
  let liked = false;

  if (session?.user) {
    const [existing] = await db
      .select({ userId: projectLikes.userId })
      .from(projectLikes)
      .where(
        and(
          eq(projectLikes.projectId, projectId),
          eq(projectLikes.userId, session.user.id),
        ),
      )
      .limit(1);
    liked = Boolean(existing);
  }

  return Response.json({ liked, count: currentCount });
}

/** POST /api/projects/[id]/like — toggle like (requires session) */
export async function POST(request: Request, { params }: Context) {
  const ip = getClientIp(request);
  const { allowed, remaining, resetMs } = rateLimit(`like:${ip}`, 20, 60_000);
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

  // Check if already liked
  const [existing] = await db
    .select({ userId: projectLikes.userId })
    .from(projectLikes)
    .where(
      and(
        eq(projectLikes.projectId, projectId),
        eq(projectLikes.userId, session.user.id),
      ),
    )
    .limit(1);

  const rlHeaders = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
  };

  if (existing) {
    // Unlike
    await db
      .delete(projectLikes)
      .where(
        and(
          eq(projectLikes.projectId, projectId),
          eq(projectLikes.userId, session.user.id),
        ),
      );
    const currentCount = await getLikeCount(projectId);
    return Response.json({ liked: false, count: currentCount }, { headers: rlHeaders });
  }

  // Like
  await db.insert(projectLikes).values({ projectId, userId: session.user.id });
  const currentCount = await getLikeCount(projectId);
  return Response.json({ liked: true, count: currentCount }, { status: 201, headers: rlHeaders });
}
