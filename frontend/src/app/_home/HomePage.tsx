import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ProductCard from "@/components/ProductCard";
import { ProductListItem } from "@/types";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getFeaturedProducts(): Promise<ProductListItem[]> {
  try {
    const res = await fetch(`${API}/products?per_page=8`, { next: { revalidate: 900 } });
    const json = await res.json();
    return json.data?.items ?? [];
  } catch { return []; }
}

const OCCASIONS = [
  { key: "tet", icon: "🏮", slug: "tet" },
  { key: "sinhNhat", icon: "🎂", slug: "sinh-nhat" },
  { key: "cuoiHoi", icon: "💍", slug: "cuoi-hoi" },
  { key: "khaiTruong", icon: "🎊", slug: "khai-truong" },
  { key: "triAn", icon: "🙏", slug: "tri-an" },
  { key: "trungThu", icon: "🌕", slug: "trung-thu" },
] as const;

const STATS =[["500+", "stat1"], ["50.000+", "stat2"], ["24h", "stat3"], ["-30%", "stat4"]] as const;

export default async function HomePage() {
  const [products, t] = await Promise.all([
    getFeaturedProducts(),
    getTranslations("home"),
  ]);

  const WHY_US = [
    { icon: "🎨", title: t("whyCustom"), desc: t("whyCustomDesc") },
    { icon: "📦", title: t("whyDelivery"), desc: t("whyDeliveryDesc") },
    { icon: "💼", title: t("whyB2B"), desc: t("whyB2BDesc") },
    { icon: "✅", title: t("whyQuality"), desc: t("whyQualityDesc") },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              {t("badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("heroTitle")}<br /><span className="text-amber-400">{t("heroHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">{t("heroDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/san-pham" className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold py-4 px-8 rounded-2xl hover:bg-amber-300 transition-colors">
                {t("exploreBtn")}
              </Link>
              <Link href="/bat-dau-du-an-moi" className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/10 transition-colors">
                {t("b2bQuoteBtn")}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-[180px] opacity-10 select-none">🎁</div>
      </section>

      {/* Occasions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("occasionsTitle")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {OCCASIONS.map(o => (
            <Link key={o.slug} href={`/san-pham?occasion=${o.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-red-50 transition-colors group">
              <span className="text-3xl">{o.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-red-700 text-center">
                {t(`occasions.${o.key}`)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("featuredTitle")}</h2>
            <Link href="/san-pham" className="text-sm font-semibold hover:underline" style={{ color: "var(--color-brand)" }}>
              {t("b2bLearnMore") === "Tìm hiểu thêm" ? "Xem tất cả →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      {/* B2B banner */}
      <section className="text-white" style={{ backgroundColor: "var(--color-brand-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {t("b2bBadge")}
              </span>
              <h2 className="text-3xl font-bold mb-4 whitespace-pre-line">{t("b2bTitle")}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{t("b2bDesc")}</p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/qua-tang-doanh-nghiep" className="font-bold py-3 px-6 rounded-xl transition-colors text-sm" style={{ backgroundColor: "var(--color-gold-mid)", color: "#fff" }}>
                  {t("b2bLearnMore")}
                </Link>
                <Link href="/bat-dau-du-an-moi" className="border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors text-sm">
                  {t("b2bStartProject")}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(([n, key]) => (
                <div key={n} className="bg-white/5 rounded-2xl p-4">
                  <p className="text-2xl font-bold text-amber-400">{n}</p>
                  <p className="text-gray-400 text-sm mt-1">{t(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">{t("whyTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map(item => (
            <div key={item.title} className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
