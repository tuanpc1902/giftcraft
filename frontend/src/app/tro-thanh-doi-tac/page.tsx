"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface FormState {
  company_name: string;
  tax_code: string;
  contact_name: string;
  phone: string;
  email: string;
  product_types: string;
  has_vat_invoice: boolean;
  min_order_quantity: string;
  description: string;
}

const init: FormState = {
  company_name: "",
  tax_code: "",
  contact_name: "",
  phone: "",
  email: "",
  product_types: "",
  has_vat_invoice: false,
  min_order_quantity: "",
  description: "",
};

function reducer(s: FormState, patch: Partial<FormState>) {
  return { ...s, ...patch };
}

export default function TroThanhDoiTacPage() {
  const [form, dispatch] = useReducer(reducer, init);
  const set = (patch: Partial<FormState>) => dispatch(patch);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/supplier/apply", {
        ...form,
        min_order_quantity: form.min_order_quantity ? parseInt(form.min_order_quantity) : null,
      });
      setDone(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Đã gửi đơn đăng ký!</h2>
          <p className="text-gray-500 mb-8">
            Cảm ơn bạn đã quan tâm trở thành đối tác của GiftCraft Studio. Chúng tôi sẽ xem xét và liên hệ lại trong vòng 3–5 ngày làm việc.
          </p>
          <Link href="/" className="btn-primary px-8 py-3">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trở thành đối tác cung cấp</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Hợp tác với GiftCraft Studio để cung cấp sản phẩm chất lượng cao phục vụ hàng nghìn khách hàng B2B và B2C trên toàn quốc.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: "📦", title: "Đơn hàng ổn định", desc: "Nhận đơn hàng định kỳ từ khách B2B với số lượng lớn" },
          { icon: "💳", title: "Thanh toán đúng hạn", desc: "Cam kết thanh toán đúng hạn theo hợp đồng" },
          { icon: "🤝", title: "Hỗ trợ tận tâm", desc: "Đội ngũ mua hàng hỗ trợ bạn từ đầu đến cuối" },
        ].map(b => (
          <div key={b.title} className="bg-gray-50 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-3">{b.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Điền thông tin đăng ký</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên công ty <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => set({ company_name: e.target.value })}
                placeholder="Công ty TNHH ..."
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã số thuế <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.tax_code}
                onChange={e => set({ tax_code: e.target.value })}
                placeholder="0123456789"
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Người liên hệ <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.contact_name}
                onChange={e => set({ contact_name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email liên hệ <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => set({ email: e.target.value })}
              placeholder="contact@company.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại sản phẩm cung cấp <span className="text-red-500">*</span></label>
            <textarea
              value={form.product_types}
              onChange={e => set({ product_types: e.target.value })}
              placeholder="Mô tả các loại sản phẩm bạn có thể cung cấp (vd: túi vải in nhiệt, hộp quà cao cấp, bút ký kim loại...)"
              required
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng tối thiểu / đơn (MOQ)</label>
              <input
                type="number"
                min="1"
                value={form.min_order_quantity}
                onChange={e => set({ min_order_quantity: e.target.value })}
                placeholder="50"
                className="input-field"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="vat"
                checked={form.has_vat_invoice}
                onChange={e => set({ has_vat_invoice: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 accent-gray-900"
              />
              <label htmlFor="vat" className="text-sm font-medium text-gray-700">Có xuất hóa đơn VAT</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thông tin thêm</label>
            <textarea
              value={form.description}
              onChange={e => set({ description: e.target.value })}
              placeholder="Năng lực sản xuất, chứng chỉ chất lượng, kinh nghiệm hợp tác..."
              rows={4}
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
            {submitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}
