import { and, asc, count, desc, eq, inArray, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
    categories,
    categoryTranslations,
    cities,
    cityTranslations,
    profiles,
    projectCategories,
    projectCoauthors,
    projectLikes,
    projects,
    user,
} from "@/db/schema";

export type ProjectCategory = {
    id: number;
    code: string;
    name: string;
};

export type ProjectProfileLink = {
    label: string;
    url: string;
};

export type ProjectCoAuthor = {
    id: number;
    name: string;
    profileLinks: ProjectProfileLink[];
    showAsCreator: boolean;
};

export type ProjectRecord = {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    pageUrl: string | null;
    livecodeUrl: string | null;
    city: { id: number; name: string; slug: string | null };
    creator: { name: string; profileLinks: ProjectProfileLink[] };
    /** Todos los co-authors del proyecto, ordenados por id ascendente. */
    coauthors: ProjectCoAuthor[];
    /** Personas adicionales más allá del autor visible (para el "+N personas" de la card). */
    extraCoauthors: number;
    categories: ProjectCategory[];
    likesCount: number;
};

export type ProjectFilters = {
    cityId?: number;
    categoryId?: number;
    projectId?: number;
    query?: string;
    limit?: number;
    offset?: number;
};

export type ProjectsPage = {
    items: ProjectRecord[];
    hasMore: boolean;
    total?: number;
};

type CreatorRow = {
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    email: string | null;
    whatsapp: string | null;
};

function creatorLinks(row: CreatorRow): ProjectProfileLink[] {
    return profileLinks(
        row.githubUrl || row.linkedinUrl || row.twitterUrl || row.instagramUrl || row.email || row.whatsapp
            ? {
                githubUrl: row.githubUrl,
                linkedinUrl: row.linkedinUrl,
                twitterUrl: row.twitterUrl,
                instagramUrl: row.instagramUrl,
                email: row.email,
                whatsapp: row.whatsapp,
            }
            : null,
    );
}

async function getCoauthorsByProject(projectIds: number[]): Promise<Map<number, ProjectCoAuthor[]>> {
    const byProject = new Map<number, ProjectCoAuthor[]>();
    if (projectIds.length === 0) return byProject;

    const rows = await db
        .select({
            projectId: projectCoauthors.projectId,
            id: projectCoauthors.id,
            name: projectCoauthors.name,
            githubUrl: projectCoauthors.githubUrl,
            linkedinUrl: projectCoauthors.linkedinUrl,
            twitterUrl: projectCoauthors.twitterUrl,
            instagramUrl: projectCoauthors.instagramUrl,
            email: projectCoauthors.email,
            whatsapp: projectCoauthors.whatsapp,
            showAsCreator: projectCoauthors.showAsCreator,
        })
        .from(projectCoauthors)
        .where(inArray(projectCoauthors.projectId, projectIds))
        .orderBy(asc(projectCoauthors.id));

    for (const row of rows) {
        const current = byProject.get(row.projectId) ?? [];
        current.push({
            id: row.id,
            name: row.name,
            profileLinks: creatorLinks(row),
            showAsCreator: row.showAsCreator,
        });
        byProject.set(row.projectId, current);
    }
    return byProject;
}

function resolveCreator(
    creatorName: string,
    links: ProjectProfileLink[],
    coauthors: ProjectCoAuthor[],
): { creator: ProjectRecord["creator"]; extraCoauthors: number } {
    const principal = coauthors.find((coauthor) => coauthor.showAsCreator);
    if (principal) {
        return {
            creator: { name: principal.name, profileLinks: principal.profileLinks },
            extraCoauthors: coauthors.length - 1,
        };
    }
    return { creator: { name: creatorName, profileLinks: links }, extraCoauthors: coauthors.length };
}

function profileLinks(profile: {
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    email: string | null;
    whatsapp: string | null;
} | null): ProjectProfileLink[] {
    if (!profile) return [];

    return [
        { label: "GitHub", url: profile.githubUrl },
        { label: "LinkedIn", url: profile.linkedinUrl },
        { label: "X", url: profile.twitterUrl },
        { label: "Instagram", url: profile.instagramUrl },
        {
            label: "Email",
            url: profile.email ? `mailto:${profile.email}` : null,
        },
        {
            label: "WhatsApp",
            url: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : null,
        },
    ].filter((link): link is ProjectProfileLink => Boolean(link.url));
}

