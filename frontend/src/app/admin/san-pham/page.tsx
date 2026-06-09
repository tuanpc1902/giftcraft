"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?per_page=50")
      .then(r => setProducts(r.data.data?.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <button className="btn-primary text-sm px-4 py-2">+ Thêm sản phẩm</button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Sản phẩm</th>
                <th className="text-left px-4 py-3">Giá lẻ</th>
                <th className="text-left px-4 py-3">Giá B2B min</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(p.retail_price)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.b2b_min_price ? formatPrice(p.b2b_min_price) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.stock_status === "in_stock" ? "bg-green-100 text-green-700" :
                      p.stock_status === "pre_order" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {p.stock_status === "in_stock" ? "Còn hàng" : p.stock_status === "pre_order" ? "Pre-order" : "Hết hàng"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a href={`/san-pham/${p.slug}`} target="_blank"
                        className="text-xs text-blue-600 hover:underline">Xem</a>
                      <button className="text-xs text-gray-500 hover:text-gray-700">Sửa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
