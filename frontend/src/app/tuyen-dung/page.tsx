"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

const OPEN_POSITIONS = [
  {
    title: "Nhân viên Thiết kế đồ họa",
    type: "Toàn thời gian",
    level: "Junior – Middle",
    desc: "Thiết kế bao bì, hộp quà, ấn phẩm khách hàng B2B. Thành thạo Adobe Illustrator/Photoshop. Ưu tiên ứng viên có kinh nghiệm thiết kế sản phẩm in ấn.",
    tags: ["Illustrator", "Photoshop", "In ấn", "Bao bì"],
  },
  {
    title: "Chuyên viên Kinh doanh B2B",
    type: "Toàn thời gian",
    level: "Middle – Senior",
    desc: "Phát triển và duy trì quan hệ khách hàng doanh nghiệp. Tư vấn giải pháp quà tặng theo nhu cầu. Kinh nghiệm bán hàng B2B từ 2 năm trở lên.",
    tags: ["B2B Sales", "CRM", "Đàm phán", "Key Account"],
  },
  {
    title: "Nhân viên Chăm sóc khách hàng",
    type: "Toàn thời gian",
    level: "Fresher – Junior",
    desc: "Tư vấn và hỗ trợ khách hàng qua chat, email và điện thoại. Xử lý đơn hàng, khiếu nại và phản hồi. Kỹ năng giao tiếp tốt, thái độ tích cực.",
    tags: ["CSKH", "Chat Support", "Xử lý đơn hàng"],
  },
  {
    title: "Kỹ sư Frontend (Next.js)",
    type: "Toàn thời gian",
    level: "Middle – Senior",
    desc: "Phát triển và tối ưu giao diện người dùng trên nền tảng Next.js + React. Làm việc cùng team backend Laravel. Yêu thích hiệu suất và trải nghiệm người dùng.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
  },
];

interface FormState {
  job_title: string;
  applicant_name: string;
  phone: string;
  email: string;
  cv_url: string;
  cover_letter: string;
}

const init: FormState = {
  job_title: "",
  applicant_name: "",
  phone: "",
  email: "",
  cv_url: "",
  cover_letter: "",
};

function reducer(s: FormState, patch: Partial<FormState>) {
  return { ...s, ...patch };
}

export default function TuyenDungPage() {
  const [form, dispatch] = useReducer(reducer, init);
  const set = (patch: Partial<FormState>) => dispatch(patch);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function applyFor(title: string) {
    set({ job_title: title });
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/jobs/apply", form);
      setDone(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Cùng nhau xây dựng GiftCraft</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Chúng tôi tìm kiếm những người đam mê sáng tạo, nhiệt huyết và muốn tạo ra những sản phẩm có ý nghĩa cho hàng nghìn khách hàng.
        </p>
      </div>

      {/* Culture */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {[
          { icon: "🎯", label: "Mục tiêu rõ ràng" },
          { icon: "🌱", label: "Phát triển nhanh" },
          { icon: "🤝", label: "Văn hóa hợp tác" },
          { icon: "💡", label: "Sáng tạo được trân trọng" },
        ].map(c => (
          <div key={c.label} className="bg-gray-50 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="text-sm font-medium text-gray-700">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Open positions */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vị trí đang tuyển</h2>
      <div className="space-y-4 mb-16">
        {OPEN_POSITIONS.map(pos => (
          <div key={pos.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{pos.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{pos.type}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">{pos.level}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{pos.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pos.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => applyFor(pos.title)}
                className="flex-shrink-0 text-sm font-semibold border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                Ứng tuyển
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application form */}
      <div id="apply-form" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        {done ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Đã nhận đơn ứng tuyển!</h2>
            <p className="text-gray-500 mb-8">
              Cảm ơn bạn đã ứng tuyển. Chúng tôi sẽ xem xét và liên hệ lại trong vòng 5–7 ngày làm việc.
            </p>
            <Link href="/" className="btn-primary px-8 py-3">Về trang chủ</Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nộp đơn ứng tuyển</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vị trí ứng tuyển <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.job_title}
                  onChange={e => set({ job_title: e.target.value })}
                  placeholder="Nhân viên Thiết kế đồ họa"
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.applicant_name}
                    onChange={e => set({ applicant_name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set({ phone: e.target.value })}
                    placeholder="0901 234 567"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set({ email: e.target.value })}
                  placeholder="yourname@email.com"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link CV / Portfolio <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  value={form.cv_url}
                  onChange={e => set({ cv_url: e.target.value })}
                  placeholder="https://drive.google.com/... hoặc https://behance.net/..."
                  required
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">Upload CV lên Google Drive, Dropbox hoặc Behance rồi dán link vào đây.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thư giới thiệu</label>
                <textarea
                  value={form.cover_letter}
                  onChange={e => set({ cover_letter: e.target.value })}
                  placeholder="Giới thiệu bản thân, lý do muốn ứng tuyển và điểm nổi bật của bạn..."
                  rows={5}
                  className="input-field resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-50"
              >
                {submitting ? "Đang gửi..." : "Nộp đơn ứng tuyển"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
