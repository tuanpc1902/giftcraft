const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, ExternalHyperlink, PageNumber, Header, Footer,
  PageBreak, TableOfContents
} = require("docx");
const fs = require("fs");

// ── Helpers ─────────────────────────────────────────────────────────────────

const BRAND = "C41E3A";       // đỏ brand GiftCraft
const GOLD  = "B45309";       // vàng
const DARK  = "1A1209";       // foreground
const LIGHT_RED = "FEF2F2";   // tint đỏ nhạt
const LIGHT_GOLD = "FEF3C7";  // tint vàng nhạt
const GRAY_BG = "F8F8F8";
const CODE_BG = "1E1E1E";     // dark code block

const PAGE_W = 11906; // A4 width DXA
const MARGIN = 1134;  // 2cm margins
const CONTENT_W = PAGE_W - MARGIN * 2; // 9638

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: BRAND })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: DARK })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: GOLD })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK, ...opts })]
  });
}

function pBold(text) { return p(text, { bold: true }); }

function note(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: GOLD } },
    children: [new TextRun({ text: "💡 " + text, font: "Arial", size: 20, color: "7C5C00", italics: true })]
  });
}

function warn(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: BRAND } },
    children: [new TextRun({ text: "⚠️  " + text, font: "Arial", size: 20, color: "9B1626", italics: true })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK })]
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
    indent: { left: 360, right: 360 },
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "333333" })]
  });
}

function codeBlock(lines) {
  return lines.map(l => code(l));
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" } },
    children: []
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [] });
}

function infoTable(rows) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [3200, CONTENT_W - 3200],
    rows: rows.map(([label, value], i) =>
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 3200, type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 140, right: 140 },
            children: [new Paragraph({ children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: DARK })] })]
          }),
          new TableCell({
            borders,
            width: { size: CONTENT_W - 3200, type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? "F5F5F5" : "FFFFFF", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 140, right: 140 },
            children: [new Paragraph({ children: [new TextRun({ text: value, font: "Courier New", size: 20, color: "333333" })] })]
          }),
        ]
      })
    )
  });
}

