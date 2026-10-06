"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
    className?: string;
}

const navItems = [
    {
        href: "/admin",
        label: "Inicio / Resumen",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: "/admin/ciudades",
        label: "CRUD Ciudades",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0v10" />
            </svg>
        ),
    },
    {
        href: "/admin/categorias",
        label: "CRUD Categorías",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
    },
    {
        href: "/admin/proyectos",
        label: "CRUD Proyectos",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
];

export function AdminSidebar({ className = "" }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`w-full md:w-64 bg-white rounded-2xl border border-(--brand)/15 p-4 shrink-0 shadow-xs ${className}`}>
            <div className="mb-4 pb-3 border-b border-(--brand)/10 px-2 hidden md:block">
                <span className="text-xs font-bold uppercase tracking-wider text-(--brand)/70">
                    Panel de Administración
                </span>
            </div>

            <nav aria-label="Navegación del panel de administración" className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-11 whitespace-nowrap ${
                                isActive
                                    ? "bg-(--brand) text-white shadow-xs"
                                    : "text-(--foreground) hover:bg-(--brand)/5 hover:text-(--brand)"
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-(--brand)"}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
