import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GiftCraft Studio — Quà tặng doanh nghiệp & cá nhân",
    template: "%s — GiftCraft Studio",
  },
  description:
    "Quà tặng cao cấp, đặt theo yêu cầu, giao nhanh toàn quốc. Chuyên B2B từ 20 sản phẩm.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GiftCraft",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <ChatWidget />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
