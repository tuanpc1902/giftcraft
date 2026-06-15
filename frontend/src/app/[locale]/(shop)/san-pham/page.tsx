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
          <select
            className="input-field w-auto text-sm"
            value={activeSort}
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
