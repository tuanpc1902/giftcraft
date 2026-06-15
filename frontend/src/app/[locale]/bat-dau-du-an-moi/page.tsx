"use client";

import { Suspense, useReducer, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";

const PROJECT_TYPES = [
  { value: "nhan-vien", label: "Quà nhân viên", icon: "👥" },
  { value: "doi-tac", label: "Quà đối tác", icon: "🤝" },
  { value: "su-kien", label: "Quà sự kiện", icon: "🎪" },
  { value: "theo-dip", label: "Theo dịp", icon: "🎊" },
  { value: "tuy-chinh", label: "Tuỳ chỉnh riêng", icon: "✨" },
];

const CUSTOMIZATIONS = [
  { key: "logo", label: "In logo thương hiệu" },
  { key: "name", label: "Khắc tên cá nhân" },
  { key: "color", label: "Màu sắc riêng" },
  { key: "packaging", label: "Bao bì tùy chỉnh" },
  { key: "box", label: "Hộp quà cao cấp" },
];

const TIER_LABELS = [
  { min: 0, max: 19, label: null },
  { min: 20, max: 49, label: "Từ 20 — giảm 10%" },
  { min: 50, max: 99, label: "Từ 50 — giảm 15%" },
  { min: 100, max: 199, label: "Từ 100 — giảm 20%" },
  { min: 200, max: 299, label: "Từ 200 — giảm 25%" },
  { min: 300, max: Infinity, label: "Từ 300 — giảm 30%" },
];

function getTierLabel(qty: number) {
  return TIER_LABELS.find(t => qty >= t.min && qty <= t.max)?.label ?? null;
}

interface FormState {
  step: 1 | 2 | 3 | 4 | 5;
  projectType: string;
  quantity: number;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  customizations: string[];
  requirements: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  occasion: string;
}

const init: FormState = {
  step: 1, projectType: "", quantity: 50,
  budgetMin: "", budgetMax: "", deadline: "",
  customizations: [], requirements: "",
  companyName: "", contactName: "", phone: "", email: "", occasion: "",
};

function reducer(s: FormState, patch: Partial<FormState>) { return { ...s, ...patch }; }

function StartProjectInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    ...init,
    occasion: searchParams.get("occasion") ?? "",
    requirements: searchParams.get("requirements") ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const set = (patch: Partial<FormState>) => dispatch(patch);
  const next = () => set({ step: (state.step + 1) as FormState["step"] });
  const back = () => set({ step: (state.step - 1) as FormState["step"] });

  const tierLabel = getTierLabel(state.quantity);

  async function submit() {
    setSubmitting(true);
    try {
      const { data } = await api.post("/b2b/quotes", {
        company_name: state.companyName,
        contact_name: state.contactName,
        phone: state.phone,
        email: state.email,
        occasion: state.occasion || state.projectType,
        quantity_requested: state.quantity,
        budget_min: state.budgetMin ? parseInt(state.budgetMin) : null,
        budget_max: state.budgetMax ? parseInt(state.budgetMax) : null,
        deadline: state.deadline || null,
        custom_requirements: [
          state.requirements,
          state.customizations.length ? `Tuỳ chỉnh: ${state.customizations.join(", ")}` : "",
        ].filter(Boolean).join("\n"),
      });
      setOrderRef(data.data?.id ?? "");
      setDone(true);
    } catch {
      alert("Có lỗi, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-ink mb-2">Đã gửi yêu cầu!</h2>
        <p className="text-ink-muted mb-2">Đội ngũ tư vấn sẽ liên hệ trong <strong>24h làm việc</strong>.</p>
        {orderRef && <p className="text-xs text-ink-muted mb-8 font-mono">Mã yêu cầu: #{orderRef}</p>}
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/")} className="btn-primary px-6">Về trang chủ</button>
          <button onClick={() => router.push("/forfolio")} className="btn-outline px-6">Xem Forfolio</button>
        </div>
      </div>
    );
  }

  const steps = ["Loại dự án", "Sản phẩm", "Số lượng", "Yêu cầu", "Liên hệ"];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-ink mb-2">Bắt đầu dự án quà tặng</h1>
      <p className="text-ink-muted text-sm mb-8">Điền thông tin — nhận báo giá trong 24h, không cần gọi điện.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-10 overflow-x-auto">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-shrink-0">
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              state.step > i + 1 ? "bg-green-500 text-white" :
              state.step === i + 1 ? "bg-ink text-white" : "bg-surface-alt text-ink-muted"
            }`}>{state.step > i + 1 ? "✓" : i + 1}</div>
            <span className={`hidden sm:block text-xs whitespace-nowrap ${state.step === i + 1 ? "text-ink font-medium" : "text-ink-muted"}`}>{label}</span>
            {i < 4 && <div className="w-4 sm:w-6 h-px bg-surface-alt" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-border p-6">
        {/* Step 1: Project type */}
        {state.step === 1 && (
          <>
            <h2 className="font-bold text-ink mb-5">Loại dự án của bạn?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map(pt => (
                <button key={pt.value} onClick={() => set({ projectType: pt.value })}
                  className={`flex items-center gap-3 p-4 rounded-sm border-2 transition-colors text-left ${state.projectType === pt.value ? "border-ink bg-surface-alt" : "border-border hover:border-border"}`}>
                  <span className="text-2xl">{pt.icon}</span>
                  <span className="font-medium text-ink">{pt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button disabled={!state.projectType} onClick={next} className="btn-primary px-8 disabled:opacity-40">Tiếp →</button>
            </div>
          </>
        )}

        {/* Step 2: Product (optional) */}
        {state.step === 2 && (
          <>
            <h2 className="font-bold text-ink mb-2">Sản phẩm (tùy chọn)</h2>
            <p className="text-sm text-ink-muted mb-5">Đã biết sản phẩm muốn đặt? Nhập tên hoặc bỏ qua.</p>
            <input className="input-field" placeholder="Ví dụ: BÁCH VỊ VẠN HỶ, Hương Quê..." value={state.occasion}
              onChange={e => set({ occasion: e.target.value })} />
            <p className="text-xs text-ink-muted mt-3">Hoặc để chúng tôi tư vấn sản phẩm phù hợp.</p>
            <div className="flex justify-between mt-6">
              <button onClick={back} className="text-ink-muted hover:text-ink font-medium">← Quay lại</button>
              <button onClick={next} className="btn-primary px-8">Tiếp →</button>
            </div>
          </>
        )}

        {/* Step 3: Quantity + budget */}
        {state.step === 3 && (
          <>
            <h2 className="font-bold text-ink mb-5">Số lượng &amp; ngân sách</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-ink block mb-2">Số lượng sản phẩm</label>
                <input type="number" min="1" className="input-field" value={state.quantity}
                  onChange={e => set({ quantity: parseInt(e.target.value) || 1 })} />
                {tierLabel && (
                  <p className="mt-2 text-sm text-brand font-medium">🎉 {state.quantity} sản phẩm → {tierLabel}</p>
                )}
                {state.quantity < 20 && (
                  <p className="mt-2 text-sm text-ink-muted">Giá B2B áp dụng từ 20 sản phẩm</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-2">Ngân sách dự kiến (VNĐ/bộ)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className="input-field" placeholder="Tối thiểu" value={state.budgetMin}
                    onChange={e => set({ budgetMin: e.target.value })} />
                  <input type="number" className="input-field" placeholder="Tối đa" value={state.budgetMax}
                    onChange={e => set({ budgetMax: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink block mb-2">Deadline giao hàng</label>
                <input type="date" className="input-field" value={state.deadline}
                  onChange={e => set({ deadline: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={back} className="text-ink-muted hover:text-ink font-medium">← Quay lại</button>
              <button onClick={next} className="btn-primary px-8">Tiếp →</button>
            </div>
          </>
        )}

        {/* Step 4: Customizations + requirements */}
        {state.step === 4 && (
          <>
            <h2 className="font-bold text-ink mb-5">Yêu cầu tùy chỉnh</h2>
            <div className="space-y-2 mb-5">
              {CUSTOMIZATIONS.map(c => (
                <label key={c.key} className={`flex items-center gap-3 p-3 rounded-sm border-2 cursor-pointer transition-colors ${state.customizations.includes(c.key) ? "border-amber-400 bg-brand-light" : "border-border"}`}>
                  <input type="checkbox" checked={state.customizations.includes(c.key)}
                    onChange={e => set({
                      customizations: e.target.checked
                        ? [...state.customizations, c.key]
                        : state.customizations.filter(x => x !== c.key)
                    })} className="rounded" />
                  <span className="text-sm font-medium text-ink">{c.label}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-ink block mb-2">Mô tả thêm (tùy chọn)</label>
              <textarea className="input-field h-28 resize-none" placeholder="Mô tả yêu cầu, phong cách, màu sắc thương hiệu..."
                value={state.requirements}
                onChange={e => set({ requirements: e.target.value })} />
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={back} className="text-ink-muted hover:text-ink font-medium">← Quay lại</button>
              <button onClick={next} className="btn-primary px-8">Tiếp →</button>
            </div>
          </>
        )}

        {/* Step 5: Contact info */}
        {state.step === 5 && (
          <>
            <h2 className="font-bold text-ink mb-5">Thông tin liên hệ</h2>
            <div className="space-y-3">
              <input required className="input-field" placeholder="Tên công ty *" value={state.companyName}
                onChange={e => set({ companyName: e.target.value })} />
              <input required className="input-field" placeholder="Họ và tên *" value={state.contactName}
                onChange={e => set({ contactName: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input required className="input-field" placeholder="Số điện thoại *" value={state.phone}
                  onChange={e => set({ phone: e.target.value })} />
                <input required type="email" className="input-field" placeholder="Email *" value={state.email}
                  onChange={e => set({ email: e.target.value })} />
              </div>
            </div>

            <div className="bg-surface-alt rounded-sm p-4 mt-5 text-sm text-ink-muted space-y-1">
              <p className="font-semibold text-ink mb-2">Tóm tắt yêu cầu:</p>
              <p>Loại: {PROJECT_TYPES.find(t => t.value === state.projectType)?.label}</p>
              <p>Số lượng: {state.quantity} sản phẩm{tierLabel ? ` (${tierLabel})` : ""}</p>
              {(state.budgetMin || state.budgetMax) && <p>Ngân sách: {state.budgetMin || "?"} – {state.budgetMax || "?"}đ/bộ</p>}
              {state.deadline && <p>Deadline: {state.deadline}</p>}
              {state.customizations.length > 0 && <p>Tuỳ chỉnh: {state.customizations.join(", ")}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={back} className="text-ink-muted hover:text-ink font-medium">← Quay lại</button>
              <button
                disabled={submitting || !state.companyName || !state.contactName || !state.phone || !state.email}
                onClick={submit}
                className="btn-primary px-10 disabled:opacity-40">
                {submitting ? "Đang gửi..." : "Gửi yêu cầu →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StartProjectPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-ink-muted">Đang tải...</div>}>
      <StartProjectInner />
    </Suspense>
  );
}
