"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/session";

export default function Header() {
  const { cart, fetch } = useCartStore();

  useEffect(() => {
    getOrCreateSessionId(); // ensure guest session exists
    fetch().catch(() => {});
  }, [fetch]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
          GiftCraft Studio
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/san-pham" className="hover:text-gray-900 transition-colors">Sản phẩm</Link>
          <Link href="/forfolio" className="hover:text-gray-900 transition-colors">Forfolio</Link>
          <Link href="/qua-tang-doanh-nghiep" className="hover:text-gray-900 transition-colors">B2B</Link>
          <Link href="/bat-dau-du-an-moi" className="hover:text-gray-900 transition-colors">Bắt đầu dự án</Link>
          <Link href="/gift-finder" className="hover:text-gray-900 transition-colors">Gift Finder</Link>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
        </nav>

        {/* Cart icon */}
        <Link href="/gio-hang" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
          {cart && cart.total_items > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.total_items > 99 ? "99+" : cart.total_items}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
