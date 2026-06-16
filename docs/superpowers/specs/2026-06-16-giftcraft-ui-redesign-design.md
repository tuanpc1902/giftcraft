# GiftCraft Studio — UI/UX Redesign Spec
**Date:** 2026-06-16  
**Branch:** rewrite/frontend  
**Status:** Approved for design → prompt generation

---

## 1. Design Direction

**Style:** B+C Hybrid — Modern & Fresh (B) × Warm Artisan (C)

| Token | Value | Notes |
|---|---|---|
| Background | `#FDFAF6` | Warm cream, not pure white |
| Surface alt | `#F5F0EA` | Warmer section tint |
| Border | `#EAE2D6` | Warm border (replaces cold `#F3F4F6`) |
| Brand red | `#B91C1C` | Primary CTA, accent |
| Gold accent | `#D4AF37` | Hero eyebrow, premium highlight |
| Amber | `#B45309` | Secondary eyebrow, sub-labels |
| Ink | `#111111` | Headings, body text |
| Ink muted | `#6B7280` | Secondary text |
| Display font | Georgia serif | Headings — tight tracking −0.5px |
| Body font | system-ui sans | Body — antialiased |

---

## 2. Logo System

**Icon:** Gift box (hộp quà) đơn giản hóa
- Khối vuông bo góc (border-radius 8px), gradient đỏ `#B91C1C → #DC2626`
- Đường ribbon ngang trắng 30% opacity ở giữa
- Tam giác nơ (bow) trắng 45% opacity ở phần trên
- Dot knot trắng 90% opacity ở giao điểm

**Wordmark:** "GiftCraft" — Georgia serif, font-weight 700, tracking −0.4px  
**Sub-label:** "Studio" — 9px, `#B45309`, letter-spacing 3px, uppercase

**Usage:**
- Header: icon 36×36px + wordmark cạnh nhau, gap 12px
- Spinner: icon 32×32px ở trung tâm, vòng xoay đỏ bao ngoài
- Favicon: icon 32×32px standalone

---

## 3. Animation System (4 contexts)

### A — Elegant & Refined (Hero, Typography)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out mạnh)
- Duration: 0.9s
- Effect: `fadeUp` — opacity 0→1, translateY 24px→0
- Stagger: 150ms giữa các element
- Dùng cho: hero title, hero sub, CTA buttons, section titles

### B — Playful & Energetic (Product cards, B2C)
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring bounce, overshoot)
- Duration: 0.6s
- Effect: `popIn` — scale 0.88→1.03→1, opacity 0→1, translateY 20px→0
- Hover: `translateY(-8px)`, `box-shadow` tăng
- Dùng cho: product cards, occasion pills, badge tags

### C — Cinematic & Bold (B2B, Stats)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Duration: 0.8s
- Effect: `clip-path reveal` — `inset(0 100% 0 0)` → `inset(0 0% 0 0)`
- Thêm: `glow pulse` radial gradient bg, counter animation cho stat numbers
- Dùng cho: B2B hero, stats bar, CTA banner

### D — Parallax & Float (Portfolio, Lookbook)
- Effect: product cards nổi lên xuống so le nhau (translateY 0 ↔ −10px, stagger 0.5s)
- Reveal: `blur-in` — filter blur 12px→0, scale 0.94→1, opacity 0→1
- Text: shimmer gradient animation trên heading
- Dùng cho: portfolio grid, forfolio page, lookbook sections

---

## 4. Scroll Reveal (toàn site)
- `IntersectionObserver`, threshold 0.1, rootMargin `0px 0px -40px 0px`
- Default: `fadeUp` elegant (translateY 24px, opacity 0, duration 0.6s)
- Stagger class: delay tăng 80ms mỗi item trong grid

---

## 5. Screen Specs

### 5.1 Header (sticky)
- Height: 68px
- Background: `rgba(253,250,246,0.95)` + `backdrop-blur(20px)`
- Border-bottom: 1px `#EAE2D6`
- Scroll shadow: `box-shadow: 0 2px 20px rgba(185,28,28,0.05)`
- Left: Logo icon + wordmark
- Center: Nav links (5 items, 32px gap, 13px, hover color `#B91C1C`)
- Right: Search icon button + Cart icon button (với badge đỏ) + "Báo giá" CTA button
- Icon buttons: 36×36px, border `#EAE2D6`, border-radius 8px, hover border `#B91C1C`
- Active nav: `font-weight 600`, `color #B91C1C`
- Search: mở expandable input bên dưới header với animation `slideDown`

