import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PartnerMarquee from "@/components/ui/PartnerMarquee";

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

const PARTNERS = [
  "Vingroup", "FPT Telecom", "VinFast", "Techcombank",
  "Shopee", "Grab", "Vinamilk", "Masan",
];

const STATS = [
  { value: "500+", label: "Doanh nghiệp tin dùng" },
  { value: "24h", label: "Báo giá nhanh" },
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "63", label: "Tỉnh thành giao hàng" },
];

const PORTFOLIO_SEEDS = ["proj-vingroup", "proj-fpt", "proj-vinfast", "proj-tech", "proj-shopee", "proj-grab"];

const TESTIMONIALS = [
  {
    quote: "GiftCraft đã giúp chúng tôi tạo ấn tượng mạnh với đối tác trong dịp Tết. Chất lượng và đóng gói vượt kỳ vọng.",
    author: "Nguyễn Minh Tuấn",
    role: "Giám đốc Marketing, FPT Telecom",
    avatar: "https://picsum.photos/seed/avatar-1/80/80",
  },
  {
    quote: "Quy trình báo giá nhanh, đội ngũ tư vấn nhiệt tình. Chúng tôi đã đặt hàng cho 3 sự kiện lớn và đều rất hài lòng.",
    author: "Trần Thị Lan",
    role: "Trưởng phòng HR, Techcombank",
    avatar: "https://picsum.photos/seed/avatar-2/80/80",
  },
  {
    quote: "Sản phẩm tùy chỉnh in logo sắc nét, giao đúng hạn dù số lượng lớn. Sẽ tiếp tục hợp tác lâu dài.",
    author: "Phạm Đức Hưng",
    role: "CEO, Masan Consumer",
    avatar: "https://picsum.photos/seed/avatar-3/80/80",
  },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[560px] bg-ink overflow-hidden">
        <Image
          src="https://picsum.photos/seed/giftcraft-hero-2026/1920/1080"
          alt="GiftCraft Studio — Quà tặng cao cấp"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
            <p className="animate-fade-up text-xs font-semibold text-brand uppercase tracking-widest mb-5">
              ✦ Bộ sưu tập Tết 2026
            </p>
            <h1 className="animate-fade-up delay-75 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-2xl leading-tight">
              Quà tặng tinh tế,<br />giao đúng cảm xúc
            </h1>
            <p className="animate-fade-up delay-150 text-white/70 text-base mb-10 max-w-md leading-relaxed">
              Thiết kế riêng cho từng dịp — từ quà Tết cá nhân đến quà doanh nghiệp số lượng lớn.
            </p>
            <div className="animate-fade-up delay-225 flex flex-col sm:flex-row gap-3">
              <Link href="/san-pham" className="btn-primary text-sm px-7 py-3.5">
                Xem bộ sưu tập
              </Link>
              <Link
                href="/bat-dau-du-an-moi"
                className="btn-secondary text-sm px-7 py-3.5 border-white/30 text-white hover:bg-white/10"
              >
                Báo giá doanh nghiệp
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-8 hidden lg:flex flex-col items-center gap-1.5 text-white/30">
          <span className="text-[10px] tracking-widest uppercase rotate-90 mb-1">Scroll</span>
          <div className="w-px h-10 bg-white/20" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-border">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80} className="text-center px-4 first:pl-0">
                <p className="font-display text-2xl sm:text-3xl font-bold text-brand">{s.value}</p>
                <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Split ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Personal */}
          <Link href="/san-pham" className="group relative h-72 overflow-hidden block rounded-sm">
            <Image
              src="https://picsum.photos/seed/personal-gift-2026/800/600"
              alt="Quà cá nhân"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Tết · Trung Thu · Sinh nhật
              </p>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Quà cá nhân</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                Khám phá →
              </span>
            </div>
          </Link>

          {/* B2B */}
          <Link href="/qua-tang-doanh-nghiep" className="group relative h-72 overflow-hidden block rounded-sm">
            <Image
              src="https://picsum.photos/seed/b2b-gift-2026/800/600"
              alt="Quà doanh nghiệp"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-transparent" />
            <div className="absolute top-5 right-5">
              <span className="bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Báo giá 24h
              </span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-7">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                In logo · Số lượng lớn · Toàn quốc
              </p>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Quà doanh nghiệp</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                Tìm hiểu →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                href={`/san-pham?occasion=${o.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-sm text-ink-muted hover:border-brand hover:text-brand hover:bg-brand-light transition-all duration-200"
              >
                <span className="text-base leading-none">{o.icon}</span>
                <span className="font-medium whitespace-nowrap">{o.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-2">✦ Được yêu thích</p>
              <h2 className="section-title text-3xl">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/san-pham" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors hidden sm:block">
              Xem tất cả →
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/san-pham" className="btn-secondary text-sm">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </section>
      )}

      {/* ── Portfolio Gallery ── */}
      <section className="bg-surface-alt py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-2">✦ Đã thực hiện</p>
              <h2 className="section-title text-3xl">Dự án thực tế</h2>
            </div>
            <Link href="/forfolio" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors hidden sm:block">
              Xem portfolio →
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PORTFOLIO_SEEDS.map((seed, i) => (
              <ScrollReveal key={seed} delay={i * 70}>
                <Link
                  href="/forfolio"
                  className="group relative aspect-square bg-surface-alt overflow-hidden rounded-sm block"
                >
                  <Image
                    src={`https://picsum.photos/seed/${seed}/600/600`}
                    alt={`Dự án ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-start p-4">
                    <span className="text-white text-xs font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      Xem chi tiết →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal className="text-center mb-12">
          <p className="eyebrow mb-2">✦ Khách hàng nói gì</p>
          <h2 className="section-title text-3xl">Được tin tưởng bởi 500+ doanh nghiệp</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <blockquote className="bg-surface-alt rounded-sm p-7 flex flex-col gap-5 hover:shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] hover:-translate-y-0.5 transition-all duration-300 h-full">
                <p className="text-brand text-3xl font-display leading-none">&ldquo;</p>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{t.quote}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-border ring-2 ring-brand-light">
                    <Image src={t.avatar} alt={t.author} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.author}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </div>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Partner Logos Marquee ── */}
      <section className="border-y border-border py-10">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest text-center mb-7">
          Đối tác doanh nghiệp tin tưởng
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
          <PartnerMarquee />
        </div>
      </section>

      {/* ── B2B CTA Banner ── */}
      <section className="relative bg-ink text-white overflow-hidden">
        <Image
          src="https://picsum.photos/seed/b2b-cta-bg/1920/600"
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-5">
              ✦ Dành cho doanh nghiệp
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
              Quà tặng in logo,<br />số lượng lớn, giao đúng hạn
            </h2>
            <p className="text-white/60 mb-10 leading-relaxed max-w-sm">
              Phục vụ 500+ doanh nghiệp. Báo giá trong 24 giờ. Đóng gói cao cấp và giao hàng toàn quốc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm">
                Bắt đầu dự án →
              </Link>
              <Link href="/qua-tang-doanh-nghiep" className="btn-ghost text-white hover:text-brand text-sm">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
