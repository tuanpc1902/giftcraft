"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getOrCreateSessionId } from "@/lib/session";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const { cart, fetch } = useCartStore();
  const { user, logout, init } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const NAV_LINKS = [
    { href: "/san-pham", label: t("products") },
    { href: "/forfolio", label: t("portfolio") },
    { href: "/qua-tang-doanh-nghiep", label: t("b2b") },
    { href: "/bat-dau-du-an-moi", label: t("startProject") },
    { href: "/gift-finder", label: t("giftFinder") },
    { href: "/blog", label: t("blog") },
  ];

  useEffect(() => {
    getOrCreateSessionId();
    fetch().catch(() => {});
    init();
  }, [fetch, init]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
  }

  function switchLocale() {
    const next = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: next });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fffdf8] border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight flex-shrink-0" style={{ color: "var(--color-brand)" }}>
            GiftCraft Studio
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${pathname?.startsWith(link.href) ? "font-semibold" : "hover:text-gray-900"}`}
                style={pathname?.startsWith(link.href) ? { color: "var(--color-brand)" } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Language switcher */}
            <button
              onClick={switchLocale}
              className="hidden sm:flex items-center text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              aria-label="Switch language"
            >
              {t("switchLang")}
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label={t("searchBtn")}
            >
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* Cart */}
            <Link href="/gio-hang" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {cart && cart.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                  {cart.total_items > 99 ? "99+" : cart.total_items}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-1.5 p-2 hover:bg-gray-50 rounded-xl transition-colors text-sm text-gray-700 font-medium"
                >
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="max-w-[80px] truncate">{user.name.split(" ").slice(-1)[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl border border-gray-100 shadow-lg py-1 text-sm overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/tai-khoan" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      👤 {t("account")}
                    </Link>
                    <Link href="/tai-khoan/du-an" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      📋 {t("b2bProjects")}
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors">
                        ⚙️ {t("adminPanel")}
                      </Link>
                    )}
                    <div className="border-t border-gray-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        {t("logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-gray-50 transition-colors"
              >
                {t("login")}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors ml-1"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname?.startsWith(link.href) ? "bg-gray-50 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <>
                    <Link href="/tai-khoan"
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                      👤 {user.name}
                    </Link>
                    <Link href="/tai-khoan/du-an"
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                      📋 {t("b2bProjects")}
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin"
                        className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                        ⚙️ {t("adminPanel")}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-3 py-2">
                    <Link href="/dang-nhap" className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      {t("login")}
                    </Link>
                    <Link href="/dang-ky" className="flex-1 text-center bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors">
                      {t("register")}
                    </Link>
                  </div>
                )}
                <button
                  onClick={switchLocale}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
                >
                  🌐 {locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setSearchOpen(false)}>
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-lg px-4 py-4" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-5 py-2.5 text-sm font-semibold flex-shrink-0">
                {t("searchBtn")}
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
