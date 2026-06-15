"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { B2bQuote } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

const STATUS_MAP: Record<B2bQuote["status"], { label: string; color: string }> = {
  new:           { label: "Mới",            color: "bg-blue-100 text-blue-700" },
  reviewing:     { label: "Đang xem xét",   color: "bg-brand-light text-amber-700" },
  quoted:        { label: "Đã báo giá",     color: "bg-purple-100 text-purple-700" },
  approved:      { label: "Đã duyệt",       color: "bg-teal-100 text-teal-700" },
  in_production: { label: "Đang sản xuất",  color: "bg-indigo-100 text-indigo-700" },
  delivered:     { label: "Đã giao",        color: "bg-green-100 text-green-700" },
  cancelled:     { label: "Đã hủy",         color: "bg-surface-alt text-ink-muted" },
};

const ALL_STATUSES = Object.entries(STATUS_MAP) as [B2bQuote["status"], { label: string; color: string }][];

export default function AdminB2bPage() {
  const [quotes, setQuotes] = useState<B2bQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<B2bQuote["status"] | "all">("all");
  const [selected, setSelected] = useState<B2bQuote | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/b2b/quotes?per_page=100")
      .then(r => setQuotes(r.data.data?.items ?? r.data.data ?? []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = filter === "all" ? quotes : quotes.filter(q => q.status === filter);

  async function updateQuote(id: number, patch: Partial<B2bQuote>) {
    setSaving(true);
    try {
      const res = await api.put(`/admin/b2b/quotes/${id}`, patch);
      const serverData: Partial<B2bQuote> = res.data?.data ?? patch;
      setQuotes(qs => qs.map(q => q.id === id ? { ...q, ...serverData } : q));
      setSelected(s => s?.id === id ? { ...s, ...serverData } : s);
    } finally {
      setSaving(false);
    }
  }

  function openDrawer(q: B2bQuote) {
    setSelected(q);
    setEditNote(q.admin_note ?? "");
    setEditPrice(q.quoted_price ? String(q.quoted_price) : "");
  }

  const countByStatus = (s: B2bQuote["status"]) => quotes.filter(q => q.status === s).length;

  return (
    <AdminLayout>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">B2B Quotes</h1>
          <p className="text-ink-muted text-sm mt-0.5">{quotes.length} yêu cầu tổng cộng</p>
        </div>
        <div className="flex gap-2 items-center">
          {countByStatus("new") > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {countByStatus("new")} mới
            </span>
          )}
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === "all" ? "bg-gray-900 text-white border-gray-900" : "border-border text-ink-muted hover:bg-surface-alt"}`}
        >
          Tất cả ({quotes.length})
        </button>
        {ALL_STATUSES.map(([s, { label }]) => {
          const count = countByStatus(s);
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? "bg-gray-900 text-white border-gray-900" : "border-border text-ink-muted hover:bg-surface-alt"}`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">Không có yêu cầu nào.</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Công ty</th>
                <th className="text-left px-4 py-3">Liên hệ</th>
                <th className="text-left px-4 py-3">Dịp / SL</th>
                <th className="text-left px-4 py-3">Ngân sách</th>
                <th className="text-left px-4 py-3">Deadline</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Ngày gửi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayed.map(q => (
                <tr
                  key={q.id}
                  onClick={() => openDrawer(q)}
                  className="hover:bg-surface-alt cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{q.company_name}</p>
                    <p className="text-xs text-ink-muted">#{q.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{q.contact_name}</p>
                    <p className="text-xs text-ink-muted">{q.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{q.occasion ?? "—"}</p>
                    <p className="text-xs text-ink-muted">{q.quantity_requested.toLocaleString()} sản phẩm</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {q.budget_min ? (
                      <span>{q.budget_min.toLocaleString()} – {q.budget_max?.toLocaleString() ?? "?"}đ</span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {q.deadline ? new Date(q.deadline).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_MAP[q.status]?.color ?? "bg-surface-alt"}`}>
                      {STATUS_MAP[q.status]?.label ?? q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {new Date(q.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-ink">Quote #{selected.id}</h2>
                <p className="text-xs text-ink-muted">{selected.company_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink-muted text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status update */}
              <div>
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide block mb-2">Cập nhật trạng thái</label>
                <select
                  className="input-field text-sm"
                  value={selected.status}
                  onChange={e => updateQuote(selected.id, { status: e.target.value as B2bQuote["status"] })}
                  disabled={saving}
                >
                  {ALL_STATUSES.map(([s, { label }]) => (
                    <option key={s} value={s}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Quote price */}
              <div>
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide block mb-2">Giá báo (đ/bộ)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input-field flex-1"
                    placeholder="0"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                  />
                  <button
                    onClick={() => updateQuote(selected.id, { quoted_price: editPrice ? Number(editPrice) : null })}
                    disabled={saving}
                    className="btn-primary text-sm px-4 disabled:opacity-40"
                  >
                    Lưu
                  </button>
                </div>
                {selected.quoted_price && (
                  <p className="text-xs text-ink-muted mt-1">Hiện tại: {formatPrice(selected.quoted_price)}/bộ</p>
                )}
              </div>

              {/* Admin note */}
              <div>
                <label className="text-xs font-semibold text-ink-muted uppercase tracking-wide block mb-2">Ghi chú nội bộ / gửi khách</label>
                <textarea
                  className="input-field h-24 resize-none text-sm"
                  placeholder="Ghi chú để khách xem hoặc ghi chú nội bộ..."
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                />
                <button
                  onClick={() => updateQuote(selected.id, { admin_note: editNote })}
                  disabled={saving}
                  className="mt-2 text-xs btn-secondary px-4 py-2 disabled:opacity-40"
                >
                  {saving ? "Đang lưu..." : "Lưu ghi chú"}
                </button>
              </div>

              {/* Contact info */}
              <div className="bg-surface-alt rounded-sm p-4 space-y-2 text-sm">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Thông tin liên hệ</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-ink-muted text-xs">Công ty</span><p className="font-medium text-ink">{selected.company_name}</p></div>
                  <div><span className="text-ink-muted text-xs">Người liên hệ</span><p className="font-medium text-ink">{selected.contact_name}</p></div>
                  <div><span className="text-ink-muted text-xs">SĐT</span><p className="font-medium text-ink">{selected.phone}</p></div>
                  <div><span className="text-ink-muted text-xs">Email</span><p className="font-medium text-ink break-all">{selected.email}</p></div>
                </div>
              </div>

              {/* Project details */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Chi tiết dự án</p>
                {selected.occasion && <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-ink-muted">Dịp / Loại</span><span className="font-medium">{selected.occasion}</span></div>}
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-ink-muted">Số lượng</span><span className="font-medium">{selected.quantity_requested.toLocaleString()} sản phẩm</span></div>
                {selected.budget_min != null && <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-ink-muted">Ngân sách</span><span className="font-medium">{selected.budget_min.toLocaleString()} – {selected.budget_max?.toLocaleString() ?? "?"}đ/bộ</span></div>}
                {selected.deadline && <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-ink-muted">Deadline</span><span className="font-medium">{new Date(selected.deadline).toLocaleDateString("vi-VN")}</span></div>}
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-ink-muted">Ngày gửi</span><span className="font-medium">{new Date(selected.created_at).toLocaleDateString("vi-VN")}</span></div>
              </div>

              {/* Requirements */}
              {selected.custom_requirements && (
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Yêu cầu tùy chỉnh</p>
                  <p className="text-sm text-ink bg-surface-alt rounded-sm p-4 leading-relaxed whitespace-pre-wrap">{selected.custom_requirements}</p>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: Báo giá B2B #${selected.id} – GiftCraft Studio`}
                  className="flex-1 btn-secondary text-sm text-center"
                >
                  ✉️ Email khách
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="flex-1 border border-border text-ink text-sm font-semibold py-3 px-4 rounded-sm hover:bg-surface-alt transition-colors text-center"
                >
                  📞 Gọi điện
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
