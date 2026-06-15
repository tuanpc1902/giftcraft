"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Review } from "@/types";

type FilterStatus = "pending" | "approved" | "rejected" | "all";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:  { label: "Chờ duyệt", color: "bg-brand-light text-brand" },
  approved: { label: "Đã duyệt",  color: "bg-green-100 text-green-700" },
  rejected: { label: "Từ chối",   color: "bg-red-100 text-brand" },
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();
  const [reviews, setReviews] = useState<(Review & { product?: { name: string; slug: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [selected, setSelected] = useState<(typeof reviews)[0] | null>(null);

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
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    api.get("/admin/reviews", { params: { status: filter } })
      .then(r => setReviews(r.data.data?.items ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: number, status: string) {
    await api.put(`/admin/reviews/${id}`, { status });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status as Review["status"] } : r));
    if (filter !== "all") setReviews(prev => prev.filter(r => r.id !== id));
    setSelected(null);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center text-ink-muted">Đang tải...</div>;

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Quản lý đánh giá</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface-alt rounded-sm p-1 w-fit mb-6">
        {(["pending", "approved", "rejected", "all"] as FilterStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-1.5 rounded-sm transition-colors ${filter === s ? "bg-white text-ink shadow-sm font-medium" : "text-ink-muted hover:text-ink"}`}
          >
            {s === "pending" ? "Chờ duyệt" : s === "approved" ? "Đã duyệt" : s === "rejected" ? "Từ chối" : "Tất cả"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">Không có đánh giá nào.</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Khách hàng</th>
                <th className="text-left px-4 py-3">Sản phẩm</th>
                <th className="text-left px-4 py-3">Xếp hạng</th>
                <th className="text-left px-4 py-3">Nội dung</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-surface-alt transition-colors cursor-pointer" onClick={() => setSelected(review)}>
                  <td className="px-4 py-3 font-medium">{review.user?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{review.product?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-ink-muted">{review.body}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_LABELS[review.status]?.color}`}>
                      {STATUS_LABELS[review.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-ink-muted">
                    {new Date(review.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-ink">Chi tiết đánh giá</h2>
                <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink-muted text-xl">✕</button>
              </div>

              <dl className="space-y-4 text-sm mb-6">
                <div><dt className="text-ink-muted">Khách hàng</dt><dd className="font-medium">{selected.user?.name}</dd></div>
                <div><dt className="text-ink-muted">Sản phẩm</dt><dd className="font-medium">{selected.product?.name ?? "—"}</dd></div>
                <div><dt className="text-ink-muted">Xếp hạng</dt><dd className="text-amber-400 text-lg">{"★".repeat(selected.rating)}{"☆".repeat(5 - selected.rating)}</dd></div>
                {selected.title && <div><dt className="text-ink-muted">Tiêu đề</dt><dd className="font-medium">{selected.title}</dd></div>}
                <div><dt className="text-ink-muted">Nội dung</dt><dd className="text-ink leading-relaxed">{selected.body}</dd></div>
                <div>
                  <dt className="text-ink-muted">Mua hàng xác thực</dt>
                  <dd className={`font-medium ${selected.is_verified_purchase ? "text-green-600" : "text-ink-muted"}`}>
                    {selected.is_verified_purchase ? "✓ Có" : "Không"}
                  </dd>
                </div>
                <div><dt className="text-ink-muted">Ngày gửi</dt><dd>{new Date(selected.created_at).toLocaleDateString("vi-VN")}</dd></div>
              </dl>

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selected.id, "approved")}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-sm text-sm font-medium hover:bg-green-500 transition-colors"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "rejected")}
                    className="flex-1 bg-brand-light text-brand py-2.5 rounded-sm text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Từ chối
                  </button>
                </div>
              )}
              {selected.status === "approved" && (
                <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="w-full bg-brand-light text-brand py-2.5 rounded-sm text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Thu hồi phê duyệt
                </button>
              )}
              {selected.status === "rejected" && (
                <button
                  onClick={() => updateStatus(selected.id, "approved")}
                  className="w-full bg-green-600 text-white py-2.5 rounded-sm text-sm font-medium hover:bg-green-500 transition-colors"
                >
                  Duyệt lại
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
