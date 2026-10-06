"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type AdminProjectRecord = {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    pageUrl: string | null;
    livecodeUrl: string | null;
    creatorId: string;
    creatorName: string | null;
    creatorEmail: string | null;
    cityId: number;
    cityName: string | null;
    deleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    categories: { id: number; code: string; name: string }[];
};

export function AdminProjectsManager() {
    const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "deleted">("all");

    const fetchProjects = async () => {
        setError(null);
        try {
            const res = await fetch("/api/admin/projects");
            if (!res.ok) throw new Error("Error al obtener el listado de proyectos.");
            const data = await res.json() as AdminProjectRecord[];
            setProjects(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar proyectos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        fetch("/api/admin/projects")
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener el listado de proyectos.");
                return res.json() as Promise<AdminProjectRecord[]>;
            })
            .then((data) => {
                if (active) setProjects(data);
            })
            .catch((err: unknown) => {
                if (active) setError(err instanceof Error ? err.message : "Error al cargar proyectos.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const handleToggleDelete = async (project: AdminProjectRecord) => {
        const isSoftDeleting = !project.deleted;
        const confirmMsg = isSoftDeleting
            ? `¿Estás seguro de dar de baja el proyecto "${project.title}"? (No aparecerá en el catálogo público)`
            : `¿Deseas restaurar y volver a publicar el proyecto "${project.title}"?`;

        if (!confirm(confirmMsg)) return;

        try {
            if (isSoftDeleting) {
                const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json() as { error?: string };
                    throw new Error(data.error || "No se pudo dar de baja el proyecto.");
                }
            } else {
                const res = await fetch(`/api/projects/${project.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deleted: false }),
                });
                if (!res.ok) {
                    const data = await res.json() as { error?: string };
                    throw new Error(data.error || "No se pudo restaurar el proyecto.");
                }
            }

            await fetchProjects();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Error al actualizar estado del proyecto.");
        }
    };

    const filteredProjects = projects.filter((p) => {
        if (filterStatus === "active") return !p.deleted;
        if (filterStatus === "deleted") return p.deleted;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-(--brand)/15 shadow-xs">
                <div>
                    <h2 className="text-xl font-bold text-(--brand)">CRUD & Moderación de Proyectos</h2>
                    <p className="text-xs sm:text-sm text-(--foreground)/70 mt-1">
                        Supervisa, edita estado y administra los proyectos creados por la comunidad.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 bg-(--brand)/5 p-1 rounded-full border border-(--brand)/10 text-xs font-semibold">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                            filterStatus === "all" ? "bg-(--brand) text-white" : "text-(--brand) hover:bg-(--brand)/10"
                        }`}
                    >
                        Todos ({projects.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("active")}
                        className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                            filterStatus === "active" ? "bg-(--brand) text-white" : "text-(--brand) hover:bg-(--brand)/10"
                        }`}
                    >
                        Activos ({projects.filter((p) => !p.deleted).length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("deleted")}
                        className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                            filterStatus === "deleted" ? "bg-(--brand) text-white" : "text-(--brand) hover:bg-(--brand)/10"
                        }`}
                    >
                        Dados de baja ({projects.filter((p) => p.deleted).length})
                    </button>
                </div>
            </div>

            {error && (
                <div role="alert" className="p-4 rounded-xl bg-(--secondary)/10 text-(--secondary) border border-(--secondary)/20 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Table list */}
            <div className="bg-white rounded-2xl border border-(--brand)/15 overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-8 text-center text-sm text-(--foreground)/70">Cargando proyectos...</div>
                ) : filteredProjects.length === 0 ? (
                    <div className="p-8 text-center text-sm text-(--foreground)/70">
                        No hay proyectos en esta categoría.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-(--brand)/5 text-(--brand) border-b border-(--brand)/10 font-bold">
                                <tr>
                                    <th scope="col" className="py-3.5 px-4">ID</th>
                                    <th scope="col" className="py-3.5 px-4">Proyecto</th>
                                    <th scope="col" className="py-3.5 px-4">Creador</th>
                                    <th scope="col" className="py-3.5 px-4">Ciudad</th>
                                    <th scope="col" className="py-3.5 px-4">Estado</th>
                                    <th scope="col" className="py-3.5 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--brand)/10">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className={`hover:bg-(--brand)/2 transition-colors ${project.deleted ? "bg-stone-50/50" : ""}`}>
                                        <td className="py-3.5 px-4 font-mono font-bold text-(--brand)">
                                            #{project.id}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-(--foreground)">
                                                <Link href={`/proyectos/${project.id}`} target="_blank" className="hover:text-(--brand) underline decoration-dotted">
                                                    {project.title}
                                                </Link>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {project.categories.map((c) => (
                                                    <span key={c.id} className="px-2 py-0.5 rounded-md bg-(--brand)/5 text-(--brand) text-[11px] font-medium border border-(--brand)/10">
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-medium text-(--foreground)">
                                                {project.creatorName || "Usuario Anónimo"}
                                            </div>
                                            <div className="text-xs text-(--foreground)/60 font-mono">
                                                {project.creatorEmail || "—"}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-(--foreground)/80 font-medium">
                                            {project.cityName || "—"}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {project.deleted ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-(--secondary)/10 text-(--secondary)">
                                                    Baja lógica
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    Publicado
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/proyectos/${project.id}`}
                                                    target="_blank"
                                                    className="px-3 py-1.5 rounded-lg border border-(--brand)/20 text-(--brand) hover:bg-(--brand)/10 font-semibold text-xs transition-colors"
                                                >
                                                    Ver
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleDelete(project)}
                                                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                                                        project.deleted
                                                            ? "border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                                            : "border border-(--secondary)/20 text-(--secondary) hover:bg-(--secondary)/10"
                                                    }`}
                                                >
                                                    {project.deleted ? "Restaurar" : "Dar de baja"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
