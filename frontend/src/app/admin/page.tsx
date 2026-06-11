"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Stats {
  today_revenue: number;
  pending_orders: number;
  express_orders: number;
  new_b2b_quotes: number;
}

function formatVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ today_revenue: 0, pending_orders: 0, express_orders: 0, new_b2b_quotes: 0 });

  useEffect(() => {
    // Placeholder — real endpoint added Phase 2
    api.get("/admin/stats").then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Doanh thu hôm nay", value: formatVND(stats.today_revenue), icon: "💰", color: "bg-green-50 text-green-700" },
    { label: "Đơn chờ xử lý", value: stats.pending_orders, icon: "📦", color: "bg-amber-50 text-amber-700" },
    { label: "Đơn hỏa tốc", value: stats.express_orders, icon: "🚀", color: "bg-red-50 text-red-600" },
    { label: "Quote B2B mới", value: stats.new_b2b_quotes, icon: "📋", color: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {stats.express_orders > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-red-500 font-bold">⚡</span>
          <p className="text-red-700 font-medium text-sm">
            {stats.express_orders} đơn hỏa tốc cần xử lý ngay!
          </p>
          <Link href="/admin/don-hang?delivery=express" className="ml-auto text-xs font-semibold text-red-600 hover:underline">
            Xem ngay →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className={`rounded-2xl p-5 ${card.color}`}>
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-75">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/don-hang", label: "Quản lý đơn hàng", icon: "📦" },
          { href: "/admin/san-pham", label: "Quản lý sản phẩm", icon: "🎁" },
          { href: "/admin/b2b", label: "B2B Quotes", icon: "📋" },
          { href: "/admin/forfolio", label: "Forfolio", icon: "🖼️" },
          { href: "/admin/danh-gia", label: "Đánh giá", icon: "⭐" },
          { href: "/admin/blog", label: "Blog CMS", icon: "✍️" },
          { href: "/admin/nha-cung-cap", label: "Nhà cung cấp", icon: "🏭" },
          { href: "/admin/tuyen-dung", label: "Tuyển dụng", icon: "👥" },
        ].map(link => (
          <Link key={link.href} href={link.href}
            className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-colors text-center">
            <p className="text-2xl mb-2">{link.icon}</p>
            <p className="text-sm font-medium text-gray-700">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
