import { createAuthClient } from "better-auth/react";

// Cliente front de better-auth. Mismo dominio → sin `baseURL`.
// Si el back viviera en otro dominio, pasa:
//   baseURL: "https://api.tudominio.com"
//
// Uso en Client Components:
//   import { signIn, signUp, signOut, useSession } from "./lib/auth-client";
//   const { data: session } = useSession();
//   await signIn.email({ email, password });
//   await signUp.email({ email, password, name });
//   await signOut();
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
