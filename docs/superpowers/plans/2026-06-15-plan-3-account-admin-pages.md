# GiftCraft Rewrite — Plan 3: Account, Admin & Remaining Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite tất cả pages còn lại — Auth, Account, Admin panel, và các landing pages (B2B, Portfolio, Blog, Gift Finder, Search, Careers, Supplier). Giữ nguyên 100% business logic và API calls.

**Architecture:** Tất cả pages giữ nguyên "use client" / Server Component pattern hiện tại. Chỉ thay UI: classes Tailwind cũ → design system mới (brand, border, surface-alt...), components cũ → components/ui/ mới.

**Tech Stack:** Next.js 16.2, Tailwind v4, components/ui từ Plan 1, next-intl 4.

**Prerequisite:** Plan 1 + Plan 2 hoàn tất.

**Quy tắc chung khi rewrite mỗi page:**
1. Thay `rounded-xl` → `rounded-sm`
2. Thay `border-amber-*` / `border-gray-*` → `border-border`
3. Thay `text-gray-*` → `text-ink` / `text-ink-muted`
4. Thay `bg-amber-*` / `bg-red-50` accent → `bg-brand-light` / `bg-surface-alt`
5. Thay inline `<button className="...">` → `<Button>` từ `components/ui/`
6. Thay `<input className="...">` → `<Input>` từ `components/ui/`
7. Thay spinner `animate-spin` → `<Skeleton>` khi loading data
8. Thay toast/alert pattern → `useToastStore().add(...)`

---

## File Map

| File | Action |
|---|---|
| `frontend/src/app/[locale]/dang-nhap/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/dang-ky/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/tai-khoan/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/tai-khoan/du-an/page.tsx` | Rewrite UI |
| `frontend/src/components/layout/AdminLayout.tsx` | Create |
| `frontend/src/app/[locale]/admin/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/don-hang/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/san-pham/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/b2b/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/blog/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/forfolio/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/danh-gia/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/nha-cung-cap/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/admin/tuyen-dung/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/qua-tang-doanh-nghiep/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/bat-dau-du-an-moi/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/forfolio/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/forfolio/ForfolioClient.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/gift-finder/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/blog/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/blog/[slug]/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/tim-kiem/SearchResults.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/tuyen-dung/page.tsx` | Rewrite UI |
| `frontend/src/app/[locale]/tro-thanh-doi-tac/page.tsx` | Rewrite UI |

---

## Task 1: Auth Pages (Login + Register)

**Files:**
- Rewrite: `frontend/src/app/[locale]/dang-nhap/page.tsx`
- Rewrite: `frontend/src/app/[locale]/dang-ky/page.tsx`

- [ ] **Step 1: Rewrite Login page**

Giữ nguyên toàn bộ logic (useAuthStore, api call, redirect). Chỉ thay UI:

