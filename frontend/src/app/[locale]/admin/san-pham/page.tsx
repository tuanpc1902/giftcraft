"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useReducer, useState } from "react";
import api from "@/lib/api";
import { ProductListItem } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

interface ProductForm {
  name: string;
  slug: string;
  short_description: string;
  retail_price: string;
  weight_grams: string;
  stock_status: "in_stock" | "out_of_stock" | "pre_order";
  is_active: boolean;
  is_customizable: boolean;
  images: string;
  cover_image: string;
  version: number;
}

const emptyForm: ProductForm = {
  name: "", slug: "", short_description: "",
  retail_price: "", weight_grams: "500",
  stock_status: "in_stock", is_active: true, is_customizable: false,
  images: "", cover_image: "", version: 0,
};

function toPayload(f: ProductForm) {
  const imageList = f.images.split("\n").map(s => s.trim()).filter(Boolean);
  return {
    name: f.name,
    slug: f.slug || autoSlug(f.name),
    short_description: f.short_description || null,
    retail_price: Number(f.retail_price),
    weight_grams: Number(f.weight_grams),
    stock_status: f.stock_status,
    is_active: f.is_active,
    is_customizable: f.is_customizable,
    images: imageList,
    cover_image: f.cover_image || imageList[0] || null,
    version: f.version,
  };
}

function autoSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formReducer(s: ProductForm, patch: Partial<ProductForm>): ProductForm {
  return { ...s, ...patch };
}

type ModalMode = "add" | "edit";

