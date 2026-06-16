"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const PERKS = [
  "Theo dõi đơn hàng real-time",
  "Tích điểm & ưu đãi thành viên",
  "Lưu địa chỉ, thanh toán nhanh hơn",
  "Báo giá B2B ưu tiên trong 24h",
];

export default function LoginPage() {
  const router = useRouter();
  const { login, user, init } = useAuthStore();
  const { add: addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { init(); }, [init]);
  useEffect(() => { if (user) router.replace("/tai-khoan"); }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.data.token, res.data.data.user);
      router.push("/tai-khoan");
    } catch {
      addToast("Email hoặc mật khẩu không đúng.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-ink">
        <Image
          src="https://picsum.photos/seed/auth-panel-2026/900/1200"
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
            <p className="eyebrow text-brand-light mb-4">Chào mừng trở lại</p>
            <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
              Quà tặng tinh tế,<br />giao đúng cảm xúc
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
          {/* Mobile logo */}
          <Link href="/" className="font-display font-bold text-xl text-ink hover:text-brand transition-colors block mb-10 lg:hidden">
            GiftCraft Studio
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Đăng nhập</h1>
            <p className="text-sm text-ink-muted">Chưa có tài khoản?{" "}
              <Link href="/dang-ky" className="text-brand font-semibold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-ink uppercase tracking-wide mb-1.5">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ban@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-ink uppercase tracking-wide mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                  aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Đăng nhập →
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-ink-muted">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
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
