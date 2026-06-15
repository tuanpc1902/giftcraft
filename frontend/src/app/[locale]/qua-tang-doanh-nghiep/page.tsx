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
      <section className="bg-ink text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-brand-light text-brand text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-sm mb-4">
              {t("badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {t("heroTitle")}<br /><span className="text-brand">{t("heroHighlight")}</span>
            </h1>
            <p className="text-lg text-ink-muted mb-8 leading-relaxed">{t("heroDesc")}</p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/bat-dau-du-an-moi"
                className="inline-flex items-center justify-center bg-brand text-white font-bold py-4 px-8 rounded-sm hover:bg-brand-light transition-colors">
                {t("ctaStart")} →
              </Link>
              <Link href="/forfolio"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-sm hover:bg-white/10 transition-colors">
                {t("ctaPortfolio")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-ink mb-3">{t("tiersTitle")}</h2>
          <p className="text-ink-muted">{t("tiersSubtitle")}</p>
        </div>
        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
          {PRICE_TIERS.map((tier, i) => (
            <div key={i} className={`text-center rounded-sm p-4 border-2 ${i === 4 ? "border-brand bg-brand-light" : "border-border"}`}>
              <p className="text-xs font-semibold text-ink-muted">{tier.from} {t("unit")}</p>
              <p className="text-2xl font-bold text-brand mt-1">{tier.pct}%</p>
              <p className="text-xs text-ink-muted mt-1">{t("discount")}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-muted mt-4">{t("tiersNote")}</p>
      </section>

      <section className="bg-surface-alt py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink mb-10 text-center">{t("useCasesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-white rounded-sm p-6 text-center shadow-sm">
                <span className="text-4xl block mb-3">{u.icon}</span>
                <h3 className="font-bold text-ink mb-2">{u.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-ink mb-12 text-center">{t("processTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="relative">
              {i < 3 && <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-surface-alt z-0" />}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-sm bg-brand-light text-brand font-black text-lg flex items-center justify-center mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-ink mb-4">{t("ctaTitle")}</h2>
          <p className="text-brand mb-8">{t("ctaDesc")}</p>
          <Link href="/bat-dau-du-an-moi"
            className="inline-flex items-center justify-center bg-ink text-white font-bold py-4 px-10 rounded-sm hover:bg-ink transition-colors text-lg">
            {t("ctaStart")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
