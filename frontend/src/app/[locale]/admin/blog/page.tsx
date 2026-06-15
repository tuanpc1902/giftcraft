"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { BlogPost } from "@/types";

const CATEGORIES = ["Xu hướng quà tặng", "Bí quyết B2B", "Câu chuyện thương hiệu", "Hướng dẫn"];

type AdminBlogPost = BlogPost & { status: "draft" | "published"; content?: string };

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: CATEGORIES[0],
  read_minutes: 3,
  status: "draft" as "draft" | "published",
  meta_title: "",
  meta_description: "",
};

export default function AdminBlogPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminBlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user === null) {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/dang-nhap");
    } else if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    api.get("/admin/blog")
      .then(r => setPosts(r.data.data?.items ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function openNew() {
    setForm(emptyForm);
    setSelected(null);
    setSaveError("");
    setShowForm(true);
  }

  function openEdit(post: AdminBlogPost) {
    setForm({
      title:           post.title,
      slug:            post.slug,
      excerpt:         post.excerpt ?? "",
      content:         post.content ?? "",
      cover_image:     post.cover_image ?? "",
      category:        post.category,
      read_minutes:    post.read_minutes,
      status:          post.status,
      meta_title:      post.meta_title ?? "",
      meta_description: post.meta_description ?? "",
    });
    setSelected(post);
    setSaveError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        ...form,
        slug: form.slug || undefined,
        read_minutes: Number(form.read_minutes),
      };
      if (selected) {
        const res = await api.put(`/admin/blog/${selected.id}`, payload);
        const updated = res.data.data;
        setPosts(prev => prev.map(p => p.id === selected.id ? updated : p));
      } else {
        const res = await api.post("/admin/blog", payload);
        setPosts(prev => [res.data.data, ...prev]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSaveError(msg ?? "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa bài viết này?")) return;
    await api.delete(`/admin/blog/${id}`);
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center text-ink-muted">Đang tải...</div>;

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Quản lý Blog</h1>
        <button onClick={openNew} className="btn-primary text-sm px-5">+ Bài viết mới</button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-muted">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-ink-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Tiêu đề</th>
                <th className="text-left px-4 py-3">Danh mục</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Ngày</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-surface-alt transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3 text-ink-muted text-xs">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      post.status === "published" ? "bg-green-100 text-green-700" : "bg-surface-alt text-ink-muted"
                    }`}>
                      {post.status === "published" ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted text-xs">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(post)} className="text-xs text-brand hover:text-brand-dark font-medium">Sửa</button>
                    <button onClick={() => handleDelete(post.id)} className="text-xs text-brand hover:text-red-700 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-ink-muted">Chưa có bài viết nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-sm w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-ink">{selected ? "Chỉnh sửa bài viết" : "Bài viết mới"}</h2>
              <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-ink-muted text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tiêu đề *</label>
                <input className="input-field" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Slug (tự động nếu bỏ trống)</label>
                  <input className="input-field" placeholder="ten-bai-viet" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Danh mục</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tóm tắt</label>
                <textarea className="input-field resize-none" rows={2} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Nội dung (HTML) *</label>
                <textarea className="input-field resize-none font-mono text-xs" rows={8} required value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Ảnh bìa (URL)</label>
                  <input className="input-field" value={form.cover_image} onChange={e => setForm(p => ({ ...p, cover_image: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Thời gian đọc (phút)</label>
                  <input className="input-field" type="number" min={1} max={60} value={form.read_minutes} onChange={e => setForm(p => ({ ...p, read_minutes: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Trạng thái</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as "draft" | "published" }))}>
                    <option value="draft">Nháp</option>
                    <option value="published">Đăng ngay</option>
                  </select>
                </div>
              </div>
              {saveError && <p className="text-sm text-brand">{saveError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary text-sm px-6 disabled:opacity-40">
                  {saving ? "Đang lưu..." : selected ? "Lưu thay đổi" : "Tạo bài viết"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm px-6">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
