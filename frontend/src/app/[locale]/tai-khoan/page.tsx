"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Order, LoyaltySummary } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

type Tab = "profile" | "orders" | "loyalty" | "projects";

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  silver:  { label: "Silver",  color: "text-gray-600",  bg: "bg-gray-100" },
  gold:    { label: "Gold",    color: "text-amber-700", bg: "bg-amber-100" },
  diamond: { label: "Diamond", color: "text-blue-700",  bg: "bg-blue-100" },
};

export default function AccountPage() {
  const router = useRouter();
  const t = useTranslations("account");
  const tOrder = useTranslations("order");
  const { user, logout, init } = useAuthStore();
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [loyaltyLoaded, setLoyaltyLoaded] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (user === null && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.replace("/dang-nhap");
    }
    if (user) {
      setEditName(user.name);
    }
  }, [user, router]);

  useEffect(() => {
    if (tab === "orders" && !ordersLoaded) {
      setOrdersLoading(true);
      api.get("/orders")
        .then(r => setOrders(r.data.data?.items ?? r.data.data ?? []))
        .catch(() => setOrders([]))
        .finally(() => { setOrdersLoading(false); setOrdersLoaded(true); });
    }
  }, [tab, ordersLoaded]);

  useEffect(() => {
    if (tab === "loyalty" && !loyaltyLoaded) {
      api.get("/loyalty/summary")
        .then(r => setLoyalty(r.data.data))
        .catch(() => {})
        .finally(() => setLoyaltyLoaded(true));
    }
  }, [tab, loyaltyLoaded]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/profile", { name: editName, phone: editPhone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">{t("loading")}</div>;
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "profile",  label: `👤 ${t("profile")}` },
    { key: "orders",   label: `📦 ${t("orders")}` },
    { key: "loyalty",  label: `⭐ ${t("loyalty")}` },
    { key: "projects", label: `📋 ${t("projects")}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 border border-gray-200 rounded-xl px-4 py-2 transition-colors"
        >
          {t("logout")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-8 w-fit">
        {TABS.map(tb => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`text-sm font-medium px-5 py-2 rounded-xl transition-colors ${
              tab === tb.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-5">{t("editProfile")}</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("name")}</label>
                <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
                <input className="input-field bg-gray-50 cursor-not-allowed" value={user.email} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("phone")}</label>
                <input className="input-field" placeholder="09xxxxxxxx" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
              </div>
              <button type="submit" disabled={saving} className="btn-primary text-sm px-6 disabled:opacity-40">
                {saving ? t("saving") : saved ? `✓ ${t("saved")}` : t("saveProfile")}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
              <h3 className="font-bold text-amber-900 mb-3">📋 {t("projects")}</h3>
              <p className="text-sm text-amber-700 mb-4">{t("projectsDesc")}</p>
              <Link href="/tai-khoan/du-an" className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 font-semibold text-sm py-2.5 px-5 rounded-xl hover:bg-amber-300 transition-colors">
                {t("viewProjects")} →
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">🔒 {t("security")}</h3>
              <Link href="/doi-mat-khau" className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
                {t("changePassword")} →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div>
          {ordersLoading ? (
            <div className="text-center py-16 text-gray-400">{t("loadingOrders")}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-gray-500 font-medium mb-2">{t("noOrders")}</p>
              <p className="text-gray-400 text-sm mb-6">{t("noOrdersHint")}</p>
              <Link href="/san-pham" className="btn-primary text-sm px-6">{t("shopNow")}</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.order_number} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {tOrder(`status.${order.status}`) ?? order.status}
                    </span>
                  </div>
                  <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {order.items?.length ?? 0} {t("itemCount")}
                      {order.delivery_type === "express" && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">🚀 {t("express")}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                      <Link href={`/don-hang/${order.order_number}`} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                        {t("viewOrder")} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loyalty */}
      {tab === "loyalty" && (
        <div>
          {!loyaltyLoaded ? (
            <div className="text-center py-16 text-gray-400">{t("loading")}</div>
          ) : loyalty ? (
            <div className="space-y-6">
              <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{t("loyaltyPoints")}</p>
                    <p className="text-5xl font-bold">{loyalty.points.toLocaleString("vi-VN")}</p>
                    <p className="text-gray-400 text-xs mt-1">{t("loyaltyPointRate")}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${TIER_CONFIG[loyalty.tier]?.bg} ${TIER_CONFIG[loyalty.tier]?.color}`}>
                    {TIER_CONFIG[loyalty.tier]?.label ?? loyalty.tier}
                  </span>
                </div>
                {loyalty.next_tier && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>{t("nextTier", { tier: TIER_CONFIG[loyalty.next_tier.tier]?.label ?? loyalty.next_tier.tier })}</span>
                      <span>{loyalty.next_tier.remaining.toLocaleString("vi-VN")} {t("pointsLeft")}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${loyalty.next_tier.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tier: "silver", label: "Silver",          benefits: [t("silverBenefit1"), t("silverBenefit2")] },
                  { tier: "gold",   label: "Gold 500đ+",      benefits: [t("goldBenefit1"),   t("goldBenefit2")] },
                  { tier: "diamond",label: "Diamond 2000đ+",  benefits: [t("diamondBenefit1"),t("diamondBenefit2")] },
                ].map(tier => (
                  <div key={tier.tier} className={`rounded-2xl border p-4 ${loyalty.tier === tier.tier ? "border-amber-300 bg-amber-50" : "border-gray-100"}`}>
                    <p className={`font-bold text-sm mb-2 ${TIER_CONFIG[tier.tier]?.color}`}>{tier.label}</p>
                    <ul className="space-y-1">
                      {tier.benefits.map(b => (
                        <li key={b} className="text-xs text-gray-600 flex items-center gap-1.5">
                          <span className="text-amber-400">✓</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">{t("pointHistory")}</h3>
                {loyalty.transactions.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">{t("noTransactions")}</p>
                ) : (
                  <div className="divide-y divide-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                    {loyalty.transactions.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                          <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <span className={`text-sm font-bold ${tx.points > 0 ? "text-green-600" : "text-red-500"}`}>
                          {tx.points > 0 ? "+" : ""}{tx.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Projects */}
      {tab === "projects" && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="font-bold text-gray-900 mb-2">{t("projects")}</h3>
          <p className="text-gray-500 text-sm mb-6">{t("projectsDesc")}</p>
          <Link href="/tai-khoan/du-an" className="btn-primary text-sm px-6">{t("viewProjects")} →</Link>
        </div>
      )}
    </div>
  );
}
