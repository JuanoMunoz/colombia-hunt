"use client";

import { useState } from "react";
import { signIn } from "../../app/lib/auth-client";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";

type Provider = "github" | "google";

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

// Botones sociales compartidos por /iniciar-sesion y /registrarse.
// Requiere OAuth configurado en `app/lib/auth.ts` + db del usuario.
export default function SocialAuthButtons({ callbackURL }: { callbackURL: string }) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const [pending, setPending] = useState<Provider | null>(null);

  const login = async (provider: Provider) => {
    setPending(provider);
    try {
      await signIn.social({ provider, callbackURL });
    } finally {
      setPending(null);
    }
  };

  const btn =
    "flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-(--brand)/25 px-5 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:opacity-60";

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-sm font-medium text-(--foreground)/70">
        {t.orContinue}
      </p>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => login("github")}
        className={btn}
      >
        <GithubIcon />
        {pending === "github" ? "…" : t.socialGithub}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => login("google")}
        className={btn}
      >
        <GoogleIcon />
        {pending === "google" ? "…" : t.socialGoogle}
      </button>
    </div>
  );
}
