"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const PERKS = [
  "Mua hàng nhanh hơn, lưu địa chỉ",
  "Tích điểm đổi quà tặng",
  "Thông báo ưu đãi & bộ sưu tập mới",
  "Hỗ trợ đơn B2B ưu tiên",
];

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
      const loginRes = await api.post("/auth/login", { email: form.email, password: form.password });
      login(loginRes.data.data.token, loginRes.data.data.user);
      router.push("/tai-khoan");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đăng ký thất bại.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-ink">
        <Image
          src="https://picsum.photos/seed/register-panel-2026/900/1200"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-ink/80 to-brand-dark/60" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="font-display font-bold text-xl text-white hover:text-brand-light transition-colors">
            GiftCraft Studio
          </Link>
          <div>
            <p className="eyebrow text-brand-light mb-4">Tham gia ngay hôm nay</p>
            <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
              Trải nghiệm quà tặng<br />đẳng cấp mới
            </h2>
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircleIcon className="w-5 h-5 text-brand flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-white/30 text-xs">© 2026 GiftCraft Studio</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display font-bold text-xl text-ink hover:text-brand transition-colors block mb-10 lg:hidden">
            GiftCraft Studio
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Tạo tài khoản</h1>
            <p className="text-sm text-ink-muted">Đã có tài khoản?{" "}
              <Link href="/dang-nhap" className="text-brand font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Họ tên", type: "text", placeholder: "Nguyễn Văn A", autoComplete: "name" },
              { key: "email", label: "Email", type: "email", placeholder: "ban@email.com", autoComplete: "email" },
              { key: "password", label: "Mật khẩu", type: "password", placeholder: "Tối thiểu 8 ký tự", autoComplete: "new-password", minLength: 8 },
              { key: "password_confirmation", label: "Xác nhận mật khẩu", type: "password", placeholder: "Nhập lại mật khẩu", autoComplete: "new-password" },
            ].map(({ key, label, type, placeholder, autoComplete, minLength }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-xs font-semibold text-ink uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <Input
                  id={key}
                  type={type}
                  placeholder={placeholder}
                  required
                  autoComplete={autoComplete}
                  minLength={minLength}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Tạo tài khoản →
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-ink-muted">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/dieu-khoan" className="text-brand hover:underline">Điều khoản</Link>
              {" "}và{" "}
              <Link href="/chinh-sach-bao-mat" className="text-brand hover:underline">Chính sách bảo mật</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
