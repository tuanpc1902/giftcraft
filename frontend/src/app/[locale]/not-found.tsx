import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Large decorative number */}
      <div className="relative select-none mb-6">
        <p className="font-display text-[120px] sm:text-[160px] font-bold text-border leading-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl animate-float">🎁</span>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-ink mb-3">
        Trang không tìm thấy
      </h1>
      <p className="text-ink-muted max-w-sm leading-relaxed mb-8">
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy thử tìm kiếm hoặc quay về trang chủ.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary text-sm">
          Về trang chủ
        </Link>
        <Link href="/san-pham" className="btn-secondary text-sm">
          Xem sản phẩm
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-12 text-sm text-ink-muted">
        <p className="mb-3 font-medium">Có thể bạn đang tìm:</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
          {[
            { href: "/qua-tang-doanh-nghiep", label: "Quà doanh nghiệp" },
            { href: "/forfolio", label: "Portfolio" },
            { href: "/gift-finder", label: "Tìm quà" },
            { href: "/blog", label: "Blog" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-brand hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
