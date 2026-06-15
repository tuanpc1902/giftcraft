"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import { ProductListItem } from "@/types";

const STEPS = [
  {
    key: "recipient",
    question: "Bạn muốn tặng cho ai?",
    options: [
      { value: "dong-nghiep", label: "Đồng nghiệp", icon: "👔" },
      { value: "vo-chong", label: "Vợ / Chồng", icon: "💑" },
      { value: "gia-dinh", label: "Gia đình", icon: "👨‍👩‍👧" },
      { value: "ban-be", label: "Bạn bè", icon: "👫" },
      { value: "doi-tac", label: "Đối tác", icon: "🤝" },
      { value: "doanh-nghiep", label: "Tập thể / DN", icon: "🏢" },
    ],
  },
  {
    key: "occasion",
    question: "Dịp gì?",
    options: [
      { value: "birthday", label: "Sinh nhật", icon: "🎂" },
      { value: "wedding", label: "Cưới / Tân hôn", icon: "💍" },
      { value: "tet", label: "Tết / Lễ", icon: "🏮" },
      { value: "khai-truong", label: "Khai trương", icon: "🎊" },
      { value: "tri-an", label: "Tri ân", icon: "🙏" },
      { value: "su-kien", label: "Sự kiện", icon: "🎪" },
    ],
  },
  {
    key: "budget",
    question: "Ngân sách bạn có?",
    options: [
      { value: "under300", label: "Dưới 300.000đ", icon: "💰" },
      { value: "300-600", label: "300k – 600k", icon: "💰💰" },
      { value: "600-1000", label: "600k – 1 triệu", icon: "💰💰💰" },
      { value: "over1000", label: "Trên 1 triệu", icon: "💎" },
    ],
  },
  {
    key: "style",
    question: "Phong cách quà?",
    options: [
      { value: "nature", label: "Thiên nhiên", icon: "🌿" },
      { value: "luxury", label: "Sang trọng", icon: "✨" },
      { value: "creative", label: "Sáng tạo", icon: "🎨" },
      { value: "traditional", label: "Truyền thống", icon: "🏺" },
    ],
  },
];

const BUDGET_MAP: Record<string, { min: number; max: number }> = {
  "under300": { min: 0, max: 300000 },
  "300-600": { min: 300000, max: 600000 },
  "600-1000": { min: 600000, max: 1000000 },
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
      // Last step — fetch results
      const finalAnswers = { ...answers, [stepKey]: value };
      setLoading(true);
      try {
        const budget = BUDGET_MAP[finalAnswers.budget] ?? { min: 0, max: 10000000 };
        // Try gift-finder endpoint, fallback to regular product search
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

  function reset() { setStepIndex(0); setResults(null); dispatch({ recipient: "", occasion: "", budget: "", style: "" }); }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <span className="text-4xl block mb-3">🎯</span>
        <h1 className="text-3xl font-bold text-ink mb-2">Gift Finder</h1>
        <p className="text-ink-muted">Trả lời 4 câu hỏi — nhận gợi ý quà phù hợp ngay.</p>
      </div>

      {/* Progress */}
      {!results && !loading && (
        <div className="flex gap-1.5 mb-10">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-sm transition-colors ${i <= stepIndex ? "bg-brand" : "bg-surface-alt"}`} />
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-bounce">🔍</div>
          <p className="text-ink-muted">Đang tìm quà phù hợp...</p>
        </div>
      )}

      {!results && !loading && (
        <div className="bg-white rounded-sm border border-border p-8">
          <h2 className="text-xl font-bold text-ink mb-6 text-center">{currentStep.question}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentStep.options.map(opt => (
              <button key={opt.value} onClick={() => handleSelect(opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all hover:border-brand hover:bg-brand-light ${answers[stepKey] === opt.value ? "border-brand bg-brand-light" : "border-border"}`}>
                <span className="text-3xl">{opt.icon}</span>
                <span className="text-sm font-medium text-ink text-center">{opt.label}</span>
              </button>
            ))}
          </div>
          {stepIndex > 0 && (
            <button onClick={() => setStepIndex(i => i - 1)} className="mt-6 text-sm text-ink-muted hover:text-ink-muted w-full text-center">
              ← Câu trước
            </button>
          )}
        </div>
      )}

      {results && !loading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">
              {results.length > 0 ? `${results.length} gợi ý phù hợp cho bạn` : "Không tìm thấy sản phẩm phù hợp"}
            </h2>
            <button onClick={reset} className="text-sm text-brand hover:text-brand font-medium">
              Tìm lại →
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-muted mb-4">Thử điều chỉnh ngân sách hoặc tìm lại.</p>
              <Link href="/san-pham" className="btn-primary px-6">Xem tất cả sản phẩm</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(p => (
                <Link key={p.slug} href={`/san-pham/${p.slug}`} className="group">
                  <div className="bg-white border border-border rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-surface-alt">
                      {p.cover_image ? (
                        <Image src={p.cover_image} alt={p.name} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl text-ink-muted">🎁</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-ink text-sm group-hover:text-brand transition-colors">{p.name}</h3>
                      <p className="text-brand text-xs mt-1">✓ {(p as SuggestedProduct).match_reason}</p>
                      <p className="font-bold text-ink mt-2">{formatPrice(p.retail_price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* B2B upsell if recipient is corporate */}
          {answers.recipient === "doanh-nghiep" && (
            <div className="mt-8 bg-brand-light border border-border rounded-sm p-6 text-center">
              <p className="text-brand font-semibold mb-1">Mua số lượng lớn? Tiết kiệm đến 30%!</p>
              <p className="text-brand text-sm mb-4">Đặt từ 20 sản phẩm để được giá B2B ưu đãi.</p>
              <Link href="/bat-dau-du-an-moi" className="btn-primary bg-brand text-white hover:bg-brand-light px-8">
                Xem giá B2B →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
