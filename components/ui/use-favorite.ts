"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";

export type FavoriteState = {
  favorited: boolean;
  loading: boolean;
  toggle: () => void;
};

/**
 * Manages favorite state for a project.
 * - If no session, redirects to /iniciar-sesion?next=/proyectos/[id]
 * - Otherwise calls POST /api/projects/[id]/favorite
 */
export function useFavorite(
  projectId: number,
  initialFavorited: boolean,
  hasSession: boolean,
): FavoriteState {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback(() => {
    if (!hasSession) {
      router.push(`/iniciar-sesion?next=/proyectos/${projectId}`);
      return;
    }

    // Optimistic update
    const nextFavorited = !favorited;
    setFavorited(nextFavorited);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/favorite`, {
          method: "POST",
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = (await res.json()) as { favorited: boolean };
          setFavorited(data.favorited);
        } else if (res.status === 401) {
          // Session expired after optimistic update — revert and redirect
          setFavorited(favorited);
          router.push(`/iniciar-sesion?next=/proyectos/${projectId}`);
        } else {
          // Revert on other errors
          setFavorited(favorited);
        }
      } catch {
        setFavorited(favorited);
      }
    });
  }, [favorited, hasSession, projectId, router]);

  return { favorited, loading: isPending, toggle };
}
