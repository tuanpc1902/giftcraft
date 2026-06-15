"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/don-hang", label: "Đơn hàng" },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/b2b", label: "B2B Quotes" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/forfolio", label: "Portfolio" },
  { href: "/admin/danh-gia", label: "Đánh giá" },
  { href: "/admin/nha-cung-cap", label: "Nhà cung cấp" },
  { href: "/admin/tuyen-dung", label: "Tuyển dụng" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/dang-nhap");
    } else if (user && user.role !== "admin") {
      router.replace("/tai-khoan");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-ink text-white flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="font-display font-bold text-white text-lg">GiftCraft</Link>
          <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  active ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">{user.name}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-surface-alt overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