### 5.2 Mobile Menu (slide-in từ phải)
- Overlay: `bg-black/40` backdrop blur
- Drawer: width 80vw, max 340px, background `#FDFAF6`
- Logo ở top, nav links dọc (48px height mỗi link, border-bottom `#EAE2D6`)
- Animation: `translateX(100%)` → `translateX(0)`, duration 0.35s ease-out
- Close button X góc trên phải

### 5.3 Homepage — Hero Section
- Chiều cao: 560px (80vh min)
- Background: gradient tối `#2D0A0A → #1C1007 → #0F1A2E` (placeholder cho ảnh thật)
- Radial glow: đỏ nhạt phía trái, amber nhạt phía phải
- Overlay: `linear-gradient(to right, rgba(28,10,7,0.88) → transparent)`
- Content: bottom-left, padding 64px bottom 80px
  - Eyebrow pill: `✦ Bộ sưu tập Tết 2026` — gold border + bg tint, border-radius 24px
  - H1: 52px, Georgia serif, trắng, line-height 1.1, gold accent trên chữ thứ 2
  - Sub: 15px, `rgba(255,255,255,0.55)`, line-height 1.75
  - CTA row: "Xem bộ sưu tập →" (đỏ solid) + "Báo giá doanh nghiệp" (border trắng + glassmorphism)
- Scroll indicator: bên phải giữa màn, text vertical "SCROLL" + đường kẻ + dot animation

### 5.4 Stats Bar
- Background `#FDFAF6`, border-top 3px đỏ `#B91C1C`
- 4 columns: `500+`, `24h`, `98%`, `63` — Georgia serif 32px, đỏ
- Padding 28px top/bottom, divider giữa các stat
- Animation: Cinematic counterUp khi scroll vào

### 5.5 Category Split Cards
- 2 cột equal, gap 20px, border-radius 12px, height 300px
- Card 1 (Quà cá nhân): gradient đỏ `#7F1D1D → #DC2626`
- Card 2 (Quà doanh nghiệp): gradient amber `#1C1007 → #B45309`, badge "Báo giá 24h"
- Overlay gradient bottom-up
- Tag pill trắng + title serif trắng + arrow text
- Hover: image scale 1.05, arrow gap tăng, text sáng hơn

### 5.6 Featured Products Grid
- 4 columns, gap 24px
- Mỗi card: border-radius 12px, border `#EAE2D6`, background trắng
- Image area 196px, badge pill góc trên trái
- Info: product name (Georgia 14px bold), sub (11px muted), price (15px đỏ bold), old price gạch
- Hover: `translateY(-8px)`, shadow `0 16px 40px rgba(0,0,0,0.10)`, image zoom 1.08
- Animation: popIn spring (Style B)

### 5.7 Partner Logos Marquee — 2 hàng so le
- Section padding 48px top/bottom
- **Hàng 1**: logo thật (SVG/PNG) của Vingroup, FPT, Techcombank, Grab, VinFast, Shopee — tốc độ 28s
- **Hàng 2**: Vinamilk, Masan, MB Bank, Viettel, Saigon Co.op, PNJ — offset khởi đầu 25%, tốc độ 22s
- Cả 2 hàng cùng chiều phải → trái, nhưng tốc độ khác nhau → hiệu ứng so le liên tục
- Logo card: background trắng, border `#EAE2D6`, border-radius 10px, padding `12px 22px`
- Hover card: border đỏ, `translateY(-3px)`, shadow nhẹ
- Fade mask 2 bên: gradient trắng 100px che mép
- Logo thật: dùng file SVG chính thức từ brand guidelines các công ty

### 5.8 Testimonials
- 3 cột, gap 24px
- Card: background `#F5F0EA`, border-radius 12px, padding 28px
- Quote mark: `"` serif 36px màu đỏ
- Text: 13px, `#6B7280`, line-height 1.75
- Avatar: 40×40px tròn, ring đỏ nhạt
- Hover: `translateY(-4px)`, shadow tăng

