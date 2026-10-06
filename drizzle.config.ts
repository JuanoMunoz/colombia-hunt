import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "turso",
    schema: "./db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    }
})