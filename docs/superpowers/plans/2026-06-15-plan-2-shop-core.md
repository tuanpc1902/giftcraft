# GiftCraft Rewrite — Plan 2: Shop Core

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite toàn bộ shop pages — Product list, Product detail, Cart, Checkout, Order detail — theo design system mới từ Plan 1. Giữ nguyên 100% business logic và API calls.

**Architecture:** Server Components cho product list/detail (ISR), Client Components cho cart/checkout/order. Tất cả business logic (cart store, api.ts, types) giữ nguyên. Chỉ thay UI layer.

**Tech Stack:** Next.js 16.2, Tailwind v4, components/ui từ Plan 1, @heroicons/react 2, Zustand cart store

**Prerequisite:** Plan 1 hoàn tất (design system + Header/Footer + ProductCard có sẵn).

---

## File Map

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/app/[locale]/(shop)/san-pham/page.tsx` | Rewrite | Product list — Server Component + client filters |
| `frontend/src/app/[locale]/(shop)/san-pham/MobileFilterToggle.tsx` | Rewrite | Mobile filter toggle button |
| `frontend/src/app/[locale]/(shop)/san-pham/[slug]/page.tsx` | Keep | ISR wrapper — không đổi |
| `frontend/src/app/[locale]/(shop)/san-pham/[slug]/ProductDetail.tsx` | Rewrite | Client — gallery, info, B2B table, cart, reviews |
| `frontend/src/components/shop/B2bPricingTable.tsx` | Create | B2B 5-tier pricing table |
| `frontend/src/components/shop/ProductTabs.tsx` | Create | Tab: Mô tả / Đánh giá / Vận chuyển |
| `frontend/src/components/shop/RelatedProducts.tsx` | Create | Grid 4 sản phẩm liên quan |
| `frontend/src/components/ProductReviews.tsx` | Rewrite | Review list + rating distribution |
| `frontend/src/components/B2bQuoteModal.tsx` | Rewrite | B2B modal — dùng Modal từ ui/ |
| `frontend/src/app/[locale]/(shop)/gio-hang/page.tsx` | Rewrite | Cart page |
| `frontend/src/app/[locale]/(shop)/checkout/page.tsx` | Rewrite | Checkout 4-step |
| `frontend/src/app/[locale]/(shop)/don-hang/[orderNumber]/page.tsx` | Rewrite | Order detail + payment polling |

---

## Task 1: Product List Page

**Files:**
- Rewrite: `frontend/src/app/[locale]/(shop)/san-pham/page.tsx`
- Rewrite: `frontend/src/app/[locale]/(shop)/san-pham/MobileFilterToggle.tsx`

- [ ] **Step 1: Rewrite MobileFilterToggle.tsx**

```tsx
// frontend/src/app/[locale]/(shop)/san-pham/MobileFilterToggle.tsx
"use client";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function MobileFilterToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-ink border border-border rounded-sm px-4 py-2 hover:border-brand hover:text-brand transition-colors lg:hidden"
    >
      <FunnelIcon className="w-4 h-4" />
      Bộ lọc
    </button>
  );
}
```

- [ ] **Step 2: Rewrite product list page**

```tsx
// frontend/src/app/[locale]/(shop)/san-pham/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Category, ProductListItem } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import { SkeletonCard } from "@/components/ui/Skeleton";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

interface Pagination { current_page: number; last_page: number; total: number; }

async function getProducts(params: Record<string, string>): Promise<{ items: ProductListItem[]; meta: Pagination }> {
  const qs = new URLSearchParams({ per_page: "20", ...params }).toString();
  try {
    const res = await fetch(`${API}/products?${qs}`, { next: { revalidate: 300, tags: ["products"] } });
    const json = await res.json();
    return { items: json.data?.items ?? [], meta: json.data?.meta ?? { current_page: 1, last_page: 1, total: 0 } };
  } catch { return { items: [], meta: { current_page: 1, last_page: 1, total: 0 } }; }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 3600, tags: ["categories"] } });
    const json = await res.json();
    return json.data ?? [];
  } catch { return []; }
}

