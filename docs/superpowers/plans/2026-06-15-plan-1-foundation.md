# GiftCraft Rewrite — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập branch rewrite, design system hoàn chỉnh (globals.css + components/ui/), layout (Header/Footer), store/toast, và Homepage — đủ để thấy toàn bộ visual identity mới chạy trên browser.

**Architecture:** Component-first trên branch `rewrite/frontend`. Build design system primitives trước, sau đó layout shell, cuối cùng là Homepage. Backend Laravel không đổi gì. Mọi API call giữ nguyên qua `lib/api.ts`.

**Tech Stack:** Next.js 16.2, React 19, Tailwind CSS v4, next/font (Spectral + Inter), Zustand 5, next-intl 4, @heroicons/react 2

---

## File Map

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/app/globals.css` | Rewrite | Design tokens + utility classes mới |
| `frontend/src/app/layout.tsx` | Modify | Load Spectral + Inter qua next/font |
| `frontend/src/app/[locale]/layout.tsx` | Modify | Dùng Header/Footer mới + ToastContainer |
| `frontend/src/store/toast.ts` | Create | Zustand toast store |
| `frontend/src/components/ui/Button.tsx` | Create | Button primitive |
| `frontend/src/components/ui/Badge.tsx` | Create | Badge primitive |
| `frontend/src/components/ui/Input.tsx` | Create | Input, Textarea, Select |
| `frontend/src/components/ui/Skeleton.tsx` | Create | Skeleton variants |
| `frontend/src/components/ui/Modal.tsx` | Create | Modal overlay |
| `frontend/src/components/ui/Drawer.tsx` | Create | Right-side drawer |
| `frontend/src/components/ui/Toast.tsx` | Create | Toast container + item |
| `frontend/src/components/layout/Header.tsx` | Create | Header mới (rewrite từ components/Header.tsx) |
| `frontend/src/components/layout/MobileMenu.tsx` | Create | Mobile menu drawer (tách từ Header) |
| `frontend/src/components/layout/Footer.tsx` | Create | Footer 4 cột |
| `frontend/src/components/shop/ProductCard.tsx` | Create | ProductCard mới (rewrite từ components/ProductCard.tsx) |
| `frontend/src/app/[locale]/page.tsx` | Rewrite | Homepage Server Component |
| `frontend/src/app/_home/HomePage.tsx` | Rewrite | Homepage sections |

---

## Task 1: Tạo branch

**Files:**
- (Không đổi file nào, chỉ tạo branch)

- [ ] **Step 1: Tạo branch**

```bash
cd /home/tuanp/projects/giftcraft
git checkout -b rewrite/frontend
```

Expected: `Switched to a new branch 'rewrite/frontend'`

- [ ] **Step 2: Verify next/font có sẵn**

```bash
cd frontend && grep '"next"' package.json
```

Expected: `"next": "16.2.7"` — next/font bundled sẵn trong Next.js, không cần cài thêm.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore: start rewrite/frontend branch"
```

---

## Task 2: Rewrite globals.css

**Files:**
- Rewrite: `frontend/src/app/globals.css`

- [ ] **Step 1: Rewrite globals.css hoàn toàn**

