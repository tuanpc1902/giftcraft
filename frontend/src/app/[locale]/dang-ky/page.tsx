"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, init } = useAuthStore();
  const { add: addToast } = useToastStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { init(); }, [init]);
  useEffect(() => { if (user) router.replace("/tai-khoan"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      addToast("Mật khẩu xác nhận không khớp.", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      await login(form.email, form.password);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đăng ký thất bại.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Tạo tài khoản</h1>
          <p className="text-sm text-ink-muted">Tham gia GiftCraft Studio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Họ tên *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <Input type="email" placeholder="Email *" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          <Input type="password" placeholder="Mật khẩu *" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} />
          <Input type="password" placeholder="Xác nhận mật khẩu *" required value={form.password_confirmation} onChange={(e) => set("password_confirmation", e.target.value)} />
          <Button type="submit" loading={loading} className="w-full">Đăng ký</Button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-6">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="text-brand font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
