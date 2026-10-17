import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema"
export const auth = betterAuth({
  user: {
    additionalFields: {
      marketingOptIn: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      termsAcceptedAt: {
        type: "string",
        required: false,
        input: true,
      },
      termsVersion: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
