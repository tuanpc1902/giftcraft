import Link from "next/link";
import Image from "next/image";
import { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductCard({ product }: { product: ProductListItem }) {
  const isOutOfStock = product.stock_status !== "in_stock";

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
        {product.cover_image ? (
          <Image
            src={product.cover_image}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? "opacity-50" : ""}`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl">🎁</div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full">Hết hàng</span>
          </div>
        )}
        {product.is_customizable && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded-full">
            Tùy chỉnh
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-amber-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-gray-700 font-bold">{formatPrice(product.retail_price)}</p>
      {product.b2b_min_price && (
        <p className="text-xs text-gray-400 mt-0.5">
          B2B từ {formatPrice(product.b2b_min_price)}
        </p>
      )}
    </Link>
  );
}