const OCCASIONS = [
  { label: "Tất cả", slug: "" },
  { label: "Quà Tết", slug: "tet" },
  { label: "Trung Thu", slug: "trung-thu" },
  { label: "Sinh nhật", slug: "sinh-nhat" },
  { label: "Khai trương", slug: "khai-truong" },
  { label: "Tri ân", slug: "tri-an" },
  { label: "Cưới hỏi", slug: "cuoi-hoi" },
];

const PRICE_RANGES = [
  { label: "Dưới 300k", max: "300000" },
  { label: "300k – 600k", min: "300000", max: "600000" },
  { label: "600k – 1 triệu", min: "600000", max: "1000000" },
  { label: "Trên 1 triệu", min: "1000000" },
];

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [{ items, meta }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const activeCategory = params.category ?? "";
  const activeOccasion = params.occasion ?? "";
  const activeSort = params.sort ?? "";

  function buildUrl(updates: Record<string, string | undefined>) {
    const p = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, v);
    });
    p.delete("page");
    return `/san-pham?${p.toString()}`;
  }

  const FilterSidebar = (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">Danh mục</p>
        <nav className="space-y-1">
          <Link
            href="/san-pham"
            className={`block px-3 py-2 text-sm rounded-sm transition-colors ${
              !activeCategory ? "bg-brand text-white font-semibold" : "text-ink-muted hover:text-brand"
            }`}
          >
            Tất cả
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildUrl({ category: cat.slug })}
              className={`block px-3 py-2 text-sm rounded-sm transition-colors ${
                activeCategory === cat.slug
                  ? "text-brand font-semibold bg-brand-light"
                  : "text-ink-muted hover:text-brand"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Occasions */}
      <div>
        <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">Dịp tặng</p>
        <div className="space-y-1">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              href={buildUrl({ occasion: o.slug })}
              className={`block px-3 py-2 text-sm rounded-sm transition-colors ${
                activeOccasion === o.slug
                  ? "text-brand font-semibold bg-brand-light"
                  : "text-ink-muted hover:text-brand"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-3">Khoảng giá</p>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const isActive = params.min_price === (r.min ?? "") && params.max_price === (r.max ?? "");
            return (
              <Link
                key={r.label}
                href={buildUrl({ min_price: r.min, max_price: r.max })}
                className={`block px-3 py-2 text-sm rounded-sm transition-colors ${
                  isActive ? "text-brand font-semibold bg-brand-light" : "text-ink-muted hover:text-brand"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Customizable */}
      <div>
        <Link
          href={buildUrl({ customizable: params.customizable ? "" : "1" })}
          className={`flex items-center gap-2 text-sm transition-colors ${
            params.customizable ? "text-brand font-semibold" : "text-ink-muted hover:text-brand"
          }`}
        >
          <span className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
            params.customizable ? "bg-brand border-brand" : "border-border"
          }`}>
            {params.customizable && <span className="text-white text-xs">✓</span>}
          </span>
          Chỉ hàng tùy chỉnh
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Sản phẩm</h1>
          <p className="text-sm text-ink-muted mt-1">{meta.total} sản phẩm</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            className="input-field w-auto text-sm"
            value={activeSort}
            onChange={(e) => {
              window.location.href = buildUrl({ sort: e.target.value });
            }}
          >
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        {/* Sidebar desktop */}
        <div className="hidden lg:block">{FilterSidebar}</div>

        {/* Product grid */}
        <div>
          {items.length === 0 ? (
            <div className="text-center py-20 text-ink-muted">
              <p className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</p>
              <Link href="/san-pham" className="text-sm text-brand hover:underline">
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={buildUrl({ page: String(page) })}
                  className={`w-9 h-9 flex items-center justify-center text-sm rounded-sm border transition-colors ${
                    meta.current_page === page
                      ? "bg-brand text-white border-brand"
                      : "border-border text-ink-muted hover:border-brand hover:text-brand"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "san-pham" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\[locale\]/\(shop\)/san-pham/page.tsx \
        frontend/src/app/\[locale\]/\(shop\)/san-pham/MobileFilterToggle.tsx
git commit -m "feat: rewrite product list page"
```

---

## Task 2: B2bPricingTable component

**Files:**
- Create: `frontend/src/components/shop/B2bPricingTable.tsx`

- [ ] **Step 1: Tạo B2bPricingTable**

```tsx
// frontend/src/components/shop/B2bPricingTable.tsx
import { B2bTier } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

export default function B2bPricingTable({ tiers }: { tiers: B2bTier[] }) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="bg-surface-alt px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-ink uppercase tracking-widest">
          Giá doanh nghiệp (B2B)
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2 text-xs text-ink-muted font-medium">Số lượng</th>
            <th className="text-right px-4 py-2 text-xs text-ink-muted font-medium">Đơn giá</th>
            <th className="text-right px-4 py-2 text-xs text-ink-muted font-medium">Tiết kiệm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tiers.map((tier, i) => (
            <tr key={i} className={i === 0 ? "bg-brand-light" : ""}>
              <td className={`px-4 py-3 font-medium ${i === 0 ? "text-brand" : "text-ink"}`}>
                {tier.qty_label}
              </td>
              <td className={`px-4 py-3 text-right font-semibold ${i === 0 ? "text-brand" : "text-ink"}`}>
                {formatPrice(tier.price)}
              </td>
              <td className="px-4 py-3 text-right text-ink-muted">
                {tier.savings_percent > 0 ? `-${tier.savings_percent}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/shop/B2bPricingTable.tsx
git commit -m "feat: add B2bPricingTable shop component"
```

---

## Task 3: ProductDetail rewrite

**Files:**
- Rewrite: `frontend/src/app/[locale]/(shop)/san-pham/[slug]/ProductDetail.tsx`

- [ ] **Step 1: Rewrite ProductDetail.tsx**

```tsx
// frontend/src/app/[locale]/(shop)/san-pham/[slug]/ProductDetail.tsx
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
        {activeTab === "reviews" && <ProductReviews productId={product.id} summary={product.reviews_summary} />}
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

      {/* B2B Quote Modal */}
      <B2bQuoteModal open={showB2b} onClose={() => setShowB2b(false)} productName={product.name} />
    </div>
  );
}
```

- [ ] **Step 2: Update B2bQuoteModal để nhận `productName` prop**

Trong `frontend/src/components/B2bQuoteModal.tsx`, thêm prop `productName?: string` và dùng `Modal` từ `components/ui/Modal`. Giữ nguyên form logic và API call.

```tsx
// frontend/src/components/B2bQuoteModal.tsx
"use client";
import { useState } from "react";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { useToastStore } from "@/store/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function B2bQuoteModal({ open, onClose, productName }: Props) {
  const { add: addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
    email: "",
    occasion: "",
    quantity_requested: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    custom_requirements: productName ? `Sản phẩm: ${productName}\n` : "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/b2b/quotes", {
        ...form,
        quantity_requested: Number(form.quantity_requested),
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
      });
      addToast("Yêu cầu đã được gửi! Chúng tôi sẽ liên hệ trong 24h.", "success");
      onClose();
    } catch {
      addToast("Gửi thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Báo giá B2B / Yêu cầu tùy chỉnh" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Tên công ty *" required value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
          <Input placeholder="Người liên hệ *" required value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Số điện thoại *" required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <Input placeholder="Email *" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Số lượng cần *" required type="number" min="20" value={form.quantity_requested} onChange={(e) => set("quantity_requested", e.target.value)} />
          <Input placeholder="Deadline (nếu có)" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Ngân sách tối thiểu" type="number" value={form.budget_min} onChange={(e) => set("budget_min", e.target.value)} />
          <Input placeholder="Ngân sách tối đa" type="number" value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} />
        </div>
        <Textarea
          placeholder="Yêu cầu tùy chỉnh (in logo, màu sắc, thiết kế...)"
          rows={4}
          value={form.custom_requirements}
          onChange={(e) => set("custom_requirements", e.target.value)}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">Gửi yêu cầu</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 3: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep -E "ProductDetail|B2bQuote" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\[locale\]/\(shop\)/san-pham/\[slug\]/ProductDetail.tsx \
        frontend/src/components/shop/B2bPricingTable.tsx \
        frontend/src/components/B2bQuoteModal.tsx
git commit -m "feat: rewrite ProductDetail, B2bPricingTable, B2bQuoteModal"
```

---

## Task 4: Cart Page

**Files:**
- Rewrite: `frontend/src/app/[locale]/(shop)/gio-hang/page.tsx`

- [ ] **Step 1: Rewrite Cart page**

```tsx
// frontend/src/app/[locale]/(shop)/gio-hang/page.tsx
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

              <Link href="/checkout" className="btn-primary w-full text-center">
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
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "gio-hang" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/\(shop\)/gio-hang/page.tsx
git commit -m "feat: rewrite cart page"
```

---

## Task 5: Checkout Page

**Files:**
- Rewrite: `frontend/src/app/[locale]/(shop)/checkout/page.tsx`

- [ ] **Step 1: Rewrite Checkout — giữ nguyên useReducer logic, thay UI**

```tsx
// frontend/src/app/[locale]/(shop)/checkout/page.tsx
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
import { Input, Textarea, Select } from "@/components/ui/Input";

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
        weight_grams: cart?.total_weight ?? 500,
        delivery_type: state.deliveryType,
      });
      set({ shippingFee: data.data?.[state.deliveryType]?.fee ?? null });
    } catch { set({ shippingFee: null }); }
    finally { setShippingLoading(false); }
  }

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
              {["standard", "express"].map((type) => (
                <label key={type} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                  state.deliveryType === type ? "border-brand bg-brand-light" : "border-border hover:border-ink-muted"
                }`}>
                  <input
                    type="radio"
                    name="delivery"
                    value={type}
                    checked={state.deliveryType === type as "standard" | "express"}
                    onChange={() => set({ deliveryType: type as "standard" | "express" })}
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
              {[
                { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                { value: "vnpay", label: "VNPay — ATM / Internet Banking / QR" },
                { value: "momo", label: "Ví MoMo" },
              ].map((m) => (
                <label key={m.value} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                  state.paymentMethod === m.value ? "border-brand bg-brand-light" : "border-border hover:border-ink-muted"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={state.paymentMethod === m.value as "cod" | "vnpay" | "momo"}
                    onChange={() => set({ paymentMethod: m.value as "cod" | "vnpay" | "momo" })}
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
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "checkout" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/\(shop\)/checkout/page.tsx
git commit -m "feat: rewrite checkout page"
```

---

## Task 6: Order Detail Page

**Files:**
- Rewrite: `frontend/src/app/[locale]/(shop)/don-hang/[orderNumber]/page.tsx`

- [ ] **Step 1: Rewrite Order detail — giữ nguyên polling logic**

```tsx
// frontend/src/app/[locale]/(shop)/don-hang/[orderNumber]/page.tsx
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
    fetchOrder();
    // Poll nếu đang chờ thanh toán
    const interval = setInterval(() => {
      if (order?.payment_status === "pending") fetchOrder();
    }, 3000);
    return () => clearInterval(interval);
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

      {/* Status timeline */}
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
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/\[locale\]/\(shop\)/don-hang/\[orderNumber\]/page.tsx
git commit -m "feat: rewrite order detail page"
```

---

## Task 7: Verify build

- [ ] **Step 1: Full type check**

```bash
cd frontend && npx tsc --noEmit 2>&1
```

Fix bất kỳ lỗi nào liên quan đến files trong Plan 2.

- [ ] **Step 2: Lint**

```bash
cd frontend && npm run lint 2>&1
```

- [ ] **Step 3: Build**

```bash
cd frontend && npm run build 2>&1 | tail -30
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: Plan 2 complete — shop core pages"
```

---

## Checklist hoàn thành Plan 2

- [ ] Product list page — filter, sort, pagination
- [ ] MobileFilterToggle
- [ ] B2bPricingTable component
- [ ] ProductDetail — gallery, info, tabs, B2B table, add to cart, related
- [ ] B2bQuoteModal — dùng ui/Modal, ui/Input
- [ ] Cart page — item list, qty update, voucher, summary
- [ ] Checkout page — 4 bước, useReducer, VNPay/MoMo/COD
- [ ] Order detail — status, items, polling
- [ ] `tsc --noEmit` pass
- [ ] `npm run build` pass

**Sau khi Plan 2 hoàn tất → tiếp tục Plan 3: Account, Admin & Remaining Pages**
