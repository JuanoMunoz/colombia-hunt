import { headers } from "next/headers";
import { auth } from "./auth";

// Helper back para leer la sesión en Server Components, layouts,
// pages y Server Actions.
//
// Uso:
//   import { getSession } from "./lib/get-session";
//   const session = await getSession();
//   if (!session) redirect("/entrar");
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
