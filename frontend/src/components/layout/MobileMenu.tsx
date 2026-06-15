"use client";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

interface NavLink { href: string; label: string; }

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ open, onClose, links, isLoggedIn, isAdmin, onLogout }: MobileMenuProps) {
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose(); }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <nav className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-display font-bold text-lg text-ink">Menu</span>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-6 py-3 text-sm text-ink hover:bg-surface-alt hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-border p-6 space-y-2">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="block text-sm text-ink-muted hover:text-brand py-2">
                  Admin
                </Link>
              )}
              <Link href="/tai-khoan" className="block text-sm text-ink-muted hover:text-brand py-2">
                Tài khoản
              </Link>
              <button onClick={onLogout} className="block text-sm text-brand py-2 w-full text-left">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="btn-secondary w-full text-center text-sm py-2">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="btn-primary w-full text-center text-sm py-2">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