export async function getProjects({
    cityId,
    categoryId,
    projectId,
    query: searchQuery,
    limit = 12,
    offset = 0,
}: ProjectFilters = {}): Promise<ProjectRecord[]> {
    const filters: SQL[] = [];

    filters.push(eq(projects.deleted, false));
    if (cityId !== undefined) filters.push(eq(projects.cityId, cityId));
    if (projectId !== undefined) filters.push(eq(projects.id, projectId));
    const normalizedQuery = searchQuery?.trim();
    if (normalizedQuery) {
        const search = `%${normalizedQuery}%`;
        const titleOrDescription = or(
            like(projects.title, search),
            like(projects.description, search),
        );
        if (titleOrDescription) filters.push(titleOrDescription);
    }

    if (categoryId !== undefined) {
        const matchingProjects = await db
            .select({ projectId: projectCategories.projectId })
            .from(projectCategories)
            .where(eq(projectCategories.categoryId, categoryId));
        const projectIds = [...new Set(matchingProjects.map(({ projectId }) => projectId))];
        if (projectIds.length === 0) return [];
        filters.push(inArray(projects.id, projectIds));
    }

    const query = db
        .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            imageUrl: projects.imageUrl,
            pageUrl: projects.pageUrl,
            livecodeUrl: projects.livecodeUrl,
            creatorName: user.name,
            githubUrl: profiles.githubUrl,
            linkedinUrl: profiles.linkedinUrl,
            twitterUrl: profiles.twitterUrl,
            instagramUrl: profiles.instagramUrl,
            email: profiles.email,
            whatsapp: profiles.whatsapp,
            cityId: cities.id,
            cityCode: cities.code,
            cityName: cityTranslations.name,
            citySlug: cityTranslations.slug,
        })
        .from(projects)
        .innerJoin(user, eq(projects.creatorId, user.id))
        .leftJoin(profiles, eq(projects.creatorId, profiles.userId))
        .innerJoin(cities, eq(projects.cityId, cities.id))
        .leftJoin(
            cityTranslations,
            and(
                eq(cityTranslations.cityId, cities.id),
                eq(cityTranslations.locale, "es"),
            ),
        )
        .orderBy(desc(projects.createdAt))
        // Fetch one extra to determine hasMore
        .limit(limit + 1)
        .offset(offset);

    const rawRows = filters.length > 0
        ? await query.where(and(...filters))
        : await query;

    const hasMore = rawRows.length > limit;
    const rows = hasMore ? rawRows.slice(0, limit) : rawRows;

    if (rows.length === 0) return [];

    const projectIds = rows.map(({ id }) => id);
    const [categoryRows, likeRows, coauthorsByProject] = await Promise.all([
        db
            .select({
                projectId: projectCategories.projectId,
                id: categories.id,
                code: categories.code,
                name: categoryTranslations.name,
            })
            .from(projectCategories)
            .innerJoin(categories, eq(projectCategories.categoryId, categories.id))
            .leftJoin(
                categoryTranslations,
                and(
                    eq(categoryTranslations.categoryId, categories.id),
                    eq(categoryTranslations.locale, "es"),
                ),
            )
            .where(inArray(projectCategories.projectId, projectIds)),
        db
            .select({ projectId: projectLikes.projectId, likesCount: count() })
            .from(projectLikes)
            .where(inArray(projectLikes.projectId, projectIds))
            .groupBy(projectLikes.projectId),
        getCoauthorsByProject(projectIds),
    ]);

    const categoriesByProject = new Map<number, ProjectCategory[]>();
    for (const category of categoryRows) {
        const current = categoriesByProject.get(category.projectId) ?? [];
        current.push({
            id: category.id,
            code: category.code,
            name: category.name ?? category.code,
        });
        categoriesByProject.set(category.projectId, current);
    }

    const likesByProject = new Map(
        likeRows.map(({ projectId, likesCount }) => [projectId, likesCount]),
    );

    const result: ProjectRecord[] = rows.map((row) => {
        const coauthors = coauthorsByProject.get(row.id) ?? [];
        const { creator, extraCoauthors } = resolveCreator(row.creatorName, creatorLinks(row), coauthors);
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            imageUrl: row.imageUrl,
            pageUrl: row.pageUrl,
            livecodeUrl: row.livecodeUrl,
            city: {
                id: row.cityId,
                name: row.cityName ?? row.cityCode,
                slug: row.citySlug,
            },
            creator,
            coauthors,
            extraCoauthors,
            categories: categoriesByProject.get(row.id) ?? [],
            likesCount: likesByProject.get(row.id) ?? 0,
        };
    });

    // Attach hasMore so callers can decide without a count query
    Object.defineProperty(result, "hasMore", { value: hasMore, enumerable: false });
    return result;
}

