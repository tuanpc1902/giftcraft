"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import api from "@/lib/api";

const POSITIONS = {
  vi: [
    {
      title: "Nhân viên Thiết kế đồ họa",
      level: "Junior – Middle",
      desc: "Thiết kế bao bì, hộp quà, ấn phẩm khách hàng B2B. Thành thạo Adobe Illustrator/Photoshop. Ưu tiên ứng viên có kinh nghiệm thiết kế sản phẩm in ấn.",
      tags: ["Illustrator", "Photoshop", "In ấn", "Bao bì"],
    },
    {
      title: "Chuyên viên Kinh doanh B2B",
      level: "Middle – Senior",
      desc: "Phát triển và duy trì quan hệ khách hàng doanh nghiệp. Tư vấn giải pháp quà tặng theo nhu cầu. Kinh nghiệm bán hàng B2B từ 2 năm trở lên.",
      tags: ["B2B Sales", "CRM", "Đàm phán", "Key Account"],
    },
    {
      title: "Nhân viên Chăm sóc khách hàng",
      level: "Fresher – Junior",
      desc: "Tư vấn và hỗ trợ khách hàng qua chat, email và điện thoại. Xử lý đơn hàng, khiếu nại và phản hồi. Kỹ năng giao tiếp tốt, thái độ tích cực.",
      tags: ["CSKH", "Chat Support", "Xử lý đơn hàng"],
    },
    {
      title: "Kỹ sư Frontend (Next.js)",
      level: "Middle – Senior",
      desc: "Phát triển và tối ưu giao diện người dùng trên nền tảng Next.js + React. Làm việc cùng team backend Laravel. Yêu thích hiệu suất và trải nghiệm người dùng.",
      tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    },
  ],
  en: [
    {
      title: "Graphic Designer",
      level: "Junior – Middle",
      desc: "Design packaging, gift boxes, and B2B print materials. Proficient in Adobe Illustrator/Photoshop. Experience with print production design a plus.",
      tags: ["Illustrator", "Photoshop", "Print", "Packaging"],
    },
    {
      title: "B2B Sales Specialist",
      level: "Middle – Senior",
      desc: "Build and maintain corporate client relationships. Consult on gifting solutions. 2+ years of B2B sales experience required.",
      tags: ["B2B Sales", "CRM", "Negotiation", "Key Account"],
    },
    {
      title: "Customer Service Representative",
      level: "Fresher – Junior",
      desc: "Assist customers via chat, email, and phone. Handle orders, complaints, and feedback. Strong communication skills and positive attitude required.",
      tags: ["Customer Service", "Chat Support", "Order Management"],
    },
    {
      title: "Frontend Engineer (Next.js)",
      level: "Middle – Senior",
      desc: "Build and optimize UI on Next.js + React. Collaborate with Laravel backend team. Passionate about performance and user experience.",
      tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    },
  ],
};

const CULTURE_ICONS = ["🎯", "🌱", "🤝", "💡"];

interface FormState {
  job_title: string;
  applicant_name: string;
  phone: string;
  email: string;
  cv_url: string;
  cover_letter: string;
}

const INIT: FormState = { job_title: "", applicant_name: "", phone: "", email: "", cv_url: "", cover_letter: "" };

function reducer(s: FormState, patch: Partial<FormState>) {
  return { ...s, ...patch };
}

export default function TuyenDungPage() {
  const t = useTranslations("careers");
  const locale = useLocale() as "vi" | "en";
  const positions = POSITIONS[locale] ?? POSITIONS.vi;

  const [form, dispatch] = useReducer(reducer, INIT);
  const set = (patch: Partial<FormState>) => dispatch(patch);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const CULTURE = [t("culture1"), t("culture2"), t("culture3"), t("culture4")];

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
      setError(e?.response?.data?.message ?? "Có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">{t("title")}</h1>
        <p className="text-ink-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      {/* Culture */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {CULTURE.map((label, i) => (
          <div key={label} className="bg-surface-alt rounded-sm p-5 text-center">
            <div className="text-3xl mb-2">{CULTURE_ICONS[i]}</div>
            <p className="text-sm font-medium text-ink">{label}</p>
          </div>
        ))}
      </div>

      {/* Open positions */}
      <h2 className="text-2xl font-bold text-ink mb-6">{t("openPositions")}</h2>
      <div className="space-y-4 mb-16">
        {positions.map(pos => (
          <div key={pos.title} className="bg-white border border-border rounded-sm p-6 hover:border-border transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-ink">{pos.title}</h3>
                  <span className="text-xs bg-surface-alt text-ink-muted px-2.5 py-0.5 rounded-full">{t("fullTime")}</span>
                  <span className="text-xs bg-brand-light text-brand px-2.5 py-0.5 rounded-full">{pos.level}</span>
                </div>
                <p className="text-sm text-ink-muted mb-3 leading-relaxed">{pos.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pos.tags.map(tag => (
                    <span key={tag} className="text-xs bg-info-light text-info px-2.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => applyFor(pos.title)}
                className="flex-shrink-0 text-sm font-semibold border border-border rounded-sm px-4 py-2 hover:bg-surface-alt transition-colors"
              >
                {t("apply")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application form */}
      <div id="apply-form" className="bg-white rounded-3xl border border-border shadow-sm p-8">
        {done ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-ink mb-3">{t("successTitle")}</h2>
            <p className="text-ink-muted mb-8">{t("successMsg")}</p>
            <Link href="/" className="btn-primary px-8 py-3">{t("backHome")}</Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-ink mb-6">{t("applyForm")}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">{t("position")} <span className="text-brand">*</span></label>
                <input type="text" value={form.job_title} onChange={e => set({ job_title: e.target.value })} required className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">{t("name")} <span className="text-brand">*</span></label>
                  <input type="text" value={form.applicant_name} onChange={e => set({ applicant_name: e.target.value })} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">{t("phone")} <span className="text-brand">*</span></label>
                  <input type="tel" value={form.phone} onChange={e => set({ phone: e.target.value })} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">{t("email")} <span className="text-brand">*</span></label>
                <input type="email" value={form.email} onChange={e => set({ email: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">{t("cvUrl")} <span className="text-brand">*</span></label>
                <input type="url" value={form.cv_url} onChange={e => set({ cv_url: e.target.value })} required className="input-field" />
                <p className="text-xs text-ink-muted mt-1">{t("cvHint")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">{t("coverLetter")}</label>
                <textarea value={form.cover_letter} onChange={e => set({ cover_letter: e.target.value })} rows={5} className="input-field resize-none" />
              </div>
              {error && <div className="bg-brand-light text-brand text-sm px-4 py-3 rounded-sm">{error}</div>}
              <button type="submit" disabled={submitting} className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-50">
                {submitting ? "..." : t("submitBtn")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
