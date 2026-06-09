"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, init } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user) router.replace("/tai-khoan");
  }, [user, router]);

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    if (password.length < 8) { setError("Mật khẩu cần ít nhất 8 ký tự."); return; }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", { name, email, password, password_confirmation: confirm });
      login(data.data.token, data.data.user);
      router.push("/tai-khoan");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-gray-900">GiftCraft Studio</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Tạo tài khoản mới</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
              <input
                type="text"
                required
                autoComplete="name"
                className="input-field"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="input-field"
                placeholder="ten@congty.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="Ít nhất 8 ký tự"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  {showPw ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                className={`input-field ${passwordMismatch ? "border-red-400 focus:ring-red-400" : ""}`}
                placeholder="Nhập lại mật khẩu"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              {passwordMismatch && (
                <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
              )}
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12 ? "bg-green-500"
                            : password.length >= 8 ? "bg-amber-400"
                            : "bg-red-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {password.length < 8 ? "Quá ngắn" : password.length < 12 ? "Trung bình" : "Mạnh"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name || !email || !password || password !== confirm}
              className="btn-primary w-full disabled:opacity-40 mt-2"
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="text-gray-900 font-semibold hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <Link href="/chinh-sach" className="underline">Điều khoản dịch vụ</Link>{" "}
          và{" "}
          <Link href="/chinh-sach" className="underline">Chính sách bảo mật</Link>.
        </p>
      </div>
    </div>
  );
}
