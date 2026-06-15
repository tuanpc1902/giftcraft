# GiftCraft Studio — Frontend Rewrite Design Spec
_Ngày: 2026-06-15_

---

## Tổng quan

Rewrite hoàn toàn frontend Next.js của GiftCraft Studio — website thương mại điện tử bán quà tặng cao cấp tại Việt Nam (quà Tết, Trung Thu, sinh nhật, khai trương, B2B doanh nghiệp).

**Phạm vi**: Frontend only. Backend Laravel 13 giữ nguyên 100% — không đổi API, không đổi DB, không đổi services.

**Approach**: Component-first trên branch `rewrite/frontend`. Build design system trước, sau đó assemble từng page.

**Tính năng**: Giữ nguyên toàn bộ tính năng hiện tại — không thêm, không bớt.

---

## Brand Identity

| Thuộc tính | Giá trị |
|---|---|
| Phong cách | Hiện đại, tối giản, editorial |
| Reference | hangstore.net, Artifact Uprising, Zola |
| Cảm xúc | Tinh tế, đáng tin cậy, thời thượng, ấm áp |
| Thị trường | Việt Nam — B2C + B2B doanh nghiệp |

---

## Design System

### Color Palette

```css
--color-brand:       #B91C1C;   /* đỏ son — accent duy nhất */
--color-brand-light: #FEE2E2;
--color-brand-dark:  #991B1B;
--color-ink:         #111111;   /* primary text */
--color-ink-muted:   #6B7280;   /* secondary text */
--color-surface:     #FFFFFF;
--color-surface-alt: #F9FAFB;
--color-border:      #F3F4F6;
--color-dark:        #111111;   /* dark section backgrounds */
```

Không dùng gradient rực rỡ. Không dùng màu cam/vàng.

### Typography

```css
--font-display: "Playfair Display", Georgia, serif;    /* h1, h2, h3 */
--font-body:    "Inter", "Be Vietnam Pro", sans-serif; /* body, label, button */
```

Load qua `next/font` — tự động `font-display: swap`.  
Không dùng font-size nhỏ hơn 12px (tiếng Việt cần readable).  
Letter-spacing `-0.025em` cho headings lớn.

### Utility Classes (globals.css)

```css
.btn-primary   — bg-brand text-white, rounded-sm, hover:bg-brand-dark
.btn-secondary — border border-ink text-ink, rounded-sm, hover:bg-surface-alt
.btn-ghost     — text-ink, hover:text-brand
.input-field   — border border-border, rounded-sm, focus:border-brand
.section-title — font-display text-2xl font-bold text-ink tracking-tight
.badge         — text-xs font-semibold px-2.5 py-1 rounded-full
```

### Component Primitives (`components/ui/`)

| Component | Variants |
|---|---|
| `Button` | primary, secondary, ghost — size sm/md/lg |
| `Badge` | default, brand (đỏ), success, muted |
| `Input` / `Textarea` / `Select` | unified `.input-field` |
| `Skeleton` | card, text, image — thay thế hoàn toàn spinner |
| `Modal` | center overlay + close button |
| `Drawer` | right-side panel (admin detail, cart) |
| `Toast` | top-right, auto-dismiss 3s, Zustand store |

---

## Architecture

### Folder Structure

```
frontend/src/
├── app/
│   ├── globals.css              ← Design system tokens + utility classes
│   ├── layout.tsx               ← Root layout: Providers, fonts
│   └── [locale]/
│       ├── page.tsx             ← Homepage (Server Component)
│       ├── layout.tsx           ← Locale layout: Header, Footer
│       ├── (shop)/
│       │   ├── san-pham/        ← Product list + detail
│       │   ├── gio-hang/        ← Cart
│       │   ├── checkout/        ← Checkout flow
│       │   └── don-hang/        ← Order detail
│       ├── admin/               ← All admin pages (Client Components)
│       ├── dang-nhap/
│       ├── dang-ky/
│       ├── tai-khoan/
│       ├── blog/
│       ├── forfolio/
│       ├── gift-finder/
│       ├── qua-tang-doanh-nghiep/
│       ├── bat-dau-du-an-moi/
│       ├── tim-kiem/
│       ├── tuyen-dung/
│       └── tro-thanh-doi-tac/
├── components/
│   ├── ui/                      ← Design system primitives
│   ├── shop/                    ← ProductCard, ProductGrid, CartDrawer...
│   ├── layout/                  ← Header, Footer, MobileMenu
│   └── shared/                  ← ChatWidget, ReviewStars, SkeletonCard...
├── lib/                         ← Giữ nguyên: api.ts, formatPrice.ts, session.ts
├── store/                       ← Giữ nguyên logic: cart.ts, auth.ts + thêm toast.ts
└── types/                       ← Giữ nguyên: index.ts
```

### Không thay đổi

- `lib/api.ts` — Axios instance, Bearer + X-Session-ID interceptors
- `lib/formatPrice.ts`, `lib/session.ts`
- `store/cart.ts`, `store/auth.ts` — giữ nguyên toàn bộ logic
- `types/index.ts` — giữ nguyên interfaces
- `i18n/`, `middleware.ts` — giữ nguyên next-intl config

### Thêm mới

- `store/toast.ts` — Zustand toast store (~30 lines, không dùng thư viện ngoài)
- `components/ui/` — directory mới cho design system primitives

---

## Homepage Layout (Layout A — Hangstore Style)

