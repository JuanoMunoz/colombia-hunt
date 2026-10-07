import type { Metadata } from "next";
import { and, asc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import EditProjectForm from "../../../../components/sections/EditProjectForm";
import { getAuthPageHref } from "../../../lib/auth-redirect";
import { getSession } from "../../../lib/get-session";
import { db } from "@/db";
import {
    categories,
    categoryTranslations,
    cities,
    cityTranslations,
    profiles,
    projectCategories,
    projects,
} from "@/db/schema";

export const metadata: Metadata = {
    title: "Editar proyecto | Colombia Hunt",
    description: "Actualiza los datos de tu proyecto publicado en Colombia Hunt.",
    robots: { index: false, follow: false },
};

function parseProjectId(rawId: string): number | null {
    const id = Number(rawId);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: rawId } = await params;
    const id = parseProjectId(rawId);
    if (!id) notFound();

    const session = await getSession();
    if (!session?.user) {
        redirect(getAuthPageHref("/iniciar-sesion", `/proyectos/${id}/editar`));
    }

    const [project] = await db
        .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            creatorId: projects.creatorId,
            cityId: projects.cityId,
            imageUrl: projects.imageUrl,
            pageUrl: projects.pageUrl,
            livecodeUrl: projects.livecodeUrl,
            deleted: projects.deleted,
        })
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

    if (!project || project.deleted) notFound();

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1);

    const isCreator = project.creatorId === session.user.id;
    const isAdmin = profile?.role === "admin";
    if (!isCreator && !isAdmin) notFound();

    const [rows, cityOptions, categoryOptions] = await Promise.all([
        db
            .select({ categoryId: projectCategories.categoryId })
            .from(projectCategories)
            .where(eq(projectCategories.projectId, id)),
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
            <EditProjectForm
                initial={{
                    id: project.id,
                    title: project.title,
                    description: project.description ?? "",
                    cityId: project.cityId,
                    categoryIds: rows.map((row) => row.categoryId),
                    imageUrl: project.imageUrl,
                    pageUrl: project.pageUrl ?? "",
                    livecodeUrl: project.livecodeUrl ?? "",
                }}
                cities={cityOptions}
                categories={categoryOptions}
            />
        </main>
    );
}
