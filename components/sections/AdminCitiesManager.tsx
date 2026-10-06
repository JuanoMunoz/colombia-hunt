"use client";

import { useEffect, useState } from "react";

export type CityTranslation = {
    slug: string;
    name: string;
    description: string;
};

export type CityRecord = {
    id: number;
    code: string;
    translations: {
        es?: CityTranslation;
        en?: CityTranslation;
    };
};

export function AdminCitiesManager() {
    const [cities, setCities] = useState<CityRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal / Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<CityRecord | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Form fields
    const [code, setCode] = useState("");
    const [esName, setEsName] = useState("");
    const [esSlug, setEsSlug] = useState("");
    const [esDescription, setEsDescription] = useState("");
    const [enName, setEnName] = useState("");
    const [enSlug, setEnSlug] = useState("");
    const [enDescription, setEnDescription] = useState("");

    const fetchCities = async () => {
        setError(null);
        try {
            const res = await fetch("/api/cities");
            if (!res.ok) throw new Error("Error al obtener el listado de ciudades.");
            const data = await res.json() as CityRecord[];
            setCities(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar ciudades.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        fetch("/api/cities")
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener el listado de ciudades.");
                return res.json() as Promise<CityRecord[]>;
            })
            .then((data) => {
                if (active) setCities(data);
            })
            .catch((err: unknown) => {
                if (active) setError(err instanceof Error ? err.message : "Error al cargar ciudades.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const openCreateForm = () => {
        setEditingCity(null);
        setCode("");
        setEsName("");
        setEsSlug("");
        setEsDescription("");
        setEnName("");
        setEnSlug("");
        setEnDescription("");
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (city: CityRecord) => {
        setEditingCity(city);
        setCode(city.code);
        setEsName(city.translations.es?.name ?? "");
        setEsSlug(city.translations.es?.slug ?? "");
        setEsDescription(city.translations.es?.description ?? "");
        setEnName(city.translations.en?.name ?? "");
        setEnSlug(city.translations.en?.slug ?? "");
        setEnDescription(city.translations.en?.description ?? "");
        setFormError(null);
        setIsFormOpen(true);
    };

    // Auto-generate slug from name if empty
    const handleEsNameChange = (val: string) => {
        setEsName(val);
        if (!editingCity && !esSlug) {
            setEsSlug(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    };

    const handleEnNameChange = (val: string) => {
        setEnName(val);
        if (!editingCity && !enSlug) {
            setEnSlug(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        const payload = {
            code: code.trim().toUpperCase(),
            translations: [
                {
                    locale: "es",
                    name: esName.trim(),
                    slug: esSlug.trim(),
                    description: esDescription.trim(),
                },
                {
                    locale: "en",
                    name: enName.trim(),
                    slug: enSlug.trim(),
                    description: enDescription.trim(),
                },
            ],
        };

        try {
            const url = editingCity ? `/api/cities/${editingCity.id}` : "/api/cities";
            const method = editingCity ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json() as { error?: string };
            if (!res.ok) {
                throw new Error(data.error || "No se pudo guardar la ciudad.");
            }

            setIsFormOpen(false);
            await fetchCities();
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : "Error al guardar.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (city: CityRecord) => {
        if (!confirm(`¿Estás seguro de eliminar la ciudad "${city.translations.es?.name || city.code}"?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/cities/${city.id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json() as { error?: string };
                throw new Error(data.error || "No se pudo eliminar la ciudad.");
            }
            await fetchCities();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Error al eliminar la ciudad.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-(--brand)/15 shadow-xs">
                <div>
                    <h2 className="text-xl font-bold text-(--brand)">CRUD de Ciudades</h2>
                    <p className="text-xs sm:text-sm text-(--foreground)/70 mt-1">
                        Crea, edita y administra las ciudades registradas en la plataforma.
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="h-11 px-5 rounded-full bg-(--brand) text-white font-semibold text-sm hover:bg-(--brand)/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Ciudad
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
                    <div className="p-8 text-center text-sm text-(--foreground)/70">Cargando ciudades...</div>
                ) : cities.length === 0 ? (
                    <div className="p-8 text-center text-sm text-(--foreground)/70">
                        No hay ciudades registradas aún. ¡Crea la primera!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-(--brand)/5 text-(--brand) border-b border-(--brand)/10 font-bold">
                                <tr>
                                    <th scope="col" className="py-3.5 px-4">ID / Código</th>
                                    <th scope="col" className="py-3.5 px-4">Nombre (ES)</th>
                                    <th scope="col" className="py-3.5 px-4">Slug (ES)</th>
                                    <th scope="col" className="py-3.5 px-4">Nombre (EN)</th>
                                    <th scope="col" className="py-3.5 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--brand)/10">
                                {cities.map((city) => (
                                    <tr key={city.id} className="hover:bg-(--brand)/2 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-bold text-(--brand)">
                                            #{city.id} <span className="ml-1 px-2 py-0.5 rounded bg-(--brand)/10 text-xs">{city.code}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-(--foreground)">
                                            {city.translations.es?.name || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs font-mono text-(--foreground)/70">
                                            {city.translations.es?.slug || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-(--foreground)/80">
                                            {city.translations.en?.name || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditForm(city)}
                                                    className="px-3 py-1.5 rounded-lg border border-(--brand)/20 text-(--brand) hover:bg-(--brand)/10 font-semibold text-xs transition-colors cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(city)}
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

            {/* Modal / Slide-over Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl border border-(--brand)/20 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-(--brand)/10 mb-4">
                            <h3 className="text-lg font-bold text-(--brand)">
                                {editingCity ? `Editar Ciudad #${editingCity.id}` : "Crear Nueva Ciudad"}
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
                                    Código de la ciudad (ISO / Abreviatura)*
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={10}
                                    placeholder="ej. BOG, MDE, CLO"
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
                                        placeholder="ej. Bogotá"
                                        value={esName}
                                        onChange={(e) => handleEsNameChange(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Slug URL (ES)*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ej. bogota"
                                        value={esSlug}
                                        onChange={(e) => setEsSlug(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) font-mono text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Descripción (ES)*</label>
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Descripción de la ciudad en español..."
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
                                        placeholder="ej. Bogota"
                                        value={enName}
                                        onChange={(e) => handleEnNameChange(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Slug URL (EN)*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ej. bogota"
                                        value={enSlug}
                                        onChange={(e) => setEnSlug(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl border border-(--brand)/20 focus:outline-(--brand) font-mono text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-(--foreground)/80 mb-1">Descripción (EN)*</label>
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Description of the city in English..."
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
                                    {submitting ? "Guardando..." : editingCity ? "Actualizar Ciudad" : "Crear Ciudad"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
