"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
      await login(email, password);
    } catch {
      addToast("Email hoặc mật khẩu không đúng.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Đăng nhập</h1>
          <p className="text-sm text-ink-muted">Chào mừng trở lại GiftCraft Studio</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Đăng nhập
          </Button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-brand font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
