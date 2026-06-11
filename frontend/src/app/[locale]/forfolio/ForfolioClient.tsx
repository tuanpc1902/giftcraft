"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  client_name: string | null;
  occasion: string;
  industry: string | null;
  quantity: number | null;
  cover_image: string;
  gallery_images: string[];
  description: string | null;
  is_featured: boolean;
}

const OCCASIONS = ["Tất cả", "Tết", "Khai trương", "Tri ân", "Hội nghị", "Trung Thu", "Sự kiện"];
const INDUSTRIES = ["Tất cả", "Tech", "Bất động sản", "F&B", "Retail", "Tài chính", "Y tế"];
const QTY_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "<100", min: 0, max: 99 },
  { label: "100–500", min: 100, max: 500 },
  { label: "500+", min: 501, max: Infinity },
];

export default function ForfolioClient({ projects }: { projects: Project[] }) {
  const [occasion, setOccasion] = useState("Tất cả");
  const [industry, setIndustry] = useState("Tất cả");
  const [qtyRange, setQtyRange] = useState(0);
  const [lightbox, setLightbox] = useState<Project | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  const filtered = projects.filter(p => {
    if (occasion !== "Tất cả" && p.occasion !== occasion) return false;
    if (industry !== "Tất cả" && p.industry !== industry) return false;
    const range = QTY_RANGES[qtyRange];
    if (p.quantity !== null && (p.quantity < range.min || p.quantity > range.max)) return false;
    return true;
  });

  function openLightbox(p: Project) { setLightbox(p); setImgIndex(0); }
  function closeLightbox() { setLightbox(null); }

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Dịp:</span>
            {OCCASIONS.map(o => (
              <button key={o} onClick={() => setOccasion(o)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${occasion === o ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {o}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Ngành:</span>
            {INDUSTRIES.map(i => (
              <button key={i} onClick={() => setIndustry(i)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${industry === i ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {i}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">SL:</span>
            {QTY_RANGES.map((r, i) => (
              <button key={r.label} onClick={() => setQtyRange(i)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${qtyRange === i ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Masonry grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Không tìm thấy dự án phù hợp.</div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map(p => (
            <div key={p.id} onClick={() => openLightbox(p)}
              className={`break-inside-avoid group cursor-pointer rounded-2xl overflow-hidden relative ${p.is_featured ? "ring-2 ring-amber-400" : ""}`}>
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image src={p.cover_image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                {p.is_featured && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">⭐ Nổi bật</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-sm">{p.title}</p>
                  <p className="text-white/80 text-xs">{p.occasion} · {p.quantity ? `${p.quantity.toLocaleString()} bộ` : ""}</p>
                  <span className="mt-2 inline-block text-xs text-amber-300 font-semibold">Xem chi tiết →</span>
                </div>
              </div>
              <div className="bg-white p-3 group-hover:hidden">
                <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                <p className="text-xs text-gray-400">{p.occasion}{p.quantity ? ` · ${p.quantity.toLocaleString()} bộ` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}>
            {/* Gallery */}
            <div className="md:w-3/5 flex-shrink-0">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                {lightbox.gallery_images?.[imgIndex] && (
                  <Image src={lightbox.gallery_images[imgIndex]} alt={lightbox.title} fill className="object-cover" sizes="600px" />
                )}
                {/* Nav arrows */}
                {(lightbox.gallery_images?.length ?? 0) > 1 && (
                  <>
                    <button onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">‹</button>
                    <button onClick={() => setImgIndex(i => Math.min((lightbox.gallery_images?.length ?? 1) - 1, i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">›</button>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {(lightbox.gallery_images?.length ?? 0) > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {lightbox.gallery_images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${imgIndex === i ? "border-amber-400" : "border-transparent"}`}>
                      <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col md:w-2/5">
              <button onClick={closeLightbox} className="self-end text-gray-300 hover:text-gray-600 text-2xl mb-2 transition-colors">×</button>
              {lightbox.is_featured && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">⭐ Nổi bật</span>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-2">{lightbox.title}</h2>
              <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                {lightbox.client_name && <p><span className="font-medium text-gray-800">Khách hàng:</span> {lightbox.client_name}</p>}
                <p><span className="font-medium text-gray-800">Dịp:</span> {lightbox.occasion}</p>
                {lightbox.industry && <p><span className="font-medium text-gray-800">Ngành:</span> {lightbox.industry}</p>}
                {lightbox.quantity && <p><span className="font-medium text-gray-800">Số lượng:</span> {lightbox.quantity.toLocaleString()} bộ</p>}
              </div>
              {lightbox.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{lightbox.description}</p>
              )}
              <Link
                href={`/bat-dau-du-an-moi?occasion=${encodeURIComponent(lightbox.occasion)}&requirements=${encodeURIComponent(`Tham khảo: ${lightbox.title}`)}`}
                onClick={closeLightbox}
                className="btn-primary text-center text-sm">
                Tôi muốn dự án tương tự →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
