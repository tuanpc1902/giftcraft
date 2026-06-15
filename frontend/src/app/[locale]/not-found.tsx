import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-display font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Không tìm thấy trang</h1>
      <p className="mt-2 text-ink-muted max-w-sm">
        Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary px-6 py-2.5 text-sm">
          Về trang chủ
        </Link>
        <Link href="/san-pham" className="btn-outline px-6 py-2.5 text-sm">
          Xem sản phẩm
        </Link>
      </div>
    </div>
  );
}
