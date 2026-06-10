"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatPrice";
import { useCartStore } from "@/store/cart";
import B2bQuoteModal from "@/components/B2bQuoteModal";
import ProductReviews from "@/components/ProductReviews";

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews">("desc");
  const [showB2b, setShowB2b] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const inStock = product.stock_status === "in_stock";

  async function handleAddToCart() {
    setAdding(true);
    try {
      await addItem(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <span>Trang chủ</span> / <span>{product.category?.name ?? "Sản phẩm"}</span> /{" "}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left: Image gallery ── */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            {product.images[activeImg] ? (
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-8xl">🎁</div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm">Tạm hết hàng</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-amber-400" : "border-transparent"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Info + Purchase ── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Rating */}
          {product.reviews_summary && product.reviews_summary.total_count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {"★".repeat(Math.round(product.reviews_summary.average_rating))}
                {"☆".repeat(5 - Math.round(product.reviews_summary.average_rating))}
              </div>
              <span className="text-sm text-gray-500">
                {product.reviews_summary.average_rating.toFixed(1)} ({product.reviews_summary.total_count} đánh giá)
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(product.retail_price)}</p>
          <p className="text-xs text-gray-400 mb-4">Đã gồm VAT</p>

          {/* Stock badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-6 ${
            inStock ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-gray-400"}`} />
            {inStock ? "Còn hàng" : "Tạm hết hàng"}
          </span>

          {inStock ? (
            <>
              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg font-bold transition-colors">−</button>
                  <span className="px-5 py-3 text-center w-14 font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 text-lg font-bold transition-colors">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {adding ? "Đang thêm..." : added ? "✓ Đã thêm!" : "Thêm vào giỏ hàng"}
                </button>
              </div>

              {/* B2B separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">Hoặc đặt hàng số lượng lớn</span>
                </div>
              </div>

              {/* B2B price tiers */}
              {product.b2b_price_tiers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bảng giá B2B</p>
                  <div className="grid grid-cols-5 gap-1">
                    {product.b2b_price_tiers.map((tier, i) => (
                      <div key={i} className="text-center bg-amber-50 rounded-xl p-2.5 border border-amber-100">
                        <p className="text-xs font-medium text-amber-800">{tier.qty_label}</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">{formatPrice(tier.price)}</p>
                        <p className="text-xs text-amber-600 font-semibold">-{tier.savings_percent}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowB2b(true)}
                className="w-full border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Yêu cầu tư vấn số lượng lớn
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">Sản phẩm tạm hết hàng. Đăng ký để nhận thông báo khi có hàng trở lại.</p>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50">
                Đăng ký nhận thông báo
              </button>
              <button onClick={() => setShowB2b(true)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700">
                Yêu cầu tư vấn
              </button>
            </div>
          )}

          {/* Policies */}
          <div className="mt-6 space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <p>📦 Giao hàng 24h nội thành / 2–5 ngày tỉnh thành</p>
            <p>💳 Thanh toán COD, VNPay, MoMo</p>
            <p>🔄 Đổi trả 7 ngày nếu lỗi sản phẩm</p>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Info / Reviews ── */}
      <div className="mt-14">
        <div className="flex border-b border-gray-200 gap-8">
          {[
            { key: "desc", label: "Mô tả" },
            { key: "info", label: "Thông tin thêm" },
            { key: "reviews", label: `Đánh giá (${product.reviews_summary?.total_count ?? 0})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "desc" | "info" | "reviews")}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === "desc" && (
            <div className="prose prose-gray max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description ?? product.short_description ?? "Chưa có mô tả."}
            </div>
          )}
          {activeTab === "info" && (
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><dt className="text-gray-400">SKU</dt><dd className="font-medium">{product.slug}</dd></div>
              <div><dt className="text-gray-400">Trọng lượng</dt><dd className="font-medium">{(product.weight_grams / 1000).toFixed(2)} kg</dd></div>
              <div><dt className="text-gray-400">Tùy chỉnh</dt><dd className="font-medium">{product.is_customizable ? "Có" : "Không"}</dd></div>
            </dl>
          )}
          {activeTab === "reviews" && (
            <ProductReviews slug={product.slug} />
          )}
        </div>
      </div>

      {/* ── Related products ── */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {product.related_products.map(p => (
              <a key={p.slug} href={`/san-pham/${p.slug}`} className="group block">
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-2">
                  {p.cover_image ? (
                    <Image src={p.cover_image} alt={p.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-4xl">🎁</div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors truncate">{p.name}</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(p.retail_price)}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {showB2b && (
        <B2bQuoteModal
          productSlug={product.slug}
          productName={product.name}
          onClose={() => setShowB2b(false)}
        />
      )}
    </div>
  );
}
