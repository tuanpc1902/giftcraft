"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/formatPrice";
import { getOrCreateSessionId } from "@/lib/session";

export default function CartPage() {
  const { cart, fetch, updateItem, removeItem, applyVoucher, removeVoucher, loading } = useCartStore();
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  useEffect(() => {
    getOrCreateSessionId();
    fetch();
  }, [fetch]);

  async function handleApplyVoucher() {
    setVoucherLoading(true);
    setVoucherError("");
    try {
      await applyVoucher(voucherInput.trim().toUpperCase());
      setVoucherInput("");
    } catch {
      setVoucherError("Mã không hợp lệ hoặc không áp dụng được.");
    } finally {
      setVoucherLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse text-gray-300 text-4xl">🛒</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ để tiếp tục.</p>
        <Link href="/san-pham" className="btn-primary px-8">Khám phá sản phẩm</Link>
      </div>
    );
  }

  const subtotal = cart.subtotal;
  const discount = cart.discount_amount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Giỏ hàng ({cart.total_items} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Item list ── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.product_id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4">
              {/* Image */}
              <Link href={`/san-pham/${item.slug}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🎁</div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/san-pham/${item.slug}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition-colors truncate">{item.name}</h3>
                </Link>
                <p className="text-sm text-gray-400 mt-0.5">{formatPrice(item.retail_price)} / sản phẩm</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateItem(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-base font-bold transition-colors">
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-base font-bold transition-colors">
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">{formatPrice(item.line_total)}</p>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg">
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Voucher */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Mã giảm giá</h3>
            {cart.voucher ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div>
                  <span className="font-mono font-semibold text-green-700 text-sm">{cart.voucher.code}</span>
                  <p className="text-xs text-green-600 mt-0.5">Giảm {formatPrice(discount)}</p>
                </div>
                <button onClick={() => removeVoucher()} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Gỡ</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 uppercase text-sm"
                  placeholder="Nhập mã giảm giá"
                  value={voucherInput}
                  onChange={e => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleApplyVoucher()}
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={!voucherInput || voucherLoading}
                  className="px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 whitespace-nowrap">
                  {voucherLoading ? "..." : "Áp dụng"}
                </button>
              </div>
            )}
            {voucherError && <p className="text-red-500 text-xs mt-2">{voucherError}</p>}
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Tóm tắt</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({cart.total_items} sp)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Phí vận chuyển</span>
                <span>Tính lúc checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal - discount)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center text-base py-4">
              Thanh toán →
            </Link>
            <Link href="/san-pham" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors">
              Tiếp tục mua sắm
            </Link>

            {/* B2B upsell */}
            {cart.total_items >= 10 && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-700">
                  Cần {Math.max(0, 20 - cart.total_items)} sản phẩm nữa để đạt giá B2B tốt nhất!
                </p>
                <Link href="/bat-dau-du-an-moi" className="text-xs font-semibold text-amber-600 hover:underline mt-1 inline-block">
                  Xem giá B2B →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
