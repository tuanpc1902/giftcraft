/* GiftCraft Studio — app shell, routing, cart, tweaks */
const { useState: uS, useEffect: uE } = React;

const FONT_STACK = {
  "Spectral": '"Spectral", "Be Vietnam Pro", serif',
  "Lora": '"Lora", "Be Vietnam Pro", serif',
  "EB Garamond": '"EB Garamond", "Be Vietnam Pro", serif',
  "Be Vietnam Pro": '"Be Vietnam Pro", sans-serif',
};
const ACCENTS = {
  "Đỏ son": "#b91c1c",
  "Mận chín": "#9d174d",
  "Rượu vang": "#7c2d12",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headingFont": "Spectral",
  "accent": "#b91c1c",
  "radius": 2,
  "hoverAdd": true
}/*EDITMODE-END*/;

function darken(hex, amt = 0.16) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r * (1 - amt)); g = Math.round(g * (1 - amt)); b = Math.round(b * (1 - amt));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = uS({ name: "home", arg: null });
  const [cart, setCart] = uS(() => {
    try { return JSON.parse(localStorage.getItem("gc_cart") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = uS(false);
  const [toast, setToast] = uS(null);

  uE(() => { localStorage.setItem("gc_cart", JSON.stringify(cart)); }, [cart]);
  uE(() => { document.body.classList.toggle("locked", cartOpen); }, [cartOpen]);

  // apply tweaks to :root
  uE(() => {
    const r = document.documentElement.style;
    r.setProperty("--heading-font", FONT_STACK[t.headingFont] || FONT_STACK["Playfair Display"]);
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-ink", darken(t.accent, 0.18));
    r.setProperty("--radius", t.radius + "px");
  }, [t.headingFont, t.accent, t.radius]);

  const showToast = (msg) => { setToast(msg); clearTimeout(window.__tt); window.__tt = setTimeout(() => setToast(null), 2600); };

  const addToCart = (p, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty }];
    });
    showToast("Đã thêm vào giỏ — " + p.name);
  };
  window.__gcAdd = addToCart;

  const setQty = (id, q) => setCart(prev => q <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty: q } : i));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const go = (name, arg = null) => { setView({ name, arg }); if (name !== "detail") window.scrollTo({ top: 0 }); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div data-hoveradd={t.hoverAdd ? "1" : "0"}>
      <Announce />
      <Nav go={go} current={view.name} cartCount={cartCount} openCart={() => setCartOpen(true)} />

      <div key={view.name + (view.arg || "")} className="gc-view">
        {view.name === "home" && <HomePage go={go} />}
        {view.name === "list" && <ListingPage go={go} initialOccasion={view.arg || "all"} />}
        {view.name === "detail" && <DetailPage go={go} productId={view.arg} addToCart={addToCart} />}
      </div>

      <Footer go={go} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} setQty={setQty} removeItem={removeItem} go={go} />
      <Toast toast={toast} />

      <TweaksPanel>
        <TweakSection label="Kiểu chữ" />
        <TweakSelect label="Font tiêu đề" value={t.headingFont}
          options={Object.keys(FONT_STACK)} onChange={v => setTweak("headingFont", v)} />
        <TweakSection label="Màu sắc" />
        <TweakColor label="Màu nhấn" value={t.accent}
          options={Object.values(ACCENTS)} onChange={v => setTweak("accent", v)} />
        <TweakSection label="Hình khối" />
        <TweakSlider label="Bo góc" value={t.radius} min={0} max={14} step={1} unit="px"
          onChange={v => setTweak("radius", v)} />
        <TweakToggle label="Hiện nút thêm khi hover" value={t.hoverAdd}
          onChange={v => setTweak("hoverAdd", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
