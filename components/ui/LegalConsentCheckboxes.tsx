"use client";

import Link from "next/link";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { PRIVACY_POLICY_URL } from "../../lib/legal";

type LegalConsentCheckboxesProps = {
  idPrefix: string;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (value: boolean) => void;
  marketingOptIn: boolean;
  onMarketingOptInChange: (value: boolean) => void;
};

const checkboxClassName =
  "size-5 shrink-0 rounded border border-(--brand)/40 accent-(--brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)";

export default function LegalConsentCheckboxes({
  idPrefix,
  acceptedTerms,
  onAcceptedTermsChange,
  marketingOptIn,
  onMarketingOptInChange,
}: LegalConsentCheckboxesProps) {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const termsId = `${idPrefix}-accept-terms`;
  const marketingId = `${idPrefix}-marketing-opt-in`;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{t.registerTermsLabel}</legend>
      <div className="flex min-h-11 items-center gap-3">
        <input
          id={termsId}
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          aria-required="true"
          aria-describedby={`${termsId}-help`}
          className={checkboxClassName}
        />
        <span
          id={`${termsId}-help`}
          className="text-sm leading-6 text-(--foreground)"
        >
          <label htmlFor={termsId} className="cursor-pointer">
            {t.registerTermsLabel}
          </label>
          <Link
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-(--brand) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          >
            {t.registerTermsLink}
          </Link>{" "}
          <span className="text-(--foreground)/60">
            ({t.registerRequiredTag})
          </span>
        </span>
      </div>
      <div className="flex min-h-11 items-center gap-3">
        <input
          id={marketingId}
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => onMarketingOptInChange(e.target.checked)}
          className={checkboxClassName}
        />
        <label
          htmlFor={marketingId}
          className="cursor-pointer text-sm leading-6 text-(--foreground)"
        >
          {t.registerMarketingLabel}{" "}
          <span className="text-(--foreground)/60">
            ({t.registerOptionalTag})
          </span>
        </label>
      </div>
    </fieldset>
  );
}
