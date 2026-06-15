/* GiftCraft Studio — shared components */
const { useState, useEffect, useRef } = React;
const { VND, OCCASIONS, CATEGORIES, PRODUCTS, REVIEWS, PARTNERS } = window.GC;

/* ---------------- Icons (simple line icons) ---------------- */
const Ic = {
  search: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  cart: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M3 4h2l2.2 12.4a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2L21 8H6.2"/><circle cx="9.5" cy="20.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="18" cy="20.5" r="1.2" fill="currentColor" stroke="none"/></svg>,
  user: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>,
  heart: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M12 20s-7-4.5-9.2-8.4C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.2 6.6C19 15.5 12 20 12 20z"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M5 5l14 14M19 5L5 19"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M5 12h14"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  chev: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 18l-6 3.4 1.4-6.8L2.3 9.1l6.9-.8z"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 12l5 5L20 6"/></svg>,
  truck: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7"/><circle cx="7" cy="17" r="1.6"/><circle cx="17.5" cy="17" r="1.6"/></svg>,
  gift: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M4 11h16v9H4zM4 11V8h16v3M12 8V20M12 8C12 5.5 10.5 4 9 4S6.5 6 8 7s4 1 4 1zM12 8c0-2.5 1.5-4 3-4s1.5 2 0 3-3 1-3 1z"/></svg>,
  pencil: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/></svg>,
  leaf: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M5 20c0-9 7-14 15-15-1 9-6 15-15 15zM5 20c2-4 5-6 9-7"/></svg>,
};

function Logo({ on = "ink", size = 22 }) {
  const c = on === "light" ? "#fff" : "var(--ink)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: c }}>
      <span style={{
        width: 26, height: 26, borderRadius: "50%", background: "var(--accent)",
        display: "grid", placeItems: "center", color: "#fff",
        fontFamily: "var(--serif)", fontSize: 15, fontWeight: 600, flex: "none",
      }}>G</span>
      <span style={{ fontFamily: "var(--serif)", fontSize: size, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1 }}>
        GiftCraft<span style={{ color: "var(--accent)" }}>.</span>
      </span>
    </span>
  );
}

function Stars({ n = 5, size }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, color: "var(--accent)" }}>
      {[0,1,2,3,4].map(i => <Ic.star key={i} style={{ opacity: i < Math.round(n) ? 1 : 0.22, width: size, height: size }} />)}
    </span>
  );
}

/* ---------------- Top announcement bar ---------------- */
function Announce() {
  const items = [
    "Miễn phí giao hàng nội thành cho đơn từ 800.000₫",
    "Tết Bính Ngọ 2026 — Đặt sớm nhận ưu đãi đến 15%",
    "In logo doanh nghiệp · Giao toàn quốc",
  ];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % items.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: "var(--ink)", color: "#fff", textAlign: "center", fontSize: 12, letterSpacing: "0.04em", padding: "9px 16px", fontWeight: 400 }}>
      <span key={i} style={{ display: "inline-block", animation: "fadeIn .5s ease" }}>{items[i]}</span>
    </div>
  );
}

