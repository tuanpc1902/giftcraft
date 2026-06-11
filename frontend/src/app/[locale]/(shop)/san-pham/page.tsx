import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/ProductCard";
import MobileFilterToggle from "./MobileFilterToggle";
import { Category, ProductListItem } from "@/types";

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

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const [params, t] = await Promise.all([
    searchParams,
    getTranslations("products"),
  ]);
  const [{ items, meta }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const activeCategory = params.category ?? "";
  const activeSort = params.sort ?? "";

  const SORT_OPTIONS = [
    { value: "", label: t("sortDefault") },
    { value: "price_asc", label: t("sortPriceAsc") },
    { value: "price_desc", label: t("sortPriceDesc") },
  ];

  const PRICE_RANGES = [
    { label: t("priceUnder300"), min: "", max: "300000" },
    { label: t("price300to600"), min: "300000", max: "600000" },
    { label: t("price600to1m"), min: "600000", max: "1000000" },
    { label: t("priceOver1m"), min: "1000000", max: "" },
  ];

  function buildUrl(updates: Record<string, string>) {
    const p = new URLSearchParams({ ...params, ...updates });
    if (!updates.category && activeCategory) p.set("category", activeCategory);
    if (!updates.sort && activeSort) p.set("sort", activeSort);
    p.delete("page");
    return `/san-pham?${p.toString()}`;
  }

  const filterContent = (
    <>
      <nav className="space-y-1">
        <Link href="/san-pham"
          className={`block px-3 py-2 rounded-xl text-sm transition-colors ${!activeCategory ? "text-white font-medium" : "text-gray-600 hover:bg-red-50"}`}
          style={!activeCategory ? { backgroundColor: "var(--color-brand)" } : undefined}>
          {t("allCategories")}
        </Link>
        {categories.map(cat => (
          <div key={cat.slug}>
            <Link href={buildUrl({ category: cat.slug })}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat.slug ? "bg-red-50 font-semibold" : "text-gray-700 hover:bg-amber-50"}`}
              style={activeCategory === cat.slug ? { color: "var(--color-brand)" } : undefined}>
              {cat.name}
            </Link>
            {cat.children?.map(child => (
              <Link key={child.slug} href={buildUrl({ category: child.slug })}
                className={`block pl-6 pr-3 py-1.5 rounded-xl text-sm transition-colors ${activeCategory === child.slug ? "bg-red-50 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                style={activeCategory === child.slug ? { color: "var(--color-brand)" } : undefined}>
                {child.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-6">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">{t("priceRange")}</h2>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(r => {
            const isActive = params.min_price === r.min && params.max_price === r.max;
            return (
              <Link key={r.label}
                href={buildUrl({ min_price: r.min, max_price: r.max })}
                className={`block px-3 py-2 rounded-xl text-sm transition-colors ${isActive ? "bg-red-50 font-medium" : "text-gray-600 hover:bg-amber-50"}`}
                style={isActive ? { color: "var(--color-brand)" } : undefined}>
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">{t("breadcrumbHome")}</Link>
        <span>/</span>
        <span className="text-gray-700">{t("title")}</span>
      </div>

      <div className="flex items-center gap-2 mb-4 lg:hidden">
        <MobileFilterToggle filterContent={filterContent} />
        <div className="flex items-center gap-1 ml-auto">
          {SORT_OPTIONS.map(opt => (
            <Link key={opt.value} href={buildUrl({ sort: opt.value })}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${activeSort === opt.value ? "text-white" : "border border-gray-200 text-gray-600"}`}
              style={activeSort === opt.value ? { backgroundColor: "var(--color-brand)" } : undefined}>
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block lg:w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">{t("category")}</h2>
            {filterContent}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-6 gap-4">
            <p className="text-sm text-gray-500">
              {t("productCount", { count: meta.total })}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t("sort")}:</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map(opt => (
                  <Link key={opt.value} href={buildUrl({ sort: opt.value })}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${activeSort === opt.value ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-amber-50"}`}
                    style={activeSort === opt.value ? { backgroundColor: "var(--color-brand)" } : undefined}>
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4 lg:hidden">
            {t("productCount", { count: meta.total })}
          </p>

          <Suspense fallback={<div className="text-center py-12 text-gray-400">{t("loading")}</div>}>
            {items.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-4">{t("noProducts")}</p>
                <Link href="/san-pham" className="hover:underline text-sm" style={{ color: "var(--color-brand)" }}>{t("viewAll")}</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {items.map(p => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </Suspense>

          {meta.last_page > 1 && (
            <div className="flex justify-center flex-wrap gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
                <Link key={page}
                  href={buildUrl({ page: page.toString() })}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${meta.current_page === page ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-amber-50"}`}
                  style={meta.current_page === page ? { backgroundColor: "var(--color-brand)" } : undefined}>
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
