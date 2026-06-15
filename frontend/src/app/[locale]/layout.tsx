import type { Metadata, Viewport } from "next";
import { Spectral, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "../globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastContainer from "@/components/ui/Toast";
import ChatWidget from "@/components/ChatWidget";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const spectral = Spectral({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GiftCraft Studio — Quà tặng doanh nghiệp & cá nhân",
    template: "%s — GiftCraft Studio",
  },
  description:
    "Quà tặng cao cấp, đặt theo yêu cầu, giao nhanh toàn quốc. Chuyên B2B từ 20 sản phẩm.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "GiftCraft" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#B91C1C",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const activeLocale = await getLocale();

  return (
    <html
      lang={activeLocale}
      className={`${spectral.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastContainer />
            <ChatWidget />
          </Providers>
        </NextIntlClientProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
