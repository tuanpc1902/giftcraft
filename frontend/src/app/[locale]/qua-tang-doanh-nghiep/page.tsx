import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Quà tặng doanh nghiệp — GiftCraft Studio",
  description: "Giải pháp quà tặng doanh nghiệp B2B: từ 20 sản phẩm, bảng giá 5 tier, thiết kế theo thương hiệu, giao hàng toàn quốc.",
};

const PRICE_TIERS = [
  { from: "Từ 20", pct: -10 },
  { from: "Từ 50", pct: -15 },
  { from: "Từ 100", pct: -20 },
  { from: "Từ 200", pct: -25 },
  { from: "Từ 300", pct: -30 },
];

export default async function B2BLandingPage() {
  const t = await getTranslations("b2b");

  const USE_CASES = [
    { icon: "🏢", title: t("useCase1Title"), desc: t("useCase1Desc") },
    { icon: "🤝", title: t("useCase2Title"), desc: t("useCase2Desc") },
    { icon: "🎪", title: t("useCase3Title"), desc: t("useCase3Desc") },
    { icon: "🏮", title: t("useCase4Title"), desc: t("useCase4Desc") },
  ];

  const PROCESS = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              {t("badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {t("heroTitle")}<br /><span className="text-amber-400">{t("heroHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">{t("heroDesc")}</p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/bat-dau-du-an-moi"
                className="inline-flex items-center justify-center bg-amber-400 text-gray-900 font-bold py-4 px-8 rounded-2xl hover:bg-amber-300 transition-colors">
                {t("ctaStart")} →
              </Link>
              <Link href="/forfolio"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/10 transition-colors">
                {t("ctaPortfolio")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("tiersTitle")}</h2>
          <p className="text-gray-500">{t("tiersSubtitle")}</p>
        </div>
        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
          {PRICE_TIERS.map((tier, i) => (
            <div key={i} className={`text-center rounded-2xl p-4 border-2 ${i === 4 ? "border-amber-400 bg-amber-50" : "border-gray-100"}`}>
              <p className="text-xs font-semibold text-gray-500">{tier.from} {t("unit")}</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{tier.pct}%</p>
              <p className="text-xs text-gray-400 mt-1">{t("discount")}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">{t("tiersNote")}</p>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">{t("useCasesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <span className="text-4xl block mb-3">{u.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{u.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">{t("processTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="relative">
              {i < 3 && <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-200 z-0" />}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-900 font-black text-lg flex items-center justify-center mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-amber-400 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("ctaTitle")}</h2>
          <p className="text-amber-900 mb-8">{t("ctaDesc")}</p>
          <Link href="/bat-dau-du-an-moi"
            className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-gray-700 transition-colors text-lg">
            {t("ctaStart")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
