@AGENTS.md

# GiftCraft Frontend — Developer Context

## Stack & Versions

- **Next.js 16.2** — App Router only. No Pages Router.
- **React 19.2** — use `useActionState`, not `useFormState` (renamed in v19).
- **Tailwind v4** — CSS-first. No `tailwind.config.ts`. Theme defined in `globals.css` under `@theme`. Uses `@tailwindcss/postcss`.
- **TypeScript 5**, **Zustand 5**, **TanStack Query 5**, **Axios 1.17**, **uuid 14**

---

## Critical Tailwind v4 differences

```css
/* v3 → v4 renames (linter will autocorrect, but write correctly) */
bg-gradient-to-br  →  bg-linear-to-br
aspect-[16/9]      →  aspect-video  (or keep custom ratio with aspect-[16/9])

/* No fractional heights: h-4.5 does NOT exist */
/* Use explicit pixels instead: h-[18px] */

/* No tailwind.config.ts — add custom tokens in globals.css */
@theme inline {
  --color-brand: #f59e0b;
}
```

---

## Directory structure

```
src/
├── app/
│   ├── globals.css             Tailwind @import + @theme design tokens + .btn-primary/.input-field
│   └── [locale]/               i18n root (locales: vi [default], en)
│       ├── layout.tsx          Locale layout — fonts, NextIntlClientProvider, Header, Footer
│       ├── page.tsx            Homepage (server component, ISR)
│       ├── not-found.tsx       404 page
│       ├── error.tsx           Error boundary (client)
│       ├── loading.tsx         Route loading spinner
│       ├── (shop)/             Layout group: san-pham/, gio-hang/, checkout/, don-hang/
│       ├── admin/              All /admin/* pages (client, uses AdminLayout)
│       ├── dang-nhap/          Login
│       ├── dang-ky/            Register
│       ├── tai-khoan/          Account hub + /du-an (protected)
│       ├── qua-tang-doanh-nghiep/  B2B landing
│       ├── bat-dau-du-an-moi/  B2B 5-step quote form
│       ├── forfolio/           Portfolio + lightbox
│       ├── gift-finder/        4-question quiz → product recommendations
│       ├── blog/               Blog listing + [slug]/ detail
│       ├── tim-kiem/           Search results (Meilisearch)
│       ├── tro-thanh-doi-tac/  Supplier application form
│       └── tuyen-dung/         Careers + job application form
├── components/
│   ├── layout/
│   │   ├── Header.tsx          Sticky nav — search, cart badge, auth dropdown, mobile menu
│   │   ├── Footer.tsx          Footer links
│   │   ├── AdminLayout.tsx     Dark sidebar admin shell (client, auth-guarded)
│   │   └── MobileMenu.tsx      Mobile slide-in menu
│   ├── ui/                     Design system: Button, Badge, SkeletonCard, Toast, etc.
│   ├── ProductCard.tsx         Product grid card
│   ├── ProductReviews.tsx      Reviews list + submit form
│   ├── ChatWidget.tsx          AI chat bubble (Claude streaming)
│   └── Providers.tsx           TanStack Query provider
├── lib/
│   ├── api.ts                  Axios instance (Bearer + X-Session-ID interceptors)
│   ├── formatPrice.ts          formatPrice(n) → vi-VN VNĐ string
│   └── session.ts              getOrCreateSessionId() → guest UUID
├── store/
│   ├── cart.ts                 useCartStore (Zustand)
│   └── auth.ts                 useAuthStore (Zustand) — login/logout/init
├── types/index.ts              All TypeScript interfaces
└── i18n/
    ├── routing.ts              defineRouting({ locales: ['vi','en'], defaultLocale: 'vi' })
    └── request.ts              getRequestConfig for next-intl
messages/
├── vi.json                     Vietnamese strings (default)
└── en.json                     English strings
```

---

## Auth pattern

```ts
// In any client page that needs auth:
const { user, init } = useAuthStore();

useEffect(() => { init(); }, [init]);          // hydrate from localStorage

useEffect(() => {
  if (user === null) {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/dang-nhap");
  }
}, [user, router]);

if (!user) return <div>Đang tải...</div>;      // brief flash before hydration
```

**`init()` behaviour:** reads `token` + `gc_user` from localStorage. If either is missing or JSON is corrupted, clears both keys. Always call `init()` in protected pages AND in login/register pages (for already-logged-in redirect).

---

## API client

```ts
import api from "@/lib/api";

// Automatically attaches:
//   Authorization: Bearer <token>  (if localStorage has "token")
//   X-Session-ID: <uuid>           (always, for guest cart)

const { data } = await api.get("/products");
// Response shape: { success, data: { items, meta }, message }
```

