import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BlogPost } from "@/types";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: 300, tags: ["blog", `blog-${slug}`] } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "GiftCraft Studio",
      url: "https://giftcraft.vn",
    },
    datePublished: post.published_at,
    url: `https://giftcraft.vn/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-flex items-center gap-1">
          ← Quay lại Blog
        </Link>

        {/* Category + meta */}
        <div className="mt-4 mb-3">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.published_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}</span>
          <span>·</span>
          <span>{post.read_minutes} phút đọc</span>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {/* Footer CTA */}
        <div className="mt-14 border-t border-gray-100 pt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Bạn có dự án quà tặng cần tư vấn?</p>
          <Link
            href="/bat-dau-du-an-moi"
            className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Bắt đầu dự án →
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
