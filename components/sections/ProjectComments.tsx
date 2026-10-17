"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getDict } from "../../app/i18n/dictionaries";
import ProfileAvatar from "../ui/ProfileAvatar";

export type ProjectCommentItem = {
  id: number;
  content: string;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
};

const MAX_LENGTH = 1000;

type ProjectCommentsProps = {
  projectId: number;
  initialComments: ProjectCommentItem[];
  hasSession: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
};

export default function ProjectComments({
  projectId,
  initialComments,
  hasSession,
  currentUserId,
  isAdmin = false,
}: ProjectCommentsProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const [comments, setComments] = useState<ProjectCommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [dialogFor, setDialogFor] = useState<ProjectCommentItem | null>(null);
  const [status, setStatus] = useState<{
    kind: "idle" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });
  const confirmRef = useRef<HTMLButtonElement>(null);

  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  useEffect(() => {
    if (dialogFor) confirmRef.current?.focus();
  }, [dialogFor]);

  useEffect(() => {
    if (!dialogFor) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDialogFor(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dialogFor]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = content.trim();
    if (!value) {
      setStatus({ kind: "error", message: t.commentInvalid });
      return;
    }
    setSubmitting(true);
    setStatus({ kind: "idle", message: "" });
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      });
      if (res.status === 401) {
        setStatus({ kind: "error", message: t.commentSessionExpired });
        return;
      }
      if (!res.ok) {
        const payload = (await res.json().catch(() => undefined)) as
          | { error?: string }
          | undefined;
        setStatus({
          kind: "error",
          message: payload?.error ?? t.commentError,
        });
        return;
      }
      const data = (await res.json()) as { comment: ProjectCommentItem };
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
      setStatus({ kind: "success", message: t.commentPosted });
    } catch {
      setStatus({ kind: "error", message: t.commentError });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    const target = dialogFor;
    if (!target) return;
    setPendingDeleteId(target.id);
    setStatus({ kind: "idle", message: "" });
    try {
      const res = await fetch(
        `/api/projects/${projectId}/comments/${target.id}`,
        { method: "DELETE", credentials: "same-origin" },
      );
      if (res.status === 401) {
        setStatus({ kind: "error", message: t.commentSessionExpired });
        return;
      }
      if (!res.ok && res.status !== 204) {
        setStatus({ kind: "error", message: t.commentDeleteError });
        return;
      }
      setComments((prev) => prev.filter((comment) => comment.id !== target.id));
      setStatus({ kind: "success", message: t.commentDeleted });
    } catch {
      setStatus({ kind: "error", message: t.commentDeleteError });
    } finally {
      setPendingDeleteId(null);
      setDialogFor(null);
    }
  }

  const isError = status.kind === "error";

  return (
    <section aria-labelledby="comentarios-proyecto" className="mt-8 flex flex-col gap-5">
      <h2
        id="comentarios-proyecto"
        className="text-xl font-semibold leading-7 text-(--foreground)"
      >
        {t.commentsTitle}
      </h2>

      {hasSession ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label
            htmlFor="nuevo-comentario"
            className="text-sm font-medium text-(--foreground)"
          >
            {t.commentFormLabel}
          </label>
          <textarea
            id="nuevo-comentario"
            name="content"
            rows={3}
            maxLength={MAX_LENGTH}
            value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
            placeholder={t.commentPlaceholder}
            className="w-full rounded-md border border-(--brand)/25 bg-(--background) px-3 py-2 text-base text-(--foreground) placeholder:text-(--foreground)/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-hidden="true" className="text-xs text-(--foreground)/60">
              {t.commentCount(content.length, MAX_LENGTH)}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? t.commentSubmitting : t.commentSubmit}
            </button>
          </div>
        </form>
      ) : (
        <Link
          href={`/iniciar-sesion?next=/proyectos/${projectId}`}
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
        >
          {t.commentLoginCta}
        </Link>
      )}

      <p
        aria-live="polite"
        role={isError ? "alert" : "status"}
        className={`min-h-6 text-sm ${isError ? "text-(--secondary)" : "text-(--foreground)/75"}`}
      >
        {status.message}
      </p>

      {comments.length === 0 ? (
        <p className="text-base leading-7 text-(--foreground)/75">
          {t.commentsEmpty}
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-4">
          {comments.map((comment) => {
            const canDelete =
              hasSession &&
              (comment.author.id === currentUserId || isAdmin);
            return (
              <li
                key={comment.id}
                className="flex gap-3 border-t border-(--brand)/10 pt-4"
              >
                <ProfileAvatar
                  name={comment.author.name}
                  userId={comment.author.id}
                  imageUrl={comment.author.image}
                  fallbackLabel={t.profileAvatarFallback(comment.author.name)}
                  className="size-9 text-sm"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      href={`/perfil/${comment.author.id}`}
                      className="rounded-sm text-sm font-semibold text-(--foreground) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                    >
                      {comment.author.name}
                    </Link>
                    <time
                      dateTime={comment.createdAt}
                      className="text-xs text-(--foreground)/60"
                    >
                      {dateFormatter.format(new Date(comment.createdAt))}
                    </time>
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => setDialogFor(comment)}
                        aria-label={t.commentDeleteAria(comment.author.name)}
                        className="ml-auto inline-flex min-h-11 items-center rounded-md px-2 text-xs font-semibold text-(--secondary) transition-colors hover:bg-(--secondary)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                      >
                        {t.commentDelete}
                      </button>
                    ) : null}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-(--foreground)/85">
                    {comment.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {dialogFor ? (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="borrar-comentario-titulo"
          aria-describedby="borrar-comentario-descripcion"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-sm rounded-xl border border-(--brand)/15 bg-(--background) p-6 shadow-lg">
            <h3
              id="borrar-comentario-titulo"
              className="text-lg font-semibold leading-7 text-(--foreground)"
            >
              {t.commentDeleteDialogTitle}
            </h3>
            <p
              id="borrar-comentario-descripcion"
              className="mt-2 text-sm leading-6 text-(--foreground)/75"
            >
              {t.commentDeleteMessage}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDialogFor(null)}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
              >
                {t.commentDeleteCancel}
              </button>
              <button
                ref={confirmRef}
                type="button"
                disabled={pendingDeleteId !== null}
                onClick={handleConfirmDelete}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--secondary) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
              >
                {pendingDeleteId !== null ? t.commentDeleting : t.commentDeleteConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
