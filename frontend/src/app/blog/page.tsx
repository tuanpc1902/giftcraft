import Link from "next/link";

const CATEGORIES = ["Tất cả", "Xu hướng quà tặng", "Bí quyết B2B", "Câu chuyện thương hiệu", "Hướng dẫn"];

const FEATURED_POST = {
  slug: "qua-tang-doanh-nghiep-2025",
  title: "Xu hướng quà tặng doanh nghiệp 2025: Cá nhân hóa lên ngôi",
  excerpt: "Thay vì hộp quà Tết đồng loạt, các doanh nghiệp hàng đầu đang đầu tư vào quà tặng được thiết kế riêng cho từng đối tác và nhân viên. Tìm hiểu tại sao xu hướng này đang bùng nổ.",
  category: "Xu hướng quà tặng",
  author: "Team GiftCraft",
  date: "15 tháng 11, 2025",
  readMins: 5,
  cover: "https://placehold.co/1200x600/1a1a2e/ffffff?text=Xu+h%C6%B0%E1%BB%9Bng+Qu%C3%A0+T%E1%BA%B7ng+2025",
};

const POSTS = [
  {
    slug: "chon-qua-tang-doi-tac",
    title: "Cách chọn quà tặng đối tác kinh doanh gây ấn tượng",
    excerpt: "5 tiêu chí quan trọng khi lựa chọn quà tặng doanh nghiệp phù hợp với văn hóa và giá trị thương hiệu.",
    category: "Bí quyết B2B",
    author: "Minh Tuấn",
    date: "10 tháng 11, 2025",
    readMins: 4,
  },
  {
    slug: "hop-qua-tet-doanh-nghiep",
    title: "Thiết kế hộp quà Tết doanh nghiệp: Từ ý tưởng đến sản phẩm",
    excerpt: "Quy trình 4 bước để tạo ra bộ quà Tết đẳng cấp mang thương hiệu riêng — từ chọn sản phẩm đến in ấn và đóng gói.",
    category: "Hướng dẫn",
    author: "Team GiftCraft",
    date: "5 tháng 11, 2025",
    readMins: 6,
  },
  {
    slug: "vingroup-fpt-qua-tang",
    title: "Câu chuyện: Vingroup chọn GiftCraft cho 500 bộ quà cuối năm",
    excerpt: "Đằng sau dự án 500 bộ quà tặng nhân viên Vingroup — hành trình thiết kế, thử nghiệm và sản xuất trong 2 tuần.",
    category: "Câu chuyện thương hiệu",
    author: "Lan Anh",
    date: "28 tháng 10, 2025",
    readMins: 7,
  },
  {
    slug: "qua-tang-eco-friendly",
    title: "Quà tặng thân thiện môi trường: Xu hướng không thể bỏ qua năm 2025",
    excerpt: "Bamboo, tái chế, hữu cơ — các vật liệu bền vững đang trở thành lựa chọn ưu tiên của doanh nghiệp hiện đại.",
    category: "Xu hướng quà tặng",
    author: "Hải Yến",
    date: "20 tháng 10, 2025",
    readMins: 3,
  },
  {
    slug: "b2b-pricing-guide",
    title: "Bảng giá B2B GiftCraft: Tiết kiệm đến 30% từ đơn 20 sản phẩm",
    excerpt: "Tất cả những gì bạn cần biết về bảng giá 5-tier của GiftCraft — từ cách tính đến tối ưu hóa ngân sách dự án.",
    category: "Bí quyết B2B",
    author: "Team GiftCraft",
    date: "15 tháng 10, 2025",
    readMins: 5,
  },
  {
    slug: "qua-tang-trung-thu-2025",
    title: "Ý tưởng quà tặng Trung Thu doanh nghiệp 2025: Vượt ra ngoài bánh trung thu",
    excerpt: "Những bộ quà Trung Thu sáng tạo kết hợp bánh truyền thống với sản phẩm handcraft cao cấp đang được ưa chuộng nhất.",
    category: "Xu hướng quà tặng",
    author: "Minh Tuấn",
    date: "5 tháng 10, 2025",
    readMins: 4,
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              Blog
            </span>
            <h1 className="text-4xl font-bold mb-4">Góc kiến thức GiftCraft</h1>
            <p className="text-gray-300 leading-relaxed">
              Xu hướng quà tặng, bí quyết B2B, và câu chuyện từ những dự án thực tế.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                c === "Tất cả"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured post */}
        <div className="mb-12">
          <Link href={`/blog/${FEATURED_POST.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl p-6 sm:p-8 hover:bg-gray-100 transition-colors">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FEATURED_POST.cover}
                  alt={FEATURED_POST.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {FEATURED_POST.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                  {FEATURED_POST.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-5">{FEATURED_POST.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{FEATURED_POST.author}</span>
                  <span>·</span>
                  <span>{FEATURED_POST.date}</span>
                  <span>·</span>
                  <span>{FEATURED_POST.readMins} phút đọc</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all h-full flex flex-col">
                {/* Placeholder cover */}
                <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl opacity-50">
                    {post.category === "Xu hướng quà tặng" ? "🎁"
                      : post.category === "Bí quyết B2B" ? "💼"
                      : post.category === "Câu chuyện thương hiệu" ? "✨"
                      : "📖"}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="inline-block text-xs font-semibold text-amber-600 mb-2">{post.category}</span>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readMins} phút</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gray-900 text-white rounded-3xl px-8 py-12 text-center">
          <p className="text-3xl mb-3">📬</p>
          <h2 className="text-2xl font-bold mb-3">Nhận bài viết mới nhất</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Xu hướng quà tặng, bí quyết B2B, và ưu đãi độc quyền gửi thẳng đến hộp thư của bạn.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Email của bạn"
            />
            <button type="submit" className="bg-amber-400 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-amber-300 transition-colors text-sm whitespace-nowrap">
              Đăng ký →
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">Không spam. Hủy đăng ký bất kỳ lúc nào.</p>
        </div>
      </div>
    </div>
  );
}
