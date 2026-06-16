# Prompt cho Claude Design — GiftCraft Studio UI/UX Redesign

Sao chép toàn bộ nội dung dưới đây và paste vào Claude Design:

---

## PROMPT

Bạn là một UI/UX designer chuyên nghiệp. Hãy thiết kế toàn bộ giao diện cho **GiftCraft Studio** — website thương mại điện tử quà tặng cao cấp của Việt Nam (B2C + B2B), domain `giftcraft.vn`.

---

### 🎨 DESIGN SYSTEM

**Phong cách:** Kết hợp Modern & Fresh + Warm Artisan — hiện đại, thoáng, nhưng ấm áp có chiều sâu.

**Bảng màu:**
- Background chính: `#FDFAF6` (warm cream, KHÔNG dùng trắng thuần)
- Background section xen kẽ: `#F5F0EA`
- Border: `#EAE2D6` (warm, không lạnh)
- Đỏ thương hiệu (primary): `#B91C1C` → hover `#991B1B`
- Vàng gold (premium accent): `#D4AF37`
- Amber (sub-label, eyebrow): `#B45309`
- Chữ chính: `#111111`
- Chữ phụ: `#6B7280`

**Typography:**
- Display/Heading: Georgia serif, font-weight 700, letter-spacing −0.5px
- Body: system-ui sans-serif, antialiased
- Eyebrow label: 9–10px, uppercase, letter-spacing 3px, màu amber `#B45309`

---

### 🎁 LOGO & BRAND IDENTITY

Thiết kế bộ logo hoàn chỉnh với các phiên bản sau:

**Icon mark (hộp quà đơn giản):**
- Hình khối vuông bo góc 8px, gradient đỏ `#B91C1C → #DC2626`
- Đường ribbon ngang trắng opacity 30% ở giữa hộp
- Hình tam giác nơ (bow) trắng opacity 45% ở phần trên
- Dot knot trắng 90% opacity tại giao điểm ribbon
- Box shadow: `0 2px 8px rgba(185,28,28,0.3)`
- KHÔNG vẽ chi tiết rườm rà — giữ icon tối giản, scalable

**Wordmark:** "GiftCraft" Georgia serif bold + sub-label "Studio" amber uppercase 9px

**Phiên bản cần thiết kế:**
1. Logo ngang: icon 36px + wordmark (dùng trong header)
2. Logo vuông: icon standalone (favicon, app icon)
3. Logo trên nền tối: icon + wordmark màu trắng/vàng (dùng trong footer, dark sections)
4. Spinner version: icon 32px đặt giữa vòng xoay đỏ

---

### ✨ HỆ THỐNG ANIMATION (ghi chú cho developer — designer cần annotate)

Mỗi màn hình cần annotation rõ animation nào áp dụng cho element nào:

**Style A — Elegant & Refined** (cho hero, typography, section titles):
- FadeUp: opacity 0→1, translateY 24px→0, duration 0.9s, easing `cubic-bezier(0.16,1,0.3,1)`
- Stagger 150ms giữa các element liên tiếp
- Dùng cho: hero content, section headings, CTA buttons

**Style B — Playful & Energetic** (cho product cards, B2C):
- PopIn spring: scale 0.88→1.03→1, opacity 0→1, translateY 20px→0, duration 0.6s, easing `cubic-bezier(0.34,1.56,0.64,1)` (spring bounce)
- Hover card: translateY −8px, shadow tăng, image zoom 1.08
- Dùng cho: product cards, occasion pills, badge tags

**Style C — Cinematic & Bold** (cho B2B, stats):
- Clip-path reveal: `inset(0 100% 0 0)` → `inset(0 0% 0 0)`, duration 0.8s
- Glow pulse: radial gradient bg đỏ, animation pulse 3s infinite
- Counter: số tăng dần khi scroll vào (0 → giá trị thật)
- Dùng cho: B2B hero, stats bar, B2B CTA banner

**Style D — Parallax & Float** (cho portfolio):
- Float: translateY 0 ↔ −10px, ease-in-out, 4s, stagger 0.5s mỗi card
- Blur reveal: opacity 0→1, blur 12px→0, scale 0.94→1
- Shimmer text: gradient đỏ-vàng chạy qua chữ heading
- Dùng cho: portfolio grid, forfolio page

