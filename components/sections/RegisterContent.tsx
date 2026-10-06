"use client";

import Link from "next/link";
import AuthForm from "../ui/AuthForm";
import SocialAuthButtons from "../ui/SocialAuthButtons";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { getAuthPageHref } from "../../app/lib/auth-redirect";

export default function RegisterContent({ callbackURL }: { callbackURL: string }) {
  const { lang } = useLanguage();
  const t = getDict(lang);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-(--brand)">
        {t.registerTitle}
        <span className="text-(--secondary)" aria-hidden="true">
          .
        </span>
      </h1>
      <div className="rounded-2xl border border-(--brand)/15 p-6">
        <AuthForm mode="register" callbackURL={callbackURL} />
        <p className="mt-4 text-center text-sm text-(--foreground)/70">
          {t.hasAccount}{" "}
          <Link
            href={getAuthPageHref("/iniciar-sesion", callbackURL)}
            className="font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {t.loginLink}
          </Link>
        </p>
      </div>
      <SocialAuthButtons callbackURL={callbackURL} />
    </div>
  );
}
