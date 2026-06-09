import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductListItem } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getFeaturedProducts(): Promise<ProductListItem[]> {
  try {
    const res = await fetch(`${API}/products?per_page=8`, { next: { revalidate: 900 } });
    const json = await res.json();
    return json.data?.items ?? [];
  } catch { return []; }
}

const OCCASIONS = [
  { label: "Quà Tết", icon: "🏮", slug: "tet" },
  { label: "Sinh nhật", icon: "🎂", slug: "sinh-nhat" },
  { label: "Cưới hỏi", icon: "💍", slug: "cuoi-hoi" },
  { label: "Khai trương", icon: "🎊", slug: "khai-truong" },
  { label: "Tri ân", icon: "🙏", slug: "tri-an" },
  { label: "Trung Thu", icon: "🌕", slug: "trung-thu" },
];

const WHY_US = [
  { icon: "🎨", title: "Thiết kế riêng", desc: "In logo, khắc tên, màu sắc thương hiệu theo yêu cầu." },
  { icon: "📦", title: "Giao hàng tận nơi", desc: "24h nội thành HCM, 2–5 ngày toàn quốc. Hỏa tốc có sẵn." },
  { icon: "💼", title: "B2B chuyên nghiệp", desc: "Bảng giá 5 tier, báo giá 24h, theo dõi tiến độ real-time." },
  { icon: "✅", title: "Chất lượng cam kết", desc: "Đổi trả 7 ngày nếu lỗi. Hơn 500 doanh nghiệp tin tưởng." },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              Quà tặng cao cấp
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Mỗi món quà,<br /><span className="text-amber-400">một câu chuyện</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Quà tặng doanh nghiệp &amp; cá nhân được thiết kế riêng, đóng gói tỉ mỉ.
              Đặt từ 1 sản phẩm hay 1.000 bộ — chúng tôi đều xử lý được.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/san-pham" className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold py-4 px-8 rounded-2xl hover:bg-amber-300 transition-colors">
                Khám phá sản phẩm →
              </Link>
              <Link href="/bat-dau-du-an-moi" className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/10 transition-colors">
                Báo giá B2B
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-[180px] opacity-10 select-none">🎁</div>
      </section>

      {/* Occasions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Chọn theo dịp</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {OCCASIONS.map(o => (
            <Link key={o.slug} href={`/san-pham?occasion=${o.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-amber-50 transition-colors group">
              <span className="text-3xl">{o.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-amber-700 text-center">{o.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-sm font-medium text-amber-600 hover:text-amber-700">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      {/* B2B banner */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">Dành cho doanh nghiệp</span>
              <h2 className="text-3xl font-bold mb-4">Quà tặng doanh nghiệp<br />từ 20 sản phẩm</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">Bảng giá B2B 5 tier, tiết kiệm đến 30%. Báo giá trong 24h. Theo dõi tiến độ real-time.</p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/qua-tang-doanh-nghiep" className="bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-amber-300 transition-colors text-sm">Tìm hiểu thêm</Link>
                <Link href="/bat-dau-du-an-moi" className="border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-colors text-sm">Bắt đầu dự án →</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["500+","Doanh nghiệp tin tưởng"],["50.000+","Sản phẩm đã giao"],["24h","Thời gian báo giá"],["-30%","Tiết kiệm tối đa B2B"]].map(([n, label]) => (
                <div key={n} className="bg-white/5 rounded-2xl p-4">
                  <p className="text-2xl font-bold text-amber-400">{n}</p>
                  <p className="text-gray-400 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Tại sao chọn GiftCraft?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map(item => (
            <div key={item.title} className="text-center p-6">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Forfolio + Gift Finder CTAs */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Forfolio — Dự án thực tế</h2>
            <p className="text-gray-500 text-sm mb-6">Vingroup, FPT, Shopee và hàng trăm doanh nghiệp khác.</p>
            <Link href="/forfolio" className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors text-sm">
              Xem Forfolio →
            </Link>
          </div>
          <div className="text-center">
            <span className="text-4xl block mb-2">🎯</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa biết tặng gì?</h2>
            <p className="text-gray-500 text-sm mb-6">Trả lời 4 câu hỏi, nhận gợi ý phù hợp ngay.</p>
            <Link href="/gift-finder" className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-amber-300 transition-colors text-sm">
              Thử Gift Finder →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