```tsx
// frontend/src/app/[locale]/dang-nhap/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, init } = useAuthStore();
  const { add: addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { init(); }, [init]);
  useEffect(() => { if (user) router.replace("/tai-khoan"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      addToast("Email hoặc mật khẩu không đúng.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Đăng nhập</h1>
          <p className="text-sm text-ink-muted">Chào mừng trở lại GiftCraft Studio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Đăng nhập
          </Button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-brand font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Register page**

Giữ nguyên form logic (name, email, password, confirm), thay UI tương tự login:

```tsx
// frontend/src/app/[locale]/dang-ky/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, init } = useAuthStore();
  const { add: addToast } = useToastStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { init(); }, [init]);
  useEffect(() => { if (user) router.replace("/tai-khoan"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      addToast("Mật khẩu xác nhận không khớp.", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      await login(form.email, form.password);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đăng ký thất bại.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Tạo tài khoản</h1>
          <p className="text-sm text-ink-muted">Tham gia GiftCraft Studio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Họ tên *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Input type="email" placeholder="Email *" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          <Input type="password" placeholder="Mật khẩu *" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} />
          <Input type="password" placeholder="Xác nhận mật khẩu *" required value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">Đăng ký</Button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-6">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="text-brand font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/dang-nhap/page.tsx \
        frontend/src/app/\[locale\]/dang-ky/page.tsx
git commit -m "feat: rewrite auth pages (login, register)"
```

---

## Task 2: Account Page

**Files:**
- Rewrite: `frontend/src/app/[locale]/tai-khoan/page.tsx`
- Rewrite: `frontend/src/app/[locale]/tai-khoan/du-an/page.tsx`

- [ ] **Step 1: Rewrite Account page — giữ nguyên tab logic + API calls**

Giữ nguyên: useAuthStore auth guard pattern, tabs (profile/orders/loyalty/projects), API calls.
Thay: tất cả class Tailwind cũ → design system mới, `<button>` → `<Button>`, `<input>` → `<Input>`.

Key UI changes:
- Tab bar: `border-b border-border` với active tab `border-b-2 border-brand text-brand`
- Order cards: `border border-border rounded-sm p-4` thay vì `rounded-xl shadow`
- Loyalty tier badges: dùng `<Badge variant="brand">` cho tier name
- Stat cards: `bg-surface-alt` thay vì `bg-amber-50`

```bash
# Đọc file hiện tại để reference khi rewrite
cat frontend/src/app/\[locale\]/tai-khoan/page.tsx
```

Sau đó rewrite giữ nguyên toàn bộ logic, chỉ thay CSS classes theo quy tắc chung ở đầu Plan 3.

- [ ] **Step 2: Rewrite B2B project tracking page**

```bash
cat frontend/src/app/\[locale\]/tai-khoan/du-an/page.tsx
```

Áp dụng quy tắc chung: border-border, text-ink, btn-primary, Badge variants.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/tai-khoan/
git commit -m "feat: rewrite account pages"
```

---

## Task 3: AdminLayout component

**Files:**
- Create: `frontend/src/components/layout/AdminLayout.tsx`

- [ ] **Step 1: Tạo AdminLayout với sidebar**

```tsx
// frontend/src/components/layout/AdminLayout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/don-hang", label: "Đơn hàng" },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/b2b", label: "B2B Quotes" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/forfolio", label: "Portfolio" },
  { href: "/admin/danh-gia", label: "Đánh giá" },
  { href: "/admin/nha-cung-cap", label: "Nhà cung cấp" },
  { href: "/admin/tuyen-dung", label: "Tuyển dụng" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, init } = useAuthStore();
  const router = useRouter();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/dang-nhap");
    } else if (user && user.role !== "admin") {
      router.replace("/tai-khoan");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-ink text-white flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="font-display font-bold text-white text-lg">GiftCraft</Link>
          <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  active ? "bg-white/10 text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">{user.name}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-surface-alt overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/layout/AdminLayout.tsx
git commit -m "feat: add AdminLayout with sidebar"
```

---

## Task 4: Admin Pages

**Files:**
- Rewrite: tất cả `frontend/src/app/[locale]/admin/*/page.tsx`

- [ ] **Step 1: Wrap tất cả admin pages với AdminLayout**

Với mỗi admin page, wrap content trong `<AdminLayout>`. Thêm import ở đầu file:

```tsx
import AdminLayout from "@/components/layout/AdminLayout";
// ...
return <AdminLayout>{/* existing content */}</AdminLayout>;
```

- [ ] **Step 2: Áp dụng quy tắc chung cho tất cả admin pages**

Với mỗi page (`don-hang`, `san-pham`, `b2b`, `blog`, `forfolio`, `danh-gia`, `nha-cung-cap`, `tuyen-dung`):

```bash
# Đọc file trước khi sửa
cat frontend/src/app/\[locale\]/admin/<page>/page.tsx
```

Thay thế:
- `rounded-xl` → `rounded-sm`
- `shadow-sm` / `shadow-lg` → `border border-border`
- `bg-gray-50` (table header) → `bg-surface-alt`
- `divide-y divide-gray-100` → `divide-y divide-border`
- `text-gray-*` → `text-ink` / `text-ink-muted`
- `bg-amber-*` accent → `bg-brand-light text-brand`
- Drawer: thay inline overlay → `<Drawer>` từ `components/ui/Drawer`
- Modal: thay inline overlay → `<Modal>` từ `components/ui/Modal`
- Buttons: thay `className="..."` → `<Button variant="...">` 

- [ ] **Step 3: Admin Dashboard page — dùng formatPrice thay formatVND local**

```tsx
// Trong admin/page.tsx — thay formatVND local bằng import
import { formatPrice } from "@/lib/formatPrice";
// Xóa local formatVND function
```

- [ ] **Step 4: Commit sau mỗi admin page**

```bash
# Commit từng page để dễ review
git add frontend/src/app/\[locale\]/admin/page.tsx
git commit -m "feat: rewrite admin dashboard"

git add frontend/src/app/\[locale\]/admin/don-hang/page.tsx
git commit -m "feat: rewrite admin orders page"

git add frontend/src/app/\[locale\]/admin/san-pham/page.tsx
git commit -m "feat: rewrite admin products page"

git add frontend/src/app/\[locale\]/admin/b2b/page.tsx
git commit -m "feat: rewrite admin B2B page"

git add frontend/src/app/\[locale\]/admin/blog/page.tsx \
        frontend/src/app/\[locale\]/admin/forfolio/page.tsx \
        frontend/src/app/\[locale\]/admin/danh-gia/page.tsx \
        frontend/src/app/\[locale\]/admin/nha-cung-cap/page.tsx \
        frontend/src/app/\[locale\]/admin/tuyen-dung/page.tsx
git commit -m "feat: rewrite remaining admin pages"
```

---

## Task 5: B2B Landing + Quote Form

**Files:**
- Rewrite: `frontend/src/app/[locale]/qua-tang-doanh-nghiep/page.tsx`
- Rewrite: `frontend/src/app/[locale]/bat-dau-du-an-moi/page.tsx`

- [ ] **Step 1: Rewrite B2B landing page**

```bash
cat frontend/src/app/\[locale\]/qua-tang-doanh-nghiep/page.tsx
```

Áp dụng quy tắc chung. Key sections của trang này:
- Hero dark: `bg-dark text-white` thay vì `bg-gray-900`
- Stats grid: `bg-white/5 rounded-sm` border-less
- Process steps: số `bg-brand` thay vì `bg-amber-400`
- CTA buttons: `btn-primary` + `btn-ghost text-white`

- [ ] **Step 2: Rewrite 5-step B2B quote form**

```bash
cat frontend/src/app/\[locale\]/bat-dau-du-an-moi/page.tsx
```

Giữ nguyên useReducer 5-step logic + API call. Chỉ thay UI:
- Step indicator: số tròn `bg-brand` cho active/done
- Form inputs: `<Input>` / `<Select>` / `<Textarea>` từ ui/
- Submit button: `<Button loading={loading}>`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/qua-tang-doanh-nghiep/page.tsx \
        frontend/src/app/\[locale\]/bat-dau-du-an-moi/page.tsx
git commit -m "feat: rewrite B2B landing and quote form pages"
```

---

## Task 6: Portfolio + Gift Finder

**Files:**
- Rewrite: `frontend/src/app/[locale]/forfolio/page.tsx`
- Rewrite: `frontend/src/app/[locale]/forfolio/ForfolioClient.tsx`
- Rewrite: `frontend/src/app/[locale]/gift-finder/page.tsx`

- [ ] **Step 1: Rewrite Portfolio**

```bash
cat frontend/src/app/\[locale\]/forfolio/ForfolioClient.tsx
```

Key changes:
- Filter tabs: `border-b border-border`, active `border-b-2 border-brand text-brand`
- Lightbox overlay: `fixed inset-0 bg-black/80 z-50` (tối màu hơn) 
- Grid items: `aspect-square` với `group-hover:scale-105 transition-transform duration-300`
- Portfolio card: `rounded-sm` thay `rounded-2xl`

- [ ] **Step 2: Rewrite Gift Finder**

```bash
cat frontend/src/app/\[locale\]/gift-finder/page.tsx
```

Giữ nguyên 4-step quiz logic. Thay UI:
- Step progress: thanh `bg-brand` thay vì `bg-amber-400`
- Option cards: `border border-border hover:border-brand hover:bg-brand-light` thay vì `hover:bg-amber-50`
- Selected state: `border-brand bg-brand-light`
- Result cards: dùng `<ProductCard>` từ `components/shop/`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/forfolio/ \
        frontend/src/app/\[locale\]/gift-finder/page.tsx
git commit -m "feat: rewrite portfolio and gift finder pages"
```

---

## Task 7: Blog Pages

**Files:**
- Rewrite: `frontend/src/app/[locale]/blog/page.tsx`
- Rewrite: `frontend/src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Rewrite Blog listing**

```bash
cat frontend/src/app/\[locale\]/blog/page.tsx
```

Key changes:
- Blog card: `border-b border-border` thay vì card với shadow
- Category badges: `<Badge>` từ ui/
- Newsletter form: `<Input>` + `<Button>`
- Load more: `<Button variant="secondary">`

- [ ] **Step 2: Rewrite Blog detail**

```bash
cat frontend/src/app/\[locale\]/blog/\[slug\]/page.tsx
```

Key changes:
- Article typography: `prose` class với `text-ink`
- Back link: `text-brand hover:underline`
- Author/date: `text-ink-muted text-sm`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/blog/
git commit -m "feat: rewrite blog pages"
```

---

## Task 8: Search + Careers + Supplier

**Files:**
- Rewrite: `frontend/src/app/[locale]/tim-kiem/SearchResults.tsx`
- Rewrite: `frontend/src/app/[locale]/tuyen-dung/page.tsx`
- Rewrite: `frontend/src/app/[locale]/tro-thanh-doi-tac/page.tsx`

- [ ] **Step 1: Rewrite Search Results**

```bash
cat frontend/src/app/\[locale\]/tim-kiem/SearchResults.tsx
```

Key changes:
- Search input: `<Input>` từ ui/
- Result cards: dùng `<ProductCard>` cho product results
- Load more: `<Button variant="secondary">`
- Empty state: centered, `text-ink-muted`

- [ ] **Step 2: Rewrite Careers page**

```bash
cat frontend/src/app/\[locale\]/tuyen-dung/page.tsx
```

Key changes:
- Job cards: `border border-border rounded-sm p-6`
- Apply modal: `<Modal>` từ ui/
- Form fields: `<Input>` / `<Textarea>` từ ui/
- Submit: `<Button loading={loading}>`

- [ ] **Step 3: Rewrite Supplier form**

```bash
cat frontend/src/app/\[locale\]/tro-thanh-doi-tac/page.tsx
```

Áp dụng quy tắc chung + dùng `<Input>`, `<Select>`, `<Textarea>`, `<Button>`.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/\[locale\]/tim-kiem/ \
        frontend/src/app/\[locale\]/tuyen-dung/page.tsx \
        frontend/src/app/\[locale\]/tro-thanh-doi-tac/page.tsx
git commit -m "feat: rewrite search, careers, supplier pages"
```

---

## Task 9: Final verify + push

- [ ] **Step 1: Full type check**

```bash
cd frontend && npx tsc --noEmit 2>&1
```

Fix tất cả errors.

- [ ] **Step 2: Lint**

```bash
cd frontend && npm run lint 2>&1
```

Fix tất cả ESLint errors.

- [ ] **Step 3: Build**

```bash
cd frontend && npm run build 2>&1 | tail -40
```

Expected: build thành công, 0 errors.

- [ ] **Step 4: Push branch lên remote**

```bash
git push -u origin rewrite/frontend
```

- [ ] **Step 5: Final commit nếu cần**

```bash
git add -A && git commit -m "chore: Plan 3 complete — all pages rewritten"
git push
```

---

## Checklist hoàn thành Plan 3

- [ ] Login page — centered form, Button, Input, toast errors
- [ ] Register page — centered form, validation
- [ ] Account page — tabs, loyalty, orders, profile
- [ ] B2B project tracking page
- [ ] AdminLayout — sidebar navigation
- [ ] Admin Dashboard — formatPrice, stats cards
- [ ] Admin Orders — table + Drawer
- [ ] Admin Products — table + Modal
- [ ] Admin B2B, Blog, Portfolio, Reviews, Suppliers, Jobs
- [ ] B2B landing + 5-step quote form
- [ ] Portfolio + lightbox + filters
- [ ] Gift Finder — 4-step quiz
- [ ] Blog listing + detail
- [ ] Search results
- [ ] Careers + job apply
- [ ] Supplier form
- [ ] `tsc --noEmit` — 0 errors
- [ ] `npm run build` — success
- [ ] Branch pushed to remote

**Rewrite hoàn tất. Khi nhận được visual design từ Claude → so sánh với implementation hiện tại và điều chỉnh components/ui/ + globals.css nếu cần.**
