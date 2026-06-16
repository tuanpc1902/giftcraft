"use client";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import { getOrCreateSessionId } from "@/lib/session";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/qua-tang-doanh-nghiep", label: "Doanh nghiệp" },
  { href: "/gift-finder", label: "Tìm quà" },
  { href: "/forfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, fetch } = useCartStore();
  const { user, logout, init } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getOrCreateSessionId();
    fetch().catch(() => {});
    init();
  }, [fetch, init]);

  useEffect(() => {
    setUserMenuOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  const totalItems = cart?.total_items ?? 0;
  const isAdmin = user?.role === "admin";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_12px_0_rgb(0_0_0/0.08)]" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="font-display font-bold text-xl text-ink hover:text-brand transition-colors">
              GiftCraft
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm transition-colors ${
                    pathname.startsWith(l.href)
                      ? "text-brand font-semibold"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-ink-muted hover:text-brand transition-colors"
                aria-label="Tìm kiếm"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link href="/gio-hang" className="relative p-2 text-ink-muted hover:text-brand transition-colors">
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User menu (desktop) */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-ink-muted hover:text-brand transition-colors"
                  aria-label="Tài khoản"
                >
                  <UserCircleIcon className="w-5 h-5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-sm shadow-lg py-1 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-xs text-ink-muted border-b border-border">
                          {user.name}
                        </div>
                        {isAdmin && (
                          <Link href="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                            Admin
                          </Link>
                        )}
                        <Link href="/tai-khoan" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Tài khoản
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-brand hover:bg-surface-alt"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/dang-nhap" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Đăng nhập
                        </Link>
                        <Link href="/dang-ky" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-ink-muted hover:text-ink"
                aria-label="Menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-border bg-white">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm quà tặng..."
                className="input-field"
              />
            </form>
          </div>
        )}
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        isLoggedIn={!!user}
        isAdmin={isAdmin}
        onLogout={() => { logout(); setMobileOpen(false); }}
      />
    </>
  );
}
