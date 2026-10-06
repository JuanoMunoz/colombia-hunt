/**
 * In-memory sliding-window rate limiter.
 * Suitable for single-instance / edge deployments (Turso is global anyway).
 * For multi-instance replace with a Redis/KV store.
 */

type WindowEntry = { timestamps: number[] };

const store = new Map<string, WindowEntry>();

/**
 * @param key       Unique key (e.g. IP + route)
 * @param limit     Max requests per window
 * @param windowMs  Window duration in milliseconds
 * @returns { allowed, remaining, resetMs }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Prune old timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  const count = entry.timestamps.length;
  const remaining = Math.max(0, limit - count - 1);
  const oldest = entry.timestamps[0] ?? now;
  const resetMs = oldest + windowMs;

  if (count >= limit) {
    return { allowed: false, remaining: 0, resetMs };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining, resetMs };
}

/** Returns the client IP from Next.js request headers (best-effort). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Standard rate-limit response (429) */
export function rateLimitExceeded(resetMs: number): Response {
  const retryAfter = Math.ceil((resetMs - Date.now()) / 1000);
  return Response.json(
    { error: "Demasiadas solicitudes. Inténtalo más tarde." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "30",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
      },
    },
  );
}