---

## Design tokens (globals.css @theme)

```css
--color-brand:       #B91C1C   /* red-700 — primary CTA, brand elements */
--color-brand-light: #FEE2E2   /* red-100 — light tint, badges */
--color-ink:         #111111   /* near-black text, admin sidebar bg */
--color-ink-muted:   #6B7280   /* secondary text */
--color-border:      #F3F4F6   /* subtle borders */
--color-surface-alt: #F9FAFB   /* page background tint */
```

Tailwind utility classes: `text-brand`, `bg-brand`, `bg-brand-light`, `text-ink`, `text-ink-muted`, `border-border`, `bg-surface-alt`, `bg-ink`.

## Shared utility classes (globals.css)

```css
.input-field      /* w-full, border-border, rounded-sm, focus ring brand */
.btn-primary      /* bg-brand text-white, rounded-sm, hover:bg-brand-dark */
.btn-secondary    /* border border-ink text-ink, rounded-sm, hover:bg-surface-alt */
.btn-ghost        /* text-ink, hover:text-brand — no background or border */
```

---

## Zustand stores

### `useCartStore`
```ts
{ cart, loading, fetch, addItem, updateItem, removeItem, clear, applyVoucher, removeVoucher }
```
- `cart.total_items` — used in Header badge
- `cart.items[]` — CartItem[]

### `useAuthStore`
```ts
{ user, token, login, logout, init }
```
- `user` is `null` until `init()` is called
- `user.role` is `"customer" | "b2b" | "admin"` — check `=== "admin"` for admin routes

---

## TypeScript types (src/types/index.ts)

Key types: `Product`, `ProductListItem`, `Category`, `CartItem`, `Cart`, `Order`, `OrderItem`, `ShippingOption`, `B2bQuote`, `BlogPost`, `PortfolioProject`, `AuthUser`

---

## Page patterns

### Server component (SEO pages)
```tsx
// No "use client". Data fetched in async function.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

export default async function Page() {
  const res = await fetch(`${API}/products`, { next: { revalidate: 3600 } });
  const { data } = await res.json();
  return <div>...</div>;
}
```

### Client component (interactive pages)
```tsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/endpoint").then(r => setData(r.data.data));
  }, []);
  // ...
}
```

### Protected page
```tsx
"use client";
// Always call init() + redirect check — see Auth pattern above
```

### Multi-step form (useReducer pattern)
```tsx
function reducer(s: State, patch: Partial<State>) { return { ...s, ...patch }; }
const [state, dispatch] = useReducer(reducer, init);
const set = (patch: Partial<State>) => dispatch(patch);
```

---

## Admin page pattern

All admin pages are client components. Data is fetched via `api.get("/admin/...")`.  
Drawer pattern for detail views (fixed right panel, click-outside to close).  
Table with `divide-y divide-gray-50` rows, `bg-gray-50` thead.

```tsx
const [selected, setSelected] = useState<T | null>(null);

// Drawer:
{selected && (
  <div className="fixed inset-0 bg-black/30 z-40 flex justify-end"
    onClick={() => setSelected(null)}>
    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl"
      onClick={e => e.stopPropagation()}>
      ...
    </div>
  </div>
)}
```

---

## Common mistakes to avoid

1. **`h-4.5` or `w-4.5`** — invalid in Tailwind v4. Use `h-[18px]` etc.
2. **`bg-gradient-to-br`** — renamed to `bg-linear-to-br` in v4.
3. **`onSubmit` in Server Components** — not allowed. Add `"use client"` or use Server Actions.
4. **ESLint disable in JSX** — `{/* eslint-disable-next-line */}` is a JSX comment and does NOT suppress ESLint. Use `// eslint-disable-next-line` on the line above (only works outside JSX, or switch to `<Image>` from next/image).
5. **`<img>` instead of `<Image>`** — always use `next/image` `<Image>` with `fill` or explicit `width`/`height`. Remote domains must be in `next.config.ts` `remotePatterns`.
6. **`Object.entries(...)` type** — returns `[string, T][]`. Cast with `as [KnownKey, T][]` when you need the key type.
7. **Zustand `user` starts as `null`** — call `init()` in useEffect before checking auth state.
8. **`useSearchParams()` requires `<Suspense>`** — wrap the component using it.

---

## Image remote patterns (next.config.ts)

Allowed image hosts:
- `https://*.r2.cloudflarestorage.com`
- `https://placehold.co`

Add new hosts to `next.config.ts` `images.remotePatterns`.
