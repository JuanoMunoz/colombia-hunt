import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
    categories,
    categoryTranslations,
    cities,
    cityTranslations,
    projectCategories,
    projects,
    user,
} from "@/db/schema";
import { requireAdmin } from "@/app/lib/require-admin";

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;

    const allProjects = await db
        .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            imageUrl: projects.imageUrl,
            pageUrl: projects.pageUrl,
            livecodeUrl: projects.livecodeUrl,
            creatorId: projects.creatorId,
            creatorName: user.name,
            creatorEmail: user.email,
            cityId: projects.cityId,
            cityName: cityTranslations.name,
            deleted: projects.deleted,
            deletedAt: projects.deletedAt,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
        })
        .from(projects)
        .leftJoin(user, eq(projects.creatorId, user.id))
        .leftJoin(cities, eq(projects.cityId, cities.id))
        .leftJoin(
            cityTranslations,
            eq(cityTranslations.cityId, cities.id)
        );

    // Filter ES translation or default for city name if available
    const projectMap = new Map<number, typeof allProjects[number]>();
    for (const item of allProjects) {
        if (!projectMap.has(item.id)) {
            projectMap.set(item.id, item);
        }
    }

    const uniqueProjects = Array.from(projectMap.values());

    // Fetch categories for each project
    const allProjectCategories = await db
        .select({
            projectId: projectCategories.projectId,
            categoryId: categories.id,
            code: categories.code,
            name: categoryTranslations.name,
        })
        .from(projectCategories)
        .innerJoin(categories, eq(projectCategories.categoryId, categories.id))
        .leftJoin(categoryTranslations, eq(categoryTranslations.categoryId, categories.id));

    const categoriesByProject = new Map<number, { id: number; code: string; name: string }[]>();
    for (const pc of allProjectCategories) {
        if (!categoriesByProject.has(pc.projectId)) {
            categoriesByProject.set(pc.projectId, []);
        }
        const existing = categoriesByProject.get(pc.projectId)!;
        if (!existing.some((c) => c.id === pc.categoryId)) {
            existing.push({ id: pc.categoryId, code: pc.code, name: pc.name ?? pc.code });
        }
    }

    const result = uniqueProjects.map((p) => ({
        ...p,
        categories: categoriesByProject.get(p.id) ?? [],
    }));

    return Response.json(result);
}
