"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import AdminLayout from "@/components/layout/AdminLayout";

interface Stats {
  today_revenue: number;
  pending_orders: number;
  express_orders: number;
  new_b2b_quotes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ today_revenue: 0, pending_orders: 0, express_orders: 0, new_b2b_quotes: 0 });

  useEffect(() => {
    api.get("/admin/stats").then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Doanh thu hôm nay", value: formatPrice(stats.today_revenue), color: "bg-success-light text-success" },
    { label: "Đơn chờ xử lý", value: String(stats.pending_orders), color: "bg-brand-light text-brand" },
    { label: "Đơn hỏa tốc", value: String(stats.express_orders), color: "bg-brand-light text-brand" },
    { label: "Quote B2B mới", value: String(stats.new_b2b_quotes), color: "bg-info-light text-info" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-ink mb-6">Dashboard</h1>

      {stats.express_orders > 0 && (
        <div className="mb-6 bg-brand-light border border-border rounded-sm px-5 py-3 flex items-center gap-3">
          <p className="text-brand font-medium text-sm flex-1">
            ⚡ {stats.express_orders} đơn hỏa tốc cần xử lý ngay!
          </p>
          <Link href="/admin/don-hang?delivery=express" className="text-xs font-semibold text-brand hover:underline">
            Xem ngay →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className={`rounded-sm p-5 ${card.color}`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-75">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/don-hang", label: "Đơn hàng", icon: "📦" },
          { href: "/admin/san-pham", label: "Sản phẩm", icon: "🎁" },
          { href: "/admin/b2b", label: "B2B Quotes", icon: "📋" },
          { href: "/admin/forfolio", label: "Portfolio", icon: "🖼️" },
          { href: "/admin/danh-gia", label: "Đánh giá", icon: "⭐" },
          { href: "/admin/blog", label: "Blog", icon: "✍️" },
          { href: "/admin/nha-cung-cap", label: "Nhà cung cấp", icon: "🏭" },
          { href: "/admin/tuyen-dung", label: "Tuyển dụng", icon: "👥" },
        ].map(link => (
          <Link key={link.href} href={link.href}
            className="border border-border rounded-sm p-5 hover:bg-surface-alt transition-colors text-center">
            <p className="text-2xl mb-2">{link.icon}</p>
            <p className="text-sm font-medium text-ink">{link.label}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
