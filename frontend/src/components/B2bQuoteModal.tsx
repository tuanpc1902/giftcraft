"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  productSlug: string;
  productName: string;
  defaultQty?: number;
  onClose: () => void;
}

export default function B2bQuoteModal({ productSlug, productName, defaultQty = 50, onClose }: Props) {
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
    email: "",
    occasion: "",
    quantity_requested: defaultQty,
    custom_requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/b2b/quotes", { ...form, product_slug: productSlug });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {sent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đã gửi yêu cầu!</h3>
            <p className="text-gray-500 text-sm mb-4">Đội ngũ tư vấn sẽ liên hệ trong 24h làm việc.</p>
            <button onClick={onClose} className="btn-primary px-6 py-2">Đóng</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Yêu cầu tư vấn số lượng lớn</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Sản phẩm: <span className="font-medium text-gray-700">{productName}</span></p>
            <form onSubmit={submit} className="space-y-3">
              <input required className="input-field" placeholder="Tên công ty" value={form.company_name}
                onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
              <input required className="input-field" placeholder="Người liên hệ" value={form.contact_name}
                onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <input required className="input-field" placeholder="Số điện thoại" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <input required type="email" className="input-field" placeholder="Email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required className="input-field" placeholder="Dịp tặng quà" value={form.occasion}
                  onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))} />
                <input required type="number" min={20} className="input-field" placeholder="Số lượng (tối thiểu 20)"
                  value={form.quantity_requested}
                  onChange={e => setForm(f => ({ ...f, quantity_requested: parseInt(e.target.value) || 20 }))} />
              </div>
              <textarea className="input-field h-24 resize-none" placeholder="Yêu cầu đặc biệt (tùy chọn)"
                value={form.custom_requirements}
                onChange={e => setForm(f => ({ ...f, custom_requirements: e.target.value }))} />
              <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
                {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
