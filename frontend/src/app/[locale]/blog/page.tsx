"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CATEGORIES = ["Tất cả", "Xu hướng quà tặng", "Bí quyết B2B", "Câu chuyện thương hiệu", "Hướng dẫn"];

const FEATURED_POST = {
  slug: "qua-tang-doanh-nghiep-2025",
  title: "Xu hướng quà tặng doanh nghiệp 2025: Cá nhân hóa lên ngôi",
  excerpt: "Thay vì hộp quà Tết đồng loạt, các doanh nghiệp hàng đầu đang đầu tư vào quà tặng được thiết kế riêng cho từng đối tác và nhân viên. Tìm hiểu tại sao xu hướng này đang bùng nổ.",
  category: "Xu hướng quà tặng",
  author: "Team GiftCraft",
  date: "15 tháng 11, 2025",
  readMins: 5,
  cover: "https://placehold.co/1200x600/1a1a2e/ffffff?text=Xu+h%C6%B0%E1%BB%9Bng+Qu%C3%A0+T%E1%BA%B7ng+2025",
};

const POSTS = [
  {
    slug: "chon-qua-tang-doi-tac",
    title: "Cách chọn quà tặng đối tác kinh doanh gây ấn tượng",
    excerpt: "5 tiêu chí quan trọng khi lựa chọn quà tặng doanh nghiệp phù hợp với văn hóa và giá trị thương hiệu.",
    category: "Bí quyết B2B",
    author: "Minh Tuấn",
    date: "10 tháng 11, 2025",
    readMins: 4,
  },
  {
    slug: "hop-qua-tet-doanh-nghiep",
    title: "Thiết kế hộp quà Tết doanh nghiệp: Từ ý tưởng đến sản phẩm",
    excerpt: "Quy trình 4 bước để tạo ra bộ quà Tết đẳng cấp mang thương hiệu riêng — từ chọn sản phẩm đến in ấn và đóng gói.",
    category: "Hướng dẫn",
    author: "Team GiftCraft",
    date: "5 tháng 11, 2025",
    readMins: 6,
  },
  {
    slug: "vingroup-fpt-qua-tang",
    title: "Câu chuyện: Vingroup chọn GiftCraft cho 500 bộ quà cuối năm",
    excerpt: "Đằng sau dự án 500 bộ quà tặng nhân viên Vingroup — hành trình thiết kế, thử nghiệm và sản xuất trong 2 tuần.",
    category: "Câu chuyện thương hiệu",
    author: "Lan Anh",
    date: "28 tháng 10, 2025",
    readMins: 7,
  },
  {
    slug: "qua-tang-eco-friendly",
    title: "Quà tặng thân thiện môi trường: Xu hướng không thể bỏ qua năm 2025",
    excerpt: "Bamboo, tái chế, hữu cơ — các vật liệu bền vững đang trở thành lựa chọn ưu tiên của doanh nghiệp hiện đại.",
    category: "Xu hướng quà tặng",
    author: "Hải Yến",
    date: "20 tháng 10, 2025",
    readMins: 3,
  },
  {
    slug: "b2b-pricing-guide",
    title: "Bảng giá B2B GiftCraft: Tiết kiệm đến 30% từ đơn 20 sản phẩm",
    excerpt: "Tất cả những gì bạn cần biết về bảng giá 5-tier của GiftCraft — từ cách tính đến tối ưu hóa ngân sách dự án.",
    category: "Bí quyết B2B",
    author: "Team GiftCraft",
    date: "15 tháng 10, 2025",
    readMins: 5,
  },
  {
    slug: "qua-tang-trung-thu-2025",
    title: "Ý tưởng quà tặng Trung Thu doanh nghiệp 2025: Vượt ra ngoài bánh trung thu",
    excerpt: "Những bộ quà Trung Thu sáng tạo kết hợp bánh truyền thống với sản phẩm handcraft cao cấp đang được ưa chuộng nhất.",
    category: "Xu hướng quà tặng",
    author: "Minh Tuấn",
    date: "5 tháng 10, 2025",
    readMins: 4,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Xu hướng quà tặng": "🎁",
  "Bí quyết B2B": "💼",
  "Câu chuyện thương hiệu": "✨",
};

export default function BlogPage() {
  const t = useTranslations("blog");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const visiblePosts = activeCategory === "Tất cả"
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-block bg-brand-light text-brand text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-sm mb-4">
              Blog
            </span>
            <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
            <p className="text-ink-muted leading-relaxed">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
                activeCategory === c
                  ? "bg-ink text-white border-ink"
                  : "border-border text-ink-muted hover:bg-surface-alt"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <Link href={`/blog/${FEATURED_POST.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-surface-alt rounded-sm p-6 sm:p-8 hover:bg-surface-alt transition-colors">
              <div className="relative aspect-video rounded-sm overflow-hidden bg-surface-alt">
                <Image
                  src={FEATURED_POST.cover}
                  alt={FEATURED_POST.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <span className="inline-block bg-brand-light text-brand text-xs font-semibold px-2.5 py-1 rounded-sm mb-3">
                  {FEATURED_POST.category}
                </span>
                <h2 className="text-2xl font-bold text-ink mb-3 group-hover:text-brand transition-colors">
                  {FEATURED_POST.title}
                </h2>
                <p className="text-ink-muted leading-relaxed mb-5">{FEATURED_POST.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-ink-muted">
                  <span>{FEATURED_POST.author}</span>
                  <span>·</span>
                  <span>{FEATURED_POST.date}</span>
                  <span>·</span>
                  <span>{t("readMinutes", { n: FEATURED_POST.readMins })}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white border border-border rounded-sm overflow-hidden hover:border-border hover:shadow-md transition-all h-full flex flex-col">
                <div className="aspect-video bg-linear-to-br from-surface-alt to-border flex items-center justify-center">
                  <span className="text-4xl opacity-50">
                    {CATEGORY_ICONS[post.category] ?? "📖"}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="inline-block text-xs font-semibold text-brand mb-2">{post.category}</span>
                  <h3 className="font-bold text-ink mb-2 group-hover:text-brand transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-ink-muted mt-auto">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{t("readMinutes", { n: post.readMins })}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-ink text-white rounded-sm px-8 py-12 text-center">
          <p className="text-3xl mb-3">📬</p>
          <h2 className="text-2xl font-bold mb-3">{t("newsletter")}</h2>
          <p className="text-ink-muted mb-6 max-w-md mx-auto">{t("newsletterDesc")}</p>
          {subscribed ? (
            <p className="text-brand font-semibold">{t("subscribeSuccess")}</p>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={e => { e.preventDefault(); setSubscribed(true); setNewsletterEmail(""); }}
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder={t("newsletterPlaceholder")}
              />
              <button type="submit" className="bg-brand text-white font-bold py-3 px-6 rounded-sm hover:bg-brand-light transition-colors text-sm whitespace-nowrap">
                {t("subscribe")} →
              </button>
            </form>
          )}
          <p className="text-xs text-ink-muted mt-3">{t("subscribeNote")}</p>
        </div>
      </div>
    </div>
  );
}
