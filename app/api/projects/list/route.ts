import { headers } from "next/headers";
import { getProjectsPage } from "../../../../lib/project-data";
import { auth } from "../../../lib/auth";
import { rateLimit, getClientIp, rateLimitExceeded } from "../../_lib/rate-limit";

const PAGE_SIZE = 12;
const RL_LIMIT = 30;
const RL_WINDOW_MS = 60_000; // 1 minute

export async function handleProjectsList(request: Request) {
  const ip = getClientIp(request);
  const { allowed, remaining, resetMs } = rateLimit(
    `projects:list:${ip}`,
    RL_LIMIT,
    RL_WINDOW_MS,
  );
  if (!allowed) return rateLimitExceeded(resetMs);

  const url = new URL(request.url);
  const rawOffset = url.searchParams.get("offset");
  const rawLimit = url.searchParams.get("limit");
  const rawCategory = url.searchParams.get("category");
  const rawCity = url.searchParams.get("city");
  const rawQuery = url.searchParams.get("q");

  const offset = rawOffset ? Math.max(0, parseInt(rawOffset, 10) || 0) : 0;
  const limit = rawLimit
    ? Math.min(PAGE_SIZE * 2, Math.max(1, parseInt(rawLimit, 10) || PAGE_SIZE))
    : PAGE_SIZE;
  const categoryId = rawCategory ? parseInt(rawCategory, 10) || undefined : undefined;
  const cityId = rawCity ? parseInt(rawCity, 10) || undefined : undefined;
  const query = rawQuery?.trim() || undefined;

  const session = await auth.api.getSession({ headers: await headers() });

  const page = await getProjectsPage({
    offset,
    limit,
    categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
    cityId: Number.isFinite(cityId) ? cityId : undefined,
    query,
    viewerId: session?.user?.id,
  });

  return Response.json(page, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-RateLimit-Limit": String(RL_LIMIT),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
    },
  });
}

export async function GET(request: Request) {
  return handleProjectsList(request);
}

export async function POST(request: Request) {
  return handleProjectsList(request);
}
