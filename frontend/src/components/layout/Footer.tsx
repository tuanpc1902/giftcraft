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
    <footer className="border-t border-border mt-24 bg-white">
      {/* Brand bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="max-w-xs">
              <Link href="/" className="font-display font-bold text-2xl text-ink hover:text-brand transition-colors block mb-3">
                GiftCraft Studio
              </Link>
              <p className="text-sm text-ink-muted leading-relaxed">
                Quà tặng cao cấp, thiết kế riêng cho từng dịp — từ cá nhân đến doanh nghiệp.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-alt rounded-full flex items-center justify-center text-ink-muted hover:bg-brand hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-alt rounded-full flex items-center justify-center text-ink-muted hover:bg-brand hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label="Instagram"
                >
                  in
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-surface-alt rounded-full flex items-center justify-center text-ink-muted hover:bg-brand hover:text-white transition-all duration-200 text-xs font-bold"
                  aria-label="TikTok"
                >
                  tt
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1 md:max-w-2xl">
              {COLS.map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-semibold text-ink uppercase tracking-widest mb-4">
                    {col.title}
                  </p>
                  <ul className="space-y-2.5">
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
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} GiftCraft Studio. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-5 text-xs text-ink-muted">
            <Link href="/chinh-sach-bao-mat" className="hover:text-brand transition-colors">Bảo mật</Link>
            <Link href="/dieu-khoan" className="hover:text-brand transition-colors">Điều khoản</Link>
            <span>🇻🇳 Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
