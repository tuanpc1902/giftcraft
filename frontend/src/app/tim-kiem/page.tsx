import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function TimKiemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>}>
      <SearchResults />
    </Suspense>
  );
}
