# GiftCraft Studio — Design Brief

Prompt dùng để yêu cầu Claude thiết kế UI/UX cho GiftCraft Studio.

---

```
Tôi cần bạn thiết kế UI/UX hoàn chỉnh cho GiftCraft Studio — 
website thương mại điện tử bán quà tặng cao cấp tại Việt Nam 
(quà Tết, Trung Thu, sinh nhật, khai trương, quà doanh nghiệp B2B).

## Brand Identity

- Tên: GiftCraft Studio
- Thị trường: Việt Nam (B2C + B2B doanh nghiệp)
- Phong cách: Hiện đại, tối giản, editorial — như Artifact Uprising, 
  Zola, hangstore.net
- Cảm xúc muốn truyền tải: Tinh tế, đáng tin cậy, thời thượng nhưng 
  vẫn ấm áp

## Color Palette

- Background: #FFFFFF (trắng thuần)
- Primary text: #111111
- Accent (duy nhất): #B91C1C (đỏ son — màu Tết Việt Nam)
- Accent light: #FEE2E2
- Secondary text: #6B7280
- Border/divider: #F3F4F6
- Dark section bg: #111111 hoặc #1a1a1a
- KHÔNG dùng gradient rực rỡ, KHÔNG dùng màu cam/vàng

## Typography

- Heading: Font serif hoặc display (Playfair Display, Cormorant Garant, 
  hoặc Be Vietnam Pro Bold)
- Body: Sans-serif sạch (Inter, Be Vietnam Pro)
- Tiếng Việt phải hiển thị đẹp (dấu thanh rõ ràng)

## Trang cần thiết kế (theo thứ tự ưu tiên)

### 1. Homepage
Thứ tự sections:
- Navigation: Logo trái hoặc giữa, links phải, cart icon + search icon
- Hero: Full-width, ảnh sản phẩm đẹp, text overlay, seasonal 
  (ví dụ "Quà Tết 2026"), 1 CTA chính
- Category split: 2 card lớn — "Quà cá nhân" (Tết/Trung Thu/Sinh nhật) 
  và "Quà doanh nghiệp" (B2B, in logo, số lượng lớn)
- Occasions tabs: Tết 🏮 · Trung Thu 🌕 · Sinh nhật 🎂 · 
  Khai trương 🎊 · Tri ân 🙏 · Cưới hỏi 💍
- Featured products: Grid 4 cột, product card minimal
- Social proof: Ảnh grid kiểu Instagram (portfolio/thực tế)
- Partner logos: Row logo đối tác doanh nghiệp (grayscale)
- B2B CTA banner: Dark background, text + button báo giá
- Footer: 4 cột

### 2. Trang danh sách sản phẩm (/san-pham)
- Filter sidebar trái: Danh mục, dịp tặng, giá, tùy chỉnh
- Product grid: 3-4 cột, lazy load
- Product card: Ảnh square, tên, giá, badge "Có thể tùy chỉnh", 
  hover show thêm ảnh

### 3. Trang chi tiết sản phẩm (/san-pham/[slug])
- Image gallery: Ảnh lớn + thumbnails
- Info: Tên, giá, badge dịp, rating, mô tả
- Bảng giá B2B 5 tier (số lượng 20/50/100/200/300+)
- Add to cart + Yêu cầu tùy chỉnh
- Tab: Mô tả | Đánh giá | Thông tin giao hàng

### 4. Giỏ hàng + Checkout
- Cart sidebar/page: Minimal, item list, voucher, total
- Checkout 4 bước: Thông tin → Vận chuyển → Thanh toán → Xác nhận

### 5. Admin Dashboard
- Sidebar navigation
- Bảng quản lý đơn hàng, sản phẩm, B2B quotes, blog
- Design clean, professional, không cần fancy

## Component Library cần thiết kế

- Button: Primary (đỏ son filled), Secondary (outline), Ghost
- Input, Select, Textarea (Tailwind v4 style)
- Product Card (list + detail)
- Category Card (large image + overlay text)
- Badge: "Tết", "Trung Thu", "Tùy chỉnh", "In stock", "Hết hàng"
- Toast notification
- Modal / Drawer
- Navigation (desktop + mobile hamburger)
- Footer

## UX Rules

- Mobile-first: 375px breakpoint
- Hình ảnh: Luôn dùng next/image, aspect-ratio square (1:1) cho 
  product card
- Loading state: Skeleton placeholder, không spinner
- Không dùng emoji trong UI chính thức (chỉ dùng trong text content)
- Spacing: Generous white space — đừng nhét quá nhiều thứ
- CTA: Mỗi section chỉ 1 CTA chính

## Tech Stack (để designer biết constraints)

- Next.js 16 App Router + Tailwind CSS v4
- Tailwind v4: KHÔNG có tailwind.config.ts, theme trong globals.css 
  dưới @theme
- Tailwind v4: bg-gradient-to-br → bg-linear-to-br
- Tailwind v4: h-4.5 không tồn tại, dùng h-[18px]
- Images: next/image với remotePatterns
- i18n: next-intl (vi mặc định, /en/ cho tiếng Anh)

## Reference websites

- hangstore.net (layout tham khảo chính — editorial, minimal, 
  split B2C/B2B)
- Artifact Uprising (typography quality)
- Zola (clean product grid)

## Deliverable

Hãy viết code React/TSX + Tailwind v4 cho từng component/page. 
Bắt đầu với Homepage trước. Code phải:
- Dùng "use client" chỉ khi cần interactive
- Server Component cho pages không cần state
- Placeholder images từ placehold.co hoặc unsplash
- Responsive (mobile + desktop)
- Tiếng Việt trong UI text
```
