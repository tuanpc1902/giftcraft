"use client";
import { useReducer, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/formatPrice";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface CheckoutState {
  step: 1 | 2 | 3 | 4;
  name: string; phone: string; address: string;
  ward: string; district: string; city: string;
  deliveryType: "standard" | "express";
  requestedDate: string; giftMessage: string; customerNote: string;
  shippingFee: number | null;
  paymentMethod: "cod" | "vnpay" | "momo";
  idempotencyKey: string;
}

const INIT: CheckoutState = {
  step: 1, name: "", phone: "", address: "",
  ward: "", district: "", city: "",
  deliveryType: "standard", requestedDate: "", giftMessage: "", customerNote: "",
  shippingFee: null, paymentMethod: "cod",
  idempotencyKey: crypto.randomUUID(),
};

function reducer(s: CheckoutState, patch: Partial<CheckoutState>) {
  return { ...s, ...patch };
}

const STEPS = ["Thông tin", "Vận chuyển", "Thanh toán", "Xác nhận"];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetch: fetchCart, clear } = useCartStore();
  const { user, init } = useAuthStore();
  const { add: addToast } = useToastStore();
  const [state, dispatch] = useReducer(reducer, INIT);
  const set = (patch: Partial<CheckoutState>) => dispatch(patch);
  const [loading, setLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => { init(); fetchCart(); }, [init, fetchCart]);
  useEffect(() => {
    if (user) set({ name: user.name ?? "", phone: "" });
  }, [user]);

  async function fetchShipping() {
    if (!state.city || !state.district) return;
    setShippingLoading(true);
    try {
      const { data } = await api.post("/shipping/calculate", {
        city: state.city, district: state.district,
        weight_grams: 500,
        delivery_type: state.deliveryType,
      });
      set({ shippingFee: data.data?.[state.deliveryType]?.fee ?? null });
    } catch { set({ shippingFee: null }); }
    finally { setShippingLoading(false); }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (state.step === 2) fetchShipping(); }, [state.step, state.deliveryType]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const { data } = await api.post(
        "/orders/checkout",
        {
          shipping_address: {
            name: state.name, phone: state.phone,
            address: state.address, ward: state.ward,
            district: state.district, city: state.city,
          },
          delivery_type: state.deliveryType,
          requested_delivery_date: state.requestedDate || null,
          gift_message: state.giftMessage || null,
          customer_note: state.customerNote || null,
          payment_method: state.paymentMethod,
        },
        { headers: { "Idempotency-Key": state.idempotencyKey } }
      );
      if (data.data?.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        await clear();
        router.push(`/don-hang/${data.data.order_number}`);
      }
    } catch {
      addToast("Đặt hàng thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  const subtotal = cart?.subtotal ?? 0;
  const discount = cart?.discount_amount ?? 0;
  const shipping = state.shippingFee ?? 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const active = state.step === num;
          const done = state.step > num;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done ? "bg-brand text-white" : active ? "bg-ink text-white" : "bg-border text-ink-muted"
              }`}>
                {done ? "✓" : num}
              </div>
              <span className={`text-sm hidden sm:block ${active ? "font-semibold text-ink" : "text-ink-muted"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Steps */}
        <div>
          {/* Step 1: Shipping info */}
          {state.step === 1 && (
            <div className="space-y-4">
              <h2 className="section-title mb-6">Thông tin giao hàng</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Họ tên *" required value={state.name} onChange={(e) => set({ name: e.target.value })} />
                <Input placeholder="Số điện thoại *" required type="tel" value={state.phone} onChange={(e) => set({ phone: e.target.value })} />
              </div>
              <Input placeholder="Địa chỉ *" required value={state.address} onChange={(e) => set({ address: e.target.value })} />
              <div className="grid grid-cols-3 gap-4">
                <Input placeholder="Phường/Xã" value={state.ward} onChange={(e) => set({ ward: e.target.value })} />
                <Input placeholder="Quận/Huyện *" required value={state.district} onChange={(e) => set({ district: e.target.value })} />
                <Input placeholder="Tỉnh/TP *" required value={state.city} onChange={(e) => set({ city: e.target.value })} />
              </div>
              <Button
                onClick={() => set({ step: 2 })}
                disabled={!state.name || !state.phone || !state.address || !state.district || !state.city}
                className="w-full mt-2"
              >
                Tiếp tục
              </Button>
            </div>
          )}

          {/* Step 2: Delivery */}
          {state.step === 2 && (
            <div className="space-y-4">
              <h2 className="section-title mb-6">Phương thức vận chuyển</h2>
              {(["standard", "express"] as const).map((type) => (
                <label key={type} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                  state.deliveryType === type ? "border-brand bg-brand-light" : "border-border hover:border-ink-muted"
                }`}>
                  <input
                    type="radio"
                    name="delivery"
                    value={type}
                    checked={state.deliveryType === type}
                    onChange={() => set({ deliveryType: type })}
                    className="accent-brand"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-ink">
                      {type === "standard" ? "Tiêu chuẩn (3–5 ngày)" : "Nhanh (1–2 ngày)"}
                    </p>
                    {shippingLoading ? (
                      <p className="text-sm text-ink-muted">Đang tính phí...</p>
                    ) : state.shippingFee !== null ? (
                      <p className="text-sm text-brand font-semibold">
                        {type === "express"
                          ? formatPrice((state.shippingFee ?? 0) + 30000)
                          : formatPrice(state.shippingFee ?? 0)}
                      </p>
                    ) : null}
                  </div>
                </label>
              ))}
              <Input placeholder="Ngày giao dự kiến (không bắt buộc)" type="date" value={state.requestedDate} onChange={(e) => set({ requestedDate: e.target.value })} />
              <Textarea placeholder="Lời nhắn trong thiệp quà (không bắt buộc)" rows={3} value={state.giftMessage} onChange={(e) => set({ giftMessage: e.target.value })} />
              <Textarea placeholder="Ghi chú cho người giao hàng (không bắt buộc)" rows={2} value={state.customerNote} onChange={(e) => set({ customerNote: e.target.value })} />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => set({ step: 1 })}>Quay lại</Button>
                <Button onClick={() => set({ step: 3 })} className="flex-1">Tiếp tục</Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {state.step === 3 && (
            <div className="space-y-4">
              <h2 className="section-title mb-6">Phương thức thanh toán</h2>
              {([
                { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                { value: "vnpay", label: "VNPay — ATM / Internet Banking / QR" },
                { value: "momo", label: "Ví MoMo" },
              ] as const).map((m) => (
                <label key={m.value} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                  state.paymentMethod === m.value ? "border-brand bg-brand-light" : "border-border hover:border-ink-muted"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={state.paymentMethod === m.value}
                    onChange={() => set({ paymentMethod: m.value })}
                    className="accent-brand"
                  />
                  <span className="font-medium text-ink">{m.label}</span>
                </label>
              ))}
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" onClick={() => set({ step: 2 })}>Quay lại</Button>
                <Button onClick={handleSubmit} loading={loading} className="flex-1">
                  Đặt hàng
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="border border-border rounded-sm p-5 space-y-3 h-fit">
          <p className="font-semibold text-ink">Đơn hàng ({cart?.total_items ?? 0} sản phẩm)</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand">
                <span>Giảm giá</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-muted">Vận chuyển</span>
              <span>{shipping > 0 ? formatPrice(shipping) : "—"}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span className="text-ink">Tổng cộng</span>
              <span className="text-brand">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
