"use client";

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
  is_customizable: boolean;
  images: string;
  cover_image: string;
}

const emptyForm: ProductForm = {
  name: "", slug: "", short_description: "",
  retail_price: "", weight_grams: "500",
  stock_status: "in_stock", is_customizable: false,
  images: "", cover_image: "",
};

function toPayload(f: ProductForm) {
  return {
    name: f.name,
    slug: f.slug || f.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    short_description: f.short_description || null,
    retail_price: Number(f.retail_price),
    weight_grams: Number(f.weight_grams),
    stock_status: f.stock_status,
    is_customizable: f.is_customizable,
    images: f.images.split("\n").map(s => s.trim()).filter(Boolean),
    cover_image: f.cover_image || f.images.split("\n").map(s => s.trim()).filter(Boolean)[0] || null,
  };
}

function formReducer(s: ProductForm, patch: Partial<ProductForm>): ProductForm { return { ...s, ...patch }; }

type ModalMode = "add" | "edit";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: ModalMode; id?: number } | null>(null);
  const [form, dispatchForm] = useReducer(formReducer, emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const set = (patch: Partial<ProductForm>) => dispatchForm(patch);

  useEffect(() => {
    api.get("/products?per_page=100")
      .then(r => setProducts(r.data.data?.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  function openAdd() {
    dispatchForm(emptyForm);
    setModal({ mode: "add" });
  }

  function openEdit(p: ProductListItem) {
    dispatchForm({
      name: p.name,
      slug: p.slug,
      short_description: "",
      retail_price: String(p.retail_price),
      weight_grams: "500",
      stock_status: p.stock_status,
      is_customizable: p.is_customizable,
      images: p.cover_image ?? "",
      cover_image: p.cover_image ?? "",
    });
    setModal({ mode: "edit", id: p.id });
  }

  async function handleSave() {
    if (!form.name || !form.retail_price) return;
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    setDeleteId(id);
    await api.delete(`/admin/products/${id}`).catch(() => {});
    setProducts(ps => ps.filter(p => p.id !== id));
    setDeleteId(null);
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} sản phẩm</p>
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
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Sản phẩm</th>
                <th className="text-left px-4 py-3">Giá lẻ</th>
                <th className="text-left px-4 py-3">Giá B2B min</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Tuỳ chỉnh</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map(p => (
                <tr key={p.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(p.retail_price)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.b2b_min_price ? formatPrice(p.b2b_min_price) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.stock_status === "in_stock" ? "bg-green-100 text-green-700" :
                      p.stock_status === "pre_order" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {p.stock_status === "in_stock" ? "Còn hàng" : p.stock_status === "pre_order" ? "Pre-order" : "Hết hàng"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_customizable ? (
                      <span className="text-xs text-purple-600 font-semibold">✓ Có</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <a href={`/san-pham/${p.slug}`} target="_blank"
                        className="text-xs text-blue-600 hover:underline">Xem</a>
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleteId === p.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40"
                      >
                        {deleteId === p.id ? "..." : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="text-center py-12 text-gray-400">Không tìm thấy sản phẩm.</div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">
                {modal.mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={e => {
                    const name = e.target.value;
                    set({ name, ...(modal.mode === "add" ? { slug: autoSlug(name) } : {}) });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
                <input
                  className="input-field font-mono text-sm"
                  placeholder="ten-san-pham"
                  value={form.slug}
                  onChange={e => set({ slug: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả ngắn</label>
                <input
                  className="input-field"
                  placeholder="Mô tả hiển thị dưới tên sản phẩm"
                  value={form.short_description}
                  onChange={e => set({ short_description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá lẻ (VNĐ) *</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="350000"
                    value={form.retail_price}
                    onChange={e => set({ retail_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cân nặng (gram)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="500"
                    value={form.weight_grams}
                    onChange={e => set({ weight_grams: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái kho</label>
                <select
                  className="input-field"
                  value={form.stock_status}
                  onChange={e => set({ stock_status: e.target.value as ProductForm["stock_status"] })}
                >
                  <option value="in_stock">Còn hàng</option>
                  <option value="pre_order">Pre-order</option>
                  <option value="out_of_stock">Hết hàng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL ảnh chính</label>
                <input
                  className="input-field"
                  placeholder="https://..."
                  value={form.cover_image}
                  onChange={e => set({ cover_image: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh gallery (mỗi URL 1 dòng)</label>
                <textarea
                  className="input-field h-20 resize-none font-mono text-xs"
                  placeholder={"https://...\nhttps://..."}
                  value={form.images}
                  onChange={e => set({ images: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_customizable}
                  onChange={e => set({ is_customizable: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Cho phép tuỳ chỉnh (in logo, khắc tên...)</span>
              </label>

              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.retail_price}
                  className="btn-primary flex-1 disabled:opacity-40"
                >
                  {saving ? "Đang lưu..." : modal.mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
                </button>
                <button onClick={() => setModal(null)} className="btn-outline px-6">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
