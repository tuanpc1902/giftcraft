"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/formatPrice";
import { getOrCreateSessionId } from "@/lib/session";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CartPage() {
  const { cart, fetch, updateItem, removeItem, applyVoucher, removeVoucher, loading } = useCartStore();
  const { add: addToast } = useToastStore();
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);

  useEffect(() => {
    getOrCreateSessionId();
    fetch();
  }, [fetch]);

  async function handleApplyVoucher() {
    if (!voucherInput.trim()) return;
    setVoucherLoading(true);
    try {
      await applyVoucher(voucherInput.trim().toUpperCase());
      setVoucherInput("");
      addToast("Áp dụng mã thành công!", "success");
    } catch {
      addToast("Mã không hợp lệ hoặc không áp dụng được.", "error");
    } finally {
      setVoucherLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-3 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Giỏ hàng</h1>

      {isEmpty ? (
        <div className="text-center py-20">
          <p className="text-ink-muted mb-6">Giỏ hàng trống</p>
          <Link href="/san-pham" className="btn-primary">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Item list */}
          <div className="divide-y divide-border">
            {cart.items.map((item) => (
              <div key={item.product_id} className="flex gap-4 py-5">
                <Link href={`/san-pham/${item.slug}`} className="relative w-20 h-20 bg-surface-alt flex-shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/san-pham/${item.slug}`} className="text-sm font-medium text-ink hover:text-brand line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-sm text-brand font-semibold mt-1">{formatPrice(item.retail_price)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-sm">
                      <button
                        onClick={() => updateItem(item.product_id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-ink-muted hover:text-brand transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-ink">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="border border-border rounded-sm p-5 space-y-4">
              <p className="font-semibold text-ink">Tóm tắt đơn hàng</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Tạm tính</span>
                  <span className="text-ink">{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-brand">
                    <span>Giảm giá</span>
                    <span>−{formatPrice(cart.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                  <span className="text-ink">Tổng cộng</span>
                  <span className="text-ink">{formatPrice(cart.subtotal - cart.discount_amount)}</span>
                </div>
              </div>

              {/* Voucher */}
              {cart.voucher ? (
                <div className="flex items-center justify-between bg-brand-light rounded-sm px-3 py-2">
                  <span className="text-sm font-medium text-brand">{cart.voucher.code}</span>
                  <button onClick={removeVoucher} className="text-xs text-ink-muted hover:text-brand">Xóa</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Mã giảm giá"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="flex-1 text-sm py-2"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleApplyVoucher}
                    loading={voucherLoading}
                    size="sm"
                  >
                    Áp dụng
                  </Button>
                </div>
              )}

              <Link href="/checkout" className="btn-primary w-full text-center block">
                Thanh toán
              </Link>
              <Link href="/san-pham" className="block text-center text-sm text-ink-muted hover:text-brand transition-colors">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
