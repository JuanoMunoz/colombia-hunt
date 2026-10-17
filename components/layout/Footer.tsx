"use client";

import Link from "next/link";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage } from "../../app/i18n/LanguageContext";
import { PRIVACY_POLICY_URL } from "../../lib/legal";

export default function Footer() {
  const { lang } = useLanguage();
  const t = getDict(lang);
  const year = new Date().getFullYear();

  const links = [
    { href: "/explorar", label: t.explore },
    { href: "/contribuir", label: t.contribute },
    { href: "/sobre-nosotros", label: t.about },
    { href: PRIVACY_POLICY_URL, label: t.footerPolicy },
  ];

  return (
    <footer className="border-t border-(--brand)/10 bg-(--brand)/3">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-bold tracking-tight text-(--brand)">
            Colombia Hunt
          </span>
          <nav aria-label={t.navLabel}>
            <ul className="flex flex-wrap items-center gap-x-5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="text-xs text-(--foreground)/60">
          © {year} {t.footerRights}
        </p>
      </div>
    </footer>
  );
}
