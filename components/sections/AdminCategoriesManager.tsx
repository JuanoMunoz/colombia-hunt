"use client";

import { useEffect, useState } from "react";

export type CategoryTranslation = {
    name: string;
    description: string;
};

export type CategoryRecord = {
    id: number;
    code: string;
    translations: {
        es?: CategoryTranslation;
        en?: CategoryTranslation;
    };
};

export function AdminCategoriesManager() {
    const [categories, setCategories] = useState<CategoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form fields
    const [code, setCode] = useState("");
    const [esName, setEsName] = useState("");
    const [esDescription, setEsDescription] = useState("");
    const [enName, setEnName] = useState("");
    const [enDescription, setEnDescription] = useState("");

    const fetchCategories = async () => {
        setError(null);
        try {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Error al obtener el listado de categorías.");
            const data = await res.json() as CategoryRecord[];
            setCategories(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar categorías.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        fetch("/api/categories")
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener el listado de categorías.");
                return res.json() as Promise<CategoryRecord[]>;
            })
            .then((data) => {
                if (active) setCategories(data);
            })
            .catch((err: unknown) => {
                if (active) setError(err instanceof Error ? err.message : "Error al cargar categorías.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const openCreateForm = () => {
        setEditingCategory(null);
        setCode("");
        setEsName("");
        setEsDescription("");
        setEnName("");
        setEnDescription("");
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (category: CategoryRecord) => {
        setEditingCategory(category);
        setCode(category.code);
        setEsName(category.translations.es?.name ?? "");
        setEsDescription(category.translations.es?.description ?? "");
        setEnName(category.translations.en?.name ?? "");
        setEnDescription(category.translations.en?.description ?? "");
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        const payload = {
            code: code.trim().toLowerCase(),
            translations: [
                {
                    locale: "es",
                    name: esName.trim(),
                    description: esDescription.trim(),
                },
                {
                    locale: "en",
                    name: enName.trim(),
                    description: enDescription.trim(),
                },
            ],
        };

        try {
            const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
            const method = editingCategory ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json() as { error?: string };
            if (!res.ok) {
                throw new Error(data.error || "No se pudo guardar la categoría.");
            }

            setIsFormOpen(false);
            await fetchCategories();
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : "Error al guardar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (category: CategoryRecord) => {
        if (!confirm(`¿Estás seguro de eliminar la categoría "${category.translations.es?.name || category.code}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json() as { error?: string };
                throw new Error(data.error || "No se pudo eliminar la categoría.");
            }
            await fetchCategories();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Error al eliminar la categoría.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-(--brand)/15 shadow-xs">
                <div>
                    <h2 className="text-xl font-bold text-(--brand)">CRUD de Categorías</h2>
                    <p className="text-xs sm:text-sm text-(--foreground)/70 mt-1">
                        Crea, edita y administra las categorías temáticas de los proyectos.
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="h-11 px-5 rounded-full bg-(--brand) text-white font-semibold text-sm hover:bg-(--brand)/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Categoría
                </button>
            </div>

            {error && (
                <div role="alert" className="p-4 rounded-xl bg-(--secondary)/10 text-(--secondary) border border-(--secondary)/20 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Table list */}
            <div className="bg-white rounded-2xl border border-(--brand)/15 overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-8 text-center text-sm text-(--foreground)/70">Cargando categorías...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-sm text-(--foreground)/70">
                        No hay categorías registradas aún. ¡Crea la primera!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-(--brand)/5 text-(--brand) border-b border-(--brand)/10 font-bold">
                                <tr>
                                    <th scope="col" className="py-3.5 px-4">ID / Código</th>
                                    <th scope="col" className="py-3.5 px-4">Nombre (ES)</th>
                                    <th scope="col" className="py-3.5 px-4">Nombre (EN)</th>
                                    <th scope="col" className="py-3.5 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--brand)/10">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-(--brand)/2 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-(--brand)">
                                            #{category.id} <span className="ml-1 px-2 py-0.5 rounded bg-(--brand)/10 text-xs">{category.code}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-(--foreground)">
                                            {category.translations.es?.name || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-(--foreground)/80">
                                            {category.translations.en?.name || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditForm(category)}
                                                    className="px-3 py-1.5 rounded-lg border border-(--brand)/20 text-(--brand) hover:bg-(--brand)/10 font-semibold text-xs transition-colors cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="px-3 py-1.5 rounded-lg border border-(--secondary)/20 text-(--secondary) hover:bg-(--secondary)/10 font-semibold text-xs transition-colors cursor-pointer"
                                                >
                                                    Eliminar
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

            {/* Modal / Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl border border-(--brand)/20 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-(--brand)/10 mb-4">
                            <h3 className="text-lg font-bold text-(--brand)">
                                {editingCategory ? `Editar Categoría #${editingCategory.id}` : "Crear Nueva Categoría"}
                            </h3>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-(--foreground)/60 hover:text-(--foreground) p-1 rounded-md"
                                aria-label="Cerrar"
                            >
                                &#x2715;
                            </button>
                        </div>

                        {formError && (
                            <div role="alert" className="p-3 mb-4 rounded-xl bg-(--secondary)/10 text-(--secondary) text-xs font-semibold">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-(--brand) mb-1">
                                    Código identificador de la categoría*
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={30}
                                    placeholder="ej. finanzas, open-source, salud"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) font-mono text-sm"
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-(--brand)/3 border border-(--brand)/10 space-y-3">
                                <span className="text-xs font-bold uppercase text-(--brand)">Traducción Español (ES)*</span>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Nombre (ES)*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ej. Finanzas & Fintech"
                                        value={esName}
                                        onChange={(e) => setEsName(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Descripción (ES)*</label>
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Descripción de la categoría en español..."
                                        value={esDescription}
                                        onChange={(e) => setEsDescription(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-(--brand)/3 border border-(--brand)/10 space-y-3">
                                <span className="text-xs font-bold uppercase text-(--brand)">Traducción Inglés (EN)*</span>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Nombre (EN)*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ej. Finance & Fintech"
                                        value={enName}
                                        onChange={(e) => setEnName(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Descripción (EN)*</label>
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Description of the category in English..."
                                        value={enDescription}
                                        onChange={(e) => setEnDescription(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="h-11 px-5 rounded-full border border-(--brand)/20 text-(--foreground) hover:bg-(--brand)/5 text-sm font-semibold cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="h-11 px-6 rounded-full bg-(--brand) text-white hover:bg-(--brand)/90 text-sm font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? "Guardando..." : editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
