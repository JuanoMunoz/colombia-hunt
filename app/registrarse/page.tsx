import type { Metadata } from "next";
import { getPostAuthRedirect } from "../lib/auth-redirect";
import RegisterContent from "../../components/sections/RegisterContent";

export const metadata: Metadata = {
  title: "Registrarse — Colombia Hunt",
  description:
    "Crea tu cuenta en Colombia Hunt con tu correo o con GitHub y Google.",
};

type RegisterPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  return (
    <main className="surface-light flex flex-1 flex-col bg-(--background)">
      <RegisterContent callbackURL={getPostAuthRedirect(next)} />
    </main>
  );
}
