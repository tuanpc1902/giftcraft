import Link from "next/link";

export const metadata = {
  title: "Quà tặng doanh nghiệp — GiftCraft Studio",
  description: "Giải pháp quà tặng doanh nghiệp B2B: từ 20 sản phẩm, bảng giá 5 tier, thiết kế theo thương hiệu, giao hàng toàn quốc.",
};

const PROCESS = [
  { step: "01", title: "Gửi yêu cầu", desc: "Điền form online — thông tin về dịp, số lượng, ngân sách. Không cần gọi điện." },
  { step: "02", title: "Nhận báo giá", desc: "Đội ngũ tư vấn gửi báo giá chi tiết trong 24h làm việc kèm mẫu thiết kế." },
  { step: "03", title: "Xác nhận & sản xuất", desc: "Ký hợp đồng online, theo dõi tiến độ real-time qua portal B2B." },
  { step: "04", title: "Giao hàng", desc: "Giao đúng hạn, đóng gói tỉ mỉ, kèm biên bản bàn giao." },
];

const USE_CASES = [
  { icon: "🏢", title: "Quà tặng nhân viên", desc: "Lễ kỷ niệm, Tết, sinh nhật tập thể, khen thưởng xuất sắc." },
  { icon: "🤝", title: "Quà đối tác", desc: "Tri ân đối tác, khách hàng VIP, ký kết hợp tác chiến lược." },
  { icon: "🎪", title: "Quà sự kiện", desc: "Hội nghị, triển lãm, ra mắt sản phẩm, khai trương." },
  { icon: "🏮", title: "Quà theo mùa", desc: "Tết, Trung Thu, Noel — các bộ sưu tập theo dịp giới hạn." },
];

export default function B2BLandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              Dành cho doanh nghiệp
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Giải pháp quà tặng<br />
              <span className="text-amber-400">B2B toàn diện</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Từ 20 sản phẩm trở lên, giảm giá đến 30%. Thiết kế theo thương hiệu,
              giao đúng hạn, không phát sinh chi phí ẩn.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/bat-dau-du-an-moi"
                className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold py-4 px-8 rounded-2xl hover:bg-amber-300 transition-colors">
                Bắt đầu dự án →
              </Link>
              <Link href="/forfolio"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/10 transition-colors">
                Xem dự án thực tế
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* B2B price tiers illustration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Bảng giá B2B 5 tier</h2>
          <p className="text-gray-500">Số lượng càng lớn, giá càng tốt. Không cần đàm phán thủ công.</p>
        </div>
        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
          {[
            { from: "Từ 20", pct: -10, color: "amber" },
            { from: "Từ 50", pct: -15, color: "amber" },
            { from: "Từ 100", pct: -20, color: "orange" },
            { from: "Từ 200", pct: -25, color: "orange" },
            { from: "Từ 300", pct: -30, color: "red" },
          ].map((t, i) => (
            <div key={i} className={`text-center rounded-2xl p-4 border-2 ${i === 4 ? "border-amber-400 bg-amber-50" : "border-gray-100"}`}>
              <p className="text-xs font-semibold text-gray-500">{t.from} sp</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{t.pct}%</p>
              <p className="text-xs text-gray-400 mt-1">giảm giá</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">* Giảm so với giá lẻ. Ví dụ: sản phẩm 500.000đ, đặt 100 bộ = 400.000đ/bộ</p>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Phù hợp cho mọi dịp</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <span className="text-4xl block mb-3">{u.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Quy trình 4 bước</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="relative">
              {i < 3 && <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-200 z-0" />}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-900 font-black text-lg flex items-center justify-center mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-400 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-amber-900 mb-8">Gửi yêu cầu ngay — nhận báo giá trong 24h làm việc.</p>
          <Link href="/bat-dau-du-an-moi"
            className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-gray-700 transition-colors text-lg">
            Bắt đầu dự án →
          </Link>
        </div>
      </section>
    </div>
  );
}
