"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import { PortfolioProject } from "@/types";

const OCCASIONS = ["Tết", "Khai trương", "Tri ân", "Hội nghị", "Trung Thu", "Sự kiện", "Sinh nhật", "Khác"];
const INDUSTRIES = ["Tech", "Bất động sản", "F&B", "Retail", "Tài chính", "Y tế", "Giáo dục", "Khác"];

interface ProjectForm {
  title: string;
  client_name: string;
  occasion: string;
  industry: string;
  quantity: string;
  cover_image: string;
  gallery_images: string;
  description: string;
  is_featured: boolean;
}

const emptyForm: ProjectForm = {
  title: "", client_name: "", occasion: OCCASIONS[0], industry: INDUSTRIES[0],
  quantity: "", cover_image: "", gallery_images: "", description: "", is_featured: false,
};

function toPayload(f: ProjectForm) {
  return {
    title: f.title,
    client_name: f.client_name || null,
    occasion: f.occasion,
    industry: f.industry || null,
    quantity: f.quantity ? parseInt(f.quantity) : null,
    cover_image: f.cover_image,
    gallery_images: f.gallery_images.split("\n").map(s => s.trim()).filter(Boolean),
    description: f.description || null,
    is_featured: f.is_featured,
  };
}

function fromProject(p: PortfolioProject): ProjectForm {
  return {
    title: p.title,
    client_name: p.client_name ?? "",
    occasion: p.occasion,
    industry: p.industry ?? INDUSTRIES[0],
    quantity: p.quantity ? String(p.quantity) : "",
    cover_image: p.cover_image,
    gallery_images: (p.gallery_images ?? []).join("\n"),
    description: p.description ?? "",
    is_featured: p.is_featured,
  };
}

type ModalMode = "add" | "edit";

function formReducer(s: ProjectForm, patch: Partial<ProjectForm>) { return { ...s, ...patch }; }

export default function AdminForfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: ModalMode; id?: number } | null>(null);
  const [form, dispatchForm] = useReducer(formReducer, emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const set = (patch: Partial<ProjectForm>) => dispatchForm(patch);

  useEffect(() => {
    api.get("/admin/portfolio?per_page=100")
      .then(r => setProjects(r.data.data?.items ?? r.data.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    dispatchForm(emptyForm);
    setModal({ mode: "add" });
  }

  function openEdit(p: PortfolioProject) {
    dispatchForm(fromProject(p));
    setModal({ mode: "edit", id: p.id });
  }

  async function toggleFeatured(p: PortfolioProject) {
    const updated = { ...p, is_featured: !p.is_featured };
    setProjects(ps => ps.map(x => x.id === p.id ? updated : x));
    await api.put(`/admin/portfolio/${p.id}`, { is_featured: updated.is_featured }).catch(() => {
      setProjects(ps => ps.map(x => x.id === p.id ? p : x));
    });
  }

  async function handleSave() {
    if (!form.title || !form.cover_image) return;
    setSaving(true);
    try {
      const payload = toPayload(form);
      if (modal?.mode === "add") {
        const { data } = await api.post("/admin/portfolio", payload);
        setProjects(ps => [data.data, ...ps]);
      } else if (modal?.id) {
        const { data } = await api.put(`/admin/portfolio/${modal.id}`, payload);
        setProjects(ps => ps.map(p => p.id === modal.id ? data.data : p));
      }
      setModal(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa dự án này?")) return;
    setDeleting(id);
    await api.delete(`/admin/portfolio/${id}`).catch(() => {});
    setProjects(ps => ps.filter(p => p.id !== id));
    setDeleting(null);
    if (modal?.id === id) setModal(null);
  }

  return (
    <AdminLayout>
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Forfolio</h1>
          <p className="text-ink-muted text-sm mt-0.5">{projects.length} dự án · {projects.filter(p => p.is_featured).length} nổi bật</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-5">+ Thêm dự án</button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Dự án</th>
                <th className="text-left px-4 py-3">Khách hàng</th>
                <th className="text-left px-4 py-3">Dịp</th>
                <th className="text-left px-4 py-3">Ngành</th>
                <th className="text-left px-4 py-3">Số lượng</th>
                <th className="text-left px-4 py-3">Nổi bật</th>
                <th className="text-left px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-surface-alt">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-surface-alt flex-shrink-0">
                        <Image src={p.cover_image} alt={p.title} fill className="object-cover" sizes="40px" />
                      </div>
                      <p className="font-medium text-ink truncate max-w-[160px]">{p.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{p.client_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.occasion}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.industry ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {p.quantity ? p.quantity.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`text-lg transition-opacity ${p.is_featured ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                      title={p.is_featured ? "Bỏ nổi bật" : "Đặt nổi bật"}
                    >
                      ⭐
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-ink-muted hover:text-ink font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-xs text-brand hover:text-brand-dark font-medium disabled:opacity-40"
                      >
                        {deleting === p.id ? "..." : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-ink">{modal.mode === "add" ? "Thêm dự án mới" : "Chỉnh sửa dự án"}</h2>
              <button onClick={() => setModal(null)} className="text-ink-muted hover:text-ink-muted text-2xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink mb-1.5">Tên dự án *</label>
                  <input className="input-field" value={form.title} onChange={e => set({ title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Khách hàng</label>
                  <input className="input-field" placeholder="Vingroup, FPT..." value={form.client_name} onChange={e => set({ client_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Số lượng (bộ)</label>
                  <input type="number" className="input-field" placeholder="500" value={form.quantity} onChange={e => set({ quantity: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Dịp *</label>
                  <select className="input-field" value={form.occasion} onChange={e => set({ occasion: e.target.value })}>
                    {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Ngành</label>
                  <select className="input-field" value={form.industry} onChange={e => set({ industry: e.target.value })}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink mb-1.5">Ảnh bìa (URL) *</label>
                  <input className="input-field" placeholder="https://..." value={form.cover_image} onChange={e => set({ cover_image: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink mb-1.5">Ảnh gallery (mỗi URL 1 dòng)</label>
                  <textarea className="input-field h-24 resize-none text-xs font-mono" placeholder={"https://...\\nhttps://..."} value={form.gallery_images} onChange={e => set({ gallery_images: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-ink mb-1.5">Mô tả</label>
                  <textarea className="input-field h-24 resize-none" placeholder="Mô tả ngắn về dự án..." value={form.description} onChange={e => set({ description: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => set({ is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium text-ink">⭐ Đánh dấu nổi bật</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.cover_image}
                  className="btn-primary flex-1 disabled:opacity-40"
                >
                  {saving ? "Đang lưu..." : modal.mode === "add" ? "Thêm dự án" : "Lưu thay đổi"}
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
