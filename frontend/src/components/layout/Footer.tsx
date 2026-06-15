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
