"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { B2bQuote } from "@/types";

const STATUS_MAP: Record<B2bQuote["status"], { label: string; color: string; icon: string; desc: string }> = {
  new:           { label: "Đã nhận",        color: "bg-blue-100 text-blue-700",    icon: "📥", desc: "Yêu cầu của bạn đã được nhận." },
  reviewing:     { label: "Đang xem xét",   color: "bg-amber-100 text-amber-700",  icon: "👀", desc: "Đội ngũ đang xem xét yêu cầu." },
  quoted:        { label: "Đã báo giá",     color: "bg-purple-100 text-purple-700", icon: "💬", desc: "Báo giá đã được gửi. Vui lòng kiểm tra email." },
  approved:      { label: "Đã duyệt",       color: "bg-teal-100 text-teal-700",    icon: "✅", desc: "Báo giá đã được duyệt. Chuẩn bị sản xuất." },
  in_production: { label: "Đang sản xuất",  color: "bg-indigo-100 text-indigo-700", icon: "🏭", desc: "Sản phẩm đang được sản xuất." },
  delivered:     { label: "Đã giao",        color: "bg-green-100 text-green-700",  icon: "🎉", desc: "Dự án hoàn tất. Cảm ơn bạn!" },
  cancelled:     { label: "Đã hủy",         color: "bg-gray-100 text-gray-500",    icon: "✕",  desc: "Yêu cầu đã bị hủy." },
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
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                  done ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
                } ${active ? "ring-2 ring-offset-2 ring-gray-900" : ""}`}>
                  {done ? (active ? info.icon : "✓") : i + 1}
                </div>
                <span className={`text-[10px] text-center max-w-[48px] leading-tight ${done ? "text-gray-700" : "text-gray-400"}`}>
                  {info.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-0.5 mb-4 transition-colors ${i < currentIdx ? "bg-gray-900" : "bg-gray-200"}`} />
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
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/tai-khoan" className="hover:text-gray-700">← Tài khoản</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Dự án B2B của tôi</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi tiến độ báo giá và sản xuất</p>
        </div>
        <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm px-5 py-2.5">
          + Dự án mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 px-8">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-bold text-gray-900 mb-2">Chưa có dự án nào</p>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
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
                className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {q.occasion ?? q.company_name ?? `Dự án #${q.id}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {q.quantity_requested.toLocaleString()} sản phẩm
                      {q.deadline && ` · Deadline: ${new Date(q.deadline).toLocaleDateString("vi-VN")}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${info.color}`}>
                      {info.icon} {info.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(q.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <QuoteTimeline status={q.status} />

                {q.quoted_price && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Giá đã báo</span>
                    <span className="font-bold text-gray-900">
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
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Chi tiết dự án</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className={`rounded-xl px-4 py-3 ${STATUS_MAP[selected.status]?.color ?? "bg-gray-100"}`}>
                <p className="font-semibold text-sm">
                  {STATUS_MAP[selected.status]?.icon} {STATUS_MAP[selected.status]?.label}
                </p>
                <p className="text-xs mt-0.5 opacity-80">{STATUS_MAP[selected.status]?.desc}</p>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tiến độ</p>
                <QuoteTimeline status={selected.status} />
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin dự án</p>
                {selected.occasion && <div className="flex justify-between"><span className="text-gray-500">Dịp / Loại</span><span className="font-medium text-gray-900">{selected.occasion}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Số lượng</span><span className="font-medium text-gray-900">{selected.quantity_requested.toLocaleString()} sản phẩm</span></div>
                {selected.budget_min && <div className="flex justify-between"><span className="text-gray-500">Ngân sách</span><span className="font-medium text-gray-900">{selected.budget_min.toLocaleString()}đ – {selected.budget_max?.toLocaleString() ?? "?"}đ/bộ</span></div>}
                {selected.deadline && <div className="flex justify-between"><span className="text-gray-500">Deadline</span><span className="font-medium text-gray-900">{new Date(selected.deadline).toLocaleDateString("vi-VN")}</span></div>}
                {selected.quoted_price && (
                  <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                    <span className="text-gray-500">Giá đã báo</span>
                    <span className="font-bold text-gray-900 text-base">{selected.quoted_price.toLocaleString("vi-VN")}đ/bộ</span>
                  </div>
                )}
              </div>

              {/* Custom requirements */}
              {selected.custom_requirements && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Yêu cầu tùy chỉnh</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.custom_requirements}</p>
                </div>
              )}

              {/* Admin note (visible to user) */}
              {selected.admin_note && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Ghi chú từ GiftCraft</p>
                  <p className="text-sm text-blue-800">{selected.admin_note}</p>
                </div>
              )}

              {/* Contact info */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Liên hệ</p>
                <div className="flex justify-between"><span className="text-gray-500">Công ty</span><span className="font-medium text-gray-900">{selected.company_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Người liên hệ</span><span className="font-medium text-gray-900">{selected.contact_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SĐT</span><span className="font-medium text-gray-900">{selected.phone}</span></div>
              </div>

              <div className="pt-2">
                <Link href="/bat-dau-du-an-moi" className="btn-outline w-full text-sm text-center">
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