**Hover micro-interactions (áp dụng toàn site):**
- Nav links: color → `#B91C1C`, underline scale từ trái
- Buttons: translateY −2px, shadow tăng
- Product cards: translateY −8px, image zoom 1.08
- Category split cards: image scale 1.05, arrow di chuyển phải
- Logo marquee cards: translateY −3px, border → đỏ
- Occasion pills: border đỏ, background `#FEE2E2`
- Input focus: border đỏ, ring `rgba(185,28,28,0.1)`

**Page transition:** opacity+translateY fade giữa các route, 0.3s ease

**Scroll reveal:** Mọi content block scroll vào vùng nhìn thấy đều có animation A (fadeUp) theo mặc định, trừ các section được chỉ định riêng.

---

### 📐 CÁC MÀN HÌNH CẦN THIẾT KẾ CHI TIẾT

---

#### 1. HEADER (Sticky Navigation)
- Chiều cao 68px, sticky top-0, z-index cao
- Background: `rgba(253,250,246,0.95)` + backdrop-blur 20px (glassmorphism nhẹ)
- Border-bottom: 1px `#EAE2D6`
- Khi scroll: box-shadow xuất hiện `0 2px 20px rgba(185,28,28,0.05)`
- **Bố cục:**
  - Trái: Logo icon 36px + wordmark "GiftCraft / Studio"
  - Giữa: 5 nav links (Sản phẩm / Doanh nghiệp / Tìm quà / Portfolio / Blog), gap 32px, 13px, active = đỏ bold
  - Phải: Icon button search + Icon button cart (badge đỏ số lượng) + Button "Báo giá" đỏ solid
  - Icon buttons: 36×36px, border `#EAE2D6`, bo góc 8px, hover border đỏ
- **Search expand:** khi click search → input field slide-down xuất hiện bên dưới header với animation slideDown 0.3s
- Vẽ thêm: trạng thái đã đăng nhập (hiện avatar user thay icon người dùng)

#### 2. MOBILE MENU (Slide-in drawer)
- Overlay tối 40% full screen
- Drawer từ phải trượt vào: width 80vw max 340px, background `#FDFAF6`
- Logo ở top với nút X đóng
- Nav links dọc, mỗi link 48px height, divider `#EAE2D6`
- Bottom: nút "Đăng nhập" và "Báo giá" full-width
- Animation: translateX 100% → 0, duration 0.35s

#### 3. HOMEPAGE — Hero Section
- **Kích thước:** full viewport width, height 560px
- **Background:** ảnh lifestyle sản phẩm quà tặng cao cấp, overlay gradient từ trái tối `rgba(28,10,7,0.88)` → phải transparent
- **Ambient:** radial glow đỏ mờ phía trái, radial glow amber mờ phía phải (dưới overlay)
- **Content (bottom-left, padding 64px left, 80px bottom):**
  - Eyebrow pill: `✦ Bộ sưu tập Tết 2026` — background vàng gold 12% opacity, border gold 30% opacity, bo tròn 24px — Animation A delay 0.1s
  - H1: `Quà tặng tinh tế,` (trắng) + dòng 2 `giao đúng cảm xúc` (màu gold `#D4AF37`) — 52px Georgia — Animation A delay 0.25s
  - Sub text: 15px, trắng 55% opacity, line-height 1.75, max-width 400px — Animation A delay 0.4s
  - CTA row: "Xem bộ sưu tập →" (đỏ solid, shadow đỏ) + "Báo giá doanh nghiệp" (border trắng 20%, glassmorphism) — Animation A delay 0.55s
- **Scroll indicator (phải giữa):** text "SCROLL" vertical + đường kẻ dọc 52px + dot nhấp nháy — Animation A delay 1s

#### 4. HOMEPAGE — Stats Bar
- Background `#FDFAF6`, border-top 3px đỏ `#B91C1C`, border-bottom `#EAE2D6`
- 4 cột equal: `500+` Doanh nghiệp / `24h` Báo giá / `98%` Hài lòng / `63` Tỉnh thành
- Số: Georgia serif 32px, đỏ `#B91C1C`
- Label: 11px, `#6B7280`
- Divider dọc giữa các cột
- Padding 28px trên/dưới
- Animation C (counter đếm lên khi scroll vào)

