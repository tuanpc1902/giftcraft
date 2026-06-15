"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/formatPrice";
import Badge from "@/components/ui/Badge";
import { SkeletonText } from "@/components/ui/Skeleton";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const PAYMENT_STATUS: Record<string, { label: string; variant: "brand" | "success" | "muted" }> = {
  pending: { label: "Chờ thanh toán", variant: "muted" },
  paid: { label: "Đã thanh toán", variant: "success" },
  failed: { label: "Thanh toán thất bại", variant: "brand" },
};

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOrder() {
    try {
      const { data } = await api.get(`/orders/${orderNumber}`);
      setOrder(data.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchOrder(); // eslint-disable-line react-hooks/set-state-in-effect
    const interval = setInterval(() => {
      if (order?.payment_status === "pending") fetchOrder();
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, order?.payment_status]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <SkeletonText lines={6} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-ink-muted mb-4">Không tìm thấy đơn hàng.</p>
        <Link href="/tai-khoan" className="btn-primary">Xem đơn hàng của tôi</Link>
      </div>
    );
  }

  const ps = PAYMENT_STATUS[order.payment_status] ?? PAYMENT_STATUS.pending;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-ink-muted uppercase tracking-widest mb-1">Đơn hàng</p>
          <h1 className="font-display text-2xl font-bold text-ink">{order.order_number}</h1>
        </div>
        <Badge variant={ps.variant}>{ps.label}</Badge>
      </div>

      {/* Status */}
      <div className="border border-border rounded-sm p-5 mb-6">
        <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-4">Trạng thái</p>
        <p className="text-sm font-semibold text-ink">{STATUS_LABEL[order.status] ?? order.status}</p>
        {order.payment_status === "pending" && (
          <p className="text-xs text-ink-muted mt-2">
            Đang chờ xác nhận thanh toán... Trang sẽ tự cập nhật.
          </p>
        )}
      </div>

      {/* Items */}
      <div className="border border-border rounded-sm divide-y divide-border mb-6">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-3 p-4">
            <div className="relative w-16 h-16 bg-surface-alt flex-shrink-0">
              {item.product_snapshot.image && (
                <Image src={item.product_snapshot.image} alt={item.product_snapshot.name} fill sizes="64px" className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{item.product_snapshot.name}</p>
              <p className="text-xs text-ink-muted mt-1">x{item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-ink">{formatPrice(item.total_price)}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border border-border rounded-sm p-5 space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Tạm tính</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount_amount > 0 && (
          <div className="flex justify-between text-sm text-brand">
            <span>Giảm giá</span>
            <span>−{formatPrice(order.discount_amount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Phí vận chuyển</span>
          <span>{formatPrice(order.shipping_fee)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
          <span className="text-ink">Tổng cộng</span>
          <span className="text-brand">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/tai-khoan" className="btn-secondary flex-1 text-center">Xem đơn hàng</Link>
        <Link href="/san-pham" className="btn-primary flex-1 text-center">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}
