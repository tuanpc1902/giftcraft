import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Quà tặng doanh nghiệp — GiftCraft Studio",
  description: "Giải pháp quà tặng doanh nghiệp B2B: từ 20 sản phẩm, bảng giá 5 tier, thiết kế theo thương hiệu, giao hàng toàn quốc.",
};

const PRICE_TIERS = [
  { from: "Từ 20",  pct: 10 },
  { from: "Từ 50",  pct: 15 },
  { from: "Từ 100", pct: 20 },
  { from: "Từ 200", pct: 25 },
  { from: "Từ 300", pct: 30, highlight: true },
];

const TRUST = [
  { value: "500+", label: "Doanh nghiệp" },
  { value: "24h",  label: "Báo giá" },
  { value: "98%",  label: "Hài lòng" },
  { value: "63",   label: "Tỉnh thành" },
];

export default async function B2BLandingPage() {
  const t = await getTranslations("b2b");

  const USE_CASES = [
    { icon: "🏢", title: t("useCase1Title"), desc: t("useCase1Desc"), img: "https://picsum.photos/seed/uc-office/400/300" },
    { icon: "🤝", title: t("useCase2Title"), desc: t("useCase2Desc"), img: "https://picsum.photos/seed/uc-partner/400/300" },
    { icon: "🎪", title: t("useCase3Title"), desc: t("useCase3Desc"), img: "https://picsum.photos/seed/uc-event/400/300" },
    { icon: "🏮", title: t("useCase4Title"), desc: t("useCase4Desc"), img: "https://picsum.photos/seed/uc-tet/400/300" },
  ];

  const PROCESS = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-ink text-white overflow-hidden min-h-[520px] flex items-center">
        <Image
          src="https://picsum.photos/seed/b2b-hero-main/1920/800"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink/90 via-ink/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand mb-5">✦ {t("badge")}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight animate-fade-up">
              {t("heroTitle")}<br />
              <span className="text-brand animate-fade-up delay-75">{t("heroHighlight")}</span>
            </h1>
            <p className="text-white/70 text-lg mb-10 leading-relaxed animate-fade-up delay-150 max-w-lg">
              {t("heroDesc")}
            </p>
            <div className="flex gap-4 flex-wrap animate-fade-up delay-225">
              <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm px-8 py-3.5">
                {t("ctaStart")} →
              </Link>
              <Link href="/forfolio" className="btn-secondary text-sm px-8 py-3.5 border-white/30 text-white hover:bg-white/10">
                {t("ctaPortfolio")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="border-b border-border bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-border">
            {TRUST.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80} className="text-center px-4 first:pl-0">
                <p className="font-display text-3xl font-bold text-brand">{s.value}</p>
                <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Price tiers ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal className="text-center mb-14">
          <p className="eyebrow mb-3">✦ Bảng giá</p>
          <h2 className="section-title text-3xl mb-3">{t("tiersTitle")}</h2>
          <p className="text-ink-muted max-w-md mx-auto">{t("tiersSubtitle")}</p>
        </ScrollReveal>

        <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
          {PRICE_TIERS.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <div className={`relative text-center rounded-sm p-5 border-2 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.10)] ${
                tier.highlight
                  ? "border-brand bg-brand text-white shadow-[0_4px_16px_0_rgb(185_28_28/0.30)]"
                  : "border-border hover:border-brand"
              }`}>
                {tier.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    TỐT NHẤT
                  </span>
                )}
                <p className={`text-xs font-semibold mb-2 ${tier.highlight ? "text-white/70" : "text-ink-muted"}`}>
                  {tier.from} {t("unit")}
                </p>
                <p className={`font-display text-2xl font-bold ${tier.highlight ? "text-white" : "text-brand"}`}>
                  -{tier.pct}%
                </p>
                <p className={`text-[10px] mt-1 ${tier.highlight ? "text-white/60" : "text-ink-muted"}`}>
                  {t("discount")}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <p className="text-center text-xs text-ink-muted mt-6">{t("tiersNote")}</p>
      </section>

      {/* ── Use cases ── */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <p className="eyebrow mb-3">✦ Ứng dụng</p>
            <h2 className="section-title text-3xl">{t("useCasesTitle")}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map((u, i) => (
              <ScrollReveal key={u.title} delay={i * 80}>
                <div className="bg-white rounded-sm overflow-hidden card-hover h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={u.img}
                      alt={u.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-3xl">{u.icon}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-ink mb-2">{u.title}</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">{u.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal className="text-center mb-14">
          <p className="eyebrow mb-3">✦ Quy trình</p>
          <h2 className="section-title text-3xl">{t("processTitle")}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {PROCESS.map((p, i) => (
            <ScrollReveal key={p.step} delay={i * 80} className="relative">
              {i < 3 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%_-_24px)] w-[calc(100%_-_24px)] h-px border-t-2 border-dashed border-border z-0" />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-brand text-white font-black text-sm flex items-center justify-center mb-5 shadow-[0_4px_12px_0_rgb(185_28_28/0.30)]">
                  {p.step}
                </div>
                <h3 className="font-bold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-ink overflow-hidden">
        <Image
          src="https://picsum.photos/seed/b2b-cta-footer/1920/500"
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="eyebrow text-brand mb-4">✦ Bắt đầu ngay</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto">{t("ctaDesc")}</p>
          <Link href="/bat-dau-du-an-moi" className="btn-primary text-sm px-10 py-4 animate-pulse-ring">
            {t("ctaStart")} →
          </Link>
        </div>
      </section>

    </div>
  );
}
