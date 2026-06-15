"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { SupplierApplication } from "@/types";

type FilterStatus = "new" | "reviewing" | "approved" | "rejected" | "all";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Mới",          color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "Đang xem xét", color: "bg-brand-light text-brand" },
  approved:  { label: "Đã duyệt",     color: "bg-green-100 text-green-700" },
  rejected:  { label: "Từ chối",      color: "bg-red-100 text-brand" },
};

export default function AdminSupplierPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();
  const [items, setItems] = useState<SupplierApplication[] | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("new");
  const [selected, setSelected] = useState<SupplierApplication | null>(null);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/dang-nhap");
    } else if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    const params = filter === "all" ? {} : { status: filter };
    let active = true;
    api.get("/admin/supplier-applications", { params })
      .then(r => { if (active) setItems(r.data.data?.items ?? []); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; setItems(null); };
  }, [filter]);

  async function updateStatus(id: number, status: string) {
    await api.put(`/admin/supplier-applications/${id}`, { status });
    setItems(prev => (prev ?? []).map(a => a.id === id ? { ...a, status: status as SupplierApplication["status"] } : a));
    if (filter !== "all") setItems(prev => (prev ?? []).filter(a => a.id !== id));
    setSelected(null);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center text-ink-muted">Đang tải...</div>;

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Đăng ký nhà cung cấp</h1>

      <div className="flex gap-1 bg-surface-alt rounded-sm p-1 w-fit mb-6">
        {(["new", "reviewing", "approved", "rejected", "all"] as FilterStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-1.5 rounded-sm transition-colors ${filter === s ? "bg-white text-ink shadow-sm font-medium" : "text-ink-muted hover:text-ink"}`}
          >
            {s === "new" ? "Mới" : s === "reviewing" ? "Xem xét" : s === "approved" ? "Đã duyệt" : s === "rejected" ? "Từ chối" : "Tất cả"}
          </button>
        ))}
      </div>

      {items === null ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">Không có đơn đăng ký nào.</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Công ty</th>
                <th className="text-left px-4 py-3">Người liên hệ</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Mã số thuế</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-surface-alt transition-colors cursor-pointer" onClick={() => setSelected(item)}>
                  <td className="px-4 py-3 font-medium">{item.company_name}</td>
                  <td className="px-4 py-3 text-ink-muted">{item.contact_name}</td>
                  <td className="px-4 py-3 text-ink-muted">{item.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{item.tax_code}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_LABELS[item.status]?.color}`}>
                      {STATUS_LABELS[item.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink-muted">
                    {new Date(item.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-ink">Chi tiết đơn đăng ký</h2>
                <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink-muted text-xl">✕</button>
              </div>

              <dl className="space-y-4 text-sm mb-6">
                <div><dt className="text-ink-muted">Công ty</dt><dd className="font-medium">{selected.company_name}</dd></div>
                <div><dt className="text-ink-muted">Mã số thuế</dt><dd className="font-medium">{selected.tax_code}</dd></div>
                <div><dt className="text-ink-muted">Người liên hệ</dt><dd className="font-medium">{selected.contact_name}</dd></div>
                <div><dt className="text-ink-muted">Email</dt><dd className="font-medium">{selected.email}</dd></div>
                <div><dt className="text-ink-muted">Điện thoại</dt><dd className="font-medium">{selected.phone}</dd></div>
                <div><dt className="text-ink-muted">Loại sản phẩm cung cấp</dt><dd className="text-ink leading-relaxed">{selected.product_types}</dd></div>
                <div>
                  <dt className="text-ink-muted">Hóa đơn VAT</dt>
                  <dd className={`font-medium ${selected.has_vat_invoice ? "text-green-600" : "text-ink-muted"}`}>
                    {selected.has_vat_invoice ? "✓ Có" : "Không"}
                  </dd>
                </div>
                {selected.min_order_quantity && (
                  <div><dt className="text-ink-muted">Số lượng tối thiểu (MOQ)</dt><dd className="font-medium">{selected.min_order_quantity.toLocaleString("vi-VN")}</dd></div>
                )}
                {selected.description && (
                  <div><dt className="text-ink-muted">Mô tả thêm</dt><dd className="text-ink leading-relaxed">{selected.description}</dd></div>
                )}
                <div><dt className="text-ink-muted">Ngày gửi</dt><dd>{new Date(selected.created_at).toLocaleDateString("vi-VN")}</dd></div>
              </dl>

              <div className="space-y-2">
                {selected.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
                    className="w-full bg-green-600 text-white py-2.5 rounded-sm text-sm font-medium hover:bg-green-500 transition-colors"
                  >
                    Phê duyệt
                  </button>
                )}
                {selected.status === "new" && (
                  <button
                    onClick={() => updateStatus(selected.id, "reviewing")}
                    className="w-full bg-brand-light text-brand py-2.5 rounded-sm text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Chuyển sang Đang xem xét
                  </button>
                )}
                {selected.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(selected.id, "rejected")}
                    className="w-full bg-brand-light text-brand py-2.5 rounded-sm text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Từ chối
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
