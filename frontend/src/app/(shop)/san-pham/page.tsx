import { Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Category, ProductListItem } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

interface Pagination { current_page: number; last_page: number; total: number; }

async function getProducts(params: Record<string, string>): Promise<{ items: ProductListItem[]; meta: Pagination }> {
  const qs = new URLSearchParams({ per_page: "20", ...params }).toString();
  try {
    const res = await fetch(`${API}/products?${qs}`, { next: { revalidate: 300 } });
    const json = await res.json();
    return { items: json.data?.items ?? [], meta: json.data?.meta ?? { current_page: 1, last_page: 1, total: 0 } };
  } catch { return { items: [], meta: { current_page: 1, last_page: 1, total: 0 } }; }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.data ?? [];
  } catch { return []; }
}

const SORT_OPTIONS = [
  { value: "", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
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
  const activeSort = params.sort ?? "";

  function buildUrl(updates: Record<string, string>) {
    const p = new URLSearchParams({ ...params, ...updates });
    if (!updates.category && activeCategory) p.set("category", activeCategory);
    if (!updates.sort && activeSort) p.set("sort", activeSort);
    p.delete("page"); // reset page on filter change
    return `/san-pham?${p.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-700">Sản phẩm</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar filter ── */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Danh mục</h2>
            <nav className="space-y-1">
              <Link href="/san-pham"
                className={`block px-3 py-2 rounded-xl text-sm transition-colors ${!activeCategory ? "bg-gray-900 text-white font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                Tất cả sản phẩm
              </Link>
              {categories.map(cat => (
                <div key={cat.slug}>
                  <Link href={buildUrl({ category: cat.slug })}
                    className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat.slug ? "bg-amber-100 text-amber-800" : "text-gray-700 hover:bg-gray-50"}`}>
                    {cat.name}
                  </Link>
                  {cat.children?.map(child => (
                    <Link key={child.slug} href={buildUrl({ category: child.slug })}
                      className={`block pl-6 pr-3 py-1.5 rounded-xl text-sm transition-colors ${activeCategory === child.slug ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            <div className="mt-8">
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Khoảng giá</h2>
              <div className="space-y-1.5">
                {[
                  { label: "Dưới 300.000đ", min: "", max: "300000" },
                  { label: "300k – 600k", min: "300000", max: "600000" },
                  { label: "600k – 1 triệu", min: "600000", max: "1000000" },
                  { label: "Trên 1 triệu", min: "1000000", max: "" },
                ].map(r => {
                  const isActive = params.min_price === r.min && params.max_price === r.max;
                  return (
                    <Link key={r.label}
                      href={buildUrl({ min_price: r.min, max_price: r.max })}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${isActive ? "bg-amber-100 text-amber-800 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                      {r.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <p className="text-sm text-gray-500">
              {meta.total} sản phẩm{activeCategory ? ` trong danh mục được chọn` : ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map(opt => (
                  <Link key={opt.value} href={buildUrl({ sort: opt.value })}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${activeSort === opt.value ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <Suspense fallback={<div className="text-center py-12 text-gray-400">Đang tải...</div>}>
            {items.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-4">Không tìm thấy sản phẩm nào.</p>
                <Link href="/san-pham" className="text-amber-600 hover:underline text-sm">Xem tất cả sản phẩm</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {items.map(p => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
                <Link key={page}
                  href={buildUrl({ page: page.toString() })}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${meta.current_page === page ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
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
