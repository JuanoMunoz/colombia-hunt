import type { Metadata } from "next";
import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import CreateProjectForm from "../../../components/sections/CreateProjectForm";
import { getAuthPageHref } from "../../lib/auth-redirect";
import { getSession } from "../../lib/get-session";
import { db } from "@/db";
import {
    categories,
    categoryTranslations,
    cities,
    cityTranslations,
} from "@/db/schema";

export const metadata: Metadata = {
    title: "Publica tu proyecto | Colombia Hunt",
    description:
        "Comparte un proyecto tecnológico hecho en Colombia y conecta con la comunidad.",
    robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
    const session = await getSession();
    if (!session?.user) {
        redirect(getAuthPageHref("/iniciar-sesion", "/proyectos/nuevo"));
    }

    const [cityOptions, categoryOptions] = await Promise.all([
        db
            .select({ id: cities.id, name: cityTranslations.name })
            .from(cities)
            .innerJoin(
                cityTranslations,
                and(
                    eq(cityTranslations.cityId, cities.id),
                    eq(cityTranslations.locale, "es"),
                ),
            )
            .orderBy(asc(cityTranslations.name)),
        db
            .select({ id: categories.id, name: categoryTranslations.name })
            .from(categories)
            .innerJoin(
                categoryTranslations,
                and(
                    eq(categoryTranslations.categoryId, categories.id),
                    eq(categoryTranslations.locale, "es"),
                ),
            )
            .orderBy(asc(categoryTranslations.name)),
    ]);

    return (
        <main className="surface-light flex flex-1 flex-col bg-(--background)">
            <CreateProjectForm cities={cityOptions} categories={categoryOptions} />
        </main>
    );
}