#### 5. HOMEPAGE — Category Split Cards
- 2 cột equal, gap 20px, padding ngang 64px
- Height 300px mỗi card, border-radius 12px, overflow hidden
- **Card trái — Quà cá nhân:**
  - BG gradient đỏ `#7F1D1D → #B91C1C → #DC2626`
  - (placeholder cho ảnh thật)
  - Overlay gradient bottom-up tối
  - Bottom-left: tag pill mờ "Tết · Trung Thu · Sinh nhật" + H2 serif trắng "Quà cá nhân" + "Khám phá →"
- **Card phải — Quà doanh nghiệp:**
  - BG gradient amber `#1C1007 → #2D1B00 → #B45309`
  - Badge pill đỏ top-right: "Báo giá 24h"
  - Bottom-left: tag + H2 "Quà doanh nghiệp" + "Tìm hiểu →"
- Hover: image/gradient scale 1.05, arrow gap tăng, text sáng hơn

#### 6. HOMEPAGE — Featured Products Grid
- Header row: eyebrow "✦ Được yêu thích" + title "Sản phẩm nổi bật" bên trái + link "Xem tất cả →" đỏ bên phải
- **Grid 4 cột, gap 24px**
- Mỗi product card:
  - Ảnh product 196px height, bo góc 12px phần trên
  - Badge pill góc trên trái (đỏ "Bán chạy" / amber "Mới" / vàng "Sale")
  - Wishlist icon góc trên phải (hiện khi hover)
  - Info block padding 18px: tên SP (Georgia 14px bold) + mô tả 11px muted + giá đỏ bold + giá gốc gạch
  - Quick add button ẩn, xuất hiện khi hover card (slide up from bottom)
- Animation B (spring popIn, stagger 100ms)
- Hover: translateY −8px, shadow, image zoom

#### 7. HOMEPAGE — Occasion Pills Row
- Horizontal scroll row, gap 8px
- Mỗi pill: icon emoji + label, border `#EAE2D6`, bo tròn full, 13px
- Hover/active: border đỏ, background `#FEE2E2`, text đỏ
- Các dịp: 🏮 Quà Tết / 🌕 Trung Thu / 🎂 Sinh nhật / 🎊 Khai trương / 🙏 Tri ân / 💍 Cưới hỏi

#### 8. HOMEPAGE — Portfolio Section (Style D)
- Background `#F5F0EA`
- Header: eyebrow + title + link "Xem portfolio →"
- Grid 3 cột, ảnh vuông aspect-ratio 1:1, bo góc 12px
- Cards nổi lên xuống so le nhau (float animation style D)
- Hover: overlay fade in từ bottom, text "Xem chi tiết →" slide up
- Blur reveal khi scroll vào

#### 9. HOMEPAGE — Testimonials
- 3 cột, gap 24px
- Mỗi card: background `#F5F0EA`, bo góc 12px, padding 28px
- Quote mark `"` serif 36px đỏ phía trên
- Nội dung quote: 13px, muted, line-height 1.75
- Divider mỏng + avatar tròn 40px + tên + chức danh
- Hover: translateY −4px, shadow

#### 10. HOMEPAGE — Partner Logos Marquee (2 HÀNG SO LE)
- Label trên: "Đối tác doanh nghiệp tin tưởng" uppercase, tracking 3px, centered
- **Hàng 1** (tốc độ 28s): Vingroup · FPT Telecom · Techcombank · Grab · VinFast · Shopee (lặp liên tục)
- **Hàng 2** (offset 25% + tốc độ 22s): Vinamilk · Masan · MB Bank · Viettel · Saigon Co.op · PNJ (lặp liên tục)
- Cả 2 hàng cùng chiều: phải → trái. Tốc độ khác nhau tạo hiệu ứng so le liên tục
- Mỗi logo card: background trắng, border `#EAE2D6`, bo góc 10px, padding `12px 22px`
- Logo: dùng logo thật (SVG) của từng brand — KHÔNG dùng chữ cái viết tắt
- Fade mask 2 bên (gradient trắng 100px)
- Hover từng card: border đỏ, translateY −3px

