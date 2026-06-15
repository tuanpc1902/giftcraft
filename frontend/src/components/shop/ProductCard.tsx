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

  return (
    <Link href={`/san-pham/${slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-surface-alt overflow-hidden mb-3">
        {cover_image ? (
          <Image
            src={cover_image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted text-sm">
            Chưa có ảnh
          </div>
        )}
        {stock_status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="muted">Hết hàng</Badge>
          </div>
        )}
        {is_customizable && (
          <div className="absolute top-2 left-2">
            <Badge variant="brand">Tùy chỉnh</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-sm text-ink font-medium leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {name}
        </p>
        <p className="text-sm font-semibold text-ink">
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
