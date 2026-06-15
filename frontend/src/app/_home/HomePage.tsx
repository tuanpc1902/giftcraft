import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getFeaturedProducts(): Promise<ProductListItem[]> {
  try {
    const res = await fetch(`${API}/products?per_page=8`, { next: { revalidate: 900 } });
    const json = await res.json();
    return json.data?.items ?? [];
  } catch { return []; }
}

const OCCASIONS = [
  { label: "Quà Tết", slug: "tet", icon: "🏮" },
  { label: "Trung Thu", slug: "trung-thu", icon: "🌕" },
  { label: "Sinh nhật", slug: "sinh-nhat", icon: "🎂" },
  { label: "Khai trương", slug: "khai-truong", icon: "🎊" },
  { label: "Tri ân", slug: "tri-an", icon: "🙏" },
  { label: "Cưới hỏi", slug: "cuoi-hoi", icon: "💍" },
] as const;

const PARTNERS = ["Tập đoàn ABC", "Vingroup", "FPT", "Masan", "Vinamilk", "MB Bank"];

const PORTFOLIO_IMAGES = Array.from({ length: 6 }, (_, i) =>
  `https://placehold.co/600x600/F9FAFB/6B7280?text=Project+${i + 1}`
);

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[75vh] min-h-[500px] bg-ink overflow-hidden">
        <Image
          src="https://placehold.co/1920x1080/111111/FFFFFF?text=GiftCraft+Hero"
          alt="GiftCraft Studio — Quà tặng cao cấp"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-4">
              Bộ sưu tập Tết 2026
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-2xl leading-tight">
              Quà tặng tinh tế,<br />giao đúng cảm xúc
            </h1>
            <p className="text-white/70 text-base mb-8 max-w-md">
              Thiết kế riêng cho từng dịp — từ quà Tết cá nhân đến quà doanh nghiệp số lượng lớn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/san-pham" className="btn-primary">
                Xem bộ sưu tập
              </Link>
              <Link href="/bat-dau-du-an-moi" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                Báo giá doanh nghiệp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Split ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/san-pham" className="group relative h-64 bg-surface-alt overflow-hidden block">
            <Image
              src="https://placehold.co/800x600/F9FAFB/6B7280?text=Qua+ca+nhan"
              alt="Quà cá nhân"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">
                Tết · Trung Thu · Sinh nhật
              </p>
              <h2 className="font-display text-2xl font-bold text-white">Quà cá nhân</h2>
            </div>
          </Link>
          <Link href="/qua-tang-doanh-nghiep" className="group relative h-64 bg-ink overflow-hidden block">
            <Image
              src="https://placehold.co/800x600/111111/FFFFFF?text=Qua+doanh+nghiep"
              alt="Quà doanh nghiệp"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                In logo · Số lượng lớn · Báo giá 24h
              </p>
              <h2 className="font-display text-2xl font-bold text-white">Quà doanh nghiệp</h2>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                href={`/san-pham?occasion=${o.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm text-ink-muted hover:border-brand hover:text-brand transition-colors"
              >
                <span>{o.icon}</span>
                <span className="font-medium">{o.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-sm text-brand hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Portfolio Gallery ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Dự án thực tế</h2>
          <Link href="/forfolio" className="text-sm text-brand hover:underline font-medium">
            Xem portfolio
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PORTFOLIO_IMAGES.map((src, i) => (
            <div key={i} className="relative aspect-square bg-surface-alt overflow-hidden group">
              <Image
                src={src}
                alt={`Portfolio ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Partner Logos ── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest text-center mb-8">
            Đối tác doanh nghiệp
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {PARTNERS.map((name) => (
              <div
                key={name}
                className="text-sm font-semibold text-ink-muted opacity-40 hover:opacity-70 transition-opacity"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B CTA Banner ── */}
      <section className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-4">
              Dành cho doanh nghiệp
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Quà tặng in logo,<br />số lượng lớn, giao đúng hạn
            </h2>
            <p className="text-white/60 mb-8">
              Phục vụ 500+ doanh nghiệp. Báo giá trong 24 giờ. Đóng gói và giao hàng toàn quốc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/bat-dau-du-an-moi" className="btn-primary">
                Bắt đầu dự án
              </Link>
              <Link href="/qua-tang-doanh-nghiep" className="btn-ghost text-white hover:text-brand">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
