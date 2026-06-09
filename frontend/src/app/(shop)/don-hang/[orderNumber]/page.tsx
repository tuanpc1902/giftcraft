"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ thanh toán", color: "text-amber-600" },
  paid: { label: "Đã thanh toán", color: "text-green-600" },
  failed: { label: "Thanh toán thất bại", color: "text-red-500" },
  refunded: { label: "Đã hoàn tiền", color: "text-blue-500" },
};

function OrderContent() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/orders/${orderNumber}`);
        setOrder(data.data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderNumber]);

  // Poll for payment status (max 10 times, every 3s) when payment=success but status still pending
  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (paymentResult !== "success" || !order || order.payment_status === "paid") return;
    if (pollCount >= 10) return;

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/orders/${orderNumber}`);
        setOrder(data.data);
        setPollCount(c => c + 1);
      } catch {
        /* ignore */
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [order, orderNumber, searchParams, pollCount]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  const payment = PAYMENT_LABELS[order.payment_status] ?? { label: order.payment_status, color: "text-gray-500" };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">
          {order.payment_status === "paid" || order.payment_method === "cod" ? "🎉" : "⏳"}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {order.payment_method === "cod" ? "Đặt hàng thành công!" : "Cảm ơn bạn!"}
        </h1>
        <p className="text-gray-500 text-sm">Mã đơn hàng: <span className="font-mono font-semibold text-gray-800">{order.order_number}</span></p>
      </div>

      {/* Status timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Trạng thái đơn hàng</p>
            <p className="font-bold text-gray-900 text-lg">{STATUS_LABELS[order.status] ?? order.status}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Thanh toán</p>
            <p className={`font-semibold ${payment.color}`}>{payment.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["confirmed", "processing", "shipped", "delivered"].map((s, i) => {
            const done = ["confirmed", "processing", "shipped", "delivered"].indexOf(order.status) >= i;
            return (
              <div key={s} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${done ? "bg-green-500" : "bg-gray-200"}`} />
                <span className={`text-xs ${done ? "text-green-700 font-medium" : "text-gray-400"}`}>
                  {STATUS_LABELS[s]}
                </span>
                {i < 3 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-3">Thông tin giao hàng</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{order.shipping_address.name} — {order.shipping_address.phone}</p>
          <p>{order.shipping_address.address}, {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}</p>
          <p className="font-medium text-gray-700">
            {order.delivery_type === "express" ? "🚀 Giao hỏa tốc" : "📦 Giao tiêu chuẩn"}
            {order.requested_delivery_date && ` — Ngày nhận: ${order.requested_delivery_date}`}
          </p>
          {order.gift_message && (
            <p className="italic text-gray-500">🎁 &ldquo;{order.gift_message}&rdquo;</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">Sản phẩm</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-800">{item.product_snapshot.name}</p>
                <p className="text-gray-400">x{item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span><span>−{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <span>Phí vận chuyển</span><span>{formatPrice(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
            <span>Tổng cộng</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <Link href="/san-pham" className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-400 text-sm">Đang tải đơn hàng...</div>}>
      <OrderContent />
    </Suspense>
  );
}