const STOCK_LABELS: Record<string, string> = {
  in_stock: "Còn hàng",
  pre_order: "Pre-order",
  out_of_stock: "Hết hàng",
};
const STOCK_COLORS: Record<string, string> = {
  in_stock: "bg-green-100 text-green-700",
  pre_order: "bg-brand-light text-amber-700",
  out_of_stock: "bg-surface-alt text-ink-muted",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: ModalMode; id?: number } | null>(null);
  const [form, dispatchForm] = useReducer(formReducer, emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const set = (patch: Partial<ProductForm>) => dispatchForm(patch);

  useEffect(() => {
    api.get("/admin/products?per_page=200")
      .then(r => setProducts(r.data.data?.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  function openAdd() {
    dispatchForm(emptyForm);
    setSaveError("");
    setModal({ mode: "add" });
  }

  function openEdit(p: ProductListItem) {
    dispatchForm({
      name: p.name,
      slug: p.slug,
      short_description: "",
      retail_price: String(p.retail_price),
      weight_grams: String(p.weight_grams ?? 500),
      stock_status: p.stock_status,
      is_active: p.is_active ?? true,
      is_customizable: p.is_customizable,
      images: p.cover_image ?? "",
      cover_image: p.cover_image ?? "",
      version: p.version ?? 1,
    });
    setSaveError("");
    setModal({ mode: "edit", id: p.id });
  }

  async function handleSave() {
    if (!form.name || !form.retail_price) return;
    setSaving(true);
    setSaveError("");
    try {
      const payload = toPayload(form);
      if (modal?.mode === "add") {
        const { data } = await api.post("/admin/products", payload);
        setProducts(ps => [data.data, ...ps]);
      } else if (modal?.id) {
        const { data } = await api.put(`/admin/products/${modal.id}`, payload);
        setProducts(ps => ps.map(p => p.id === modal.id ? { ...p, ...data.data } : p));
      }
      setModal(null);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (status === 409) {
        setSaveError("Sản phẩm vừa bị chỉnh sửa bởi người khác. Vui lòng đóng lại và mở lại để lấy phiên bản mới.");
      } else {
        setSaveError(msg ?? "Lưu thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    setDeleteId(id);
    await api.delete(`/admin/products/${id}`).catch(() => {});
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteId(null);
  }

  async function toggleActive(p: ProductListItem) {
    const next = !p.is_active;
    setProducts(ps => ps.map(x => x.id === p.id ? { ...x, is_active: next } : x));
    await api.put(`/admin/products/${p.id}`, { is_active: next, version: p.version }).catch(() => {
      setProducts(ps => ps.map(x => x.id === p.id ? { ...x, is_active: p.is_active } : x));
    });
  }

  return (
    <AdminLayout>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quản lý sản phẩm</h1>
          <p className="text-ink-muted text-sm mt-0.5">{products.length} sản phẩm</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-5">+ Thêm sản phẩm</button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          className="input-field max-w-sm"
          placeholder="Tìm theo tên hoặc slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Sản phẩm</th>
                <th className="text-left px-4 py-3">Giá lẻ</th>
                <th className="text-left px-4 py-3">B2B min</th>
                <th className="text-left px-4 py-3">Kho</th>
                <th className="text-left px-4 py-3">Hiển thị</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayed.map(p => (
                <tr key={p.slug} className={`hover:bg-surface-alt ${p.is_active === false ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink-muted font-mono mt-0.5">{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPrice(p.retail_price)}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {p.b2b_min_price ? formatPrice(p.b2b_min_price) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STOCK_COLORS[p.stock_status] ?? "bg-surface-alt"}`}>
                      {STOCK_LABELS[p.stock_status] ?? p.stock_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      title={p.is_active ? "Đang hiển thị — nhấn để ẩn" : "Đang ẩn — nhấn để hiện"}
                      className={`text-lg transition-opacity ${p.is_active !== false ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                    >
                      👁
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <a href={`/san-pham/${p.slug}`} target="_blank"
                        className="text-xs text-blue-600 hover:underline">Xem</a>
                      <button onClick={() => openEdit(p)}
                        className="text-xs text-ink-muted hover:text-ink font-medium">Sửa</button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleteId === p.id}
                        className="text-xs text-brand hover:text-red-700 font-medium disabled:opacity-40">
                        {deleteId === p.id ? "..." : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="text-center py-12 text-ink-muted">Không tìm thấy sản phẩm.</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-ink">
                {modal.mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </h2>
              <button onClick={() => setModal(null)} className="text-ink-muted hover:text-ink-muted text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              {saveError && (
                <div className="bg-brand-light border border-red-200 text-red-700 text-sm rounded-sm px-4 py-3">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Tên sản phẩm *</label>
                <input className="input-field" value={form.name}
                  onChange={e => {
                    const name = e.target.value;
                    set({ name, ...(modal.mode === "add" ? { slug: autoSlug(name) } : {}) });
                  }} />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Slug</label>
                <input className="input-field font-mono text-sm" value={form.slug}
                  onChange={e => set({ slug: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Mô tả ngắn</label>
                <input className="input-field" value={form.short_description}
                  onChange={e => set({ short_description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Giá lẻ (VNĐ) *</label>
                  <input type="number" className="input-field" placeholder="350000" value={form.retail_price}
                    onChange={e => set({ retail_price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Cân nặng (gram)</label>
                  <input type="number" className="input-field" placeholder="500" value={form.weight_grams}
                    onChange={e => set({ weight_grams: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Trạng thái kho</label>
                  <select className="input-field" value={form.stock_status}
                    onChange={e => set({ stock_status: e.target.value as ProductForm["stock_status"] })}>
                    <option value="in_stock">Còn hàng</option>
                    <option value="pre_order">Pre-order</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                    <input type="checkbox" checked={form.is_active}
                      onChange={e => set({ is_active: e.target.checked })} className="rounded" />
                    Hiển thị trên shop
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                    <input type="checkbox" checked={form.is_customizable}
                      onChange={e => set({ is_customizable: e.target.checked })} className="rounded" />
                    Cho phép tuỳ chỉnh
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">URL ảnh chính</label>
                <input className="input-field" placeholder="https://..."
                  value={form.cover_image} onChange={e => set({ cover_image: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Ảnh gallery (mỗi URL 1 dòng)</label>
                <textarea className="input-field h-20 resize-none font-mono text-xs"
                  placeholder={"https://...\nhttps://..."} value={form.images}
                  onChange={e => set({ images: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={handleSave}
                  disabled={saving || !form.name || !form.retail_price}
                  className="btn-primary flex-1 disabled:opacity-40">
                  {saving ? "Đang lưu..." : modal.mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
                </button>
                <button onClick={() => setModal(null)} className="btn-secondary px-6">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
