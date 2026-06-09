import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "./ProductDetail";
import { Product } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/products/${slug}`, {
      next: { revalidate: 3600, tags: [`product-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Product;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Sản phẩm không tồn tại" };

  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? undefined,
    openGraph: {
      title: product.meta_title ?? product.name,
      description: product.meta_description ?? product.short_description ?? undefined,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // JSON-LD Product schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    brand: { "@type": "Brand", name: "GiftCraft Studio" },
    offers: {
      "@type": "Offer",
      price: product.retail_price.toString(),
      priceCurrency: "VND",
      availability:
        product.stock_status === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.reviews_summary?.total_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.reviews_summary.average_rating.toFixed(1),
            reviewCount: product.reviews_summary.total_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
