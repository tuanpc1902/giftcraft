"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import { ProductListItem } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";

const STEPS = [
  {
    key: "recipient",
    question: "Bạn muốn tặng cho ai?",
    subtitle: "Chọn đối tượng nhận quà",
    options: [
      { value: "dong-nghiep",  label: "Đồng nghiệp",    icon: "👔" },
      { value: "vo-chong",     label: "Vợ / Chồng",     icon: "💑" },
      { value: "gia-dinh",     label: "Gia đình",        icon: "👨‍👩‍👧" },
      { value: "ban-be",       label: "Bạn bè",          icon: "👫" },
      { value: "doi-tac",      label: "Đối tác",         icon: "🤝" },
      { value: "doanh-nghiep", label: "Tập thể / DN",    icon: "🏢" },
    ],
  },
  {
    key: "occasion",
    question: "Dịp gì?",
    subtitle: "Lựa chọn theo dịp tặng quà",
    options: [
      { value: "birthday",   label: "Sinh nhật",    icon: "🎂" },
      { value: "wedding",    label: "Cưới / Tân hôn", icon: "💍" },
      { value: "tet",        label: "Tết / Lễ",     icon: "🏮" },
      { value: "khai-truong",label: "Khai trương",  icon: "🎊" },
      { value: "tri-an",     label: "Tri ân",       icon: "🙏" },
      { value: "su-kien",    label: "Sự kiện",      icon: "🎪" },
    ],
  },
  {
    key: "budget",
    question: "Ngân sách bạn có?",
    subtitle: "Tìm quà phù hợp với chi phí của bạn",
    options: [
      { value: "under300", label: "Dưới 300.000đ", icon: "💚" },
      { value: "300-600",  label: "300k – 600k",   icon: "💛" },
      { value: "600-1000", label: "600k – 1 triệu", icon: "🧡" },
      { value: "over1000", label: "Trên 1 triệu",  icon: "💎" },
    ],
  },
  {
    key: "style",
    question: "Phong cách quà?",
    subtitle: "Cá tính nào phù hợp với người nhận",
    options: [
      { value: "nature",      label: "Thiên nhiên",  icon: "🌿" },
      { value: "luxury",      label: "Sang trọng",   icon: "✨" },
      { value: "creative",    label: "Sáng tạo",     icon: "🎨" },
      { value: "traditional", label: "Truyền thống", icon: "🏺" },
    ],
  },
];

const BUDGET_MAP: Record<string, { min: number; max: number }> = {
  "under300": { min: 0,       max: 300000   },
  "300-600":  { min: 300000,  max: 600000   },
  "600-1000": { min: 600000,  max: 1000000  },
  "over1000": { min: 1000000, max: 10000000 },
};

interface Answers { recipient: string; occasion: string; budget: string; style: string; }
function reducer(s: Answers, patch: Partial<Answers>) { return { ...s, ...patch }; }

interface SuggestedProduct extends ProductListItem { match_reason: string; }

