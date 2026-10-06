import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
        profile: r.one.profiles(),
        projects: r.many.projects({
            from: r.user.id,
            to: r.projects.creatorId,
        }),
        likes: r.many.projectLikes({
            from: r.user.id,
            to: r.projectLikes.userId,
        }),
    },
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id,
        }),
    },
    cities: {
        translations: r.many.cityTranslations(),
        projects: r.many.projects(),
    },
    cityTranslations: {
        city: r.one.cities({
            from: r.cityTranslations.cityId,
            to: r.cities.id,
        }),
    },
    categories: {
        translations: r.many.categoryTranslations(),
        projectCategories: r.many.projectCategories(),
        projects: r.many.projects({
            from: r.categories.id.through(r.projectCategories.categoryId),
            to: r.projects.id.through(r.projectCategories.projectId),
        }),
    },
    categoryTranslations: {
        category: r.one.categories({
            from: r.categoryTranslations.categoryId,
            to: r.categories.id,
        }),
    },
    profiles: {
        user: r.one.user({
            from: r.profiles.userId,
            to: r.user.id,
        }),
    },
    projects: {
        creator: r.one.user({
            from: r.projects.creatorId,
            to: r.user.id,
        }),
        city: r.one.cities({
            from: r.projects.cityId,
            to: r.cities.id,
        }),
        projectCategories: r.many.projectCategories(),
        categories: r.many.categories({
            from: r.projects.id.through(r.projectCategories.projectId),
            to: r.categories.id.through(r.projectCategories.categoryId),
        }),
        likes: r.many.projectLikes(),
    },
    projectCategories: {
        project: r.one.projects({
            from: r.projectCategories.projectId,
            to: r.projects.id,
        }),
        category: r.one.categories({
            from: r.projectCategories.categoryId,
            to: r.categories.id,
        }),
    },
    projectLikes: {
        user: r.one.user({
            from: r.projectLikes.userId,
            to: r.user.id,
        }),
        project: r.one.projects({
            from: r.projectLikes.projectId,
            to: r.projects.id,
        }),
    },
}));