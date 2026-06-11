"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { ProductListItem } from "@/types";

interface SearchMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [input, setInput] = useState(initialQ);
  const [results, setResults] = useState<ProductListItem[] | null>(null);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch when initialQ changes (URL-driven)
  useEffect(() => {
    inputRef.current?.focus();
    if (!initialQ.trim()) return;
    let active = true;
    api.get("/search", { params: { q: initialQ.trim(), page: 1, per_page: 20 } })
      .then(r => {
        if (!active) return;
        const d = r.data.data;
        setResults(d?.items ?? []);
        setMeta(d?.meta ?? null);
        setPage(1);
      })
      .catch(() => { if (active) setResults([]); });
    return () => { active = false; setResults(null); };
  }, [initialQ]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    router.replace(q ? `/tim-kiem?q=${encodeURIComponent(q)}` : "/tim-kiem");
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    api.get("/search", { params: { q: initialQ.trim(), page: next, per_page: 20 } })
      .then(r => {
        const d = r.data.data;
        setResults(prev => [...(prev ?? []), ...(d?.items ?? [])]);
        setMeta(d?.meta ?? null);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar — keyed so input resets when URL query changes */}
      <form key={initialQ} onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-10">
        <input
          ref={inputRef}
          type="search"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tìm sản phẩm... (vd: hộp quà, bút ký, túi vải)"
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary px-6 py-2.5 text-sm font-semibold flex-shrink-0">
          Tìm
        </button>
      </form>

      {/* State: empty query */}
      {!initialQ && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-2">Nhập từ khóa để tìm sản phẩm</p>
          <p className="text-sm">Ví dụ: hộp quà, bút kim loại, túi vải canvas...</p>
        </div>
      )}

      {/* State: loading */}
      {initialQ && results === null && (
        <div className="text-center py-24 text-gray-400">Đang tìm kiếm...</div>
      )}

      {/* State: no results */}
      {initialQ && results !== null && results.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg mb-2">Không tìm thấy kết quả cho &ldquo;{initialQ}&rdquo;</p>
          <p className="text-sm text-gray-400">Thử từ khóa khác hoặc xem toàn bộ sản phẩm</p>
          <Link href="/san-pham" className="inline-block mt-6 btn-primary px-6 py-2.5 text-sm">Xem tất cả sản phẩm</Link>
        </div>
      )}

      {/* Results */}
      {results !== null && results.length > 0 && (
        <>
          {meta && (
            <p className="text-sm text-gray-500 mb-6">
              Tìm thấy <span className="font-semibold text-gray-900">{meta.total}</span> sản phẩm cho &ldquo;{initialQ}&rdquo;
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="btn-outline px-8 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {loadingMore ? "Đang tải..." : "Xem thêm"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