/* ---------------- Navigation ---------------- */
function Nav({ go, current, cartCount, openCart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { label: "Quà Tết", v: "list", o: "tet" },
    { label: "Trung Thu", v: "list", o: "trungthu" },
    { label: "Doanh nghiệp", v: "list", o: "b2b" },
    { label: "Bộ sưu tập", v: "list", o: "all" },
    { label: "Câu chuyện", v: "home" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${scrolled ? "var(--line-strong)" : "var(--line)"}`, transition: "border-color .3s" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <button onClick={() => go("home")} style={{ background: "none", border: 0, padding: 0 }} aria-label="GiftCraft Studio">
          <Logo />
        </button>
        <nav style={{ display: "flex", gap: 30, position: "absolute", left: "50%", transform: "translateX(-50%)" }} className="gc-navlinks">
          {links.map(l => (
            <button key={l.label} onClick={() => go(l.v, l.o)}
              style={{ background: "none", border: 0, padding: "4px 0", fontSize: 13.5, fontWeight: 500, letterSpacing: "0.01em", color: "var(--ink)", position: "relative" }}
              className="gc-link">
              {l.label}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button className="gc-ico" aria-label="Tìm kiếm"><Ic.search /></button>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", color: "var(--secondary)" }}>
            <span style={{ color: "var(--ink)" }}>VI</span> / EN
          </span>
          <button className="gc-ico gc-hide-sm" aria-label="Tài khoản"><Ic.user /></button>
          <button className="gc-ico" aria-label="Giỏ hàng" onClick={openCart} style={{ position: "relative" }}>
            <Ic.cart />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -7, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 9, display: "grid", placeItems: "center", padding: "0 4px" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Product card ---------------- */
function ProductCard({ p, go, addToCart, reveal }) {
  const [hover, setHover] = useState(false);
  return (
    <article className={reveal ? "reveal" : ""} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <div className="zoom" style={{ position: "relative", aspectRatio: "1/1", background: "var(--paper)", marginBottom: 16 }} onClick={() => go("detail", p.id)}>
        <div className="ph ph-warm" data-label={p.ph} style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
          {p.new && <span className="badge badge-ink">Mới</span>}
          {p.tag === "tet" && <span className="badge badge-accent">Tết 2026</span>}
          {p.tag === "trungthu" && <span className="badge badge-soft">Trung Thu</span>}
          {!p.stock && <span className="badge badge-oos">Hết hàng</span>}
        </div>
        <button className="gc-wish" aria-label="Yêu thích" onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: 0, display: "grid", placeItems: "center", color: "var(--ink)", opacity: hover ? 1 : 0, transform: hover ? "none" : "translateY(-4px)", transition: "all .3s" }}>
          <Ic.heart />
        </button>
        {p.stock && (
          <div className="gc-hoveradd" style={{ position: "absolute", left: 14, right: 14, bottom: 14, opacity: hover ? 1 : 0, transform: hover ? "none" : "translateY(8px)", transition: "all .3s" }}>
            <button className="btn btn-light btn-block" onClick={(e) => { e.stopPropagation(); addToCart(p); }} style={{ fontSize: 12.5, padding: "13px" }}>
              Thêm vào giỏ
            </button>
          </div>
        )}
      </div>
      <div onClick={() => go("detail", p.id)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          {p.custom && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}><Ic.pencil style={{ width: 12, height: 12 }} />Tùy chỉnh</span>}
          <Stars n={p.rating} />
          <span style={{ fontSize: 11.5, color: "var(--secondary)" }}>({p.reviews})</span>
        </div>
        <h3 className="serif" style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="price" style={{ fontSize: 15 }}>{VND(p.price)}</span>
          {p.oldPrice && <span className="price-old" style={{ fontSize: 13 }}>{VND(p.oldPrice)}</span>}
        </div>
      </div>
    </article>
  );
}

/* ---------------- Toast ---------------- */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "var(--ink)", color: "#fff", padding: "14px 20px", borderRadius: 3, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 18px 50px rgba(0,0,0,0.25)", animation: "toastIn .35s var(--ease)", maxWidth: "90vw" }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", flex: "none" }}><Ic.check /></span>
      <span style={{ fontSize: 13.5 }}>{toast}</span>
    </div>
  );
}

/* ---------------- Cart drawer ---------------- */
function CartDrawer({ open, onClose, items, setQty, removeItem, go }) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const freeAt = 800000;
  const pct = Math.min(100, Math.round((subtotal / freeAt) * 100));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 120, pointerEvents: open ? "auto" : "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.4)", opacity: open ? 1 : 0, transition: "opacity .35s" }} />
      <aside style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "min(440px, 100vw)", background: "#fff", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(101%)", transition: "transform .42s var(--ease)", boxShadow: "-20px 0 60px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 26px", borderBottom: "1px solid var(--line)" }}>
          <span className="serif" style={{ fontSize: 21, fontWeight: 500 }}>Giỏ hàng <span className="muted" style={{ fontSize: 14, fontFamily: "var(--sans)" }}>({items.reduce((s,i)=>s+i.qty,0)})</span></span>
          <button className="gc-ico" onClick={onClose} aria-label="Đóng"><Ic.close /></button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 40, textAlign: "center" }}>
            <div>
              <div style={{ color: "var(--line-strong)", marginBottom: 18, display: "flex", justifyContent: "center" }}><Ic.gift style={{ width: 48, height: 48 }} /></div>
              <p className="serif" style={{ fontSize: 20, margin: "0 0 6px" }}>Giỏ hàng đang trống</p>
              <p className="muted" style={{ fontSize: 13.5, margin: "0 0 22px" }}>Khám phá bộ sưu tập quà tặng tinh tế.</p>
              <button className="btn btn-primary" onClick={() => { onClose(); go("list", "all"); }}>Khám phá ngay</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: "16px 26px", background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
              {subtotal >= freeAt
                ? <p style={{ margin: 0, fontSize: 12.5, color: "#047857", fontWeight: 500, display: "flex", alignItems: "center", gap: 7 }}><Ic.truck style={{ width: 16, height: 16 }} />Đơn hàng được miễn phí giao hàng</p>
                : <p style={{ margin: 0, fontSize: 12.5, color: "var(--secondary)" }}>Mua thêm <b style={{ color: "var(--ink)" }}>{VND(freeAt - subtotal)}</b> để được <b style={{ color: "var(--ink)" }}>miễn phí giao hàng</b></p>}
              <div style={{ height: 4, background: "var(--line-strong)", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: "var(--accent)", transition: "width .4s" }} />
              </div>
            </div>
            <div className="scroll-y" style={{ flex: 1, padding: "8px 26px" }}>
              {items.map(it => (
                <div key={it.id} style={{ display: "flex", gap: 14, padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
                  <div className="ph ph-warm" data-label="" style={{ width: 76, height: 76, flex: "none" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <h4 className="serif" style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.25 }}>{it.name}</h4>
                      <button onClick={() => removeItem(it.id)} className="gc-ico" style={{ flex: "none", color: "var(--secondary)" }} aria-label="Xoá"><Ic.close style={{ width: 16, height: 16 }} /></button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-strong)", borderRadius: 2 }}>
                        <button onClick={() => setQty(it.id, it.qty - 1)} style={qtyBtn} aria-label="Giảm"><Ic.minus /></button>
                        <span style={{ width: 30, textAlign: "center", fontSize: 13, fontWeight: 600 }}>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} style={qtyBtn} aria-label="Tăng"><Ic.plus /></button>
                      </div>
                      <span className="price" style={{ fontSize: 14 }}>{VND(it.price * it.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 26px", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input className="field" placeholder="Mã giảm giá" style={{ flex: 1 }} />
                <button className="btn btn-secondary" style={{ padding: "0 18px" }}>Áp dụng</button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span className="muted" style={{ fontSize: 13 }}>Tạm tính</span>
                <span className="price" style={{ fontSize: 18 }}>{VND(subtotal)}</span>
              </div>
              <p className="muted" style={{ fontSize: 11.5, margin: "0 0 16px" }}>Phí vận chuyển tính ở bước thanh toán</p>
              <button className="btn btn-primary btn-block btn-lg">Tiến hành thanh toán <Ic.arrow className="ar" /></button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
const qtyBtn = { width: 30, height: 30, border: 0, background: "none", display: "grid", placeItems: "center", color: "var(--ink)" };

/* ---------------- Footer ---------------- */
function Footer({ go }) {
  const cols = [
    { h: "Mua sắm", links: ["Quà Tết 2026", "Trung Thu", "Sinh nhật", "Khai trương", "Cưới hỏi"] },
    { h: "Doanh nghiệp", links: ["Quà Tết nhân viên", "In logo theo yêu cầu", "Báo giá số lượng lớn", "Hợp tác đối tác"] },
    { h: "Hỗ trợ", links: ["Chính sách giao hàng", "Đổi trả & bảo hành", "Hướng dẫn đặt quà", "Liên hệ"] },
  ];
  return (
    <footer style={{ background: "var(--dark)", color: "#fff", paddingTop: 80 }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 48, paddingBottom: 64 }} className="gc-footgrid">
          <div>
            <Logo on="light" />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: "20px 0 24px", maxWidth: 300 }}>
              Studio quà tặng cao cấp — tinh tế trong từng chi tiết, ấm áp trong từng món quà trao gửi.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["IG", "FB", "in", "Zalo"].map(s => (
                <span key={s} style={{ width: 38, height: 38, border: "1px solid rgba(255,255,255,0.18)", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{s}</span>
              ))}
            </div>
          </div>
          {cols.map(c => (
            <div key={c.h}>
              <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 18px" }}>{c.h}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {c.links.map(l => <li key={l}><a className="gc-foot-link" style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }} onClick={() => go("list", "all")}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 0", borderTop: "1px solid rgba(255,255,255,0.12)", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>© 2026 GiftCraft Studio · Công ty TNHH Quà Tặng Tinh Hoa</span>
          <div style={{ display: "flex", gap: 24, fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>
            <a>Điều khoản</a><a>Bảo mật</a><a>Sơ đồ trang</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Ic, Logo, Stars, Announce, Nav, ProductCard, Toast, CartDrawer, Footer });
