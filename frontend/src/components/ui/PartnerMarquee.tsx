"use client";

interface Partner {
  name: string;
  short: string;
  color: string;
  bg: string;
}

const PARTNERS: Partner[] = [
  { name: "Vingroup",      short: "V",  color: "#1E3A8A", bg: "#DBEAFE" },
  { name: "FPT Telecom",   short: "F",  color: "#EA580C", bg: "#FFEDD5" },
  { name: "Techcombank",   short: "T",  color: "#B91C1C", bg: "#FEE2E2" },
  { name: "Grab",          short: "G",  color: "#15803D", bg: "#DCFCE7" },
  { name: "VinFast",       short: "VF", color: "#1B4332", bg: "#D1FAE5" },
  { name: "Shopee",        short: "S",  color: "#C2410C", bg: "#FED7AA" },
  { name: "Vinamilk",      short: "VM", color: "#1D4ED8", bg: "#BFDBFE" },
  { name: "Masan",         short: "M",  color: "#374151", bg: "#F3F4F6" },
  { name: "MB Bank",       short: "MB", color: "#7C3AED", bg: "#EDE9FE" },
  { name: "Viettel",       short: "VT", color: "#B91C1C", bg: "#FEE2E2" },
  { name: "Saigon Co.op",  short: "SC", color: "#0369A1", bg: "#E0F2FE" },
  { name: "PNJ",           short: "PNJ",color: "#B45309", bg: "#FEF3C7" },
];

function LogoCard({ p }: { p: Partner }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-white border border-border rounded-sm mx-3 select-none whitespace-nowrap group hover:border-[var(--card-color)] hover:shadow-[0_2px_12px_0_rgb(0_0_0/0.08)] transition-all duration-200"
      style={{ "--card-color": p.color } as React.CSSProperties}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
        style={{ background: p.bg, color: p.color }}
      >
        {p.short}
      </div>
      <span className="text-sm font-semibold text-ink-muted group-hover:text-ink transition-colors">
        {p.name}
      </span>
    </div>
  );
}

export default function PartnerMarquee() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee">
        {doubled.map((p, i) => (
          <LogoCard key={i} p={p} />
        ))}
      </div>
    </div>
  );
}
