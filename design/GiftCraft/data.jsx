/* GiftCraft Studio — data model (exported to window) */

const VND = (n) => new Intl.NumberFormat("vi-VN").format(n) + "₫";

const OCCASIONS = [
  { id: "tet", label: "Tết", glyph: "春", note: "Quà Tết 2026" },
  { id: "trungthu", label: "Trung Thu", glyph: "月", note: "Trăng rằm sum vầy" },
  { id: "sinhnhat", label: "Sinh Nhật", glyph: "祝", note: "Mừng tuổi mới" },
  { id: "khaitruong", label: "Khai Trương", glyph: "開", note: "Hưng thịnh phát đạt" },
  { id: "trian", label: "Tri Ân", glyph: "謝", note: "Lời cảm ơn chân thành" },
  { id: "cuoihoi", label: "Cưới Hỏi", glyph: "囍", note: "Trăm năm hạnh phúc" },
];

const CATEGORIES = [
  { id: "hop-qua", label: "Hộp quà cao cấp" },
  { id: "tra-banh", label: "Trà & Bánh" },
  { id: "ruou-vang", label: "Rượu vang & Quà rượu" },
  { id: "do-decor", label: "Đồ trang trí" },
  { id: "van-phong", label: "Quà văn phòng" },
  { id: "tu-thien", label: "Quà thiện nguyện" },
];

// price tiers for B2B (per-unit by quantity)
const tiers = (base) => [
  { qty: "1–19", price: base, save: 0 },
  { qty: "20–49", price: Math.round(base * 0.92), save: 8 },
  { qty: "50–99", price: Math.round(base * 0.85), save: 15 },
  { qty: "100–199", price: Math.round(base * 0.78), save: 22 },
  { qty: "200–299", price: Math.round(base * 0.72), save: 28 },
  { qty: "300+", price: Math.round(base * 0.66), save: 34 },
];

const P = (o) => ({
  rating: 4.8, reviews: 64, custom: true, stock: true,
  tiers: tiers(o.price), ...o,
});

const PRODUCTS = [
  P({ id: "an-khang", name: "Hộp quà Tết — An Khang", price: 1280000, oldPrice: 1490000,
      occasion: "tet", cat: "hop-qua", tag: "tet", new: true,
      blurb: "Mứt sen, trà shan tuyết, bánh cốm thủ công trong hộp sơn mài đỏ son.",
      ph: "Hộp sơn mài đỏ · mứt sen" }),
  P({ id: "phu-quy", name: "Giỏ quà Phú Quý", price: 2150000,
      occasion: "tet", cat: "hop-qua", tag: "tet",
      blurb: "Rượu vang, hạt dưỡng sinh, trà ô long và bánh quy bơ Pháp.",
      ph: "Giỏ quà mây · rượu vang" }),
  P({ id: "tan-xuan", name: "Set trà Tân Xuân", price: 890000,
      occasion: "tet", cat: "tra-banh", tag: "tet",
      blurb: "Ấm tử sa men ngọc cùng trà sen Tây Hồ ướp thủ công.", custom: false,
      ph: "Ấm tử sa · trà sen" }),
  P({ id: "nguyet-quang", name: "Hộp bánh Trung Thu — Nguyệt Quang", price: 1180000,
      occasion: "trungthu", cat: "tra-banh", tag: "trungthu", new: true,
      blurb: "Sáu vị bánh nướng – dẻo cổ truyền, hộp giấy mỹ thuật dập nổi.",
      ph: "Hộp bánh · dập nổi vàng" }),
  P({ id: "doan-vien", name: "Giỏ Trung Thu Đoàn Viên", price: 1650000,
      occasion: "trungthu", cat: "hop-qua", tag: "trungthu",
      blurb: "Bánh thủ công, trà thượng hạng và đèn lồng lụa mini.",
      ph: "Giỏ quà · đèn lồng lụa" }),
  P({ id: "han-huyen", name: "Hộp quà Sinh Nhật — Hàn Huyên", price: 760000,
      occasion: "sinhnhat", cat: "hop-qua", tag: "default",
      blurb: "Nến thơm, sô-cô-la Bỉ và thiệp viết tay cá nhân hoá.",
      ph: "Nến thơm · sô-cô-la" }),
  P({ id: "thinh-vuong", name: "Quà Khai Trương Thịnh Vượng", price: 1980000,
      occasion: "khaitruong", cat: "do-decor", tag: "default",
      blurb: "Cây kim tiền phong thuỷ trong chậu gốm Bát Tràng tráng men.", custom: false,
      ph: "Cây kim tiền · gốm Bát Tràng" }),
  P({ id: "tri-an-vang", name: "Hộp Tri Ân — Hoàng Kim", price: 1420000,
      occasion: "trian", cat: "ruou-vang", tag: "default",
      blurb: "Rượu vang Bordeaux, ly pha lê khắc tên và sổ da bò thật.",
      ph: "Rượu vang · ly pha lê" }),
  P({ id: "vien-man", name: "Set quà Cưới Viên Mãn", price: 2480000,
      occasion: "cuoihoi", cat: "hop-qua", tag: "default", new: true,
      blurb: "Trà long phụng, mứt sen trần và khăn lụa thêu chữ Hỷ.",
      ph: "Set cưới · khăn lụa thêu" }),
  P({ id: "minh-niem", name: "Quà văn phòng Minh Niệm", price: 540000,
      occasion: "trian", cat: "van-phong", tag: "default",
      blurb: "Bình giữ nhiệt khắc laser, sổ tay da và bút kim loại.",
      ph: "Bình giữ nhiệt · sổ da" }),
  P({ id: "loc-bien", name: "Giỏ quà Lộc Biển", price: 1750000,
      occasion: "tet", cat: "hop-qua", tag: "tet",
      blurb: "Hải sản khô thượng hạng, yến sào và đông trùng hạ thảo.",
      ph: "Giỏ hải sản · yến sào" }),
  P({ id: "thanh-tam", name: "Hộp Thanh Tâm thiện nguyện", price: 650000,
      occasion: "trian", cat: "tu-thien", tag: "default", custom: false, stock: false,
      blurb: "Mỗi hộp đóng góp một phần cho quỹ học bổng vùng cao.",
      ph: "Hộp giấy tái chế · thiệp" }),
];

const REVIEWS = [
  { name: "Chị Mai Anh", role: "Khách lẻ · Hà Nội", stars: 5,
    text: "Hộp quà đẹp hơn cả mong đợi, đóng gói chỉn chu. Người nhận rất thích phần thiệp viết tay." },
  { name: "Anh Quốc Bảo", role: "Trưởng phòng HC · FPT Software", stars: 5,
    text: "Đặt 240 phần quà Tết cho nhân viên, in logo sắc nét, giao đúng hẹn. Sẽ hợp tác tiếp năm sau." },
  { name: "Chị Thu Hà", role: "Khách doanh nghiệp · Techcombank", stars: 5,
    text: "Đội ngũ tư vấn tận tâm, báo giá theo số lượng minh bạch. Quà sang trọng đúng tầm thương hiệu." },
];

const PARTNERS = ["FPT", "Techcombank", "Vietcombank", "VinGroup", "Viettel", "Masan", "Shopee", "VNG"];

window.GC = { VND, OCCASIONS, CATEGORIES, PRODUCTS, REVIEWS, PARTNERS };