export type OwnProjectRecord = ProjectRecord & {
    deleted: boolean;
    createdAt: Date | null;
};

export async function getOwnProjects(creatorId: string): Promise<OwnProjectRecord[]> {
    const rows = await db
        .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            imageUrl: projects.imageUrl,
            pageUrl: projects.pageUrl,
            livecodeUrl: projects.livecodeUrl,
            deleted: projects.deleted,
            createdAt: projects.createdAt,
            creatorName: user.name,
            githubUrl: profiles.githubUrl,
            linkedinUrl: profiles.linkedinUrl,
            twitterUrl: profiles.twitterUrl,
            instagramUrl: profiles.instagramUrl,
            email: profiles.email,
            whatsapp: profiles.whatsapp,
            cityId: cities.id,
            cityCode: cities.code,
            cityName: cityTranslations.name,
            citySlug: cityTranslations.slug,
        })
        .from(projects)
        .innerJoin(user, eq(projects.creatorId, user.id))
        .leftJoin(profiles, eq(projects.creatorId, profiles.userId))
        .innerJoin(cities, eq(projects.cityId, cities.id))
        .leftJoin(
            cityTranslations,
            and(
                eq(cityTranslations.cityId, cities.id),
                eq(cityTranslations.locale, "es"),
            ),
        )
        .where(eq(projects.creatorId, creatorId))
        .orderBy(desc(projects.createdAt));

    if (rows.length === 0) return [];

    const projectIds = rows.map(({ id }) => id);
    const [categoryRows, likeRows, coauthorsByProject] = await Promise.all([
        db
            .select({
                projectId: projectCategories.projectId,
                id: categories.id,
                code: categories.code,
                name: categoryTranslations.name,
            })
            .from(projectCategories)
            .innerJoin(categories, eq(projectCategories.categoryId, categories.id))
            .leftJoin(
                categoryTranslations,
                and(
                    eq(categoryTranslations.categoryId, categories.id),
                    eq(categoryTranslations.locale, "es"),
                ),
            )
            .where(inArray(projectCategories.projectId, projectIds)),
        db
            .select({ projectId: projectLikes.projectId, likesCount: count() })
            .from(projectLikes)
            .where(inArray(projectLikes.projectId, projectIds))
            .groupBy(projectLikes.projectId),
        getCoauthorsByProject(projectIds),
    ]);

    const categoriesByProject = new Map<number, ProjectCategory[]>();
    for (const category of categoryRows) {
        const current = categoriesByProject.get(category.projectId) ?? [];
        current.push({
            id: category.id,
            code: category.code,
            name: category.name ?? category.code,
        });
        categoriesByProject.set(category.projectId, current);
    }

    const likesByProject = new Map(
        likeRows.map(({ projectId, likesCount }) => [projectId, likesCount]),
    );

    return rows.map((row) => {
        const coauthors = coauthorsByProject.get(row.id) ?? [];
        const { creator, extraCoauthors } = resolveCreator(row.creatorName, creatorLinks(row), coauthors);
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            imageUrl: row.imageUrl,
            pageUrl: row.pageUrl,
            livecodeUrl: row.livecodeUrl,
            deleted: row.deleted,
            createdAt: row.createdAt,
            city: {
                id: row.cityId,
                name: row.cityName ?? row.cityCode,
                slug: row.citySlug,
            },
            creator,
            coauthors,
            extraCoauthors,
            categories: categoriesByProject.get(row.id) ?? [],
            likesCount: likesByProject.get(row.id) ?? 0,
        };
    });
}

/** Convenience wrapper that also returns hasMore for paginated API responses. */
export async function getProjectsPage(
    filters: ProjectFilters = {},
): Promise<ProjectsPage> {
    const limit = filters.limit ?? 12;
    const rows = await getProjects({ ...filters, limit });
    // hasMore was attached by getProjects
    const hasMore = (rows as unknown as { hasMore?: boolean }).hasMore ?? false;
    return { items: rows, hasMore };
}

export async function getProjectById(id: number): Promise<ProjectRecord | null> {
    const [project] = await getProjects({ projectId: id, limit: 1 });
    return project ?? null;
}

export async function getProjectIds(): Promise<number[]> {
    const rows = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.deleted, false));
    return rows.map(({ id }) => id);
}

export async function getProjectsForSitemap(): Promise<
    { id: number; updatedAt: Date | null }[]
> {
    const rows = await db
        .select({ id: projects.id, updatedAt: projects.updatedAt })
        .from(projects)
        .where(eq(projects.deleted, false));
    return rows;
}