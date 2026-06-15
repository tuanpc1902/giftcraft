/* GiftCraft Studio — Homepage */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

function useReveal() {
  useEffectH(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el, i) => { el.style.transitionDelay = (Math.min(i, 6) * 60) + "ms"; io.observe(el); });
    // safety net: never leave content hidden if observer/transition is throttled
    const t = setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(el => el.classList.add("in")), 1800);
    return () => { io.disconnect(); clearTimeout(t); };
  });
}

/* ---- Hero ---- */
function Hero({ go }) {
  return (
    <section style={{ position: "relative", background: "var(--paper)" }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch", gap: 0, minHeight: "82vh" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px 80px 0" }} className="gc-hero-copy">
          <span className="kicker eyebrow-line" style={{ marginBottom: 28 }}>Bộ sưu tập Tết Bính Ngọ 2026</span>
          <h1 className="display" style={{ fontSize: "clamp(46px, 5.4vw, 82px)", margin: 0 }}>
            Trao gửi<br/>sự <span style={{ fontStyle: "italic", color: "var(--accent)" }}>tinh tế</span>,<br/>nhận về niềm tin.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--secondary)", maxWidth: 420, margin: "30px 0 38px" }}>
            Những hộp quà thủ công được tuyển chọn kỹ lưỡng — dành cho người thân yêu và đối tác doanh nghiệp, trong từng dịp trọng đại.
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => go("list", "tet")}>Khám phá Quà Tết <Ic.arrow className="ar" /></button>
            <button className="btn btn-ghost" onClick={() => go("list", "b2b")}>Quà doanh nghiệp</button>
          </div>
          <div style={{ display: "flex", gap: 36, marginTop: 56 }}>
            {[["12.000+", "Quà đã trao gửi"], ["500+", "Doanh nghiệp tin chọn"], ["4,9/5", "Đánh giá khách hàng"]].map(([a,b]) => (
              <div key={b}>
                <div className="serif" style={{ fontSize: 26, fontWeight: 500 }}>{a}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div className="ph ph-warm" data-label="Hero — hộp quà Tết đỏ son trên nền lụa" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", left: -54, bottom: 56, background: "#fff", padding: "22px 26px", boxShadow: "0 24px 60px rgba(0,0,0,0.12)", maxWidth: 250 }} className="gc-hide-sm">
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span className="badge badge-accent">Bán chạy</span>
              <Stars n={5} />
            </div>
            <p className="serif" style={{ margin: "0 0 4px", fontSize: 16 }}>Hộp quà Tết — An Khang</p>
            <p className="price" style={{ margin: 0, fontSize: 14 }}>{window.GC.VND(1280000)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Category split (B2C / B2B) ---- */
function CategorySplit({ go }) {
  const cards = [
    { k: "Cá nhân", title: "Quà cho người thương", desc: "Tết · Trung Thu · Sinh nhật · Cưới hỏi", to: ["list", "all"], ph: "Quà cá nhân · hộp lụa", cls: "ph-warm", cta: "Mua quà cá nhân" },
    { k: "Doanh nghiệp", title: "Quà tặng doanh nghiệp", desc: "In logo · Số lượng lớn · Báo giá theo bậc", to: ["list", "b2b"], ph: "Quà B2B · in logo doanh nghiệp", cls: "ph-dark", cta: "Yêu cầu báo giá", dark: true },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }} className="gc-2col">
          {cards.map(c => (
            <div key={c.k} className="reveal zoom" style={{ position: "relative", aspectRatio: "10/11", cursor: "pointer", overflow: "hidden" }} onClick={() => go(...c.to)}>
              <div className={"ph " + c.cls} data-label={c.ph} style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: c.dark ? "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.05))" : "linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)" }} />
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, color: "#fff" }}>
                <span className="kicker" style={{ color: c.dark ? "#fff" : "#fff", opacity: 0.85 }}>{c.k}</span>
                <h3 className="serif" style={{ fontSize: 34, fontWeight: 500, margin: "12px 0 8px", lineHeight: 1.05 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", margin: "0 0 20px" }}>{c.desc}</p>
                <span className="ulink" style={{ color: "#fff", borderColor: "#fff" }}>{c.cta} <Ic.arrow className="ar" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Occasions tabs ---- */
function Occasions({ go }) {
  const { OCCASIONS, PRODUCTS } = window.GC;
  const [active, setActive] = useStateH("tet");
  const list = PRODUCTS.filter(p => p.occasion === active).slice(0, 4);
  const fill = PRODUCTS.filter(p => p.occasion !== active).slice(0, 4 - list.length);
  const shown = [...list, ...fill].slice(0, 4);
  const cur = OCCASIONS.find(o => o.id === active);
  return (
    <section className="section-sm" style={{ background: "var(--paper)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="kicker kicker-muted">Mua theo dịp</span>
          <h2 className="serif" style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 500, margin: "14px 0 0" }}>Mỗi dịp một câu chuyện</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
          {OCCASIONS.map(o => (
            <button key={o.id} onClick={() => setActive(o.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 20px", borderRadius: 999, border: "1px solid " + (active === o.id ? "var(--ink)" : "var(--line-strong)"), background: active === o.id ? "var(--ink)" : "#fff", color: active === o.id ? "#fff" : "var(--ink)", fontSize: 13.5, fontWeight: 500, transition: "all .25s" }}>
              <span className="serif" style={{ fontSize: 15, color: active === o.id ? "rgba(255,255,255,0.6)" : "var(--accent)" }}>{o.glyph}</span>
              {o.label}
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p className="muted" style={{ fontSize: 14, fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 18 }}>“{cur.note}”</p>
        </div>
        <div className="gc-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
          {shown.map(p => <ProductCard key={p.id} p={p} go={go} addToCart={window.__gcAdd} />)}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="btn btn-secondary" onClick={() => go("list", active)}>Xem tất cả quà {cur.label} <Ic.arrow className="ar" /></button>
        </div>
      </div>
    </section>
  );
}

/* ---- Featured products ---- */
function Featured({ go }) {
  const { PRODUCTS } = window.GC;
  const shown = PRODUCTS.slice(0, 4);
  return (
    <section className="section">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="kicker">Tuyển chọn</span>
            <h2 className="serif" style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 500, margin: "14px 0 0" }}>Được yêu thích nhất</h2>
          </div>
          <button className="ulink" onClick={() => go("list", "all")}>Toàn bộ bộ sưu tập <Ic.arrow className="ar" /></button>
        </div>
        <div className="gc-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
          {shown.map(p => <ProductCard key={p.id} p={p} go={go} addToCart={window.__gcAdd} reveal />)}
        </div>
      </div>
    </section>
  );
}

/* ---- Craft / values strip ---- */
function Values() {
  const items = [
    { ic: Ic.leaf, h: "Thủ công tuyển chọn", d: "Từng sản phẩm được nghệ nhân và đội ngũ tuyển lựa kỹ càng." },
    { ic: Ic.pencil, h: "Cá nhân hoá", d: "Khắc tên, in logo, thiệp viết tay theo đúng tâm ý của bạn." },
    { ic: Ic.truck, h: "Giao trọn vẹn", d: "Đóng gói chỉn chu, giao toàn quốc, đúng hẹn từng dịp." },
    { ic: Ic.gift, h: "Trải nghiệm mở quà", d: "Mỗi hộp là một khoảnh khắc — từ lớp lụa đến chi tiết cuối." },
  ];
  return (
    <section className="section-sm" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }} className="gc-grid4">
          {items.map(it => (
            <div key={it.h} className="reveal">
              <div style={{ color: "var(--accent)", marginBottom: 16 }}><it.ic style={{ width: 26, height: 26 }} /></div>
              <h3 className="serif" style={{ fontSize: 19, fontWeight: 500, margin: "0 0 8px" }}>{it.h}</h3>
              <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Social proof (instagram grid) ---- */
function SocialProof() {
  const labels = ["Khoảnh khắc trao quà", "Hộp Tết An Khang", "Set Trung Thu", "Quà doanh nghiệp 240 phần", "Thiệp viết tay", "Đóng gói lụa", "Khai trương", "Hậu trường studio"];
  return (
    <section className="section" style={{ background: "var(--paper)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="kicker">@giftcraft.studio</span>
          <h2 className="serif" style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 500, margin: "14px 0 8px" }}>Từ studio đến tay người nhận</h2>
          <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>Theo dõi hành trình mỗi món quà được tạo nên.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: "1fr", gap: 14 }} className="gc-ig">
          {labels.map((l, i) => (
            <div key={i} className="zoom" style={{ position: "relative", aspectRatio: "1/1", gridColumn: i === 0 ? "span 2" : "auto", gridRow: i === 0 ? "span 2" : "auto", cursor: "pointer" }}>
              <div className={"ph " + (i % 3 === 0 ? "ph-warm" : "")} data-label={l} style={{ position: "absolute", inset: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Partners ---- */
function Partners() {
  const { PARTNERS } = window.GC;
  return (
    <section style={{ padding: "64px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap">
        <p style={{ textAlign: "center", fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--secondary)", margin: "0 0 36px", fontWeight: 600 }}>Được hơn 500 doanh nghiệp tin chọn</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          {PARTNERS.map(p => (
            <span key={p} className="serif" style={{ fontSize: 24, fontWeight: 600, color: "#c9c7c4", letterSpacing: "0.02em", transition: "color .3s", cursor: "default" }} onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={e => e.currentTarget.style.color = "#c9c7c4"}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Testimonials ---- */
function Testimonials() {
  const { REVIEWS } = window.GC;
  return (
    <section className="section">
      <div className="wrap">
        <div style={{ marginBottom: 44 }}>
          <span className="kicker">Khách hàng nói gì</span>
          <h2 className="serif" style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 500, margin: "14px 0 0", maxWidth: 600 }}>Niềm tin được trao gửi qua từng món quà</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }} className="gc-grid3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="reveal" style={{ border: "1px solid var(--line)", padding: 32, background: "#fff" }}>
              <Stars n={r.stars} />
              <p className="serif" style={{ fontSize: 18, lineHeight: 1.5, fontWeight: 400, margin: "18px 0 26px" }}>“{r.text}”</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="ph" data-label="" style={{ width: 42, height: 42, borderRadius: "50%" }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- B2B banner ---- */
function B2BBanner({ go }) {
  return (
    <section style={{ background: "var(--dark)", color: "#fff" }}>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center", padding: "var(--s9) 0" }} className="gc-b2b">
        <div>
          <span className="kicker" style={{ color: "var(--accent)" }}>Giải pháp doanh nghiệp</span>
          <h2 className="serif" style={{ fontSize: "clamp(34px,4vw,54px)", fontWeight: 500, lineHeight: 1.05, margin: "18px 0 22px" }}>
            Quà tặng doanh nghiệp,<br/>chỉn chu đến từng phần.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 0 32px" }}>
            In logo thương hiệu, đóng gói đồng bộ, báo giá minh bạch theo bậc số lượng từ 20 đến 300+ phần. Đội ngũ tư vấn riêng đồng hành cùng bạn.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => go("list", "b2b")}>Yêu cầu báo giá <Ic.arrow className="ar" /></button>
            <button className="btn btn-dark-outline btn-lg">Tải brochure</button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {[["20–300+", "Quy mô mỗi đơn"], ["5 bậc", "Báo giá theo số lượng"], ["72 giờ", "Phản hồi báo giá"]].map(([a,b]) => (
            <div key={b} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="serif" style={{ fontSize: 38, fontWeight: 500, color: "#fff", minWidth: 150 }}>{a}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ go }) {
  useReveal();
  return (
    <main>
      <Hero go={go} />
      <CategorySplit go={go} />
      <Occasions go={go} />
      <Featured go={go} />
      <Values />
      <SocialProof />
      <Testimonials />
      <Partners />
      <B2BBanner go={go} />
    </main>
  );
}

window.HomePage = HomePage;
window.useReveal = useReveal;
