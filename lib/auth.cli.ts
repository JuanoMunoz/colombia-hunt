import { auth } from "../app/lib/auth";

// Config usada por el CLI de better-auth para generar el schema:
//   pnpm dlx @better-auth/cli generate --config lib/auth.cli.ts --output db/auth-schema.ts
// La conexión de db vive en `app/lib/auth.ts` (TODO del mantenedor).
export default auth;
