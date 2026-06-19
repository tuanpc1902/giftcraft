"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { B2bQuote } from "@/types";

const STATUS_MAP: Record<B2bQuote["status"], { label: string; color: string; icon: string; desc: string }> = {
  new:           { label: "Đã nhận",        color: "bg-info-light text-info",    icon: "📥", desc: "Yêu cầu của bạn đã được nhận." },
  reviewing:     { label: "Đang xem xét",   color: "bg-brand-light text-brand",  icon: "👀", desc: "Đội ngũ đang xem xét yêu cầu." },
  quoted:        { label: "Đã báo giá",     color: "bg-purple-100 text-purple-700", icon: "💬", desc: "Báo giá đã được gửi. Vui lòng kiểm tra email." },
  approved:      { label: "Đã duyệt",       color: "bg-teal-100 text-teal-700",    icon: "✅", desc: "Báo giá đã được duyệt. Chuẩn bị sản xuất." },
  in_production: { label: "Đang sản xuất",  color: "bg-indigo-100 text-indigo-700", icon: "🏭", desc: "Sản phẩm đang được sản xuất." },
  delivered:     { label: "Đã giao",        color: "bg-success-light text-success",  icon: "🎉", desc: "Dự án hoàn tất. Cảm ơn bạn!" },
  cancelled:     { label: "Đã hủy",         color: "bg-surface-alt text-ink-muted",    icon: "✕",  desc: "Yêu cầu đã bị hủy." },
};

const STATUS_STEPS: B2bQuote["status"][] = ["new", "reviewing", "quoted", "approved", "in_production", "delivered"];

function QuoteTimeline({ status }: { status: B2bQuote["status"] }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  if (currentIdx === -1) return null;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((s, i) => {
          const info = STATUS_MAP[s];
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs transition-colors ${
                  done ? "bg-ink text-white" : "bg-surface-alt text-ink-muted"
                } ${active ? "ring-2 ring-offset-2 ring-ink" : ""}`}>
                  {done ? (active ? info.icon : "✓") : i + 1}
                </div>
                <span className={`text-[10px] text-center max-w-[48px] leading-tight ${done ? "text-ink" : "text-ink-muted"}`}>
                  {info.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-0.5 mb-4 transition-colors ${i < currentIdx ? "bg-ink" : "bg-surface-alt"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function B2bPortalPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();
  const [quotes, setQuotes] = useState<B2bQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<B2bQuote | null>(null);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user === null && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) { router.replace("/dang-nhap"); return; }
    }
    if (user) {
      api.get("/b2b/quotes/my")
        .then(r => setQuotes(r.data.data?.items ?? r.data.data ?? []))
        .catch(() => setQuotes([]))
        .finally(() => setLoading(false));
    }
  }, [user, router]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-ink-muted mb-1">
            <Link href="/tai-khoan" className="hover:text-ink">← Tài khoản</Link>
          </div>
          <h1 className="text-2xl font-bold text-ink">Dự án B2B của tôi</h1>
          <p className="text-ink-muted text-sm mt-1">Theo dõi tiến độ báo giá và sản xuất</p>
        </div>
        <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm px-5 py-2.5">
          + Dự án mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-sm border border-border text-center py-16 px-8">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-bold text-ink mb-2">Chưa có dự án nào</p>
          <p className="text-ink-muted text-sm mb-8 max-w-sm mx-auto">
            Gửi yêu cầu báo giá B2B để bắt đầu. Chúng tôi phản hồi trong 24h làm việc.
          </p>
          <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm px-8">
            Bắt đầu dự án mới →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map(q => {
            const info = STATUS_MAP[q.status] ?? STATUS_MAP.new;
            return (
              <div
                key={q.id}
                onClick={() => setSelected(q)}
                className="bg-white rounded-sm border border-border p-5 cursor-pointer hover:border-border hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-ink">
                      {q.occasion ?? q.company_name ?? `Dự án #${q.id}`}
                    </p>
                    <p className="text-sm text-ink-muted mt-0.5">
                      {q.quantity_requested.toLocaleString()} sản phẩm
                      {q.deadline && ` · Deadline: ${new Date(q.deadline).toLocaleDateString("vi-VN")}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-sm ${info.color}`}>
                      {info.icon} {info.label}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {new Date(q.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <QuoteTimeline status={q.status} />

                {q.quoted_price && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Giá đã báo</span>
                    <span className="font-bold text-ink">
                      {q.quoted_price.toLocaleString("vi-VN")}đ/bộ
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-ink">Chi tiết dự án</h2>
              <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink-muted text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className={`rounded-sm px-4 py-3 ${STATUS_MAP[selected.status]?.color ?? "bg-surface-alt"}`}>
                <p className="font-semibold text-sm">
                  {STATUS_MAP[selected.status]?.icon} {STATUS_MAP[selected.status]?.label}
                </p>
                <p className="text-xs mt-0.5 opacity-80">{STATUS_MAP[selected.status]?.desc}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Tiến độ</p>
                <QuoteTimeline status={selected.status} />
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Thông tin dự án</p>
                {selected.occasion && <div className="flex justify-between"><span className="text-ink-muted">Dịp / Loại</span><span className="font-medium text-ink">{selected.occasion}</span></div>}
                <div className="flex justify-between"><span className="text-ink-muted">Số lượng</span><span className="font-medium text-ink">{selected.quantity_requested.toLocaleString()} sản phẩm</span></div>
                {selected.budget_min && <div className="flex justify-between"><span className="text-ink-muted">Ngân sách</span><span className="font-medium text-ink">{selected.budget_min.toLocaleString()}đ – {selected.budget_max?.toLocaleString() ?? "?"}đ/bộ</span></div>}
                {selected.deadline && <div className="flex justify-between"><span className="text-ink-muted">Deadline</span><span className="font-medium text-ink">{new Date(selected.deadline).toLocaleDateString("vi-VN")}</span></div>}
                {selected.quoted_price && (
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <span className="text-ink-muted">Giá đã báo</span>
                    <span className="font-bold text-ink text-base">{selected.quoted_price.toLocaleString("vi-VN")}đ/bộ</span>
                  </div>
                )}
              </div>

              {/* Custom requirements */}
              {selected.custom_requirements && (
                <div>
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">Yêu cầu tùy chỉnh</p>
                  <p className="text-sm text-ink-muted bg-surface-alt rounded-sm p-3 leading-relaxed">{selected.custom_requirements}</p>
                </div>
              )}

              {/* Admin note (visible to user) */}
              {selected.admin_note && (
                <div className="bg-info-light rounded-sm p-4">
                  <p className="text-xs font-semibold text-info uppercase tracking-wide mb-1">Ghi chú từ GiftCraft</p>
                  <p className="text-sm text-info">{selected.admin_note}</p>
                </div>
              )}

              {/* Contact info */}
              <div className="space-y-2 text-sm border-t border-border pt-4">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Liên hệ</p>
                <div className="flex justify-between"><span className="text-ink-muted">Công ty</span><span className="font-medium text-ink">{selected.company_name}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Người liên hệ</span><span className="font-medium text-ink">{selected.contact_name}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">SĐT</span><span className="font-medium text-ink">{selected.phone}</span></div>
              </div>

              <div className="pt-2">
                <Link href="/bat-dau-du-an-moi" className="btn-secondary w-full text-sm text-center">
                  Gửi yêu cầu mới →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
