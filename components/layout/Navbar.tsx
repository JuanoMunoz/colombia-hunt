"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../../public/img/logo_H_colombia_colorido.webp";
import { getDict } from "../../app/i18n/dictionaries";
import { useLanguage, type Lang } from "../../app/i18n/LanguageContext";
import { useSession } from "../../app/lib/auth-client";
import { catalogApi, type ApiCategory, type ApiCity } from "../../lib/http-client";
import ProfileAvatar from "../ui/ProfileAvatar";
import SignOutButton from "../ui/SignOutButton";
import { UserIcon } from "../ui/icons";

const LANGS: Lang[] = ["es", "en"];

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const { data: session, isPending: sessionPending } = useSession();
  const t = getDict(lang);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    catalogApi.cities
      .list({ signal: controller.signal })
      .then(setCities)
      .catch(() => setCities([]));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    catalogApi.categories
      .list({ signal: controller.signal })
      .then(setCategories)
      .catch(() => setCategories([]));

    return () => controller.abort();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  const currentUserId = session?.user?.id;
  const [adminCheckedFor, setAdminCheckedFor] = useState<string | undefined>(undefined);
  // Ajuste durante el render (patrón React): al cambiar de usuario se
  // revoca el flag admin sin setState síncrono dentro de un efecto.
  if (currentUserId !== adminCheckedFor) {
    setAdminCheckedFor(currentUserId);
    setIsAdmin(false);
  }

  useEffect(() => {
    if (!currentUserId) return;
    let active = true;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { profile?: { role?: string } } | null) => {
        if (active && data?.profile?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [currentUserId]);

  // Con sesión, la cuenta vive en el avatar con desplegable (sin textos
  // sueltos en desktop); sin sesión hay un solo enlace de acceso.
  const accountItem = sessionPending || session?.user
    ? null
    : { href: "/iniciar-sesion", label: t.loginLink };

  const menuItems = [
    { href: "/explorar", label: t.explore },
    { href: "/sobre-nosotros", label: t.about },
    { href: "/contribuir", label: t.contribute },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    ...(accountItem ? [accountItem] : []),
  ];

  function closeMobileMenu() {
    setMobileOpen(false);
    setCitiesOpen(false);
    setCategoriesOpen(false);
    setAccountOpen(false);
  }

  function renderNavigationLinks(isMobile: boolean) {
    return menuItems.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        onClick={isMobile ? closeMobileMenu : undefined}
        className={isMobile
          ? "flex min-h-11 w-full items-center rounded-md px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
          : "flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) sm:px-3"
        }
      >
        {label}
      </Link>
    ));
  }

  function renderCitiesMenu(isMobile: boolean) {
    return (
      <div className="relative">
        <button
          type="button"
          aria-expanded={citiesOpen}
          aria-haspopup="true"
          onClick={() => {
            setCategoriesOpen(false);
            setAccountOpen(false);
            setCitiesOpen((open) => !open);
          }}
          className={isMobile
            ? "flex min-h-11 w-full items-center justify-between rounded-md px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            : "flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) sm:px-3"
          }
        >
          {t.cities}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform duration-200 ${citiesOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {citiesOpen ? (
          <ul className={isMobile
            ? "static mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-(--brand)/15 bg-(--background) p-1 shadow-lg"
            : "absolute top-full right-0 z-50 mt-1 max-h-80 min-w-56 overflow-y-auto overscroll-contain rounded-xl border border-(--brand)/15 bg-(--background) p-1 shadow-lg"
          }>
            {cities.map((city) => {
              const spanish = city.translations.es;
              const localized = city.translations[lang] ?? spanish;
              if (!spanish || !localized) return null;

              return (
                <li key={city.id}>
                  <Link
                    href={`/ciudades/${spanish.slug}`}
                    onClick={() => {
                      setCitiesOpen(false);
                      if (isMobile) closeMobileMenu();
                    }}
                    className="flex min-h-11 items-center rounded-md px-3 text-sm text-(--foreground) hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                  >
                    {localized.name}
                  </Link>
                </li>
              );
            })}
            {cities.length === 0 ? (
              <li>
                <span
                  aria-disabled="true"
                  className="flex min-h-11 items-center px-3 text-sm text-(--foreground)/60"
                >
                  {t.soon}
                </span>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    );
  }

  function renderCategoriesMenu(isMobile: boolean) {
    return (
      <div className="relative">
        <button
          type="button"
          aria-expanded={categoriesOpen}
          aria-haspopup="true"
          onClick={() => {
            setCitiesOpen(false);
            setAccountOpen(false);
            setCategoriesOpen((open) => !open);
          }}
          className={isMobile
            ? "flex min-h-11 w-full items-center justify-between rounded-md px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
            : "flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) sm:px-3"
          }
        >
          {t.categoriesMenu}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {categoriesOpen ? (
          <ul className={isMobile
            ? "static mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-(--brand)/15 bg-(--background) p-1 shadow-lg"
            : "absolute top-full right-0 z-50 mt-1 max-h-80 min-w-56 overflow-y-auto overscroll-contain rounded-xl border border-(--brand)/15 bg-(--background) p-1 shadow-lg"
          }>
            {categories.map((category) => {
              const localized = category.translations[lang] ?? category.translations.es;
              if (!localized) return null;

              return (
                <li key={category.id}>
                  <Link
                    href={`/categorias/${category.id}`}
                    onClick={() => {
                      setCategoriesOpen(false);
                      if (isMobile) closeMobileMenu();
                    }}
                    className="flex min-h-11 items-center rounded-md px-3 text-sm text-(--foreground) hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                  >
                    {localized.name}
                  </Link>
                </li>
              );
            })}
            {categories.length === 0 ? (
              <li>
                <span
                  aria-disabled="true"
                  className="flex min-h-11 items-center px-3 text-sm text-(--foreground)/60"
                >
                  {t.soon}
                </span>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    );
  }

  function renderAccountMenu() {
    const user = session?.user;
    if (sessionPending || !user) return null;
    return (
      <div className="relative ml-1">
        <button
          type="button"
          aria-label={t.accountMenu}
          aria-expanded={accountOpen}
          aria-haspopup="menu"
          onClick={() => {
            setCitiesOpen(false);
            setCategoriesOpen(false);
            setAccountOpen((open) => !open);
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-(--brand)/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
        >
          <ProfileAvatar
            name={user.name}
            userId={user.id}
            imageUrl={user.image ?? null}
            fallbackLabel={t.profile}
            className="size-9 text-sm"
          />
        </button>
        {accountOpen ? (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setAccountOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <ul
              role="menu"
              aria-label={t.accountMenu}
              className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-(--brand)/15 bg-(--background) p-1 shadow-lg"
            >
              <li role="none">
                <Link
                  role="menuitem"
                  href="/perfil"
                  onClick={() => setAccountOpen(false)}
                  className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-(--foreground) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                >
                  <UserIcon className="h-4 w-4 text-(--brand)" />
                  {t.profile}
                </Link>
              </li>
              <li role="none">
                <Link
                  role="menuitem"
                  href="/mis-proyectos"
                  onClick={() => setAccountOpen(false)}
                  className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-(--foreground) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
                >
                  {t.myProjectsManage}
                </Link>
              </li>
              <li aria-hidden="true" className="mx-2 my-1 border-t border-(--brand)/10" />
              <li role="none">
                <SignOutButton variant="menu" />
              </li>
            </ul>
          </>
        ) : null}
      </div>
    );
  }

  function renderLanguageSwitcher(isMobile: boolean) {
    return (
      <div
        role="group"
        aria-label={t.language}
        className={`flex items-center gap-1 rounded-full border border-(--brand)/30 p-1 ${isMobile ? "self-start" : "ml-1"}`}
      >
        {LANGS.map((code) => {
          const active = code === lang;
          return (
            <button
              key={code}
              type="button"
              onClick={() => {
                setLang(code);
                if (isMobile) closeMobileMenu();
              }}
              aria-pressed={active}
              aria-label={`${t.language}: ${code.toUpperCase()}`}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-xs font-bold tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) ${active
                ? "bg-(--brand)/10 text-(--brand)"
                : "text-(--brand)/70 hover:bg-(--brand)/5 hover:text-(--brand)"
                }`}
            >
              {code}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <header className="surface-light sticky top-0 z-50 border-b border-(--brand)/15 bg-(--background)">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-full focus:bg-(--flourish) focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1A1C1E] focus:outline-none"
      >
        {t.skip}
      </a>
      <nav
        aria-label={t.navLabel}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeMobileMenu();
        }}
        className="relative mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-2 px-4 py-2 sm:px-6"
      >
        <Link
          href="/"
          aria-label={t.home}
          className="flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
        >
          <Image
            src={logo}
            alt={t.logoAlt}
            className="h-9 w-auto sm:h-10"
            priority
          />
          <span
            aria-hidden="true"
            className="hidden mt-2.5 text-lg font-bold tracking-tight text-(--brand) sm:block"
          >
            Colombia Hunt
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex lg:gap-2">
          {renderNavigationLinks(false)}
          {renderCitiesMenu(false)}
          {renderCategoriesMenu(false)}
          {renderAccountMenu()}
          {renderLanguageSwitcher(false)}
        </div>
        <button
          type="button"
          aria-label={mobileOpen ? t.menuClose : t.menuOpen}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setMobileOpen((open) => !open);
            setCitiesOpen(false);
            setCategoriesOpen(false);
            setAccountOpen(false);
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-(--brand)/20 text-(--brand) transition-colors hover:bg-(--brand)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) lg:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-5 w-5"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
        <div
          id="mobile-navigation"
          className={`${mobileOpen ? "flex" : "hidden"} absolute top-full right-0 left-0 z-50 max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto overscroll-contain border-b border-(--brand)/15 bg-(--background) px-4 py-2 lg:hidden`}
        >
          {renderNavigationLinks(true)}
          {renderCitiesMenu(true)}
          {renderCategoriesMenu(true)}
          {!sessionPending && session?.user ? (
            <div className="flex flex-col gap-1">
              <Link
                href="/perfil"
                onClick={closeMobileMenu}
                className="flex min-h-11 w-full items-center rounded-md px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
              >
                {t.profile}
              </Link>
              <Link
                href="/mis-proyectos"
                onClick={closeMobileMenu}
                className="flex min-h-11 w-full items-center rounded-md px-3 text-sm font-semibold text-(--brand) transition-colors hover:bg-(--brand)/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
              >
                {t.myProjectsManage}
              </Link>
              <div className="self-start">
                <SignOutButton />
              </div>
            </div>
          ) : null}
          {renderLanguageSwitcher(true)}
        </div>
      </nav>
    </header>
  );
}
