"use client";

import { useState, type ReactNode } from "react";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileFilterToggle({ filterContent }: { filterContent: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
        style={{ borderColor: "var(--color-brand)", color: "var(--color-brand)" }}
      >
        <AdjustmentsHorizontalIcon className="h-4 w-4" />
        Lọc
      </button>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative ml-auto w-72 max-w-[85vw] h-full bg-[#fffdf8] overflow-y-auto shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
              <h2 className="font-bold text-gray-900">Bộ lọc</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="px-5 py-4 flex-1">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Danh mục</h3>
              {filterContent}
            </div>
            <div className="px-5 py-4 border-t border-amber-100">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: "var(--color-brand)" }}
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