```css
@import "tailwindcss";

@theme inline {
  /* Brand colors */
  --color-brand:        #B91C1C;
  --color-brand-light:  #FEE2E2;
  --color-brand-dark:   #991B1B;

  /* Neutral palette */
  --color-ink:          #111111;
  --color-ink-muted:    #6B7280;
  --color-surface:      #FFFFFF;
  --color-surface-alt:  #F9FAFB;
  --color-border:       #F3F4F6;
  --color-dark:         #111111;

  /* Typography */
  --font-display: var(--font-display), Georgia, serif;
  --font-body:    var(--font-body), system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  background: #fff;
  color: #111111;
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-display), Georgia, serif;
  letter-spacing: -0.025em;
}

/* ── Utility classes ── */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center font-semibold
           bg-brand text-white px-6 py-3 rounded-sm
           hover:bg-brand-dark transition-colors duration-150
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center font-semibold
           border border-ink text-ink px-6 py-3 rounded-sm
           hover:bg-surface-alt transition-colors duration-150
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-ghost {
    @apply inline-flex items-center justify-center font-medium
           text-ink px-4 py-2
           hover:text-brand transition-colors duration-150;
  }

  .input-field {
    @apply w-full border border-border rounded-sm px-4 py-3
           text-ink placeholder:text-ink-muted bg-white
           focus:outline-none focus:border-brand transition-colors duration-150;
  }

  .section-title {
    @apply font-display text-2xl font-bold text-ink tracking-tight;
  }

  .badge {
    @apply inline-block text-xs font-semibold px-2.5 py-1 rounded-full;
  }
}
```

- [ ] **Step 2: Chạy build để check Tailwind v4 parse đúng**

```bash
cd frontend && npm run build 2>&1 | tail -20
```

