/* GiftCraft Studio — Product detail (/san-pham/[slug]) */

function QtyStepper({ qty, setQty }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-strong)", borderRadius: 2 }}>
      <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 50, border: 0, background: "none", display: "grid", placeItems: "center" }} aria-label="Giảm"><Ic.minus /></button>
      <span style={{ width: 44, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</span>
      <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 50, border: 0, background: "none", display: "grid", placeItems: "center" }} aria-label="Tăng"><Ic.plus /></button>
    </div>
  );
}

function DetailPage({ go, productId, addToCart }) {
  const { PRODUCTS, OCCASIONS, VND } = window.GC;
  const p = PRODUCTS.find(x => x.id === productId) || PRODUCTS[0];
  const occ = OCCASIONS.find(o => o.id === p.occasion);
  const [gi, setGi] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState("desc");
  React.useEffect(() => { window.scrollTo(0, 0); setGi(0); setQty(1); setTab("desc"); }, [productId]);

  const thumbs = [p.ph, "Chi tiết đóng gói", "Phụ kiện kèm theo", "Khoảnh khắc trao quà"];
  const related = PRODUCTS.filter(x => x.id !== p.id && (x.occasion === p.occasion || x.cat === p.cat)).slice(0, 4);

  return (
    <main>
      <div className="wrap" style={{ padding: "26px 40px 0" }}>
        <div style={{ display: "flex", gap: 8, fontSize: 12.5, color: "var(--secondary)" }}>
          <a onClick={() => go("home")} style={{ cursor: "pointer" }}>Trang chủ</a><span>/</span>
          <a onClick={() => go("list", p.occasion)} style={{ cursor: "pointer" }}>{occ.label}</a><span>/</span>
          <span style={{ color: "var(--ink)" }}>{p.name}</span>
        </div>
      </div>

      <div className="wrap" style={{ padding: "32px 40px 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "start" }} className="gc-detail">
          {/* gallery */}
          <div style={{ position: "sticky", top: 96 }} className="gc-gallery">
            <div className="zoom" style={{ position: "relative", aspectRatio: "1/1", background: "var(--paper)", marginBottom: 14 }}>
              <div className="ph ph-warm" data-label={thumbs[gi]} style={{ position: "absolute", inset: 0 }} />
              <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 6 }}>
                {p.tag === "tet" && <span className="badge badge-accent">Tết 2026</span>}
                {p.new && <span className="badge badge-ink">Mới</span>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {thumbs.map((t, i) => (
                <button key={i} onClick={() => setGi(i)} style={{ position: "relative", aspectRatio: "1/1", border: "1px solid " + (gi === i ? "var(--ink)" : "var(--line)"), padding: 0, background: "none", cursor: "pointer", overflow: "hidden" }}>
                  <div className="ph ph-warm" data-label="" style={{ position: "absolute", inset: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span className="badge badge-soft">{occ.label}</span>
              {p.custom && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 5 }}><Ic.pencil style={{ width: 13, height: 13 }} />Có thể tùy chỉnh</span>}
              {p.stock ? <span className="badge badge-stock badge-dot">Còn hàng</span> : <span className="badge badge-oos">Hết hàng</span>}
            </div>
            <h1 className="serif" style={{ fontSize: "clamp(32px,3.6vw,46px)", fontWeight: 500, margin: "0 0 16px", lineHeight: 1.05 }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <Stars n={p.rating} size={16} />
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.rating}</span>
              <span className="muted" style={{ fontSize: 13.5 }}>· {p.reviews} đánh giá</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
              <span className="price serif" style={{ fontSize: 34, fontWeight: 500 }}>{VND(p.price)}</span>
              {p.oldPrice && <span className="price-old" style={{ fontSize: 18 }}>{VND(p.oldPrice)}</span>}
              {p.oldPrice && <span className="badge badge-accent">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#3a3a3a", margin: "0 0 30px", maxWidth: 480 }}>{p.blurb} Hộp quà được hoàn thiện thủ công với chất liệu cao cấp, sẵn sàng để trao gửi.</p>

            {/* B2B tier pricing */}
            <div style={{ border: "1px solid var(--line-strong)", borderRadius: 3, overflow: "hidden", marginBottom: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 8 }}><Ic.gift style={{ width: 16, height: 16, color: "var(--accent)" }} />Bảng giá doanh nghiệp</span>
                <span className="muted" style={{ fontSize: 11.5 }}>Giá mỗi phần</span>
              </div>
              <div>
                {p.tiers.map((t, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 16, padding: "12px 18px", borderBottom: i < p.tiers.length - 1 ? "1px solid var(--line)" : 0 }}>
                    <span style={{ fontSize: 13.5 }}>{t.qty} phần</span>
                    {t.save > 0 ? <span className="badge badge-soft" style={{ justifySelf: "end" }}>-{t.save}%</span> : <span />}
                    <span className="price" style={{ fontSize: 14, minWidth: 96, textAlign: "right" }}>{VND(t.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* actions */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <QtyStepper qty={qty} setQty={setQty} />
              <button className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 200 }} disabled={!p.stock} onClick={() => addToCart(p, qty)}>
                {p.stock ? <>Thêm vào giỏ · {VND(p.price * qty)}</> : "Tạm hết hàng"}
              </button>
            </div>
            <button className="btn btn-secondary btn-block" style={{ marginBottom: 28 }}>
              <Ic.pencil style={{ width: 16, height: 16 }} /> Yêu cầu tùy chỉnh / báo giá số lượng lớn
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 3 }}>
              {[[Ic.truck, "Giao 2–4 ngày", "Toàn quốc"], [Ic.gift, "Gói quà miễn phí", "Kèm thiệp"], [Ic.leaf, "Đổi trả 7 ngày", "Yên tâm"]].map(([I, a, b], i) => (
                <div key={i} style={{ padding: "18px 16px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--line)" : 0 }}>
                  <div style={{ color: "var(--accent)", display: "flex", justifyContent: "center", marginBottom: 8 }}><I /></div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ marginTop: 90, borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", gap: 36 }}>
            {[["desc", "Mô tả"], ["review", "Đánh giá (" + p.reviews + ")"], ["ship", "Giao hàng"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: 0, borderTop: "2px solid " + (tab === k ? "var(--ink)" : "transparent"), marginTop: -1, padding: "22px 0", fontSize: 14, fontWeight: tab === k ? 600 : 500, color: tab === k ? "var(--ink)" : "var(--secondary)", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
          <div style={{ padding: "32px 0 0", maxWidth: 720 }}>
            {tab === "desc" && (
              <div style={{ fontSize: 15.5, lineHeight: 1.85, color: "#3a3a3a" }}>
                <p style={{ marginTop: 0 }}>{p.blurb}</p>
                <p>Mỗi hộp quà GiftCraft Studio là kết quả của quá trình tuyển chọn nguyên liệu kỹ lưỡng và hoàn thiện thủ công bởi đội ngũ nghệ nhân. Lớp hộp bên ngoài sử dụng chất liệu cao cấp, bền đẹp, thân thiện với môi trường.</p>
                <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
                  <li>Đóng gói sang trọng, sẵn sàng để trao tặng</li>
                  <li>Kèm thiệp viết tay cá nhân hoá theo yêu cầu</li>
                  <li>Tùy chọn in logo doanh nghiệp cho đơn số lượng lớn</li>
                  <li>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp</li>
                </ul>
              </div>
            )}
            {tab === "review" && (
              <div style={{ display: "grid", gap: 24 }}>
                {window.GC.REVIEWS.map((r, i) => (
                  <div key={i} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{r.role}</div>
                      </div>
                      <Stars n={r.stars} />
                    </div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#3a3a3a", margin: 0 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === "ship" && (
              <div style={{ fontSize: 15.5, lineHeight: 1.85, color: "#3a3a3a" }}>
                <p style={{ marginTop: 0 }}>Giao hàng nội thành Hà Nội & TP.HCM trong 2–3 ngày làm việc, các tỉnh thành khác 3–4 ngày. Miễn phí giao hàng cho đơn từ 800.000₫.</p>
                <p>Đơn doanh nghiệp số lượng lớn có thể hẹn lịch giao theo đợt và giao tận nơi theo danh sách. Liên hệ đội ngũ tư vấn để được hỗ trợ riêng.</p>
              </div>
            )}
          </div>
        </div>

        {/* related */}
        <div style={{ marginTop: 90 }}>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 500, margin: "0 0 36px" }}>Có thể bạn cũng thích</h2>
          <div className="gc-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
            {related.map(rp => <ProductCard key={rp.id} p={rp} go={go} addToCart={addToCart} />)}
          </div>
        </div>
      </div>
    </main>
  );
}

window.DetailPage = DetailPage;
