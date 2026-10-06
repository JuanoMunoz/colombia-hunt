import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSession } from "@/app/lib/get-session";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export const metadata = {
    title: "Panel Admin | Colombia Hunt",
    description: "Gestión administrativa de ciudades, categorías y proyectos en Colombia Hunt.",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session?.user) {
        redirect("/iniciar-sesion?next=/admin");
    }

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    if (profile?.role !== "admin") {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center surface-light">
                <div className="max-w-md w-full bg-white rounded-2xl border border-(--brand)/15 p-8 shadow-sm">
                    <div className="w-16 h-16 bg-(--secondary)/10 text-(--secondary) rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-(--brand) mb-2">Acceso denegado (403)</h1>
                    <p className="text-(--foreground)/80 text-sm mb-6">
                        No tienes permisos de administrador para acceder a esta sección. Esta zona está reservada únicamente para administradores de Colombia Hunt.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center h-12 rounded-full px-6 bg-(--brand) text-white font-medium hover:bg-(--brand)/90 transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-(--background) surface-light">
            <header className="bg-white border-b border-(--brand)/10 py-6 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-(--secondary)/10 text-(--secondary)">
                                Admin
                            </span>
                            <h1 className="text-2xl font-bold text-(--brand)">
                                Dashboard del Admin<span className="text-(--secondary)">.</span>
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-(--foreground)/70 mt-1">
                            Panel de gestión de ciudades, categorías y proyectos del ecosistema colombiano.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <span className="text-(--foreground)/70 font-medium">
                            Hola, <strong className="text-(--brand)">{session.user.name}</strong>
                        </span>
                        <Link
                            href="/"
                            className="px-3.5 py-1.5 rounded-full border border-(--brand)/20 text-(--brand) hover:bg-(--brand)/5 transition-colors font-medium min-h-11 flex items-center"
                        >
                            Ver sitio público &rarr;
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-6">
                <AdminSidebar />
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </main>
    );
}
