"use client";
import { FunnelIcon } from "@heroicons/react/24/outline";

export default function MobileFilterToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-ink border border-border rounded-sm px-4 py-2 hover:border-brand hover:text-brand transition-colors lg:hidden"
    >
      <FunnelIcon className="w-4 h-4" />
      Bộ lọc
    </button>
  );
}
