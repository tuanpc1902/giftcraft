Create a new frontend page for GiftCraft Studio.

## Arguments
$ARGUMENTS — describe the page: name, route, purpose, and whether it needs auth.

## What to do

Read `frontend/CLAUDE.md` for all conventions before writing any code.

### Step 1 — Decide the component type

- **Server component** (no `"use client"`): Use for SEO pages (product listing, blog, landing pages). Fetch data with `async/await` and `{ next: { revalidate: N } }`.
- **Client component** (`"use client"`): Use for interactive pages (forms, admin panels, dashboards). Fetch with `api` from `@/lib/api`.
- **Protected page**: Must call `useAuthStore().init()` in a `useEffect` and redirect to `/dang-nhap` if no token.

### Step 2 — Create the file

File path: `frontend/src/app/<route>/page.tsx`

**Server component template:**
```tsx
import type { Metadata } from "next";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

export const metadata: Metadata = { title: "Page Title — GiftCraft Studio" };

async function getData() {
  try {
    const res = await fetch(`${API}/endpoint`, { next: { revalidate: 900 } });
    return (await res.json()).data ?? null;
  } catch { return null; }
}

export default async function MyPage() {
  const data = await getData();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      ...
    </div>
  );
}
```

**Client component template:**
```tsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/endpoint")
      .then(r => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400">Đang tải...</div>;
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">...</div>;
}
```

**Protected page addition** (add to any client page that needs auth):
```tsx
const { user, init } = useAuthStore();
useEffect(() => { init(); }, [init]);
useEffect(() => {
  if (user === null) {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/dang-nhap");
  }
}, [user, router]);
if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
```

### Step 3 — Style rules

- Max-width container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Page heading: `text-2xl font-bold text-gray-900`
- Cards: `bg-white rounded-2xl border border-gray-100 p-5`
- Use `.btn-primary`, `.btn-outline`, `.input-field` utility classes from `globals.css`
- Empty state: icon emoji + message + CTA button
- Loading state: `text-center py-16 text-gray-400`
- All text in Vietnamese

### Step 4 — Checklist before finishing

- [ ] No `h-4.5`, `w-4.5` (use `h-[18px]` etc.)
- [ ] No `bg-gradient-to-br` (use `bg-linear-to-br` for Tailwind v4)
- [ ] No bare `<img>` — use `<Image>` from `next/image` with `fill` or explicit dimensions
- [ ] If using `useSearchParams()`, wrap in `<Suspense>`
- [ ] If form has `onSubmit`, page must be `"use client"`
- [ ] Protected pages: `init()` called, redirect to `/dang-nhap` if no token
- [ ] Add route to the table in `CLAUDE.md` and `PROGRESS.md`
