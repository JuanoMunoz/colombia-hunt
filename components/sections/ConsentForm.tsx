"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { PRIVACY_POLICY_URL } from "../../lib/legal";
import LegalConsentCheckboxes from "../ui/LegalConsentCheckboxes";

export default function ConsentForm({ next }: { next: string }) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!acceptedTerms) {
      setError(t.registerTermsRequired);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: true, marketingOptIn }),
      });
      if (res.status === 401) {
        setError(t.consentSessionExpired);
        return;
      }
      if (!res.ok) {
        setError(t.consentError);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError(t.consentError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-(--brand)">
        {t.consentTitle}
        <span className="text-(--secondary)" aria-hidden="true">
          .
        </span>
      </h1>
      <div className="rounded-2xl border border-(--brand)/15 p-6">
        <p className="mb-5 text-sm leading-6 text-(--foreground)/80">
          {t.consentIntro}{" "}
          <Link
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-(--brand) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {t.registerTermsLink}
          </Link>
          .
        </p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <LegalConsentCheckboxes
            idPrefix="consent"
            acceptedTerms={acceptedTerms}
            onAcceptedTermsChange={setAcceptedTerms}
            marketingOptIn={marketingOptIn}
            onMarketingOptInChange={setMarketingOptIn}
          />
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
            {loading ? t.consentSubmitting : t.consentSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}
