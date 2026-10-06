// import "server-only"
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { relations } from './relations';

config({ path: '.env' });

export const db = drizzle({
    connection: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
    relations,
});