export default function GiftFinderPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, dispatch] = useReducer(reducer, { recipient: "", occasion: "", budget: "", style: "" });
  const [results, setResults] = useState<SuggestedProduct[] | null>(null);
  const [loading, setLoading] = useState(false);

  const currentStep = STEPS[stepIndex];
  const stepKey = currentStep.key as keyof Answers;

  async function handleSelect(value: string) {
    dispatch({ [stepKey]: value } as Partial<Answers>);

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      const finalAnswers = { ...answers, [stepKey]: value };
      setLoading(true);
      try {
        const budget = BUDGET_MAP[finalAnswers.budget] ?? { min: 0, max: 10000000 };
        try {
          const { data } = await api.post("/gift-finder", finalAnswers);
          setResults(data.data ?? []);
        } catch {
          const { data } = await api.get(`/products?min_price=${budget.min}&max_price=${budget.max}&per_page=6`);
          setResults((data.data?.items ?? []).map((p: ProductListItem) => ({
            ...p,
            match_reason: "Phù hợp với ngân sách của bạn",
          })));
        }
      } finally {
        setLoading(false);
      }
    }
  }

  function reset() {
    setStepIndex(0);
    setResults(null);
    dispatch({ recipient: "", occasion: "", budget: "", style: "" });
  }

  const isResults = !!results && !loading;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-alt">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <SparklesIcon className="w-3.5 h-3.5" />
            Gift Finder AI
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Tìm quà hoàn hảo</h1>
          <p className="text-ink-muted text-sm">Trả lời {STEPS.length} câu hỏi — nhận gợi ý quà phù hợp ngay tức thì.</p>
        </div>

        {/* Progress bar */}
        {!isResults && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-6">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                    i < stepIndex ? "bg-brand" : i === stepIndex ? "bg-brand" : "bg-border"
                  }`}>
                    {i === stepIndex && (
                      <div className="h-full bg-brand rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${i <= stepIndex ? "text-brand" : "text-ink-muted/50"}`}>
                    {i + 1}. {s.key === "recipient" ? "Ai" : s.key === "occasion" ? "Dịp" : s.key === "budget" ? "Ngân sách" : "Phong cách"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Loading */}
        {loading && (
          <div className="text-center py-24">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-border" />
              <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin" />
              <SparklesIcon className="absolute inset-0 m-auto w-6 h-6 text-brand" />
            </div>
            <p className="font-semibold text-ink mb-1">Đang tìm quà phù hợp...</p>
            <p className="text-sm text-ink-muted">Chúng tôi đang phân tích {Object.values(answers).filter(Boolean).length} tiêu chí</p>
          </div>
        )}

        {/* Step card */}
        {!results && !loading && (
          <div className="animate-scale-in">
            <div className="bg-white rounded-sm border border-border shadow-[0_4px_24px_0_rgb(0_0_0/0.06)] overflow-hidden">
              {/* Step header */}
              <div className="px-8 pt-8 pb-6 border-b border-border">
                <p className="text-xs text-ink-muted font-semibold uppercase tracking-widest mb-2">
                  Câu {stepIndex + 1} / {STEPS.length}
                </p>
                <h2 className="font-display text-2xl font-bold text-ink">{currentStep.question}</h2>
                <p className="text-sm text-ink-muted mt-1">{currentStep.subtitle}</p>
              </div>

              {/* Options */}
              <div className="p-6">
                <div className={`grid gap-3 ${currentStep.options.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
                  {currentStep.options.map((opt, i) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`animate-fade-up flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all duration-200 hover:border-brand hover:bg-brand-light hover:shadow-sm group ${
                        answers[stepKey] === opt.value
                          ? "border-brand bg-brand-light"
                          : "border-border"
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                        {opt.icon}
                      </span>
                      <span className="text-sm font-semibold text-ink text-center leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Back nav */}
              {stepIndex > 0 && (
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => setStepIndex(i => i - 1)}
                    className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Câu trước
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {isResults && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="eyebrow mb-1">✦ Kết quả</p>
                <h2 className="font-display text-2xl font-bold text-ink">
                  {results.length > 0
                    ? `${results.length} gợi ý dành cho bạn`
                    : "Không tìm thấy sản phẩm phù hợp"}
                </h2>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                Tìm lại →
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center bg-white rounded-sm border border-border p-12">
                <p className="text-5xl mb-4">😔</p>
                <p className="text-ink-muted mb-6">Thử điều chỉnh ngân sách hoặc phong cách.</p>
                <div className="flex gap-3 justify-center">
                  <button type="button" onClick={reset} className="btn-secondary text-sm">
                    Tìm lại
                  </button>
                  <Link href="/san-pham" className="btn-primary text-sm">
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
                  {results.map((p, i) => (
                    <div key={p.slug} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <ProductCard product={p} />
                      {p.match_reason && (
                        <p className="text-[11px] text-brand font-medium mt-2 px-0.5">✓ {p.match_reason}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/san-pham" className="btn-secondary text-sm">
                    Xem thêm sản phẩm →
                  </Link>
                </div>
              </>
            )}

            {/* B2B upsell */}
            {answers.recipient === "doanh-nghiep" && (
              <div className="mt-8 bg-ink rounded-sm p-8 text-center">
                <p className="font-display text-xl font-bold text-white mb-2">
                  Mua số lượng lớn? Tiết kiệm đến 30%!
                </p>
                <p className="text-white/60 text-sm mb-6">
                  Đặt từ 20 sản phẩm, nhận giá B2B ưu đãi. Báo giá trong 24h.
                </p>
                <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm">
                  Xem giá B2B →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
