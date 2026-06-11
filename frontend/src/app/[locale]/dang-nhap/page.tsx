"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { login, user, init } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user) router.replace("/tai-khoan");
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.data.token, data.data.user);
      router.push(data.data.user.role === "admin" ? "/admin" : "/tai-khoan");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: "var(--color-warm-bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-2xl font-bold" style={{ color: "var(--color-brand)" }}>GiftCraft Studio</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">{t("loginSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">{t("password")}</label>
                <Link href="/quen-mat-khau" className="text-xs hover:underline" style={{ color: "var(--color-brand)" }}>
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  {showPw ? t("pwHide") : t("pwShow")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full disabled:opacity-40 mt-2"
            >
              {loading ? t("loggingIn") : t("loginBtn")}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/dang-ky" className="font-semibold hover:underline" style={{ color: "var(--color-brand)" }}>
              {t("registerLink")}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {t("b2bNote")}{" "}
          <Link href="/bat-dau-du-an-moi" className="hover:underline" style={{ color: "var(--color-brand)" }}>
            {t("b2bNoteLink")} →
          </Link>
        </p>
      </div>
    </div>
  );
}
