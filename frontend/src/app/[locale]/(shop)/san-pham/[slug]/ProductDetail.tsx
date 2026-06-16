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
import { MinusIcon, PlusIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/20/solid";

const TABS = [
  { key: "desc",    label: "Mô tả sản phẩm" },
  { key: "reviews", label: "Đánh giá" },
  { key: "info",    label: "Vận chuyển & Đổi trả" },
] as const;

type Tab = typeof TABS[number]["key"];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          n <= Math.round(rating)
            ? <StarSolid key={n} className="w-4 h-4 text-amber-400" />
            : <StarIcon key={n} className="w-4 h-4 text-border" />
        ))}
      </div>
      <span className="text-sm text-ink font-semibold">{rating.toFixed(1)}</span>
      <span className="text-sm text-ink-muted">({count} đánh giá)</span>
    </div>
  );
}

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
      addToast("Đã thêm vào giỏ hàng ✓", "success");
    } catch {
      addToast("Không thể thêm sản phẩm. Thử lại.", "error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-8 flex-wrap">
        <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
        <span className="opacity-40">/</span>
        <Link href="/san-pham" className="hover:text-brand transition-colors">Sản phẩm</Link>
        {product.category && (
          <>
            <span className="opacity-40">/</span>
            <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-brand transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="opacity-40">/</span>
        <span className="text-ink truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* ── Image gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square bg-surface-alt rounded-sm overflow-hidden group">
            {product.images[activeImg] ? (
              <Image
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover animate-fade-in"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-muted/30 text-6xl">🎁</div>
            )}

            {/* Stock overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Badge variant="muted">Hết hàng</Badge>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_customizable && <Badge variant="brand">Tùy chỉnh</Badge>}
              {product.stock_status === "pre_order" && <Badge variant="muted">Pre-order</Badge>}
            </div>

            {/* Image nav dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeImg === i ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square bg-surface-alt overflow-hidden rounded-sm border-2 transition-all duration-150 ${
                    activeImg === i
                      ? "border-brand scale-[1.04]"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="20vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="space-y-6">
          {/* Name + rating */}
          <div>
            <h1 className="font-display text-3xl font-bold text-ink mb-3 leading-tight">{product.name}</h1>
            {product.reviews_summary && product.reviews_summary.total_count > 0 && (
              <StarRating
                rating={product.reviews_summary.average_rating}
                count={product.reviews_summary.total_count}
              />
            )}
          </div>

          {/* Price */}
          <div className="pb-5 border-b border-border">
            <p className="font-display text-4xl font-bold text-ink">{formatPrice(product.retail_price)}</p>
            {product.b2b_min_price && (
              <p className="text-sm text-ink-muted mt-1.5">
                B2B từ <span className="font-semibold text-brand">{formatPrice(product.b2b_min_price)}</span>/sản phẩm
              </p>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-ink-muted leading-relaxed">{product.short_description}</p>
          )}

          {/* Qty + Add to cart */}
          {inStock ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {/* Qty selector */}
                <div className="flex items-center border border-border rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="w-10 h-11 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors disabled:opacity-30"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-ink border-x border-border h-11 flex items-center justify-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-11 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <Button onClick={handleAddToCart} loading={adding} className="flex-1 h-11">
                  Thêm vào giỏ
                </Button>
              </div>

              {product.is_customizable && (
                <Button variant="secondary" onClick={() => setShowB2b(true)} className="w-full h-11 text-sm">
                  Yêu cầu tùy chỉnh / Báo giá B2B →
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-surface-alt rounded-sm p-4 text-center text-sm text-ink-muted">
              Sản phẩm này hiện đã hết hàng. Vui lòng quay lại sau.
            </div>
          )}

          {/* B2B pricing table */}
          {product.b2b_price_tiers?.length > 0 && (
            <B2bPricingTable tiers={product.b2b_price_tiers} />
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: TruckIcon, label: "Giao hàng toàn quốc" },
              { icon: ShieldCheckIcon, label: "Đổi trả 7 ngày" },
              { icon: ArrowPathIcon, label: "Đóng gói cao cấp" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-surface-alt rounded-sm p-3 text-center">
                <Icon className="w-5 h-5 text-brand" />
                <span className="text-[10px] font-medium text-ink-muted leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
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

      <div className="mb-16 min-h-[200px]">
        {activeTab === "desc" && (
          <div
            className="prose prose-sm max-w-none text-ink-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description ?? "<p>Chưa có mô tả.</p>" }}
          />
        )}
        {activeTab === "reviews" && (
          <ProductReviews slug={product.slug} summary={product.reviews_summary} />
        )}
        {activeTab === "info" && (
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            {[
              { title: "Giao hàng tiêu chuẩn", body: "3–5 ngày làm việc trên toàn quốc" },
              { title: "Giao hàng nhanh",       body: "1–2 ngày làm việc, phụ thu 30.000đ" },
              { title: "Đóng gói",               body: "Hộp quà sang trọng, in thiệp chúc mừng miễn phí" },
              { title: "Đổi trả",                body: "7 ngày nếu lỗi do nhà sản xuất, đổi ngay sản phẩm mới" },
            ].map((item) => (
              <div key={item.title} className="bg-surface-alt rounded-sm p-5">
                <p className="font-semibold text-ink text-sm mb-1">{item.title}</p>
                <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Related products ── */}
      {product.related_products && product.related_products.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-2">✦ Có thể bạn thích</p>
              <h2 className="section-title">Sản phẩm liên quan</h2>
            </div>
            <Link href="/san-pham" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors hidden sm:block">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {product.related_products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile sticky CTA ── */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-sm border-t border-border px-4 py-3 flex items-center gap-3">
          <div>
            <p className="text-xs text-ink-muted leading-none mb-0.5 truncate max-w-[180px]">{product.name}</p>
            <p className="font-bold text-ink text-sm">{formatPrice(product.retail_price)}</p>
          </div>
          <Button onClick={handleAddToCart} loading={adding} className="flex-1 h-11 text-sm">
            Thêm vào giỏ
          </Button>
        </div>
      )}

      <B2bQuoteModal open={showB2b} onClose={() => setShowB2b(false)} productName={product.name} />
    </div>
  );
}
