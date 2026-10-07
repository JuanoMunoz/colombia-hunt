"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { HttpClientError, projectApi, type OwnProjectItem } from "../../lib/http-client";
import OptimizedImage from "../ui/OptimizedImage";

type Filter = "active" | "deleted";

export default function OwnProjectsList({ initial }: { initial: OwnProjectItem[] }) {
    const { lang } = useLanguage();
    const t = getDict(lang);
    const [items, setItems] = useState<OwnProjectItem[]>(initial);
    const [filter, setFilter] = useState<Filter>("active");
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [dialogFor, setDialogFor] = useState<OwnProjectItem | null>(null);
    const [status, setStatus] = useState<{ kind: "idle" | "deleting" | "success" | "error"; message: string }>({
        kind: "idle",
        message: "",
    });
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (dialogFor) {
            confirmRef.current?.focus();
        }
    }, [dialogFor]);

    useEffect(() => {
        if (!dialogFor) return;
        function onKey(event: KeyboardEvent) {
            if (event.key === "Escape") setDialogFor(null);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [dialogFor]);

    const active = items.filter((item) => !item.deleted);
    const deleted = items.filter((item) => item.deleted);
    const visible = filter === "active" ? active : deleted;

    async function handleConfirmDelete() {
        const target = dialogFor;
        if (!target) return;
        setPendingId(target.id);
        setStatus({ kind: "deleting", message: "" });
        try {
            await projectApi.remove(target.id);
            setItems((prev) =>
                prev.map((item) =>
                    item.id === target.id ? { ...item, deleted: true } : item,
                ),
            );
            setStatus({ kind: "success", message: t.myProjectsDeleted });
            setFilter("active");
        } catch (error) {
            if (error instanceof HttpClientError && error.status === 401) {
                setStatus({ kind: "error", message: t.myProjectsSessionExpired });
            } else if (error instanceof HttpClientError) {
                setStatus({ kind: "error", message: error.message });
            } else {
                setStatus({ kind: "error", message: t.myProjectsDeleteError });
            }
        } finally {
            setPendingId(null);
            setDialogFor(null);
        }
    }

    if (items.length === 0) {
        return (
            <div className="mt-8 flex flex-col items-start gap-4 border-y border-(--brand)/15 py-6">
                <p role="status" className="text-base leading-7 text-(--foreground)/75">
                    {t.myProjectsEmpty}
                </p>
                <Link
                    href="/proyectos/nuevo"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--brand) px-4 text-sm font-semibold text-(--background) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                >
                    {t.myProjectsEmptyCta}
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" className="text-sm font-medium text-(--foreground)/70">
                    {t.myProjectsCount(active.length)}
                </p>
                <div
                    role="group"
                    aria-label={t.myProjectsTitle}
                    className="flex items-center gap-1.5 self-start rounded-full border border-(--brand)/10 bg-(--brand)/5 p-1 text-xs font-semibold"
                >
                    <button
                        type="button"
                        onClick={() => setFilter("active")}
                        aria-pressed={filter === "active"}
                        className={`min-h-11 rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
                            filter === "active"
                                ? "bg-(--brand) text-white"
                                : "text-(--brand) hover:bg-(--brand)/10"
                        }`}
                    >
                        {t.myProjectsActive} ({active.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("deleted")}
                        aria-pressed={filter === "deleted"}
                        className={`min-h-11 rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${
                            filter === "deleted"
                                ? "bg-(--brand) text-white"
                                : "text-(--brand) hover:bg-(--brand)/10"
                        }`}
                    >
                        {t.myProjectsDeletedHistory} ({deleted.length})
                    </button>
                </div>
            </div>

            <p
                aria-live="polite"
                role={status.kind === "error" ? "alert" : "status"}
                className={`min-h-6 text-sm ${status.kind === "error" ? "text-(--secondary)" : "text-(--foreground)/75"}`}
            >
                {status.kind === "deleting" ? t.myProjectsDeleting : status.message}
            </p>

            {visible.length === 0 ? (
                <p role="status" className="text-base leading-7 text-(--foreground)/75">
                    {filter === "active" ? t.myProjectsEmpty : t.myProjectsDeletedHistory}
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {visible.map((item) => (
                        <li
                            key={item.id}
                            className="flex flex-col gap-4 rounded-xl border border-(--brand)/15 bg-(--background) p-4 sm:flex-row sm:items-center"
                        >
                            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-md bg-(--brand)/5 sm:w-32">
                                {item.imageUrl ? (
                                    <OptimizedImage
                                        src={item.imageUrl}
                                        alt={`${item.title}`}
                                        variant="avatar"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-2 text-center text-xs text-(--foreground)/60">
                                        {t.projectImageUnavailable}
                                    </div>
                                )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/proyectos/${item.id}`}
                                        className="min-h-11 inline-flex items-center rounded-md text-base font-semibold text-(--foreground) underline-offset-4 hover:text-(--brand) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                    >
                                        {item.title}
                                    </Link>
                                    {item.deleted ? (
                                        <span className="inline-flex items-center rounded-full bg-(--secondary)/10 px-2.5 py-1 text-xs font-bold text-(--secondary)">
                                            {t.myProjectsDeletedBadge}
                                        </span>
                                    ) : null}
                                </div>
                                <p className="text-sm text-(--foreground)/70">
                                    {item.city.name} · {t.projectLikeCount(item.likesCount)}
                                </p>
                                {item.categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {item.categories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="rounded-md border border-(--brand)/10 bg-(--brand)/5 px-2 py-0.5 text-[11px] font-medium text-(--brand)"
                                            >
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            {!item.deleted ? (
                                <div className="flex shrink-0 items-center gap-2">
                                    <Link
                                        href={`/proyectos/${item.id}/editar`}
                                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                    >
                                        {t.myProjectsEdit}
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={pendingId === item.id}
                                        onClick={() => setDialogFor(item)}
                                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--secondary)/25 px-4 text-sm font-semibold text-(--secondary) transition-colors hover:bg-(--secondary)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                                    >
                                        {t.myProjectsDelete}
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href={`/proyectos/${item.id}`}
                                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                                >
                                    {t.myProjectsView}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {dialogFor ? (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="dar-de-baja-titulo"
                        aria-describedby="dar-de-baja-descripcion"
                        className="w-full max-w-md rounded-2xl border border-(--brand)/15 bg-(--background) p-6"
                    >
                        <h2 id="dar-de-baja-titulo" className="text-lg font-bold text-(--foreground)">
                            {t.myProjectsDeleteDialogTitle}
                        </h2>
                        <p id="dar-de-baja-descripcion" className="mt-2 text-sm leading-6 text-(--foreground)/75">
                            {t.myProjectsDeleteMessage(dialogFor.title)}
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDialogFor(null)}
                                className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand)/25 px-4 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                            >
                                {t.myProjectsDeleteCancel}
                            </button>
                            <button
                                type="button"
                                ref={confirmRef}
                                disabled={pendingId === dialogFor.id}
                                onClick={handleConfirmDelete}
                                className="inline-flex min-h-11 items-center justify-center rounded-md bg-(--secondary) px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-wait disabled:opacity-70"
                            >
                                {t.myProjectsDeleteConfirmButton}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