// ── Build document ───────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BRAND },
        paragraph: { spacing: { before: 0, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: 16838 },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND } },
          children: [
            new TextRun({ text: "GiftCraft Studio", font: "Arial", size: 18, bold: true, color: BRAND }),
            new TextRun({ text: "  —  Hướng dẫn triển khai Production", font: "Arial", size: 18, color: "888888" }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" } },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Trang ", font: "Arial", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" }),
            new TextRun({ text: " / ", font: "Arial", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "888888" }),
          ]
        })]
      })
    },
    children: [

      // ── Cover Page ──────────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 2000, after: 200 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "🎁  GiftCraft Studio", font: "Arial", size: 64, bold: true, color: BRAND })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 400 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Hướng dẫn triển khai Production", font: "Arial", size: 36, color: GOLD })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Từ VPS → Domain → HTTPS → Go Live", font: "Arial", size: 24, color: "888888", italics: true })]
      }),
      divider(),
      new Paragraph({
        spacing: { before: 200, after: 60 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Stack: Next.js 16 · Laravel 13 · PostgreSQL 16 · Redis 7 · Meilisearch 1.8", font: "Arial", size: 20, color: "555555" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Server: Hetzner CX32 · Ubuntu 24.04 · Docker Compose · Let's Encrypt SSL", font: "Arial", size: 20, color: "555555" })]
      }),
      new Paragraph({
        spacing: { before: 300, after: 0 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Domain: giftcraft.vn", font: "Arial", size: 22, bold: true, color: DARK })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── Table of Contents ───────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Mục lục", font: "Arial", size: 36, bold: true, color: BRAND })]
      }),
      new TableOfContents("", { hyperlink: true, headingStyleRange: "1-3" }),
      new Paragraph({ children: [new PageBreak()] }),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 1 — TỔNG QUAN
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 1 — Tổng quan kiến trúc"),

      p("Hệ thống GiftCraft Studio được triển khai dưới dạng monorepo chạy hoàn toàn bằng Docker Compose. Tất cả các service giao tiếp qua Docker internal network, chỉ Nginx expose ra ngoài qua port 80 và 443."),
      emptyLine(),

      h2("1.1  Sơ đồ luồng request"),
      ...codeBlock([
        "Browser (HTTPS 443)",
        "    │",
        "    ▼",
        "Nginx :443  ──────────────────────────────────────────",
        "    │  /api/auth/*      → rate limit 5r/m → Laravel :8000",
        "    │  /api/orders/checkout → rate limit 3r/m → Laravel :8000",
        "    │  /api/*           → rate limit 60r/m → Laravel :8000",
        "    │  /_next/static/*  → cache 1 năm → Next.js :3000",
        "    │  /*               → Next.js :3000",
        "    └──────────────────────────────────────────────────",
        "",
        "Laravel → PostgreSQL :5432  (DB chính)",
        "Laravel → Redis :6379       (cache, session, queue)",
        "Laravel → Meilisearch :7700 (full-text search)",
        "Laravel → Horizon           (queue worker, 5 processes)",
      ]),
      emptyLine(),

      h2("1.2  Thông số server khuyến nghị"),
      infoTable([
        ["Provider",        "Hetzner Cloud (hetzner.com)"],
        ["Server type",     "CX32 — 4 vCPU / 8 GB RAM / 80 GB SSD"],
        ["Giá",            "~€8.21/tháng ≈ 230.000 VNĐ/tháng (tính đến 2025)"],
        ["OS",              "Ubuntu 24.04 LTS"],
        ["Datacenter",      "Singapore (ap-southeast) — latency tốt từ Việt Nam"],
        ["Backup",          "PostgreSQL → Cloudflare R2, cron 2:00 AM hàng ngày"],
        ["CDN / Storage",   "Cloudflare R2 (ảnh sản phẩm, log)"],
      ]),
      emptyLine(),

      h2("1.3  Danh sách service"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2000, 1800, 1800, CONTENT_W - 5600],
        rows: [
          new TableRow({
            tableHeader: true,
            children: ["Service", "Image", "Port (internal)", "Vai trò"].map(h =>
              new TableCell({
                borders, shading: { fill: BRAND, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
              })
            )
          }),
          ...([
            ["nginx",       "nginx:alpine",               "80, 443",  "Reverse proxy, SSL, rate limiting, gzip"],
            ["nextjs",      "custom (Dockerfile.prod)",   "3000",     "Next.js App Router — SSR/ISR/static"],
            ["laravel",     "custom (Dockerfile)",        "8000",     "Laravel 13 API — FPM + serve"],
            ["horizon",     "custom (Dockerfile)",        "—",        "Queue worker — email, jobs background"],
            ["postgres",    "postgres:16-alpine",         "5432",     "Database chính — 256MB RAM limit"],
            ["redis",       "redis:7-alpine",             "6379",     "Cache, session, queue, idempotency"],
            ["meilisearch", "getmeili/meilisearch:v1.8",  "7700",     "Full-text search — sản phẩm, blog"],
          ].map(([s, img, port, role], i) =>
            new TableRow({
              children: [s, img, port, role].map(v =>
                new TableCell({
                  borders, shading: { fill: i % 2 === 0 ? "F9F9F9" : "FFFFFF", type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: v, font: v.includes("custom") || v.includes(":") ? "Courier New" : "Arial", size: 19, color: DARK })] })]
                })
              )
            })
          ))
        ]
      }),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 2 — CHUẨN BỊ
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 2 — Chuẩn bị trước khi triển khai"),

      h2("2.1  Thuê VPS Hetzner"),
      p("Hetzner là nhà cung cấp VPS châu Âu với giá tốt nhất trong tầm giá. Datacenter Singapore phù hợp cho thị trường Việt Nam."),
      emptyLine(),
      h3("Các bước đăng ký:"),
      numbered("Truy cập https://www.hetzner.com/cloud → Đăng ký tài khoản"),
      numbered("Xác minh email và thanh toán (thẻ Visa/Mastercard hoặc PayPal)"),
      numbered("Vào Cloud Console → New Project → Đặt tên: \"giftcraft\""),
      numbered("Nhấn Add Server với cấu hình:"),
      bullet("Location: Singapore", 1),
      bullet("Image: Ubuntu 24.04", 1),
      bullet("Type: Shared CPU → CX32 (4 vCPU, 8 GB RAM, 80 GB disk)", 1),
      bullet("Networking: IPv4 + IPv6 (bật cả hai)", 1),
      bullet("SSH Key: dán public key của bạn (xem bước 2.3)", 1),
      bullet("Name: giftcraft-prod", 1),
      numbered("Nhấn Create & Buy → đợi ~30 giây server khởi động"),
      numbered("Ghi lại địa chỉ IPv4 public (ví dụ: 65.21.xxx.xxx)"),
      emptyLine(),
      note("Hetzner tính tiền theo giờ. Nếu muốn thử nghiệm, có thể tạo server nhỏ hơn (CX22) rồi resize lên CX32 sau."),

      emptyLine(),
      h2("2.2  Mua và cấu hình tên miền"),
      h3("Đăng ký domain:"),
      p("Khuyến nghị mua domain tại Namecheap (namecheap.com) hoặc tại Nhân Hòa (nhanhoa.com) nếu muốn thanh toán VNĐ."),
      numbered("Tìm kiếm domain giftcraft.vn → Thêm vào giỏ → Thanh toán"),
      numbered("Sau khi có domain, vào phần DNS Management"),
      emptyLine(),
      h3("Cấu hình DNS records (trỏ về IP VPS):"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [1500, 1500, 2000, CONTENT_W - 5000],
        rows: [
          new TableRow({
            tableHeader: true,
            children: ["Type", "Name", "Value", "TTL / Ghi chú"].map(h =>
              new TableCell({
                borders, shading: { fill: GOLD, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
              })
            )
          }),
          ...([
            ["A",     "@",              "65.21.xxx.xxx",          "300s — trỏ giftcraft.vn về VPS"],
            ["A",     "www",            "65.21.xxx.xxx",          "300s — trỏ www.giftcraft.vn"],
            ["CNAME", "staging",        "giftcraft-staging.xxx",  "Tuỳ chọn — môi trường staging"],
            ["MX",    "@",              "mail.giftcraft.vn",      "Nếu dùng email riêng"],
            ["TXT",   "@",              "v=spf1 include:resend.com ~all", "SPF cho Resend mail"],
          ].map(([type, name, val, note], i) =>
            new TableRow({
              children: [type, name, val, note].map(v =>
                new TableCell({
                  borders, shading: { fill: i % 2 === 0 ? "FFFDF8" : "FFFFFF", type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: v, font: v.includes(".") || v.includes("v=") ? "Courier New" : "Arial", size: 19, color: DARK })] })]
                })
              )
            })
          ))
        ]
      }),
      emptyLine(),
      note("DNS propagation mất từ 5 phút đến 48 giờ. Kiểm tra bằng: nslookup giftcraft.vn hoặc https://dnschecker.org"),

      emptyLine(),
      h2("2.3  Tạo SSH Key để kết nối VPS"),
      h3("Trên máy local (Windows):"),
      ...codeBlock([
        "# Mở PowerShell, tạo ED25519 key (an toàn hơn RSA)",
        "ssh-keygen -t ed25519 -C \"deploy@giftcraft.vn\" -f ~/.ssh/giftcraft_deploy",
        "",
        "# Kết quả tạo 2 file:",
        "#   ~/.ssh/giftcraft_deploy      (private key — KHÔNG chia sẻ)",
        "#   ~/.ssh/giftcraft_deploy.pub  (public key — dán vào Hetzner)",
      ]),
      emptyLine(),
      h3("Dán public key lên Hetzner khi tạo server, hoặc sau khi tạo:"),
      ...codeBlock([
        "# Copy nội dung public key",
        "cat ~/.ssh/giftcraft_deploy.pub",
        "",
        "# Vào Hetzner Console → Server → Access → SSH Keys → Add Key",
        "# Dán nội dung trên vào, đặt tên: deploy-2025",
      ]),
      emptyLine(),
      h3("Kết nối SSH lần đầu:"),
      ...codeBlock([
        "# SSH vào server với user root",
        "ssh -i ~/.ssh/giftcraft_deploy root@65.21.xxx.xxx",
        "",
        "# Kiểm tra kết nối thành công",
        "uname -a",
        "# Ubuntu 24.04.x LTS ...",
      ]),
      emptyLine(),
      warn("Giữ private key (~/.ssh/giftcraft_deploy) an toàn. Đừng commit lên Git hoặc gửi qua Slack/email. Nên lưu vào password manager (Bitwarden, 1Password)."),

      emptyLine(),
      h2("2.4  Chuẩn bị GitHub / Git Repository"),
      numbered("Tạo repository trên GitHub (hoặc GitLab) với visibility Private"),
      numbered("Push code từ máy local:"),
      ...codeBlock([
        "cd C:/Users/tuanp/Documents/giftcraft",
        "git remote add origin git@github.com:your-org/giftcraft.git",
        "git push -u origin main",
      ]),
      numbered("Tạo Deploy Key trên server (để server có thể pull code):"),
      ...codeBlock([
        "# Trên VPS, chạy với user deploy",
        "ssh-keygen -t ed25519 -C \"deploy@giftcraft-server\" -f ~/.ssh/github_deploy -N \"\"",
        "cat ~/.ssh/github_deploy.pub",
        "# Copy output → GitHub repo Settings → Deploy keys → Add deploy key",
        "# Title: Giftcraft Prod Server",
        "# Allow write access: KHÔNG tích (read-only là đủ)",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 3 — SETUP SERVER
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 3 — Setup server từ đầu"),

      h2("3.1  Chạy script setup tự động"),
      p("Dự án đã có sẵn script setup đầy đủ tại infra/scripts/setup-server.sh. Script này tự động cài đặt Docker, Certbot, tạo user deploy, clone repo và cấu hình firewall."),
      emptyLine(),
      h3("Chỉnh sửa trước khi chạy:"),
      ...codeBlock([
        "# Trên máy local, mở file:",
        "# infra/scripts/setup-server.sh",
        "",
        "# Sửa 3 dòng đầu:",
        "DOMAIN=\"giftcraft.vn\"                          # domain của bạn",
        "REPO=\"git@github.com:your-org/giftcraft.git\"  # repo SSH URL",
        "APP_DIR=\"/var/www/giftcraft\"                   # thư mục deploy (giữ nguyên)",
      ]),
      emptyLine(),
      h3("Upload và chạy:"),
      ...codeBlock([
        "# Upload script lên server",
        "scp -i ~/.ssh/giftcraft_deploy infra/scripts/setup-server.sh root@65.21.xxx.xxx:/root/",
        "",
        "# SSH vào server",
        "ssh -i ~/.ssh/giftcraft_deploy root@65.21.xxx.xxx",
        "",
        "# Chạy script (mất ~5-10 phút)",
        "chmod +x /root/setup-server.sh",
        "bash /root/setup-server.sh",
      ]),
      emptyLine(),
      p("Script sẽ tự động thực hiện các bước sau:"),
      bullet("apt update && apt upgrade — cập nhật hệ điều hành"),
      bullet("Cài Docker Engine (phiên bản mới nhất từ docker.com)"),
      bullet("Cài Certbot + tự động lấy SSL certificate từ Let's Encrypt"),
      bullet("Tạo user deploy (không có quyền root)"),
      bullet("Clone repository về /var/www/giftcraft"),
      bullet("Cấu hình UFW firewall: chỉ mở port 22, 80, 443"),
      bullet("Cài cron job backup database lúc 2:00 AM hàng ngày"),

      emptyLine(),
      h2("3.2  Cài đặt thủ công (nếu không dùng script)"),
      h3("Bước 1: Cập nhật hệ điều hành"),
      ...codeBlock([
        "apt update && apt upgrade -y",
        "apt install -y curl git unzip software-properties-common ufw fail2ban",
      ]),
      emptyLine(),
      h3("Bước 2: Cài Docker Engine"),
      ...codeBlock([
        "# Cài Docker từ official repository",
        "curl -fsSL https://get.docker.com | sh",
        "",
        "# Thêm user deploy vào group docker",
        "usermod -aG docker deploy",
        "",
        "# Kiểm tra",
        "docker --version",
        "docker compose version",
        "# Docker version 26.x.x",
        "# Docker Compose version v2.x.x",
      ]),
      emptyLine(),
      h3("Bước 3: Cấu hình Firewall (UFW)"),
      ...codeBlock([
        "ufw allow 22/tcp     # SSH",
        "ufw allow 80/tcp     # HTTP",
        "ufw allow 443/tcp    # HTTPS",
        "ufw --force enable",
        "ufw status           # Kiểm tra",
      ]),
      emptyLine(),
      warn("Luôn bật UFW TRƯỚC khi chặn SSH. Đảm bảo port 22 đã được allow, nếu không sẽ bị lock out khỏi server."),
      emptyLine(),
      h3("Bước 4: Tạo user deploy"),
      ...codeBlock([
        "# Tạo user deploy (không có sudo)",
        "useradd -m -s /bin/bash deploy",
        "",
        "# Thêm SSH public key",
        "mkdir -p /home/deploy/.ssh",
        "echo \"ssh-ed25519 AAAA... deploy@giftcraft\" >> /home/deploy/.ssh/authorized_keys",
        "chmod 700 /home/deploy/.ssh",
        "chmod 600 /home/deploy/.ssh/authorized_keys",
        "chown -R deploy:deploy /home/deploy/.ssh",
        "",
        "# Cho phép deploy dùng docker compose (thông qua group)",
        "usermod -aG docker deploy",
      ]),
      emptyLine(),
      h3("Bước 5: Clone repository"),
      ...codeBlock([
        "mkdir -p /var/www/giftcraft",
        "chown deploy:deploy /var/www/giftcraft",
        "su - deploy",
        "git clone git@github.com:your-org/giftcraft.git /var/www/giftcraft",
        "cd /var/www/giftcraft",
        "ls  # Phải thấy: backend/ frontend/ infra/ .env.example ...",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 4 — CẤU HÌNH BIẾN MÔI TRƯỜNG
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 4 — Cấu hình biến môi trường (.env)"),

      p("File .env là bộ não cấu hình của toàn bộ hệ thống. Nó được đặt ở thư mục gốc (/var/www/giftcraft/.env) và được Docker Compose đọc cho tất cả các service."),
      emptyLine(),
      warn("Tuyệt đối không commit file .env lên Git. File này đã được liệt kê trong .gitignore. Chỉ lưu trữ .env.example (không có giá trị thực) trong repository."),

      emptyLine(),
      h2("4.1  Tạo file .env trên server"),
      ...codeBlock([
        "cd /var/www/giftcraft",
        "cp .env.example .env",
        "nano .env    # hoặc vim .env",
      ]),

      emptyLine(),
      h2("4.2  Các biến bắt buộc phải điền"),
      h3("App"),
      infoTable([
        ["APP_ENV",       "production"],
        ["APP_KEY",       "base64:... (generate bằng: php artisan key:generate --show)"],
        ["APP_URL",       "https://giftcraft.vn"],
        ["APP_DEBUG",     "false (BẮT BUỘC false trong production)"],
        ["FRONTEND_URL",  "https://giftcraft.vn"],
      ]),
      emptyLine(),
      h3("Database (PostgreSQL)"),
      infoTable([
        ["DB_CONNECTION",  "pgsql"],
        ["DB_HOST",        "postgres (tên service trong Docker network)"],
        ["DB_PORT",        "5432"],
        ["DB_DATABASE",    "giftcraft_db"],
        ["DB_USERNAME",    "giftcraft (hoặc đặt tên khác)"],
        ["DB_PASSWORD",    "Đặt password mạnh — ví dụ: Gx9@mK2#pLqW (min 16 ký tự)"],
      ]),
      emptyLine(),
      h3("Redis"),
      infoTable([
        ["REDIS_HOST",     "redis (tên service trong Docker)"],
        ["REDIS_PORT",     "6379"],
        ["REDIS_PASSWORD", "null (để trống nếu không set password Redis)"],
        ["CACHE_STORE",    "redis"],
        ["QUEUE_CONNECTION", "redis"],
        ["SESSION_DRIVER", "redis"],
      ]),
      emptyLine(),
      h3("Cloudflare R2 (lưu trữ ảnh sản phẩm)"),
      p("Cloudflare R2 tương thích với S3 API, dung lượng 10GB miễn phí, không tính phí egress."),
      numbered("Đăng nhập Cloudflare Dashboard → R2 → Create bucket → Tên: giftcraft"),
      numbered("R2 → Manage R2 API Tokens → Create API Token → chọn Object Read & Write"),
      numbered("Copy các giá trị vào .env:"),
      infoTable([
        ["R2_ACCESS_KEY_ID",      "Access Key ID từ Cloudflare"],
        ["R2_SECRET_ACCESS_KEY",  "Secret Access Key từ Cloudflare"],
        ["R2_BUCKET",             "giftcraft"],
        ["R2_ENDPOINT",           "https://<account-id>.r2.cloudflarestorage.com"],
        ["R2_PUBLIC_URL",         "https://r2.giftcraft.vn (nếu set custom domain)"],
        ["R2_DEFAULT_REGION",     "auto"],
      ]),
      emptyLine(),
      h3("Backup R2 (riêng cho backup script)"),
      infoTable([
        ["R2_ACCESS_KEY_ID",      "Key có quyền write vào bucket backup"],
        ["R2_SECRET_ACCESS_KEY",  "Secret tương ứng"],
      ]),
      emptyLine(),
      h3("Thanh toán VNPay"),
      p("Đăng ký tại https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/ để lấy sandbox credentials. Production credentials liên hệ VNPay trực tiếp."),
      infoTable([
        ["VNPAY_TMN_CODE",    "Terminal Merchant Code từ VNPay"],
        ["VNPAY_HASH_SECRET", "Hash secret từ VNPay"],
        ["VNPAY_URL",         "https://pay.vnpay.vn/vpcpay.html (production)"],
        ["VNPAY_RETURN_URL",  "https://giftcraft.vn/api/payment/vnpay/callback"],
      ]),
      emptyLine(),
      h3("Thanh toán MoMo"),
      infoTable([
        ["MOMO_PARTNER_CODE", "Partner code từ MoMo Business"],
        ["MOMO_ACCESS_KEY",   "Access key từ MoMo"],
        ["MOMO_SECRET_KEY",   "Secret key từ MoMo"],
        ["MOMO_ENDPOINT",     "https://payment.momo.vn/v2/gateway/api/create (production)"],
        ["MOMO_RETURN_URL",   "https://giftcraft.vn/api/payment/momo/callback"],
      ]),
      emptyLine(),
      h3("Email (Resend)"),
      p("Resend (resend.com) cung cấp 3.000 email/tháng miễn phí, hỗ trợ custom domain và transactional email."),
      numbered("Đăng ký tại https://resend.com → Tạo API key"),
      numbered("Thêm domain giftcraft.vn → Xác minh DNS records"),
      infoTable([
        ["MAIL_MAILER",       "resend"],
        ["RESEND_API_KEY",    "re_xxxxxxxxxxxx (từ Resend dashboard)"],
        ["MAIL_FROM_ADDRESS", "no-reply@giftcraft.vn"],
        ["MAIL_FROM_NAME",    "GiftCraft Studio"],
      ]),
      emptyLine(),
      h3("Giao hàng GHN"),
      p("Đăng ký tại https://sso.ghn.vn/ → Tạo cửa hàng → Lấy API token."),
      infoTable([
        ["GHN_TOKEN",    "Token từ GHN developer portal"],
        ["GHN_SHOP_ID",  "Shop ID trong GHN dashboard"],
        ["GHN_ENDPOINT", "https://online-gateway.ghn.vn/shiip/public-api (production)"],
      ]),
      emptyLine(),
      h3("Meilisearch"),
      infoTable([
        ["MEILISEARCH_HOST",  "http://meilisearch:7700"],
        ["MEILISEARCH_KEY",   "Đặt master key mạnh — ví dụ: Ms9@kP3#xLqR2024"],
        ["SCOUT_DRIVER",      "meilisearch"],
      ]),
      emptyLine(),
      h3("Frontend (Next.js)"),
      infoTable([
        ["NEXT_PUBLIC_API_URL",  "https://giftcraft.vn/api"],
        ["NEXT_PUBLIC_SITE_URL", "https://giftcraft.vn"],
        ["INTERNAL_API_URL",     "http://nginx/api (fetch server-side qua Docker network)"],
      ]),

      emptyLine(),
      h2("4.3  Generate APP_KEY"),
      p("APP_KEY là khóa mã hóa session và dữ liệu nhạy cảm. Phải generate một lần duy nhất và giữ nguyên suốt vòng đời production."),
      ...codeBlock([
        "# Chạy trên server (sau khi có docker-compose.prod.yml hoạt động)",
        "docker compose -f infra/docker-compose.prod.yml run --rm laravel \\",
        "  php artisan key:generate --show",
        "# Output: base64:AbCdEfGhIjKlMnOpQrStUvWx...",
        "",
        "# Dán vào .env:",
        "APP_KEY=base64:AbCdEfGhIjKlMnOpQrStUvWx...",
      ]),
      warn("Không bao giờ thay đổi APP_KEY sau khi đã có dữ liệu production. Thay đổi sẽ làm hỏng toàn bộ session, cookie và dữ liệu mã hóa (như user.phone)."),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 5 — SSL CERTIFICATE
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 5 — SSL Certificate (Let's Encrypt)"),

      h2("5.1  Lấy certificate lần đầu"),
      p("Script setup-server.sh đã tự động lấy certificate. Nếu cần lấy thủ công:"),
      ...codeBlock([
        "# Dừng bất kỳ service nào đang dùng port 80",
        "docker compose -f infra/docker-compose.prod.yml down 2>/dev/null || true",
        "",
        "# Lấy certificate (standalone mode — Certbot tự chạy web server tạm)",
        "certbot certonly --standalone \\",
        "  -d giftcraft.vn \\",
        "  -d www.giftcraft.vn \\",
        "  --non-interactive \\",
        "  --agree-tos \\",
        "  -m admin@giftcraft.vn",
        "",
        "# Certificate được lưu tại:",
        "# /etc/letsencrypt/live/giftcraft.vn/fullchain.pem",
        "# /etc/letsencrypt/live/giftcraft.vn/privkey.pem",
      ]),
      emptyLine(),
      h2("5.2  Tự động gia hạn"),
      p("Let's Encrypt certificate có hiệu lực 90 ngày. Certbot tự động tạo cron job gia hạn. Kiểm tra:"),
      ...codeBlock([
        "# Kiểm tra cron job đã có chưa",
        "systemctl list-timers | grep certbot",
        "",
        "# Hoặc kiểm tra crontab",
        "crontab -l",
        "",
        "# Test gia hạn thủ công (dry run)",
        "certbot renew --dry-run",
        "",
        "# Nếu Nginx đang chạy, cần hook reload sau khi gia hạn:",
        "echo '0 3 * * * certbot renew --quiet --deploy-hook \"docker compose -f /var/www/giftcraft/infra/docker-compose.prod.yml exec -T nginx nginx -s reload\"' | crontab -",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 6 — TRIỂN KHAI LẦN ĐẦU
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 6 — Triển khai lần đầu (First Deploy)"),

      h2("6.1  Checklist trước khi deploy"),
      bullet("DNS records đã trỏ về IP VPS (kiểm tra: nslookup giftcraft.vn)"),
      bullet("File .env đã được điền đầy đủ tất cả biến bắt buộc"),
      bullet("SSL certificate đã được lấy (kiểm tra: ls /etc/letsencrypt/live/giftcraft.vn/)"),
      bullet("Repository đã được push lên GitHub với code mới nhất"),
      bullet("Server đã clone repository về /var/www/giftcraft"),
      bullet("Docker đã được cài và user deploy đã có quyền docker"),
      emptyLine(),

      h2("6.2  Chạy deploy script"),
      p("Dự án có sẵn script deploy tự động tại infra/scripts/deploy.sh:"),
      ...codeBlock([
        "# SSH vào server với user deploy",
        "ssh -i ~/.ssh/giftcraft_deploy deploy@65.21.xxx.xxx",
        "",
        "# Di chuyển đến thư mục project",
        "cd /var/www/giftcraft",
        "",
        "# Cấp quyền chạy script",
        "chmod +x infra/scripts/deploy.sh infra/scripts/backup.sh",
        "",
        "# Chạy deploy production",
        "bash infra/scripts/deploy.sh production",
      ]),
      emptyLine(),
      p("Script deploy tự động thực hiện:"),
      numbered("git pull — pull code mới nhất từ nhánh hiện tại"),
      numbered("docker compose up -d --build — build image và khởi động các service"),
      numbered("php artisan migrate --force — chạy migration database"),
      numbered("php artisan optimize:clear — clear caches cũ"),
      numbered("php artisan queue:restart — khởi động lại queue worker"),
      numbered("Smoke test: kiểm tra /api/health trả về HTTP 200"),
      numbered("Nếu smoke test fail: tự động rollback về commit trước"),

      emptyLine(),
      h2("6.3  Deploy thủ công từng bước"),
      h3("Bước 1: Build và khởi động services"),
      ...codeBlock([
        "cd /var/www/giftcraft",
        "",
        "# Build tất cả images và start",
        "docker compose -f infra/docker-compose.prod.yml up -d --build",
        "",
        "# Kiểm tra tất cả containers đang chạy",
        "docker compose -f infra/docker-compose.prod.yml ps",
        "# NAME                     STATUS",
        "# giftcraft-nginx-1        Up",
        "# giftcraft-nextjs-1       Up",
        "# giftcraft-laravel-1      Up",
        "# giftcraft-horizon-1      Up",
        "# giftcraft-postgres-1     Up (healthy)",
        "# giftcraft-redis-1        Up (healthy)",
        "# giftcraft-meilisearch-1  Up",
      ]),
      emptyLine(),
      h3("Bước 2: Chạy database migrations"),
      ...codeBlock([
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  php artisan migrate --force",
        "# Kết quả: Running migrations...",
        "# 2024_01_01_000001_create_users_table ...... 10ms DONE",
        "# ... (19 tables tổng cộng)",
      ]),
      emptyLine(),
      h3("Bước 3: Seed dữ liệu mẫu (lần đầu)"),
      ...codeBlock([
        "# Chỉ chạy lần đầu — sẽ xóa và tạo lại dữ liệu!",
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  php artisan db:seed --force",
        "# Tạo: 2 admin, 12 categories, 25 products, 8 portfolio items",
      ]),
      warn("KHÔNG chạy db:seed trên production sau khi đã có dữ liệu thật. Lệnh này sẽ xóa sạch dữ liệu hiện tại."),
      emptyLine(),
      h3("Bước 4: Clear và warm cache"),
      ...codeBlock([
        "# Clear tất cả caches cũ",
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  php artisan optimize:clear",
        "",
        "# Warm up config và route cache (tăng hiệu năng production)",
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  php artisan config:cache",
        "",
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  php artisan route:cache",
      ]),
      emptyLine(),
      h3("Bước 5: Kiểm tra hoạt động"),
      ...codeBlock([
        "# Test API health endpoint",
        "curl https://giftcraft.vn/api/health",
        "# {\"success\":true,\"data\":{\"status\":\"ok\",...}}",
        "",
        "# Test trang chủ",
        "curl -I https://giftcraft.vn",
        "# HTTP/2 200",
        "# content-type: text/html; charset=utf-8",
        "",
        "# Kiểm tra SSL certificate",
        "echo | openssl s_client -servername giftcraft.vn -connect giftcraft.vn:443 2>/dev/null | openssl x509 -noout -dates",
        "# notBefore=... notAfter=... (còn hạn 90 ngày)",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 7 — DATABASE
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 7 — Quản lý Database PostgreSQL"),

      h2("7.1  Kết nối database"),
      h3("Từ bên trong Docker network (recommended):"),
      ...codeBlock([
        "# Kết nối psql từ container laravel",
        "docker compose -f infra/docker-compose.prod.yml exec -T laravel \\",
        "  psql postgresql://giftcraft:PASSWORD@postgres:5432/giftcraft_db",
        "",
        "# Hoặc trực tiếp vào container postgres",
        "docker compose -f infra/docker-compose.prod.yml exec postgres \\",
        "  psql -U giftcraft -d giftcraft_db",
      ]),
      emptyLine(),
      h3("Từ máy local qua SSH tunnel (an toàn, không cần expose port):"),
      ...codeBlock([
        "# Tạo SSH tunnel: port 5432 local → port 5432 trong Docker",
        "ssh -i ~/.ssh/giftcraft_deploy -L 5432:localhost:5433 deploy@65.21.xxx.xxx -N",
        "",
        "# Giữ terminal trên, mở terminal mới:",
        "# Kết nối bằng TablePlus, DBeaver, pgAdmin:",
        "#   Host: 127.0.0.1",
        "#   Port: 5432",
        "#   Database: giftcraft_db",
        "#   Username: giftcraft",
        "#   Password: (giá trị DB_PASSWORD trong .env)",
      ]),
      note("Không nên expose port 5432 ra internet (không cần thêm port mapping trong docker-compose.prod.yml). SSH tunnel an toàn hơn nhiều."),

      emptyLine(),
      h2("7.2  Backup database"),
      h3("Backup thủ công:"),
      ...codeBlock([
        "# Backup ra file .sql.gz",
        "docker compose -f infra/docker-compose.prod.yml exec -T postgres \\",
        "  pg_dump -U giftcraft giftcraft_db | gzip > /tmp/backup_$(date +%Y%m%d).sql.gz",
        "",
        "# Copy file backup về máy local",
        "scp -i ~/.ssh/giftcraft_deploy deploy@65.21.xxx.xxx:/tmp/backup_*.sql.gz .",
      ]),
      emptyLine(),
      h3("Backup tự động lên Cloudflare R2:"),
      p("Script backup.sh đã được cài cron tự động lúc 2:00 AM. Script này:"),
      bullet("Dump PostgreSQL → gzip → upload lên R2 bucket giftcraft-backups"),
      bullet("Tự động xóa backup cũ hơn 30 ngày"),
      bullet("Log kết quả vào /var/log/giftcraft-backup.log"),
      emptyLine(),
      p("Thiết lập R2 bucket cho backup:"),
      numbered("Tạo bucket riêng tên giftcraft-backups trong Cloudflare R2"),
      numbered("Tạo API token riêng chỉ có quyền write vào bucket backup"),
      numbered("Thêm vào .env:"),
      ...codeBlock([
        "R2_ACCESS_KEY_ID=xxxx       # Key cho backup",
        "R2_SECRET_ACCESS_KEY=xxxx   # Secret cho backup",
        "# R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com",
      ]),
      emptyLine(),
      h3("Kiểm tra cron backup:"),
      ...codeBlock([
        "# Xem log backup",
        "tail -50 /var/log/giftcraft-backup.log",
        "",
        "# Chạy test thủ công",
        "bash /var/www/giftcraft/infra/scripts/backup.sh",
      ]),

      emptyLine(),
      h2("7.3  Restore database"),
      ...codeBlock([
        "# Upload file backup lên server",
        "scp -i ~/.ssh/giftcraft_deploy backup_20250101.sql.gz deploy@65.21.xxx.xxx:/tmp/",
        "",
        "# Trên server — restore",
        "gunzip -c /tmp/backup_20250101.sql.gz | \\",
        "  docker compose -f infra/docker-compose.prod.yml exec -T postgres \\",
        "  psql -U giftcraft -d giftcraft_db",
        "",
        "# Restart laravel để clear cache",
        "docker compose -f infra/docker-compose.prod.yml restart laravel",
      ]),
      warn("Restore sẽ ghi đè dữ liệu hiện tại. Luôn backup mới nhất trước khi restore."),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 8 — DEPLOY CẬP NHẬT CODE
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 8 — Deploy cập nhật code"),

      h2("8.1  Quy trình deploy thường ngày"),
      ...codeBlock([
        "# 1. Commit và push code lên GitHub từ máy local",
        "git add -A",
        "git commit -m \"feat: thêm tính năng X\"",
        "git push origin main",
        "",
        "# 2. SSH vào server",
        "ssh -i ~/.ssh/giftcraft_deploy deploy@65.21.xxx.xxx",
        "",
        "# 3. Chạy deploy script",
        "cd /var/www/giftcraft",
        "bash infra/scripts/deploy.sh production",
        "",
        "# Script tự động: git pull → docker build → migrate → smoke test",
      ]),

      emptyLine(),
      h2("8.2  Zero-downtime deploy"),
      p("Docker Compose --no-deps flag cho phép rebuild từng service một mà không dừng toàn bộ stack:"),
      ...codeBlock([
        "# Chỉ rebuild và restart nextjs (không ảnh hưởng Laravel, DB)",
        "docker compose -f infra/docker-compose.prod.yml up -d --build --no-deps nextjs",
        "",
        "# Chỉ rebuild laravel",
        "docker compose -f infra/docker-compose.prod.yml up -d --build --no-deps laravel",
        "",
        "# Restart horizon sau khi update code",
        "docker compose -f infra/docker-compose.prod.yml restart horizon",
      ]),

      emptyLine(),
      h2("8.3  Rollback"),
      ...codeBlock([
        "# Xem lịch sử commit",
        "git log --oneline -10",
        "",
        "# Rollback về commit cụ thể",
        "git checkout <commit-hash>",
        "",
        "# Rebuild lại",
        "docker compose -f infra/docker-compose.prod.yml up -d --build --no-deps",
        "",
        "# Hoặc đơn giản là revert commit và push lại",
        "git revert HEAD",
        "git push origin main",
        "# Rồi chạy deploy script bình thường",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 9 — MONITORING VÀ LOGS
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 9 — Monitoring và xem Logs"),

      h2("9.1  Xem logs theo service"),
      ...codeBlock([
        "# Tất cả services (realtime)",
        "docker compose -f infra/docker-compose.prod.yml logs -f",
        "",
        "# Chỉ Next.js",
        "docker compose -f infra/docker-compose.prod.yml logs -f nextjs",
        "",
        "# Chỉ Laravel",
        "docker compose -f infra/docker-compose.prod.yml logs -f laravel",
        "",
        "# Chỉ Nginx access log",
        "docker compose -f infra/docker-compose.prod.yml logs -f nginx",
        "",
        "# Horizon queue worker",
        "docker compose -f infra/docker-compose.prod.yml logs -f horizon",
        "",
        "# 100 dòng cuối",
        "docker compose -f infra/docker-compose.prod.yml logs --tail=100 laravel",
      ]),

      emptyLine(),
      h2("9.2  Kiểm tra tài nguyên server"),
      ...codeBlock([
        "# CPU, RAM, network của từng container",
        "docker stats",
        "",
        "# Disk usage",
        "df -h",
        "",
        "# Dung lượng Docker volumes",
        "docker system df -v",
        "",
        "# Top processes",
        "htop",
      ]),

      emptyLine(),
      h2("9.3  Laravel logs"),
      ...codeBlock([
        "# Xem Laravel application log",
        "docker compose -f infra/docker-compose.prod.yml exec laravel \\",
        "  tail -100 storage/logs/laravel.log",
        "",
        "# Clear log cũ",
        "docker compose -f infra/docker-compose.prod.yml exec laravel \\",
        "  php artisan log:clear",
        "",
        "# Horizon dashboard (chỉ truy cập từ localhost vì Nginx block public)",
        "# Tạo SSH tunnel rồi mở: http://localhost:8000/horizon",
        "ssh -i ~/.ssh/giftcraft_deploy -L 8000:localhost:8000 deploy@65.21.xxx.xxx -N",
      ]),

      emptyLine(),
      h2("9.4  Uptime monitoring (miễn phí)"),
      p("Dùng Better Uptime (betteruptime.com) hoặc UptimeRobot (uptimerobot.com) để nhận cảnh báo qua email/Slack khi website down:"),
      numbered("Đăng ký tài khoản → Add new monitor"),
      numbered("URL: https://giftcraft.vn/api/health"),
      numbered("Check interval: 1 phút"),
      numbered("Alert: email + Telegram bot (nếu cần)"),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 10 — TROUBLESHOOTING
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 10 — Xử lý sự cố thường gặp"),

      h2("10.1  Container không khởi động"),
      ...codeBlock([
        "# Kiểm tra trạng thái tất cả containers",
        "docker compose -f infra/docker-compose.prod.yml ps",
        "",
        "# Xem log container bị lỗi",
        "docker compose -f infra/docker-compose.prod.yml logs laravel",
        "",
        "# Rebuild từ đầu (xóa cache build)",
        "docker compose -f infra/docker-compose.prod.yml down",
        "docker compose -f infra/docker-compose.prod.yml up -d --build",
      ]),

      emptyLine(),
      h2("10.2  Database connection refused"),
      ...codeBlock([
        "# Kiểm tra postgres có healthy không",
        "docker compose -f infra/docker-compose.prod.yml ps postgres",
        "",
        "# Kiểm tra biến DB trong .env",
        "grep DB_ .env",
        "",
        "# Test kết nối từ laravel container",
        "docker compose -f infra/docker-compose.prod.yml exec laravel \\",
        "  php artisan db:show",
        "",
        "# Restart postgres",
        "docker compose -f infra/docker-compose.prod.yml restart postgres",
      ]),

      emptyLine(),
      h2("10.3  502 Bad Gateway"),
      p("Lỗi 502 từ Nginx có nghĩa là upstream service (nextjs hoặc laravel) không response."),
      ...codeBlock([
        "# Kiểm tra nextjs có đang chạy không",
        "docker compose -f infra/docker-compose.prod.yml ps nextjs",
        "",
        "# Xem log nextjs để tìm lỗi",
        "docker compose -f infra/docker-compose.prod.yml logs nextjs --tail=50",
        "",
        "# Restart nextjs",
        "docker compose -f infra/docker-compose.prod.yml restart nextjs",
        "",
        "# Nếu vẫn lỗi — rebuild",
        "docker compose -f infra/docker-compose.prod.yml up -d --build --no-deps nextjs",
      ]),

      emptyLine(),
      h2("10.4  SSL certificate lỗi"),
      ...codeBlock([
        "# Kiểm tra certificate còn hạn không",
        "certbot certificates",
        "",
        "# Gia hạn thủ công",
        "docker compose -f infra/docker-compose.prod.yml stop nginx",
        "certbot renew",
        "docker compose -f infra/docker-compose.prod.yml start nginx",
      ]),

      emptyLine(),
      h2("10.5  Disk đầy"),
      ...codeBlock([
        "# Xem disk usage",
        "df -h",
        "",
        "# Xóa Docker images cũ không dùng",
        "docker image prune -a",
        "",
        "# Xóa build cache",
        "docker builder prune",
        "",
        "# Xóa containers, networks, volumes không dùng",
        "docker system prune",
        "",
        "# Xem thư mục nào tốn nhiều nhất",
        "du -sh /var/lib/docker/*",
        "du -sh /var/log/*",
      ]),

      emptyLine(),
      h2("10.6  Email không gửi được"),
      ...codeBlock([
        "# Kiểm tra Horizon có đang xử lý queue không",
        "docker compose -f infra/docker-compose.prod.yml logs horizon --tail=20",
        "",
        "# Kiểm tra failed jobs",
        "docker compose -f infra/docker-compose.prod.yml exec laravel \\",
        "  php artisan queue:failed",
        "",
        "# Retry failed jobs",
        "docker compose -f infra/docker-compose.prod.yml exec laravel \\",
        "  php artisan queue:retry all",
        "",
        "# Kiểm tra RESEND_API_KEY trong .env",
        "grep RESEND .env",
      ]),

      // ════════════════════════════════════════════════════════════════════════
      // CHƯƠNG 11 — CHECKLIST GO-LIVE
      // ════════════════════════════════════════════════════════════════════════
      h1("Chương 11 — Checklist Go-Live"),

      h2("Infrastructure"),
      bullet("VPS Hetzner CX32 đang chạy Ubuntu 24.04"),
      bullet("Firewall UFW: chỉ mở port 22, 80, 443"),
      bullet("Fail2ban đã cài để chống brute force SSH"),
      bullet("SSH key-only authentication (đã tắt password auth)"),
      bullet("Domain DNS đã trỏ về IP VPS"),
      bullet("SSL certificate Let's Encrypt valid"),
      bullet("Auto-renew SSL đã được cấu hình"),
      bullet("Cron backup DB 2:00 AM hàng ngày"),
      bullet("Uptime monitoring đã thiết lập"),

      emptyLine(),
      h2("Application"),
      bullet("APP_ENV=production, APP_DEBUG=false"),
      bullet("APP_KEY đã được generate và lưu vào .env"),
      bullet("Tất cả biến .env đã điền đủ (không còn giá trị trống)"),
      bullet("VNPay và MoMo đã chuyển sang production URL"),
      bullet("GHN đã chuyển sang production endpoint"),
      bullet("Resend email domain đã verify DNS"),
      bullet("Cloudflare R2 bucket đã tạo và permissions đúng"),
      bullet("Database migrations đã chạy thành công"),
      bullet("Meilisearch đã index sản phẩm"),
      bullet("Tất cả containers Up và healthy"),

      emptyLine(),
      h2("Security"),
      bullet("Mật khẩu DB đủ mạnh (min 16 ký tự, có ký tự đặc biệt)"),
      bullet("Meilisearch master key đã thay đổi (không dùng local_master_key)"),
      bullet("Redis không expose ra public internet"),
      bullet("PostgreSQL không expose ra public internet"),
      bullet("/horizon endpoint chỉ accessible từ localhost"),
      bullet("Content Security Policy headers đã cấu hình trong Nginx"),
      bullet("Rate limiting đã cấu hình cho /api/auth và /api/orders/checkout"),

      emptyLine(),
      h2("Testing"),
      bullet("Đặt hàng test thành công (COD)"),
      bullet("Thanh toán VNPay sandbox test thành công"),
      bullet("Thanh toán MoMo sandbox test thành công"),
      bullet("Email xác nhận đơn hàng gửi được"),
      bullet("Tính phí GHN hoạt động"),
      bullet("Upload ảnh lên R2 hoạt động"),
      bullet("Search sản phẩm qua Meilisearch hoạt động"),
      bullet("Cart merge khi login hoạt động"),
      bullet("Admin panel accessible và hoạt động"),
      bullet("Mobile responsive trên iOS Safari và Android Chrome"),

      // ════════════════════════════════════════════════════════════════════════
      // PHỤ LỤC
      // ════════════════════════════════════════════════════════════════════════
      h1("Phụ lục — Lệnh tham khảo nhanh"),

      h2("A.1  Các lệnh Docker Compose thường dùng"),
      infoTable([
        ["Khởi động toàn bộ stack",          "docker compose -f infra/docker-compose.prod.yml up -d"],
        ["Dừng toàn bộ stack",               "docker compose -f infra/docker-compose.prod.yml down"],
        ["Xem trạng thái containers",        "docker compose -f infra/docker-compose.prod.yml ps"],
        ["Xem logs realtime",                "docker compose -f infra/docker-compose.prod.yml logs -f"],
        ["Restart 1 service",                "docker compose -f infra/docker-compose.prod.yml restart laravel"],
        ["Rebuild 1 service",                "docker compose -f infra/docker-compose.prod.yml up -d --build --no-deps nextjs"],
        ["Vào shell container",              "docker compose -f infra/docker-compose.prod.yml exec laravel bash"],
        ["Chạy artisan command",             "docker compose -f infra/docker-compose.prod.yml exec -T laravel php artisan <cmd>"],
        ["Xem resource usage",               "docker stats --no-stream"],
      ]),
      emptyLine(),
      h2("A.2  Các lệnh Artisan thường dùng"),
      infoTable([
        ["Chạy migration",          "php artisan migrate --force"],
        ["Rollback migration",      "php artisan migrate:rollback"],
        ["Clear tất cả cache",      "php artisan optimize:clear"],
        ["Cache config",            "php artisan config:cache"],
        ["Cache routes",            "php artisan route:cache"],
        ["Restart queue",           "php artisan queue:restart"],
        ["Xem queue failed jobs",   "php artisan queue:failed"],
        ["Xem danh sách routes",    "php artisan route:list"],
        ["Tinker (REPL)",           "php artisan tinker"],
      ]),
      emptyLine(),
      h2("A.3  File và thư mục quan trọng"),
      infoTable([
        ["/var/www/giftcraft/.env",                      "Biến môi trường production"],
        ["/var/www/giftcraft/infra/docker-compose.prod.yml", "Production stack config"],
        ["/var/www/giftcraft/infra/nginx/production.conf",   "Nginx config"],
        ["/var/www/giftcraft/infra/scripts/deploy.sh",       "Script deploy tự động"],
        ["/var/www/giftcraft/infra/scripts/backup.sh",       "Script backup DB"],
        ["/etc/letsencrypt/live/giftcraft.vn/",          "SSL certificates"],
        ["/var/log/giftcraft-backup.log",                "Log backup DB"],
        ["docker volume: postgres_data",                 "Dữ liệu PostgreSQL"],
        ["docker volume: redis_data",                    "Dữ liệu Redis"],
        ["docker volume: meilisearch_data",              "Dữ liệu Meilisearch index"],
        ["docker volume: storage_data",                  "Laravel storage (uploads)"],
      ]),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/Users/tuanp/Documents/giftcraft/PRODUCTION_GUIDE.docx", buffer);
  console.log("✅  PRODUCTION_GUIDE.docx đã được tạo thành công!");
}).catch(err => {
  console.error("❌  Lỗi:", err);
  process.exit(1);
});
