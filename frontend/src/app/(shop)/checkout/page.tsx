"use client";

import { useReducer, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/formatPrice";

interface CheckoutState {
  step: 1 | 2 | 3 | 4;
  // Step 1
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  // Step 2
  deliveryType: "standard" | "express";
  requestedDate: string;
  giftMessage: string;
  customerNote: string;
  shippingFee: number | null;
  // Step 3
  paymentMethod: "cod" | "vnpay" | "momo";
  voucherCode: string;
}

type Action =
  | { type: "SET"; key: keyof CheckoutState; value: string | number | null }
  | { type: "NEXT" }
  | { type: "BACK" };

function reducer(state: CheckoutState, action: Action): CheckoutState {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, 4) as CheckoutState["step"] };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, 1) as CheckoutState["step"] };
    default:
      return state;
  }
}

const initialState: CheckoutState = {
  step: 1,
  name: "", phone: "", address: "", ward: "", district: "", city: "",
  deliveryType: "standard",
  requestedDate: "", giftMessage: "", customerNote: "",
  shippingFee: null,
  paymentMethod: "cod",
  voucherCode: "",
};

const CITIES = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Bình Dương", "Đồng Nai", "Vũng Tàu"];

export default function CheckoutPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const idempotencyKey = useRef(crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const router = useRouter();
  const { cart, fetch: fetchCart } = useCartStore();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const set = (key: keyof CheckoutState, value: string | number | null) =>
    dispatch({ type: "SET", key, value });

  async function calculateShipping() {
    if (!state.city) return;
    setShippingLoading(true);
    try {
      const { data } = await api.post("/shipping/calculate", {
        address: { city: state.city, district: state.district },
        delivery_type: state.deliveryType,
      });
      const fee = state.deliveryType === "express"
        ? (data.data.express?.fee ?? data.data.standard.fee)
        : data.data.standard.fee;
      set("shippingFee", fee);
    } finally {
      setShippingLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/purity
  useEffect(() => { if (state.step === 2 && state.city) { calculateShipping(); } },
    [state.deliveryType, state.city, state.step]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const { data } = await api.post(
        "/orders/checkout",
        {
          shipping_address: {
            name: state.name, phone: state.phone, address: state.address,
            ward: state.ward, district: state.district, city: state.city,
          },
          delivery_type: state.deliveryType,
          requested_delivery_date: state.requestedDate || null,
          gift_message: state.giftMessage || null,
          customer_note: state.customerNote || null,
          payment_method: state.paymentMethod,
          voucher_code: state.voucherCode || undefined,
        },
        { headers: { "Idempotency-Key": idempotencyKey.current } }
      );

      if (data.data.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        router.push(`/don-hang/${data.data.order_number}`);
      }
    } catch {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const subtotal = cart?.subtotal ?? 0;
  const discount = cart?.discount_amount ?? 0;
  const shipping = state.shippingFee ?? 0;
  const total = subtotal - discount + shipping;

  if (!cart || cart.total_items === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 mb-4">Giỏ hàng trống.</p>
        <Link href="/san-pham" className="btn-primary">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10 text-xs font-medium">
        {["Địa chỉ", "Giao hàng", "Thanh toán", "Xác nhận"].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              state.step > i + 1 ? "bg-green-500 text-white" :
              state.step === i + 1 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {state.step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={state.step === i + 1 ? "text-gray-900" : "text-gray-400"}>{label}</span>
            {i < 3 && <div className="flex-1 h-px bg-gray-200 min-w-8" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main form ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* STEP 1 — Address */}
          {state.step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Địa chỉ giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className="input-field col-span-2" placeholder="Họ và tên *" value={state.name}
                  onChange={e => set("name", e.target.value)} />
                <input className="input-field" placeholder="Số điện thoại *" value={state.phone}
                  onChange={e => set("phone", e.target.value)} />
                <select className="input-field" value={state.city}
                  onChange={e => set("city", e.target.value)}>
                  <option value="">Tỉnh / Thành phố *</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="input-field" placeholder="Quận / Huyện *" value={state.district}
                  onChange={e => set("district", e.target.value)} />
                <input className="input-field" placeholder="Phường / Xã" value={state.ward}
                  onChange={e => set("ward", e.target.value)} />
                <input className="input-field col-span-2" placeholder="Số nhà, tên đường *" value={state.address}
                  onChange={e => set("address", e.target.value)} />
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!state.name || !state.phone || !state.city || !state.district || !state.address}
                  onClick={() => dispatch({ type: "NEXT" })}
                  className="btn-primary px-8 disabled:opacity-40"
                >
                  Tiếp tục →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery */}
          {state.step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="font-bold text-gray-900 text-lg">Phương thức giao hàng</h2>

              <div className="space-y-3">
                <label className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                  state.deliveryType === "standard" ? "border-gray-900 bg-gray-50" : "border-gray-100"
                }`}>
                  <input type="radio" name="delivery" value="standard" checked={state.deliveryType === "standard"}
                    onChange={() => set("deliveryType", "standard")} className="mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Giao tiêu chuẩn</p>
                    <p className="text-sm text-gray-500">24h nội thành HCM / 2–5 ngày tỉnh thành</p>
                  </div>
                </label>

                {state.city.toLowerCase().includes("hcm") || state.city.toLowerCase().includes("hồ chí minh") ? (
                  <label className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    state.deliveryType === "express" ? "border-amber-400 bg-amber-50" : "border-gray-100"
                  }`}>
                    <input type="radio" name="delivery" value="express" checked={state.deliveryType === "express"}
                      onChange={() => set("deliveryType", "express")} className="mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">🚀 Giao hỏa tốc</p>
                      <p className="text-sm text-gray-500">
                        Giao trong ngày {new Date().toLocaleDateString("vi-VN")} — Chỉ nội thành HCM
                      </p>
                    </div>
                  </label>
                ) : null}
              </div>

              {state.deliveryType === "standard" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Ngày nhận mong muốn (tùy chọn)</label>
                  <input type="date" className="input-field max-w-xs"
                    min={tomorrow}
                    value={state.requestedDate}
                    onChange={e => set("requestedDate", e.target.value)} />
                </div>
              )}

              {state.shippingFee !== null && (
                <p className="text-sm text-gray-600 font-medium">
                  Phí vận chuyển: {shippingLoading ? "Đang tính..." : formatPrice(state.shippingFee)}
                </p>
              )}

              {/* Gift message */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">🎁 Lời nhắn trên thiệp</label>
                <div className="relative">
                  <textarea className="input-field h-24 resize-none pr-16" maxLength={200} placeholder="Chúc mừng sinh nhật..."
                    value={state.giftMessage}
                    onChange={e => set("giftMessage", e.target.value)} />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400">{state.giftMessage.length}/200</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">📝 Ghi chú thêm</label>
                <input className="input-field" maxLength={100} placeholder="Ví dụ: Giao giờ hành chính (tùy chọn)"
                  value={state.customerNote}
                  onChange={e => set("customerNote", e.target.value)} />
              </div>

              <div className="flex justify-between">
                <button onClick={() => dispatch({ type: "BACK" })} className="text-gray-500 hover:text-gray-700 font-medium">← Quay lại</button>
                <button onClick={() => dispatch({ type: "NEXT" })} className="btn-primary px-8">Tiếp tục →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Payment */}
          {state.step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="font-bold text-gray-900 text-lg">Phương thức thanh toán</h2>

              <div className="space-y-3">
                {[
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
                  { value: "vnpay", label: "VNPay (QR / Thẻ / Ví)", icon: "🏦" },
                  { value: "momo", label: "Ví MoMo", icon: "💜" },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    state.paymentMethod === opt.value ? "border-gray-900 bg-gray-50" : "border-gray-100"
                  }`}>
                    <input type="radio" name="payment" value={opt.value}
                      checked={state.paymentMethod === opt.value}
                      onChange={() => set("paymentMethod", opt.value)} />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-medium text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between">
                <button onClick={() => dispatch({ type: "BACK" })} className="text-gray-500 hover:text-gray-700 font-medium">← Quay lại</button>
                <button onClick={() => dispatch({ type: "NEXT" })} className="btn-primary px-8">Xem lại đơn →</button>
              </div>
            </div>
          )}

          {/* STEP 4 — Confirm */}
          {state.step === 4 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Xác nhận đơn hàng</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Giao đến:</span> {state.name} — {state.phone}</p>
                <p>{state.address}, {state.ward}, {state.district}, {state.city}</p>
                <p><span className="font-medium">Giao hàng:</span> {state.deliveryType === "express" ? "🚀 Hỏa tốc" : "Tiêu chuẩn"}</p>
                {state.giftMessage && <p><span className="font-medium">Lời nhắn:</span> {state.giftMessage}</p>}
                <p><span className="font-medium">Thanh toán:</span> {{cod:"COD",vnpay:"VNPay",momo:"MoMo"}[state.paymentMethod]}</p>
              </div>

              <div className="flex justify-between pt-2">
                <button onClick={() => dispatch({ type: "BACK" })} className="text-gray-500 hover:text-gray-700 font-medium">← Quay lại</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="btn-primary px-10 disabled:opacity-50 text-base">
                  {submitting ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cart?.items.map(item => (
                <div key={item.product_id} className="flex gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900 whitespace-nowrap">{formatPrice(item.line_total)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{state.shippingFee !== null ? formatPrice(shipping) : "Chưa tính"}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Tổng cộng</span>
                <span>{formatPrice(state.shippingFee !== null ? total : subtotal - discount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