### 5.9 B2B CTA Banner (full-width)
- Background tối `#111111` + ảnh opacity 15%
- Animation: Cinematic style — glow pulse đỏ
- Left: eyebrow + H2 lớn serif trắng + sub + 2 CTA buttons
- Right (desktop): animated stats counter (Cinematic style)

### 5.10 Footer
- Background `#111111`
- Logo trắng + tagline
- 4 cột links
- Bottom bar: copyright + social icons
- Warm divider `rgba(255,255,255,0.08)`

---

### 5.11 Product Listing Page (`/san-pham`)
- Sticky filter sidebar trái (desktop) / Bottom sheet filter (mobile)
- Grid: 3 cột desktop, 2 cột mobile
- Sort dropdown: border `#EAE2D6`, hover đỏ
- Pagination hoặc infinite scroll với skeleton cards
- Occasion pills row ngang trên cùng (scrollable)

### 5.12 Product Detail Page (`/san-pham/[slug]`)
- Layout 2 cột: gallery trái, info phải
- Gallery: ảnh lớn + thumbnails hàng dưới, click thumbnail → swap với Elegant fade
- Info: breadcrumb → tên SP (Georgia 28px) → giá → số lượng stepper → CTA "Thêm vào giỏ" (đỏ, full-width) → B2B pricing table accordion
- Reviews section phía dưới: star rating + list + form submit
- Related products: ProductCard grid (popIn animation khi scroll)

### 5.13 B2B Landing Page (`/qua-tang-doanh-nghiep`)
- Hero: Cinematic style, tối, counter stats animation
- Process steps: 1→2→3→4 với icon và line connector animate
- Portfolio showcase: Parallax float (Style D)
- Quote CTA form: inline hoặc modal

### 5.14 Login / Register Pages
- Centered card, max-width 420px, background trắng, shadow
- Logo ở trên
- Input fields: border `#EAE2D6`, focus border đỏ + ring
- Button: full-width đỏ, border-radius 8px
- Elegant fadeUp animation khi load

### 5.15 Gift Finder (`/gift-finder`)
- 4-step quiz: mỗi câu hỏi fade transition (Elegant style)
- Option cards: hover scale 1.02, selected state border đỏ + checkmark
- Progress bar đỏ trên đầu
- Result: product cards popIn (Style B)

### 5.16 Loading Spinner (toàn site)
- Center screen, `min-h-[50vh]`
- Vòng ngoài: ring tĩnh `#EAE2D6`
- Vòng xoay: gradient `#B91C1C` → transparent, `border-top-color #B91C1C`
- Trung tâm: icon logo hộp quà đơn giản (32×32px)
- Text dưới: "Đang tải..." pulse animation, uppercase, letter-spacing 3px, `#6B7280`

---

## 6. Hover & Micro-interaction Summary

| Element | Hover effect |
|---|---|
| Nav links | color `#B91C1C`, underline scale từ trái |
| Buttons primary | `translateY(-2px)`, shadow tăng |
| Product cards | `translateY(-8px)`, shadow, image zoom |
| Category cards | image scale 1.05, arrow gap tăng |
| Logo cards marquee | `translateY(-3px)`, border đỏ |
| Testimonial cards | `translateY(-4px)`, shadow |
| Occasion pills | border đỏ, bg `#FEE2E2`, text đỏ |
| Portfolio items | overlay fade-in, text slide up |
| Input fields | border đỏ, ring `rgba(185,28,28,0.1)` |

---

## 7. Page Transition
- Route change: current page `opacity 0, translateY(-8px)` (0.2s ease-in)
- New page: `opacity 0 → 1, translateY(8px) → 0` (0.4s ease-out)
- Hoặc dùng View Transitions API của Next.js

---

## 8. Partner Logo Files Needed
Cần tìm SVG thật của: Vingroup, FPT Telecom, Techcombank, Grab, VinFast, Shopee, Vinamilk, Masan Consumer, MB Bank, Viettel, Saigon Co.op, PNJ
