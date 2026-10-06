import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, cities, projects } from "@/db/schema";

export default async function AdminDashboardPage() {
    const [[{ value: totalCities }], [{ value: totalCategories }], [{ value: totalProjects }], [{ value: activeProjects }]] = await Promise.all([
        db.select({ value: count() }).from(cities),
        db.select({ value: count() }).from(categories),
        db.select({ value: count() }).from(projects),
        db.select({ value: count() }).from(projects).where(eq(projects.deleted, false)),
    ]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-(--brand)/15 p-6 shadow-xs">
                <h2 className="text-xl font-bold text-(--brand) mb-2">Resumen General</h2>
                <p className="text-sm text-(--foreground)/70">
                    Bienvenido al panel de administración. Desde aquí puedes gestionar los catálogos principales y moderar los proyectos de la plataforma.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-(--brand)/15 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-(--brand)/70 uppercase tracking-wider">Ciudades</span>
                        <div className="text-3xl font-extrabold text-(--brand) mt-2">{totalCities}</div>
                    </div>
                    <Link
                        href="/admin/ciudades"
                        className="mt-4 text-xs font-semibold text-(--brand) hover:underline flex items-center gap-1"
                    >
                        Gestionar ciudades &rarr;
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-(--brand)/15 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-(--brand)/70 uppercase tracking-wider">Categorías</span>
                        <div className="text-3xl font-extrabold text-(--brand) mt-2">{totalCategories}</div>
                    </div>
                    <Link
                        href="/admin/categorias"
                        className="mt-4 text-xs font-semibold text-(--brand) hover:underline flex items-center gap-1"
                    >
                        Gestionar categorías &rarr;
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-(--brand)/15 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-(--brand)/70 uppercase tracking-wider">Proyectos</span>
                        <div className="text-3xl font-extrabold text-(--brand) mt-2">{totalProjects}</div>
                        <p className="text-xs text-(--foreground)/60 mt-1">{activeProjects} activos, {totalProjects - activeProjects} dados de baja</p>
                    </div>
                    <Link
                        href="/admin/proyectos"
                        className="mt-4 text-xs font-semibold text-(--brand) hover:underline flex items-center gap-1"
                    >
                        Gestionar proyectos &rarr;
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/ciudades"
                    className="p-5 bg-white rounded-2xl border border-(--brand)/15 hover:border-(--brand)/40 transition-colors shadow-xs group"
                >
                    <div className="w-10 h-10 rounded-xl bg-(--brand)/10 text-(--brand) flex items-center justify-center mb-3 group-hover:bg-(--brand) group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0v10" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-(--brand) text-lg mb-1">CRUD de Ciudades</h3>
                    <p className="text-xs text-(--foreground)/70">
                        Crear, editar códigos y traducciones en español/inglés de las ciudades de Colombia.
                    </p>
                </Link>

                <Link
                    href="/admin/categorias"
                    className="p-5 bg-white rounded-2xl border border-(--brand)/15 hover:border-(--brand)/40 transition-colors shadow-xs group"
                >
                    <div className="w-10 h-10 rounded-xl bg-(--brand)/10 text-(--brand) flex items-center justify-center mb-3 group-hover:bg-(--brand) group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-(--brand) text-lg mb-1">CRUD de Categorías</h3>
                    <p className="text-xs text-(--foreground)/70">
                        Crear, editar códigos y nombres/descripciones de las categorías del catálogo.
                    </p>
                </Link>

                <Link
                    href="/admin/proyectos"
                    className="p-5 bg-white rounded-2xl border border-(--brand)/15 hover:border-(--brand)/40 transition-colors shadow-xs group"
                >
                    <div className="w-10 h-10 rounded-xl bg-(--brand)/10 text-(--brand) flex items-center justify-center mb-3 group-hover:bg-(--brand) group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-(--brand) text-lg mb-1">CRUD de Proyectos</h3>
                    <p className="text-xs text-(--foreground)/70">
                        Ver listado completo, moderar, editar o aplicar baja lógica/restauración de proyectos.
                    </p>
                </Link>
            </div>
        </div>
    );
}
