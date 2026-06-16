"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

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
  { label: "< 100",  min: 0, max: 99 },
  { label: "100–500", min: 100, max: 500 },
  { label: "500+",   min: 501, max: Infinity },
];

function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-150 ${
        active
          ? "bg-ink text-white border-ink shadow-sm"
          : "border-border text-ink-muted hover:border-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

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

  const totalImages = lightbox?.gallery_images?.length ?? 0;

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border py-3.5 mb-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap gap-y-2 gap-x-4 items-center">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest w-8">Dịp</span>
            {OCCASIONS.map(o => (
              <FilterPill key={o} active={occasion === o} onClick={() => setOccasion(o)}>
                {o}
              </FilterPill>
            ))}
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest w-10">Ngành</span>
            {INDUSTRIES.map(i => (
              <FilterPill key={i} active={industry === i} onClick={() => setIndustry(i)}>
                {i}
              </FilterPill>
            ))}
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest w-5">SL</span>
            {QTY_RANGES.map((r, i) => (
              <FilterPill key={r.label} active={qtyRange === i} onClick={() => setQtyRange(i)}>
                {r.label}
              </FilterPill>
            ))}
          </div>
          {filtered.length !== projects.length && (
            <span className="ml-auto text-xs text-ink-muted">
              {filtered.length}/{projects.length} dự án
            </span>
          )}
        </div>
      </div>

      {/* ── Masonry grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-muted">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-medium">Không tìm thấy dự án phù hợp.</p>
          <button type="button" onClick={() => { setOccasion("Tất cả"); setIndustry("Tất cả"); setQtyRange(0); }}
            className="mt-4 text-sm text-brand hover:underline">
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => openLightbox(p)}
              className="break-inside-avoid mb-4 group cursor-pointer rounded-sm overflow-hidden relative block"
            >
              <div className={`relative aspect-[4/3] bg-surface-alt ${p.is_featured ? "ring-2 ring-brand ring-inset" : ""}`}>
                <Image
                  src={p.cover_image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Featured badge */}
                {p.is_featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-brand text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <StarIcon className="w-3 h-3" />
                    Nổi bật
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm leading-snug mb-1">{p.title}</p>
                    <p className="text-white/70 text-xs mb-3">
                      {p.occasion}{p.quantity ? ` · ${p.quantity.toLocaleString()} bộ` : ""}
                    </p>
                    <span className="inline-block text-xs font-semibold text-brand bg-white/10 border border-white/20 rounded-full px-3 py-1">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="bg-white border-t border-border px-4 py-3 group-hover:bg-surface-alt transition-colors duration-200">
                <p className="font-semibold text-ink text-sm leading-snug truncate">{p.title}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {p.occasion}{p.industry ? ` · ${p.industry}` : ""}{p.quantity ? ` · ${p.quantity.toLocaleString()} bộ` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Gallery */}
            <div className="md:w-3/5 flex-shrink-0">
              <div className="relative aspect-[4/3] bg-surface-alt overflow-hidden">
                {lightbox.gallery_images?.[imgIndex] && (
                  <Image
                    src={lightbox.gallery_images[imgIndex]}
                    alt={lightbox.title}
                    fill
                    className="object-cover"
                    sizes="600px"
                    priority
                  />
                )}
                {/* Prev/next */}
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setImgIndex(i => Math.max(0, i - 1))}
                      disabled={imgIndex === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgIndex(i => Math.min(totalImages - 1, i + 1))}
                      disabled={imgIndex === totalImages - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                      {imgIndex + 1} / {totalImages}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {totalImages > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide bg-surface-alt">
                  {lightbox.gallery_images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      className={`relative flex-shrink-0 w-14 h-14 rounded-sm overflow-hidden border-2 transition-all duration-150 ${
                        imgIndex === i ? "border-brand scale-[1.05]" : "border-transparent hover:border-border"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col md:w-2/5">
              <button
                type="button"
                onClick={closeLightbox}
                className="self-end p-1.5 rounded-full text-ink-muted hover:bg-surface-alt hover:text-ink transition-colors mb-3"
                aria-label="Đóng"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {lightbox.is_featured && (
                <div className="flex items-center gap-1.5 text-brand text-xs font-bold mb-3">
                  <StarIcon className="w-3.5 h-3.5" />
                  Dự án nổi bật
                </div>
              )}

              <h2 className="font-display text-xl font-bold text-ink mb-4 leading-snug">
                {lightbox.title}
              </h2>

              <div className="space-y-2 text-sm mb-5">
                {lightbox.client_name && (
                  <div className="flex gap-2">
                    <span className="text-ink-muted w-20 flex-shrink-0">Khách hàng</span>
                    <span className="text-ink font-medium">{lightbox.client_name}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-ink-muted w-20 flex-shrink-0">Dịp</span>
                  <span className="text-ink font-medium">{lightbox.occasion}</span>
                </div>
                {lightbox.industry && (
                  <div className="flex gap-2">
                    <span className="text-ink-muted w-20 flex-shrink-0">Ngành</span>
                    <span className="text-ink font-medium">{lightbox.industry}</span>
                  </div>
                )}
                {lightbox.quantity && (
                  <div className="flex gap-2">
                    <span className="text-ink-muted w-20 flex-shrink-0">Số lượng</span>
                    <span className="text-ink font-medium">{lightbox.quantity.toLocaleString()} bộ</span>
                  </div>
                )}
              </div>

              {lightbox.description && (
                <p className="text-sm text-ink-muted leading-relaxed flex-1 pb-5 border-b border-border mb-5">
                  {lightbox.description}
                </p>
              )}

              <Link
                href={`/bat-dau-du-an-moi?occasion=${encodeURIComponent(lightbox.occasion)}&requirements=${encodeURIComponent(`Tham khảo: ${lightbox.title}`)}`}
                onClick={closeLightbox}
                className="btn-primary text-center text-sm w-full"
              >
                Tôi muốn dự án tương tự →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
