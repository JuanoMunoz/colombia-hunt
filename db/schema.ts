import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, primaryKey, unique, index, check } from "drizzle-orm/sqlite-core";
// db/schema.ts (al inicio)
import { user } from "./auth-schema";
export * from "./auth-schema";

const timestamps = {
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
};

// ---------- Ciudades ----------
export const cities = sqliteTable("cities", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull().unique(), // "medellin"
    ...timestamps,
});

export const cityTranslations = sqliteTable(
    "city_translations",
    {
        cityId: integer("city_id").notNull().references(() => cities.id, { onDelete: "cascade" }),
        locale: text("locale").notNull(), // "es" | "en"
        slug: text("slug").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        ...timestamps,
    },
    (t) => [primaryKey({ columns: [t.cityId, t.locale] }), unique().on(t.locale, t.slug)],
);

// ---------- Categorías ----------
export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull().unique(), // "web", "mobile"
    ...timestamps,
});

export const categoryTranslations = sqliteTable(
    "category_translations",
    {
        categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
        locale: text("locale").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        ...timestamps,
    },
    (t) => [primaryKey({ columns: [t.categoryId, t.locale] })],
);

// ---------- Perfil (links sociales) ----------
export type ProfileRole = "user" | "admin";

export const profiles = sqliteTable(
    "profiles",
    {
        userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
        role: text("role").$type<ProfileRole>().notNull().default("user"),
        githubUrl: text("github_url"),
        linkedinUrl: text("linkedin_url"),
        twitterUrl: text("twitter_url"),
        whatsapp: text("whatsapp"), // guarda solo el número: 573001234567
        ...timestamps,
    },
    (t) => [check("profiles_role_check", sql`${t.role} in ('user', 'admin')`)],
);

// ---------- Proyectos ----------
export const projects = sqliteTable(
    "projects",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        title: text("title").notNull(),
        description: text("description"),
        creatorId: text("creator_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        cityId: integer("city_id").notNull().references(() => cities.id),
        imageUrl: text("image_url"),
        pageUrl: text("page_url"),
        livecodeUrl: text("livecode_url"),
        deleted: integer("deleted", { mode: "boolean" }).notNull().default(false),
        deletedAt: integer("deleted_at", { mode: "timestamp" }),
        ...timestamps,
    },
    (t) => [index("projects_city_idx").on(t.cityId), index("projects_creator_idx").on(t.creatorId)],
);

export const projectCategories = sqliteTable(
    "project_categories",
    {
        projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
        categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.projectId, t.categoryId] })],
);

export const projectLikes = sqliteTable(
    "project_likes",
    {
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
        projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
        createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    },
    (t) => [primaryKey({ columns: [t.userId, t.projectId] })],
);