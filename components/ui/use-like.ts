"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

export type LikeState = {
  liked: boolean;
  count: number;
  loading: boolean;
  toggle: () => void;
};

/**
 * Manages like state for a project.
 * - If no session, redirects to /iniciar-sesion?next=/proyectos/[id]
 * - Otherwise calls POST /api/projects/[id]/like
 */
export function useLike(
  projectId: number,
  initialLiked: boolean,
  initialCount: number,
  hasSession: boolean,
): LikeState {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback(() => {
    if (!hasSession) {
      router.push(`/iniciar-sesion?next=/proyectos/${projectId}`);
      return;
    }

    // Optimistic update
    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);
    setLiked(nextLiked);
    setCount(nextCount);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/like`, {
          method: "POST",
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = (await res.json()) as { liked: boolean; count: number };
          setLiked(data.liked);
          setCount(data.count);
        } else if (res.status === 401) {
          // Session expired after optimistic update — revert and redirect
          setLiked(liked);
          setCount(count);
          router.push(`/iniciar-sesion?next=/proyectos/${projectId}`);
        } else {
          // Revert on other errors
          setLiked(liked);
          setCount(count);
        }
      } catch {
        setLiked(liked);
        setCount(count);
      }
    });
  }, [liked, count, hasSession, projectId, router]);

  return { liked, count, loading: isPending, toggle };
}
