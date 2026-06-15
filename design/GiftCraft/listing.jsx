/* GiftCraft Studio — Product listing (/san-pham) */

function FilterGroup({ title, children, open = true }) {
  const [o, setO] = React.useState(open);
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "22px 0" }}>
      <button onClick={() => setO(v => !v)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: 0, padding: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</span>
        <Ic.chev style={{ transform: o ? "rotate(90deg)" : "none", transition: "transform .25s", color: "var(--secondary)" }} />
      </button>
      <div style={{ display: "grid", gridTemplateRows: o ? "1fr" : "0fr", transition: "grid-template-rows .3s var(--ease)" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ paddingTop: o ? 16 : 0, transition: "padding .3s" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function Check({ label, count, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer", fontSize: 13.5 }}>
      <span style={{ width: 17, height: 17, border: "1px solid " + (checked ? "var(--accent)" : "var(--line-strong)"), background: checked ? "var(--accent)" : "#fff", borderRadius: 2, display: "grid", placeItems: "center", color: "#fff", flex: "none", transition: "all .2s" }}>
        {checked && <Ic.check style={{ width: 12, height: 12 }} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && <span className="muted" style={{ fontSize: 12 }}>{count}</span>}
    </label>
  );
}

function ListingPage({ go, initialOccasion }) {
  const { PRODUCTS, OCCASIONS, CATEGORIES, VND } = window.GC;
  const b2b = initialOccasion === "b2b";
  const [occ, setOcc] = React.useState(() => {
    const s = new Set();
    if (initialOccasion && initialOccasion !== "all" && initialOccasion !== "b2b") s.add(initialOccasion);
    return s;
  });
  const [cats, setCats] = React.useState(new Set());
  const [custom, setCustom] = React.useState(b2b);
  const [maxPrice, setMaxPrice] = React.useState(2500000);
  const [sort, setSort] = React.useState("featured");

  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const toggle = (setFn) => (key) => setFn(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  let list = PRODUCTS.filter(p =>
    (occ.size === 0 || occ.has(p.occasion)) &&
    (cats.size === 0 || cats.has(p.cat)) &&
    (!custom || p.custom) &&
    p.price <= maxPrice
  );
  if (sort === "low") list = [...list].sort((a,b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a,b) => b.price - a.price);
  if (sort === "new") list = [...list].sort((a,b) => (b.new?1:0) - (a.new?1:0));

  const title = b2b ? "Quà tặng doanh nghiệp" : initialOccasion === "tet" ? "Quà Tết 2026" : initialOccasion === "trungthu" ? "Quà Trung Thu" : "Tất cả sản phẩm";
  const occCount = (id) => PRODUCTS.filter(p => p.occasion === id).length;
  const catCount = (id) => PRODUCTS.filter(p => p.cat === id).length;

  return (
    <main>
      {/* breadcrumb + header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: b2b ? "var(--dark)" : "#fff", color: b2b ? "#fff" : "var(--ink)" }}>
        <div className="wrap" style={{ padding: b2b ? "56px 40px 52px" : "40px 40px 44px" }}>
          <div style={{ display: "flex", gap: 8, fontSize: 12.5, color: b2b ? "rgba(255,255,255,0.5)" : "var(--secondary)", marginBottom: 22 }}>
            <a onClick={() => go("home")} style={{ cursor: "pointer" }}>Trang chủ</a><span>/</span>
            <span style={{ color: b2b ? "#fff" : "var(--ink)" }}>{title}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18 }}>
            <div style={{ maxWidth: 620 }}>
              {b2b && <span className="kicker" style={{ color: "var(--accent)" }}>Giải pháp B2B</span>}
              <h1 className="serif" style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 500, margin: b2b ? "14px 0 14px" : "0 0 12px", lineHeight: 1.02 }}>{title}</h1>
              <p style={{ fontSize: 15, color: b2b ? "rgba(255,255,255,0.7)" : "var(--secondary)", margin: 0, lineHeight: 1.6 }}>
                {b2b ? "Báo giá theo bậc số lượng, in logo thương hiệu và đóng gói đồng bộ. Chọn sản phẩm để xem bảng giá chi tiết." : "Những món quà được tuyển chọn cho mọi dịp trao gửi yêu thương."}
              </p>
            </div>
            {b2b && <button className="btn btn-primary btn-lg">Nhận tư vấn riêng <Ic.arrow className="ar" /></button>}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ padding: "44px 40px 110px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 48 }} className="gc-listgrid">
          {/* sidebar */}
          <aside className="gc-filter">
            <div style={{ position: "sticky", top: 96 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}>Bộ lọc</span>
                <button className="muted" onClick={() => { setOcc(new Set()); setCats(new Set()); setCustom(false); setMaxPrice(2500000); }} style={{ background: "none", border: 0, fontSize: 12, textDecoration: "underline", cursor: "pointer" }}>Xoá tất cả</button>
              </div>
              <FilterGroup title="Dịp tặng">
                {OCCASIONS.map(o => <Check key={o.id} label={o.label} count={occCount(o.id)} checked={occ.has(o.id)} onChange={() => toggle(setOcc)(o.id)} />)}
              </FilterGroup>
              <FilterGroup title="Danh mục">
                {CATEGORIES.map(c => <Check key={c.id} label={c.label} count={catCount(c.id)} checked={cats.has(c.id)} onChange={() => toggle(setCats)(c.id)} />)}
              </FilterGroup>
              <FilterGroup title="Mức giá">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
                  <span className="muted">0₫</span><span style={{ fontWeight: 600 }}>≤ {VND(maxPrice)}</span>
                </div>
                <input type="range" min="500000" max="2500000" step="50000" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
              </FilterGroup>
              <FilterGroup title="Tùy chỉnh">
                <Check label="Có thể tùy chỉnh / in logo" checked={custom} onChange={() => setCustom(v => !v)} />
              </FilterGroup>
            </div>
          </aside>

          {/* grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--line)" }}>
              <span className="muted" style={{ fontSize: 13.5 }}><b style={{ color: "var(--ink)" }}>{list.length}</b> sản phẩm</span>
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span className="muted">Sắp xếp</span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="field" style={{ width: "auto", padding: "9px 32px 9px 12px", fontSize: 13 }}>
                  <option value="featured">Nổi bật</option>
                  <option value="new">Mới nhất</option>
                  <option value="low">Giá thấp → cao</option>
                  <option value="high">Giá cao → thấp</option>
                </select>
              </label>
            </div>
            {list.length === 0 ? (
              <div style={{ padding: "100px 0", textAlign: "center" }}>
                <p className="serif" style={{ fontSize: 22, margin: "0 0 8px" }}>Không tìm thấy sản phẩm phù hợp</p>
                <p className="muted" style={{ fontSize: 14 }}>Thử nới rộng bộ lọc của bạn.</p>
              </div>
            ) : (
              <div className="gc-grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, rowGap: 44 }}>
                {list.map(p => <ProductCard key={p.id} p={p} go={go} addToCart={window.__gcAdd} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

window.ListingPage = ListingPage;
