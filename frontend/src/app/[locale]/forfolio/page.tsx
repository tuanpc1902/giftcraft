import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ForfolioClient from "./ForfolioClient";

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api";

async function getProjects() {
  try {
    const res = await fetch(`${API}/portfolio`, { next: { revalidate: 3600, tags: ["portfolio"] } });
    const json = await res.json();
    return json.data ?? [];
  } catch { return []; }
}

export const metadata = {
  title: "Forfolio — Dự án thực tế",
  description: "Xem những dự án quà tặng thực tế GiftCraft đã thực hiện cho Vingroup, FPT, Shopee và hàng trăm doanh nghiệp.",
};

export default async function ForfolioPage() {
  const [projects, t] = await Promise.all([
    getProjects(),
    getTranslations("portfolio"),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-ink mb-3">{t("title")}</h1>
        <p className="text-ink-muted max-w-xl mx-auto">{t("subtitle")}</p>
      </div>
      <Suspense fallback={<div className="text-center py-12 text-ink-muted">{t("loading")}</div>}>
        <ForfolioClient projects={projects} />
      </Suspense>
    </div>
  );
}
