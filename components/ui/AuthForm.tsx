"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn, signUp } from "../../app/lib/auth-client";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";

type AuthFormProps = {
  mode: "login" | "register";
  callbackURL: string;
};

// Formulario email+password compartido por login y registro.
export default function AuthForm({ mode, callbackURL }: AuthFormProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res =
        mode === "login"
          ? await signIn.email({ email, password })
          : await signUp.email({ email, password, name });
      if (res.error) {
        setError(t.authError);
      } else {
        router.push(callbackURL);
      }
    } catch {
      setError(t.authError);
    } finally {
      setLoading(false);
    }
  };

  const input =
    "min-h-11 w-full rounded-xl border border-(--brand)/25 bg-transparent px-4 text-base text-(--foreground) placeholder:text-(--foreground)/50 focus:outline-2 focus:outline-offset-1 focus:outline-(--brand)";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {mode === "register" ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-name" className="text-sm font-semibold text-(--foreground)">
            {t.nameLabel}
          </label>
          <input
            id="auth-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={input}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-email" className="text-sm font-semibold text-(--foreground)">
          {t.emailLabel}
        </label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-password" className="text-sm font-semibold text-(--foreground)">
          {t.passwordLabel}
        </label>
        <input
          id="auth-password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-(--secondary)">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-11 items-center justify-center rounded-full bg-(--brand) px-6 text-sm font-semibold text-[#FBFAF8] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:opacity-60"
      >
        {loading ? "…" : mode === "login" ? t.loginButton : t.registerButton}
      </button>
    </form>
  );
}