#### 11. HOMEPAGE — B2B CTA Banner (full width)
- Background tối `#111111`, ảnh mờ 15% opacity overlay
- Cinematic style: radial glow đỏ, animation pulse
- Left: eyebrow đỏ + H2 serif trắng 36px "Quà tặng in logo, số lượng lớn, giao đúng hạn" + sub text trắng 55% + 2 buttons
- Right (desktop): 3 stats counter animated (Cinematic style) trong khung tối bo góc
- Annotation: clip-path reveal + glow pulse animation

#### 12. FOOTER
- Background `#111111`
- Row 1: logo trắng + tagline
- Row 2: 4 cột links (Sản phẩm / Doanh nghiệp / Về chúng tôi / Hỗ trợ), heading đỏ nhạt `#FCA5A5`
- Row 3: divider + copyright + social icons (Facebook, Instagram, Zalo, TikTok)
- Divider: `rgba(255,255,255,0.08)`

---

#### 13. PRODUCT LISTING PAGE (`/san-pham`)
- Bố cục: sidebar filter trái 240px + main grid phải
- Sidebar: filter theo danh mục, dịp, giá (slider), rating — sticky khi scroll
- Top bar: breadcrumb + đếm kết quả + sort dropdown
- Grid: 3 cột desktop, 2 cột mobile, gap 24px
- Product cards: giống homepage nhưng thêm rating stars
- Pagination: dots + prev/next, hoặc "Xem thêm" button
- Empty state: illustration + text khi không có kết quả
- Skeleton loading: 3×3 card skeletons khi đang tải (shimmer animation)
- Mobile: filter ẩn, nút "Bộ lọc" mở bottom sheet

#### 14. PRODUCT DETAIL PAGE (`/san-pham/[slug]`)
- **Layout 2 cột** (desktop): gallery trái 55% / info phải 45%, gap 48px
- **Gallery:**
  - Ảnh chính: aspect-ratio 4/5, bo góc 12px, click để zoom
  - Thumbnails hàng dưới: 4–5 ảnh nhỏ 72px, border đỏ khi active
  - Click thumbnail: swap ảnh chính với Elegant fade 0.4s
  - Badge "Bán chạy" / "Mới" góc trên trái ảnh chính
- **Info:**
  - Breadcrumb → tên SP (Georgia 28px, −0.5px tracking) → rating stars + số reviews
  - Giá đỏ bold 24px + giá gốc gạch
  - Mô tả ngắn 14px, line-height 1.75
  - Số lượng: stepper (−/số/+) + "Thêm vào giỏ" full-width đỏ bo góc 8px
  - "Yêu thích" button outline, "Chia sẻ" icon
  - Accordion: Thông tin sản phẩm / Chính sách giao hàng / Hỏi đáp B2B
  - B2B pricing table: gradient từ nhạt → đậm amber (5 tier giá theo số lượng)
- **Phần dưới:**
  - Reviews section: star summary + list reviews + form gửi review
  - Related products: horizontal scroll hoặc grid 4 cột (popIn animation)

#### 15. B2B LANDING PAGE (`/qua-tang-doanh-nghiep`)
- **Hero (Cinematic style):**
  - Background tối + ảnh B2B mờ
  - Clip-path reveal cho title
  - Counter animation stats: "500+ doanh nghiệp" / "24h báo giá" / "63 tỉnh"
  - CTA lớn: "Bắt đầu dự án →" + "Xem portfolio"
- **Process section:** 4 bước số 1→2→3→4 với icon tròn đỏ, line connector animate từ trái qua phải, text mô tả từng bước
- **Portfolio showcase:** grid ảnh dự án thực (Parallax float style D)
- **Pricing overview:** 5-tier B2B pricing table responsive, highlighted tier phổ biến
- **Quote form section:** form inline (Tên doanh nghiệp / Email / SĐT / Số lượng / Mô tả dự án) + submit CTA
- **Testimonials B2B:** giống homepage nhưng chỉ corporate clients

