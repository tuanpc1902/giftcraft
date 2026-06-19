"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý", confirmed: "Đã xác nhận", processing: "Đang xử lý",
  shipped: "Đang giao", delivered: "Đã giao", cancelled: "Đã hủy",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-brand-light text-brand",
  confirmed: "bg-info-light text-info",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-success-light text-success",
  cancelled: "bg-surface-alt text-ink-muted",
};

function AdminOrdersInner() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (searchParams.get("delivery")) params.set("delivery_type", searchParams.get("delivery")!);
    api.get(`/admin/orders?${params}`)
      .then(r => { if (!cancelled) { setOrders(r.data.data?.items ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setOrders([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [searchParams]);

  async function updateStatus(orderId: string, status: string) {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    setOrders(os => os.map(o => o.order_number === orderId ? { ...o, status } : o));
    if (selectedOrder?.order_number === orderId) setSelectedOrder(o => o ? { ...o, status } : null);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <Link href="?delivery=express" className="text-xs border border-brand/30 text-brand px-3 py-1.5 rounded-sm hover:bg-brand-light">🚀 Hỏa tốc</Link>
          <Link href="/admin/don-hang" className="text-xs border border-border text-ink-muted px-3 py-1.5 rounded-sm hover:bg-surface-alt">Tất cả</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-muted">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">Chưa có đơn hàng nào.</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Đơn hàng</th>
                <th className="text-left px-4 py-3">Khách hàng</th>
                <th className="text-left px-4 py-3">Tổng tiền</th>
                <th className="text-left px-4 py-3">Giao hàng</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.order_number} className="hover:bg-surface-alt cursor-pointer"
                  onClick={() => setSelectedOrder(order)}>
                  <td className="px-4 py-3 font-mono text-xs text-ink">{order.order_number}</td>
                  <td className="px-4 py-3 text-ink">{order.shipping_address?.name ?? "Khách"}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    {order.delivery_type === "express" ? (
                      <span className="bg-brand-light text-brand text-xs font-bold px-2 py-1 rounded-full">🚀 HỎA TỐC</span>
                    ) : (
                      <span className="text-ink-muted text-xs">Tiêu chuẩn</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-surface-alt"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select className="text-xs border border-border rounded-sm px-2 py-1"
                      value={order.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(order.order_number, e.target.value)}>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Chi tiết đơn</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-ink-muted hover:text-ink-muted text-2xl">&times;</button>
            </div>
            <div className="space-y-3 text-sm text-ink-muted">
              <div><span className="font-medium">Mã đơn:</span> <span className="font-mono">{selectedOrder.order_number}</span></div>
              <div><span className="font-medium">Loại giao:</span> {selectedOrder.delivery_type === "express" ? "🚀 Hỏa tốc" : "Tiêu chuẩn"}</div>
              {selectedOrder.requested_delivery_date && (
                <div><span className="font-medium">Ngày giao:</span> {selectedOrder.requested_delivery_date}</div>
              )}
              {selectedOrder.gift_message && (
                <div><span className="font-medium">Lời nhắn thiệp:</span> <span className="italic">{selectedOrder.gift_message}</span></div>
              )}
              {selectedOrder.customer_note && (
                <div><span className="font-medium">Ghi chú:</span> {selectedOrder.customer_note}</div>
              )}
              <div className="border-t border-border pt-3">
                <span className="font-medium">Địa chỉ:</span>
                <p className="mt-1">{selectedOrder.shipping_address?.name} — {selectedOrder.shipping_address?.phone}</p>
                <p>{selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.district}, {selectedOrder.shipping_address?.city}</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-medium mb-2">Sản phẩm:</p>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.product_snapshot?.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.total_price)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 font-bold text-ink flex justify-between">
                <span>Tổng cộng</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
              <button onClick={() => window.print()}
                className="w-full border border-border text-ink py-2 rounded-sm text-sm font-medium hover:bg-surface-alt mt-2">
                🖨️ In phiếu giao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-12 text-center text-ink-muted">Đang tải...</div>}>
        <AdminOrdersInner />
      </Suspense>
    </AdminLayout>
  );
}