Expected: build success hoặc chỉ lỗi từ components khác (không phải globals.css).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat: rewrite globals.css with new design system tokens"
```

---

## Task 3: Toast store

**Files:**
- Create: `frontend/src/store/toast.ts`

- [ ] **Step 1: Tạo toast store**

```ts
// frontend/src/store/toast.ts
import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add(message, type = "info") {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  remove(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "toast" || echo "no toast errors"
```

Expected: `no toast errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/store/toast.ts
git commit -m "feat: add Zustand toast store"
```

---

## Task 4: components/ui/Button.tsx

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`

- [ ] **Step 1: Tạo Button component**

```tsx
// frontend/src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const SIZE_CLASS: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "Button" || echo "no Button errors"
```

Expected: `no Button errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Button.tsx
git commit -m "feat: add Button ui primitive"
```

---

## Task 5: components/ui/Badge.tsx

**Files:**
- Create: `frontend/src/components/ui/Badge.tsx`

- [ ] **Step 1: Tạo Badge component**

```tsx
// frontend/src/components/ui/Badge.tsx
type BadgeVariant = "default" | "brand" | "success" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "bg-surface-alt text-ink",
  brand:   "bg-brand-light text-brand",
  success: "bg-green-100 text-green-700",
  muted:   "bg-border text-ink-muted",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${VARIANT_CLASS[variant]} ${className}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Badge.tsx
git commit -m "feat: add Badge ui primitive"
```

---

## Task 6: components/ui/Input.tsx

**Files:**
- Create: `frontend/src/components/ui/Input.tsx`

- [ ] **Step 1: Tạo Input, Textarea, Select**

```tsx
// frontend/src/components/ui/Input.tsx
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`input-field ${className}`} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} className={`input-field resize-none ${className}`} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select ref={ref} className={`input-field ${className}`} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Input.tsx
git commit -m "feat: add Input/Textarea/Select ui primitives"
```

---

## Task 7: components/ui/Skeleton.tsx

**Files:**
- Create: `frontend/src/components/ui/Skeleton.tsx`

- [ ] **Step 1: Tạo Skeleton**

```tsx
// frontend/src/components/ui/Skeleton.tsx
interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-alt rounded-sm ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export default Skeleton;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Skeleton.tsx
git commit -m "feat: add Skeleton ui primitive"
```

---

## Task 8: components/ui/Modal.tsx

**Files:**
- Create: `frontend/src/components/ui/Modal.tsx`

- [ ] **Step 1: Tạo Modal**

```tsx
// frontend/src/components/ui/Modal.tsx
"use client";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-sm shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-ink">{title}</h3>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Modal.tsx
git commit -m "feat: add Modal ui primitive"
```

---

## Task 9: components/ui/Drawer.tsx

**Files:**
- Create: `frontend/src/components/ui/Drawer.tsx`

- [ ] **Step 1: Tạo Drawer**

```tsx
// frontend/src/components/ui/Drawer.tsx
"use client";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, width = "max-w-md" }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-40 flex justify-end"
      onClick={onClose}
    >
      <div
        className={`bg-white ${width} w-full h-full overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white">
            <h3 className="font-semibold text-ink">{title}</h3>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Drawer.tsx
git commit -m "feat: add Drawer ui primitive"
```

---

## Task 10: components/ui/Toast.tsx

**Files:**
- Create: `frontend/src/components/ui/Toast.tsx`

- [ ] **Step 1: Tạo Toast component**

```tsx
// frontend/src/components/ui/Toast.tsx
"use client";
import { useToastStore } from "@/store/toast";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ICONS = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
  error:   <XCircleIcon className="w-5 h-5 text-brand" />,
  info:    <InformationCircleIcon className="w-5 h-5 text-ink-muted" />,
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 bg-white border border-border rounded-sm px-4 py-3 shadow-lg"
        >
          {ICONS[t.type]}
          <p className="flex-1 text-sm text-ink">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-ink-muted hover:text-ink">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/ui/Toast.tsx
git commit -m "feat: add Toast container component"
```

---

## Task 11: components/layout/Footer.tsx

**Files:**
- Create: `frontend/src/components/layout/Footer.tsx`

- [ ] **Step 1: Tạo Footer 4 cột**

```tsx
// frontend/src/components/layout/Footer.tsx
import Link from "next/link";

const COLS = [
  {
    title: "GiftCraft Studio",
    links: [
      { href: "/gioi-thieu", label: "Về chúng tôi" },
      { href: "/forfolio", label: "Portfolio" },
      { href: "/blog", label: "Blog" },
      { href: "/tuyen-dung", label: "Tuyển dụng" },
    ],
  },
  {
    title: "Sản phẩm",
    links: [
      { href: "/san-pham?occasion=tet", label: "Quà Tết" },
      { href: "/san-pham?occasion=trung-thu", label: "Quà Trung Thu" },
      { href: "/san-pham?occasion=sinh-nhat", label: "Quà Sinh nhật" },
      { href: "/san-pham", label: "Tất cả sản phẩm" },
    ],
  },
  {
    title: "Doanh nghiệp",
    links: [
      { href: "/qua-tang-doanh-nghiep", label: "Quà tặng B2B" },
      { href: "/bat-dau-du-an-moi", label: "Báo giá ngay" },
      { href: "/tro-thanh-doi-tac", label: "Trở thành đối tác" },
      { href: "/gift-finder", label: "Tìm quà phù hợp" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { href: "/tai-khoan", label: "Tài khoản" },
      { href: "/tai-khoan", label: "Đơn hàng của tôi" },
      { href: "mailto:hello@giftcraft.vn", label: "hello@giftcraft.vn" },
      { href: "tel:0909000000", label: "0909 000 000" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-muted hover:text-brand transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-muted">
            © {new Date().getFullYear()} GiftCraft Studio. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-sm text-ink-muted">
            Làm với tình yêu tại Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/layout/Footer.tsx
git commit -m "feat: add Footer layout component"
```

---

## Task 12: components/layout/MobileMenu.tsx

**Files:**
- Create: `frontend/src/components/layout/MobileMenu.tsx`

- [ ] **Step 1: Tạo MobileMenu**

```tsx
// frontend/src/components/layout/MobileMenu.tsx
"use client";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

interface NavLink { href: string; label: string; }

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ open, onClose, links, isLoggedIn, isAdmin, onLogout }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => { onClose(); }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <nav className="absolute top-0 left-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-display font-bold text-lg text-ink">Menu</span>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-6 py-3 text-sm text-ink hover:bg-surface-alt hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-border p-6 space-y-2">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="block text-sm text-ink-muted hover:text-brand py-2">
                  Admin
                </Link>
              )}
              <Link href="/tai-khoan" className="block text-sm text-ink-muted hover:text-brand py-2">
                Tài khoản
              </Link>
              <button onClick={onLogout} className="block text-sm text-brand py-2 w-full text-left">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="btn-secondary w-full text-center text-sm py-2">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="btn-primary w-full text-center text-sm py-2">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/layout/MobileMenu.tsx
git commit -m "feat: add MobileMenu layout component"
```

---

## Task 13: components/layout/Header.tsx

**Files:**
- Create: `frontend/src/components/layout/Header.tsx`

- [ ] **Step 1: Tạo Header mới**

```tsx
// frontend/src/components/layout/Header.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useEffect, useRef, useState } from "react";
import { getOrCreateSessionId } from "@/lib/session";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/qua-tang-doanh-nghiep", label: "Doanh nghiệp" },
  { href: "/gift-finder", label: "Tìm quà" },
  { href: "/forfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, fetch } = useCartStore();
  const { user, logout, init } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getOrCreateSessionId();
    fetch().catch(() => {});
    init();
  }, [fetch, init]);

  useEffect(() => {
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  const totalItems = cart?.total_items ?? 0;
  const isAdmin = user?.role === "admin";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="font-display font-bold text-xl text-ink hover:text-brand transition-colors">
              GiftCraft
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm transition-colors ${
                    pathname.startsWith(l.href)
                      ? "text-brand font-semibold"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-ink-muted hover:text-brand transition-colors"
                aria-label="Tìm kiếm"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link href="/gio-hang" className="relative p-2 text-ink-muted hover:text-brand transition-colors">
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User menu (desktop) */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-ink-muted hover:text-brand transition-colors"
                  aria-label="Tài khoản"
                >
                  <UserCircleIcon className="w-5 h-5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-sm shadow-lg py-1 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-xs text-ink-muted border-b border-border">
                          {user.name}
                        </div>
                        {isAdmin && (
                          <Link href="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                            Admin
                          </Link>
                        )}
                        <Link href="/tai-khoan" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Tài khoản
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-brand hover:bg-surface-alt"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/dang-nhap" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Đăng nhập
                        </Link>
                        <Link href="/dang-ky" className="block px-4 py-2 text-sm text-ink hover:bg-surface-alt">
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-ink-muted hover:text-ink"
                aria-label="Menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="border-t border-border bg-white">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm quà tặng..."
                className="input-field"
              />
            </form>
          </div>
        )}
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
        isLoggedIn={!!user}
        isAdmin={isAdmin}
        onLogout={() => { logout(); setMobileOpen(false); }}
      />
    </>
  );
}
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep -E "Header|MobileMenu" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/Header.tsx frontend/src/components/layout/MobileMenu.tsx
git commit -m "feat: add Header and MobileMenu layout components"
```

---

## Task 14: Update [locale]/layout.tsx

**Files:**
- Modify: `frontend/src/app/[locale]/layout.tsx`

- [ ] **Step 1: Rewrite [locale]/layout.tsx**

File này chứa `<html>/<body>`, metadata, font setup, ChatWidget, ServiceWorkerRegistration. Giữ nguyên cấu trúc, thay font + thêm Footer + ToastContainer:

```tsx
// frontend/src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from "next";
import { Spectral, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "../globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastContainer from "@/components/ui/Toast";
import ChatWidget from "@/components/ChatWidget";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const spectral = Spectral({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GiftCraft Studio — Quà tặng doanh nghiệp & cá nhân",
    template: "%s — GiftCraft Studio",
  },
  description:
    "Quà tặng cao cấp, đặt theo yêu cầu, giao nhanh toàn quốc. Chuyên B2B từ 20 sản phẩm.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "GiftCraft" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#B91C1C",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const activeLocale = await getLocale();

  return (
    <html
      lang={activeLocale}
      className={`${spectral.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastContainer />
            <ChatWidget />
          </Providers>
        </NextIntlClientProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Chạy build check**

```bash
cd frontend && npm run build 2>&1 | tail -30
```

Expected: build pass (lỗi từ pages chưa rewrite là chấp nhận được).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[locale\]/layout.tsx
git commit -m "feat: update locale layout — Spectral, Footer, Toast, keep ChatWidget + SW"
```

---

## Task 15: components/shop/ProductCard.tsx

**Files:**
- Create: `frontend/src/components/shop/ProductCard.tsx`

- [ ] **Step 1: Tạo ProductCard mới**

```tsx
// frontend/src/components/shop/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/formatPrice";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, slug, retail_price, b2b_min_price, cover_image, stock_status, is_customizable } = product;

  return (
    <Link href={`/san-pham/${slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-surface-alt overflow-hidden mb-3">
        {cover_image ? (
          <Image
            src={cover_image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted text-sm">
            Chưa có ảnh
          </div>
        )}
        {stock_status === "out_of_stock" && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="muted">Hết hàng</Badge>
          </div>
        )}
        {is_customizable && (
          <div className="absolute top-2 left-2">
            <Badge variant="brand">Tùy chỉnh</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-sm text-ink font-medium leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {name}
        </p>
        <p className="text-sm font-semibold text-ink">
          {formatPrice(retail_price)}
        </p>
        {b2b_min_price && (
          <p className="text-xs text-ink-muted">
            B2B từ {formatPrice(b2b_min_price)}
          </p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Type check**

```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "ProductCard" || echo "no errors"
```

Expected: `no errors`

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/shop/ProductCard.tsx
git commit -m "feat: add ProductCard shop component"
```

---

## Task 16: Homepage sections

**Files:**
- Rewrite: `frontend/src/app/_home/HomePage.tsx`

- [ ] **Step 1: Rewrite HomePage.tsx với tất cả sections (Layout A)**

```tsx
// frontend/src/app/_home/HomePage.tsx
import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/types";
import ProductCard from "@/components/shop/ProductCard";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getFeaturedProducts(): Promise<ProductListItem[]> {
  try {
    const res = await fetch(`${API}/products?per_page=8`, { next: { revalidate: 900 } });
    const json = await res.json();
    return json.data?.items ?? [];
  } catch { return []; }
}

const OCCASIONS = [
  { label: "Quà Tết", slug: "tet", icon: "🏮" },
  { label: "Trung Thu", slug: "trung-thu", icon: "🌕" },
  { label: "Sinh nhật", slug: "sinh-nhat", icon: "🎂" },
  { label: "Khai trương", slug: "khai-truong", icon: "🎊" },
  { label: "Tri ân", slug: "tri-an", icon: "🙏" },
  { label: "Cưới hỏi", slug: "cuoi-hoi", icon: "💍" },
] as const;

const PARTNERS = ["Tập đoàn ABC", "Vingroup", "FPT", "Masan", "Vinamilk", "MB Bank"];

const PORTFOLIO_IMAGES = Array.from({ length: 6 }, (_, i) =>
  `https://placehold.co/600x600/F9FAFB/6B7280?text=Project+${i + 1}`
);

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[75vh] min-h-[500px] bg-ink overflow-hidden">
        <Image
          src="https://placehold.co/1920x1080/111111/FFFFFF?text=GiftCraft+Hero"
          alt="GiftCraft Studio — Quà tặng cao cấp"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-4">
              Bộ sưu tập Tết 2026
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-2xl leading-tight">
              Quà tặng tinh tế,<br />giao đúng cảm xúc
            </h1>
            <p className="text-white/70 text-base mb-8 max-w-md">
              Thiết kế riêng cho từng dịp — từ quà Tết cá nhân đến quà doanh nghiệp số lượng lớn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/san-pham" className="btn-primary">
                Xem bộ sưu tập
              </Link>
              <Link href="/bat-dau-du-an-moi" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                Báo giá doanh nghiệp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Split ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/san-pham" className="group relative h-64 bg-surface-alt overflow-hidden block">
            <Image
              src="https://placehold.co/800x600/F9FAFB/6B7280?text=Qua+ca+nhan"
              alt="Quà cá nhân"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">
                Tết · Trung Thu · Sinh nhật
              </p>
              <h2 className="font-display text-2xl font-bold text-white">Quà cá nhân</h2>
            </div>
          </Link>
          <Link href="/qua-tang-doanh-nghiep" className="group relative h-64 bg-ink overflow-hidden block">
            <Image
              src="https://placehold.co/800x600/111111/FFFFFF?text=Qua+doanh+nghiep"
              alt="Quà doanh nghiệp"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                In logo · Số lượng lớn · Báo giá 24h
              </p>
              <h2 className="font-display text-2xl font-bold text-white">Quà doanh nghiệp</h2>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                href={`/san-pham?occasion=${o.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm text-ink-muted hover:border-brand hover:text-brand transition-colors"
              >
                <span>{o.icon}</span>
                <span className="font-medium">{o.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-sm text-brand hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Portfolio Gallery ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Dự án thực tế</h2>
          <Link href="/forfolio" className="text-sm text-brand hover:underline font-medium">
            Xem portfolio
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PORTFOLIO_IMAGES.map((src, i) => (
            <div key={i} className="relative aspect-square bg-surface-alt overflow-hidden group">
              <Image
                src={src}
                alt={`Portfolio ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Partner Logos ── */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest text-center mb-8">
            Đối tác doanh nghiệp
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {PARTNERS.map((name) => (
              <div
                key={name}
                className="text-sm font-semibold text-ink-muted opacity-40 hover:opacity-70 transition-opacity"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B CTA Banner ── */}
      <section className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-4">
              Dành cho doanh nghiệp
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Quà tặng in logo,<br />số lượng lớn, giao đúng hạn
            </h2>
            <p className="text-white/60 mb-8">
              Phục vụ 500+ doanh nghiệp. Báo giá trong 24 giờ. Đóng gói và giao hàng toàn quốc.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/bat-dau-du-an-moi" className="btn-primary">
                Bắt đầu dự án
              </Link>
              <Link href="/qua-tang-doanh-nghiep" className="btn-ghost text-white hover:text-brand">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/_home/HomePage.tsx
git commit -m "feat: rewrite Homepage with Layout A sections"
```

---

## Task 17: Verify build + type check cuối

- [ ] **Step 1: Full type check**

```bash
cd frontend && npx tsc --noEmit 2>&1
```

Fix bất kỳ lỗi nào liên quan đến files trong Plan 1.

- [ ] **Step 2: Lint**

```bash
cd frontend && npm run lint 2>&1
```

Fix bất kỳ ESLint error nào.

- [ ] **Step 3: Build**

```bash
cd frontend && npm run build 2>&1
```

Expected: build success. Lỗi từ pages chưa rewrite (Plan 2/3) là chấp nhận được nếu là type warning không phải error.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: Plan 1 complete — design system, layout, homepage"
```

---

## Checklist hoàn thành Plan 1

- [ ] Branch `rewrite/frontend` tạo thành công
- [ ] `globals.css` với design tokens mới
- [ ] Font Spectral + Inter load qua next/font
- [ ] `components/ui/` — Button, Badge, Input, Skeleton, Modal, Drawer, Toast
- [ ] `store/toast.ts` — Zustand toast store
- [ ] `components/layout/` — Header, MobileMenu, Footer
- [ ] `components/shop/ProductCard.tsx`
- [ ] Homepage render đúng với 8 sections (Layout A)
- [ ] `tsc --noEmit` pass
- [ ] `npm run lint` pass
- [ ] `npm run build` pass

**Sau khi Plan 1 hoàn tất → tiếp tục Plan 2: Shop Core (Product pages + Cart + Checkout)**
