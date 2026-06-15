"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

const CATEGORIES = ["Tất cả", "Xu hướng quà tặng", "Bí quyết B2B", "Câu chuyện thương hiệu", "Hướng dẫn"];

interface BlogListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string;
  read_minutes: number;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function PostSkeleton() {
  return (
    <div className="border border-border rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-video bg-surface-alt" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-surface-alt rounded-sm" />
        <div className="h-4 w-full bg-surface-alt rounded-sm" />
        <div className="h-4 w-3/4 bg-surface-alt rounded-sm" />
        <div className="h-3 w-1/2 bg-surface-alt rounded-sm mt-4" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get("/blog", { params: { per_page: 20 } })
      .then(r => setPosts(r.data.data?.items ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0] ?? null;
  const gridPosts = posts.slice(1);

  const visiblePosts = activeCategory === "Tất cả"
    ? gridPosts
    : gridPosts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-block bg-brand-light text-brand text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-sm mb-4">
              Blog
            </span>
            <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
            <p className="text-white/60 leading-relaxed">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
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

        {/* Featured post */}
        {loading ? (
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-surface-alt rounded-sm p-6 sm:p-8 animate-pulse">
            <div className="aspect-video bg-border rounded-sm" />
            <div className="space-y-4">
              <div className="h-4 w-28 bg-border rounded-sm" />
              <div className="h-6 w-full bg-border rounded-sm" />
              <div className="h-6 w-4/5 bg-border rounded-sm" />
              <div className="h-4 w-full bg-border rounded-sm" />
              <div className="h-4 w-3/4 bg-border rounded-sm" />
            </div>
          </div>
        ) : featured && activeCategory === "Tất cả" ? (
          <div className="mb-12">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-surface-alt rounded-sm p-6 sm:p-8 hover:bg-surface-alt transition-colors">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-border">
                  {featured.cover_image ? (
                    <Image
                      src={featured.cover_image}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-alt flex items-center justify-center text-4xl opacity-40">🎁</div>
                  )}
                </div>
                <div>
                  <span className="inline-block bg-brand-light text-brand text-xs font-semibold px-2.5 py-1 rounded-sm mb-3">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-ink mb-3 group-hover:text-brand transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-ink-muted leading-relaxed mb-5">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-ink-muted">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{formatDate(featured.published_at)}</span>
                    <span>·</span>
                    <span>{t("readMinutes", { n: featured.read_minutes })}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : null}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-20 text-ink-muted">
            <p className="text-5xl mb-4">📝</p>
            <p className="font-medium">Chưa có bài viết trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white border border-border rounded-sm overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
                  <div className="relative aspect-video bg-surface-alt overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">📖</div>
                    )}
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
                      <span>{formatDate(post.published_at)}</span>
                      <span>·</span>
                      <span>{t("readMinutes", { n: post.read_minutes })}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-ink text-white rounded-sm px-8 py-12 text-center">
          <p className="text-3xl mb-3">📬</p>
          <h2 className="text-2xl font-bold mb-3">{t("newsletter")}</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">{t("newsletterDesc")}</p>
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
              <button type="submit" className="bg-brand text-white font-bold py-3 px-6 rounded-sm hover:bg-brand-dark transition-colors text-sm whitespace-nowrap">
                {t("subscribe")} →
              </button>
            </form>
          )}
          <p className="text-xs text-white/40 mt-3">{t("subscribeNote")}</p>
        </div>
      </div>
    </div>
  );
}
