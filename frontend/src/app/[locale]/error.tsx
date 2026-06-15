"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-display font-bold text-brand">!</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Đã xảy ra lỗi</h1>
      <p className="mt-2 text-ink-muted max-w-sm">
        Có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary px-6 py-2.5 text-sm">
          Thử lại
        </button>
        <Link href="/" className="btn-outline px-6 py-2.5 text-sm">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
