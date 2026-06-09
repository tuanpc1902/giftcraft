"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import { getOrCreateSessionId } from "@/lib/session";

const NAV_LINKS = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/forfolio", label: "Forfolio" },
  { href: "/qua-tang-doanh-nghiep", label: "B2B" },
  { href: "/bat-dau-du-an-moi", label: "Bắt đầu dự án" },
  { href: "/gift-finder", label: "Gift Finder" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const { cart, fetch } = useCartStore();
  const { user, logout, init } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getOrCreateSessionId();
    fetch().catch(() => {});
    init();
  }, [fetch, init]);

  // Close user dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 flex-shrink-0">
            GiftCraft Studio
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-900 transition-colors ${pathname?.startsWith(link.href) ? "text-gray-900 font-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link href="/gio-hang" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {cart && cart.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4.5 min-w-[18px] flex items-center justify-center px-1">
                  {cart.total_items > 99 ? "99+" : cart.total_items}
                </span>
              )}
            </Link>

            {/* Auth state */}
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
                      👤 Tài khoản
                    </Link>
                    <Link href="/tai-khoan/du-an" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors">
                      📋 Dự án B2B
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        Đăng xuất
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
                Đăng nhập
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
                      📋 Dự án B2B
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin"
                        className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-3 py-2">
                    <Link href="/dang-nhap" className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      Đăng nhập
                    </Link>
                    <Link href="/dang-ky" className="flex-1 text-center bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-700 transition-colors">
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
