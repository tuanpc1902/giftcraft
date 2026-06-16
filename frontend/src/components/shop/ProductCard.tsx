import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/formatPrice";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, slug, retail_price, b2b_min_price, cover_image, stock_status, is_customizable } = product;
  const outOfStock = stock_status === "out_of_stock";

  return (
    <Link href={`/san-pham/${slug}`} className="group block card-hover rounded-sm">
      {/* Image */}
      <div className="relative aspect-square bg-surface-alt overflow-hidden mb-3 rounded-sm">
        {cover_image ? (
          <>
            <Image
              src={cover_image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.07] ${outOfStock ? "opacity-50" : ""}`}
            />
            {/* Hover overlay */}
            {!outOfStock && (
              <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-semibold tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  Xem chi tiết →
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted/30 text-5xl">
            🎁
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Badge variant="muted">Hết hàng</Badge>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {is_customizable && (
            <Badge variant="brand">Tùy chỉnh</Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 px-0.5 pb-1">
        <p className="text-sm text-ink font-medium leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200">
          {name}
        </p>
        <p className="text-sm font-bold text-ink">
          {formatPrice(retail_price)}
        </p>
        {b2b_min_price && (
          <p className="text-xs text-ink-muted">
            B2B từ {formatPrice(b2b_min_price)}
          </p>
        )}
      </div>
    </Link>
  );
}
