Add a new admin panel page to GiftCraft Studio.

## Arguments
$ARGUMENTS — describe what this admin page manages (resource name, key actions needed).

## What to do

Read `frontend/CLAUDE.md` and check existing admin pages for patterns before writing.  
Reference files: `frontend/src/app/admin/don-hang/page.tsx` (drawer pattern), `frontend/src/app/admin/forfolio/page.tsx` (CRUD + modal pattern).

### Step 1 — Create the file

Path: `frontend/src/app/admin/<resource>/page.tsx`

All admin pages are **client components** (`"use client"`).

### Step 2 — Standard admin page structure

```tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";

export default function AdminResourcePage() {
  const [items, setItems] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ResourceType | null>(null);

  useEffect(() => {
    api.get("/admin/resource?per_page=100")
      .then(r => setItems(r.data.data?.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tên trang</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} mục</p>
        </div>
        <button onClick={() => {/* open modal */}} className="btn-primary text-sm px-5">
          + Thêm mới
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Cột 1</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelected(item)}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gray-500 hover:text-gray-700">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end"
          onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Chi tiết</h2>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {/* Detail content */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 3 — Add/Edit Modal (for CRUD pages)

```tsx
{/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    onClick={() => setShowModal(false)}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Thêm / Sửa</h2>
        <button onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên *</label>
          <input className="input-field" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="btn-primary flex-1 disabled:opacity-40">
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button onClick={() => setShowModal(false)} className="btn-outline px-6">Hủy</button>
        </div>
      </div>
    </div>
  </div>
)}
```

### Step 4 — Status badge colors

```ts
const STATUS_COLORS = {
  active:   "bg-green-100 text-green-700",
  pending:  "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-500",
  error:    "bg-red-100 text-red-600",
};
```

### Step 5 — Register in admin dashboard

Open `frontend/src/app/admin/page.tsx` and add a link card in the quick-links grid:
```tsx
{ href: "/admin/new-resource", label: "Tên mục mới", icon: "🎯" }
```

### Step 6 — Checklist

- [ ] Page is `"use client"`
- [ ] Loading and empty states handled
- [ ] Click-outside closes drawer
- [ ] Confirm dialog before delete (`confirm("Xóa...?")`)
- [ ] Optimistic update (update state before/after API call)
- [ ] Link added to `/admin` dashboard quick-links
- [ ] Route added to `CLAUDE.md` and `PROGRESS.md`