#### 16. GIFT FINDER QUIZ (`/gift-finder`)
- **Progress bar:** thin đỏ trên đầu, animate fill theo bước (25% → 50% → 75% → 100%)
- **4 màn hỏi** (transition Elegant fade giữa các bước):
  1. Cho ai? (Cá nhân / Doanh nghiệp / Đối tác) — option cards lớn với icon
  2. Dịp gì? (Tết / Sinh nhật / Khai trương / Tri ân...) — grid pills
  3. Ngân sách? (slider hoặc range picker)
  4. Phong cách? (Truyền thống / Hiện đại / Cao cấp) — card với ảnh preview
- Mỗi câu hỏi: option hover scale 1.02, selected state border đỏ + checkmark + background `#FEE2E2`
- **Result page:** "Chúng tôi gợi ý cho bạn" + grid product cards (popIn animation B)

#### 17. LOGIN / REGISTER PAGES
- **Layout:** centered card max-width 420px, padding 40px, bo góc 16px, shadow `0 8px 32px rgba(0,0,0,0.08)`
- Logo icon (không wordmark) ở trên centered
- Heading: "Đăng nhập" / "Đăng ký" Georgia 24px
- Inputs: border `#EAE2D6`, focus → border đỏ + ring, bo góc 8px, height 48px
- Password: eye toggle icon
- Button "Đăng nhập": full-width, đỏ, bo góc 8px, height 48px
- Link chuyển Login ↔ Register
- Divider "hoặc đăng nhập với"
- Social login: Google, Facebook buttons outline
- Animation: card Elegant fadeUp khi page load

#### 18. CART PAGE (`/gio-hang`)
- Layout 2 cột: cart items trái / order summary phải (sticky)
- Mỗi item: ảnh 80px + tên + variant + stepper + giá + nút xóa
- Order summary card: subtotal / shipping / discount / total + voucher input + CTA "Tiến hành thanh toán"
- Empty cart: illustration + "Giỏ hàng trống" + button "Xem sản phẩm"

#### 19. LOADING SPINNER (Toàn site)
- Background `#FDFAF6`, căn giữa màn hình, `min-height: 50vh`
- **Cấu trúc:**
  - Ring ngoài tĩnh: border `#EAE2D6`, width 3px, size 72px, tròn
  - Arc xoay: border-top + border-right (gradient opacity), animation 1.2s cubic
  - Trung tâm: icon logo hộp quà (32×32px, đơn giản giống header icon)
  - Text bên dưới: "Đang tải..." pulse animation, uppercase, letter-spacing 3px, `#6B7280`, 10px
- Vẽ cả phiên bản nhỏ (24px) dùng trong button loading state

---

### 📋 DELIVERABLES YÊU CẦU

Với mỗi màn hình hãy thiết kế:

1. **Desktop version** (1440px width)
2. **Mobile version** (390px width — iPhone 15 Pro)
3. **Annotation layer** — ghi rõ animation style (A/B/C/D), timing, easing
4. **Component states** — default / hover / active / focus / loading / empty
5. **Dark variants** cho: header khi trên hero / footer / B2B CTA banner

**Logo deliverables:**
- Icon mark SVG (nhiều kích cỡ: 16/24/32/36/48/64px)
- Logo ngang (icon + wordmark)
- Logo tối (trên nền đen)
- Favicon ICO + PNG 32px

**Design tokens file:**
- Tạo file tokens JSON hoặc Figma variables cho toàn bộ màu, spacing, radius, shadow, typography

---

### ⚠️ QUAN TRỌNG

- Ngôn ngữ: **Tiếng Việt** toàn bộ copy (tên sản phẩm, button, label)
- KHÔNG dùng màu trắng thuần `#FFFFFF` cho background page — luôn dùng `#FDFAF6`
- Product cards và logo cards cần khoảng cách thoáng — padding tối thiểu 18px bên trong, gap tối thiểu 24px giữa các cards
- Các sections cần breathing room — padding trên/dưới tối thiểu 64–80px
- Logo partner marquee: dùng logo THẬT (SVG chính thức) của từng brand, không dùng chữ viết tắt
- Mọi ảnh minh họa: dùng placeholder lifestyle photography chất lượng cao (quà tặng, không gian sang trọng)
- Border-radius: cards 12px / buttons 6–8px / pills 24px / inputs 8px
- Tất cả icon: Heroicons outline style hoặc tương đương, stroke-width 1.5
