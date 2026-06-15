"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatPrice";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import B2bPricingTable from "@/components/shop/B2bPricingTable";
import B2bQuoteModal from "@/components/B2bQuoteModal";
import ProductReviews from "@/components/ProductReviews";
import ProductCard from "@/components/shop/ProductCard";

const TABS = [
  { key: "desc", label: "Mô tả" },
  { key: "reviews", label: "Đánh giá" },
  { key: "info", label: "Vận chuyển" },
] as const;

type Tab = typeof TABS[number]["key"];

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("desc");
  const [showB2b, setShowB2b] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();
  const { add: addToast } = useToastStore();

  const inStock = product.stock_status === "in_stock";

  async function handleAddToCart() {
    setAdding(true);
    try {
      await addItem(product.id, qty);
      addToast("Đã thêm vào giỏ hàng", "success");
    } catch {
      addToast("Không thể thêm sản phẩm. Thử lại.", "error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-brand transition-colors">Sản phẩm</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-brand transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square bg-surface-alt overflow-hidden mb-3">
            {product.images[activeImg] ? (
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-muted text-sm">
                Chưa có ảnh
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Badge variant="muted">Hết hàng</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square bg-surface-alt overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-brand" : "border-transparent hover:border-border"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="20vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.is_customizable && <Badge variant="brand">Có thể tùy chỉnh</Badge>}
              {product.stock_status === "pre_order" && <Badge variant="muted">Pre-order</Badge>}
            </div>
            <h1 className="font-display text-3xl font-bold text-ink mb-2">{product.name}</h1>
            {product.reviews_summary && product.reviews_summary.total_count > 0 && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="text-amber-400">{"★".repeat(Math.round(product.reviews_summary.average_rating))}</span>
                <span>{product.reviews_summary.average_rating.toFixed(1)}</span>
                <span>({product.reviews_summary.total_count} đánh giá)</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold text-ink">{formatPrice(product.retail_price)}</p>
            {product.b2b_min_price && (
              <p className="text-sm text-ink-muted mt-1">B2B từ {formatPrice(product.b2b_min_price)}/sản phẩm</p>
            )}
          </div>

          {product.short_description && (
            <p className="text-ink-muted leading-relaxed">{product.short_description}</p>
          )}

          {/* Qty + Add to cart */}
          {inStock && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-sm">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-ink">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                  >
                    +
                  </button>
                </div>
                <Button onClick={handleAddToCart} loading={adding} className="flex-1">
                  Thêm vào giỏ
                </Button>
              </div>
              {product.is_customizable && (
                <Button variant="secondary" onClick={() => setShowB2b(true)} className="w-full">
                  Yêu cầu tùy chỉnh / Báo giá B2B
                </Button>
              )}
            </div>
          )}

          {/* B2B pricing table */}
          {product.b2b_price_tiers?.length > 0 && (
            <B2bPricingTable tiers={product.b2b_price_tiers} />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-16">
        {activeTab === "desc" && (
          <div
            className="prose max-w-none text-ink-muted"
            dangerouslySetInnerHTML={{ __html: product.description ?? "<p>Chưa có mô tả.</p>" }}
          />
        )}
        {activeTab === "reviews" && <ProductReviews slug={product.slug} summary={product.reviews_summary} />}
        {activeTab === "info" && (
          <div className="space-y-4 text-sm text-ink-muted max-w-lg">
            <p><strong className="text-ink">Giao hàng tiêu chuẩn:</strong> 3–5 ngày làm việc</p>
            <p><strong className="text-ink">Giao hàng nhanh:</strong> 1–2 ngày làm việc (+30.000đ)</p>
            <p><strong className="text-ink">Đóng gói:</strong> Hộp quà sang trọng, in thiệp miễn phí</p>
            <p><strong className="text-ink">Đổi trả:</strong> 7 ngày nếu lỗi do nhà sản xuất</p>
          </div>
        )}
      </div>

      {/* Related products */}
      {product.related_products && product.related_products.length > 0 && (
        <div>
          <h2 className="section-title mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {product.related_products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      <B2bQuoteModal open={showB2b} onClose={() => setShowB2b(false)} productName={product.name} />
    </div>
  );
}
