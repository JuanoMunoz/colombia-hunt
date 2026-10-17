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
        favorites: r.many.projectFavorites({
            from: r.user.id,
            to: r.projectFavorites.userId,
        }),
        comments: r.many.projectComments({
            from: r.user.id,
            to: r.projectComments.userId,
        }),
        uploads: r.many.uploadedFiles({
            from: r.user.id,
            to: r.uploadedFiles.userId,
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
        coauthors: r.many.projectCoauthors({
            from: r.projects.id,
            to: r.projectCoauthors.projectId,
        }),
        categories: r.many.categories({
            from: r.projects.id.through(r.projectCategories.projectId),
            to: r.categories.id.through(r.projectCategories.categoryId),
        }),
        likes: r.many.projectLikes(),
        favorites: r.many.projectFavorites(),
        comments: r.many.projectComments(),
        uploads: r.many.uploadedFiles({
            from: r.projects.id,
            to: r.uploadedFiles.projectId,
        }),
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
    projectCoauthors: {
        project: r.one.projects({
            from: r.projectCoauthors.projectId,
            to: r.projects.id,
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
    projectFavorites: {
        user: r.one.user({
            from: r.projectFavorites.userId,
            to: r.user.id,
        }),
        project: r.one.projects({
            from: r.projectFavorites.projectId,
            to: r.projects.id,
        }),
    },
    projectComments: {
        user: r.one.user({
            from: r.projectComments.userId,
            to: r.user.id,
        }),
        project: r.one.projects({
            from: r.projectComments.projectId,
            to: r.projects.id,
        }),
    },
    uploadedFiles: {
        user: r.one.user({
            from: r.uploadedFiles.userId,
            to: r.user.id,
        }),
        project: r.one.projects({
            from: r.uploadedFiles.projectId,
            to: r.projects.id,
        }),
    },
}));