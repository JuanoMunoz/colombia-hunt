import type { Metadata } from "next";
import { getPostAuthRedirect } from "../lib/auth-redirect";
import LoginContent from "../../components/sections/LoginContent";

export const metadata: Metadata = {
  title: "Iniciar sesión — Colombia Hunt",
  description:
    "Inicia sesión en Colombia Hunt con tu correo o con GitHub y Google.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <LoginContent callbackURL={getPostAuthRedirect(next)} />
    </main>
  );
}