```
<Header />                  sticky, logo trái, nav phải, cart + search icon
<HeroSection />             full-width image, text overlay seasonal, 1 CTA
<CategorySplit />           2 card lớn: "Quà cá nhân" | "Quà doanh nghiệp"
<OccasionsRow />            tab ngang: Tết · Trung Thu · Sinh nhật · Khai trương · Tri ân · Cưới hỏi
<FeaturedProducts />        grid 4 cột, ISR 15 phút
<PortfolioGallery />        grid ảnh 3×2 kiểu Instagram (portfolio thực tế)
<PartnerLogos />            row logo grayscale đối tác doanh nghiệp
<B2bCtaBanner />            dark background, text + nút báo giá
<Footer />                  4 cột
```

---

## Pages

### Danh sách sản phẩm (`/san-pham`)

- Server Component shell + Client filter sidebar
- Grid 4 cột desktop / 2 cột mobile
- `ProductCard`: ảnh 1:1, tên, giá, badge "Có thể tùy chỉnh", hover show ảnh 2
- Filter: danh mục, dịp tặng, khoảng giá, chỉ hàng tùy chỉnh
- Load more / pagination

### Chi tiết sản phẩm (`/san-pham/[slug]` — ISR 1h)

- `ProductGallery`: ảnh lớn + thumbnails
- `ProductInfo`: tên, giá, stock badge, rating summary
- `B2bPricingTable`: 5 tier (20/50/100/200/300+)
- `AddToCartForm`: qty selector + add to cart ("use client")
- `B2bQuoteModal`: trigger từ nút "Yêu cầu tùy chỉnh"
- `ProductTabs`: Mô tả | Đánh giá | Vận chuyển
- `RelatedProducts`: grid 4 sản phẩm

### Checkout Flow (`/checkout`)

4 bước dùng `useReducer` (giữ nguyên pattern):  
Thông tin giao hàng → Phương thức vận chuyển → Thanh toán → Xác nhận

### Admin

Tất cả Client Components. Layout: sidebar cố định trái + main content.

| Route | Page |
|---|---|
| `/admin` | Dashboard — stats cards |
| `/admin/don-hang` | Orders — table + right drawer |
| `/admin/san-pham` | Products — table + add/edit modal |
| `/admin/b2b` | B2B quotes — table + status drawer |
| `/admin/blog` | Blog CMS — list + editor |
| `/admin/forfolio` | Portfolio — grid + CRUD |
| `/admin/danh-gia` | Reviews — approve/reject |
| `/admin/nha-cung-cap` | Supplier apps — table + status |
| `/admin/tuyen-dung` | Job apps — table + status |

### Các pages khác

Giữ nguyên route và logic, rewrite UI theo design system mới:  
`/dang-nhap`, `/dang-ky`, `/tai-khoan`, `/tai-khoan/du-an`, `/qua-tang-doanh-nghiep`, `/bat-dau-du-an-moi`, `/forfolio`, `/gift-finder`, `/blog`, `/blog/[slug]`, `/tim-kiem`, `/tuyen-dung`, `/tro-thanh-doi-tac`

---

## Data Flow

### Server Components

```ts
const res = await fetch(`${INTERNAL_API}/products`, {
  next: { revalidate: 900 }
});
// Revalidate qua /api/revalidate webhook từ Laravel (NextRevalidationService)
```

ISR schedule:
- Homepage: 15 phút
- Product list: 15 phút  
- Product detail: 1 giờ
- Blog: 1 giờ

### Client Components

```ts
import api from "@/lib/api";
// Tự động attach Bearer token + X-Session-ID
const { data } = await api.get("/products");
```

---

## Error Handling

| Tình huống | Xử lý |
|---|---|
| API 5xx | `error.tsx` per-segment, message + retry button |
| 404 | `not-found.tsx` per-segment |
| Auth 401 | Axios interceptor → `logout()` + redirect `/dang-nhap` |
| Stock hết khi checkout | Toast "Sản phẩm đã hết hàng" + disable nút |
| Network offline | Toast persistent "Mất kết nối" |
| Form validation | Inline error dưới field — không dùng `alert()` |

---

## Performance

- `next/image` với `sizes` attribute đúng trên mọi image
- Skeleton thay spinner ở tất cả Client Components
- `next/font` cho Playfair Display + Inter — tự động `font-display: swap`
- Không load thư viện animation nặng — dùng Tailwind `transition-*` thuần

---

## Testing

**Backend**: Giữ nguyên 22 tests Laravel — `php artisan test --parallel`

**Frontend CI** (theo thứ tự):
1. `tsc --noEmit` — type check
2. `npm run lint` — ESLint
3. `npm run build` — build gate

**E2E** (sau khi rewrite xong): Playwright cho critical path — login → add to cart → checkout

---

## Implementation Approach

**Branch**: `rewrite/frontend`

**Thứ tự build**:
1. `globals.css` — design tokens + utility classes
2. `components/ui/` — Button, Badge, Input, Skeleton, Modal, Drawer, Toast
3. `components/layout/` — Header, Footer, MobileMenu
4. Homepage + components shop
5. Product list + detail
6. Cart + Checkout
7. Auth pages (login, register)
8. Account pages
9. Admin pages
10. Remaining pages (B2B, Portfolio, Blog, Gift Finder, Search, Careers, Supplier)

---

## Constraints (Tailwind v4)

- Không có `tailwind.config.ts` — theme trong `globals.css` dưới `@theme`
- `bg-gradient-to-br` → `bg-linear-to-br`
- `h-4.5` / `w-4.5` không tồn tại → dùng `h-[18px]`
- `onSubmit` trong Server Component → không được phép, phải `"use client"`
- Luôn dùng `<Image>` từ `next/image` — không dùng `<img>`
- `useSearchParams()` cần wrap `<Suspense>`
