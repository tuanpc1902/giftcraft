export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest animate-pulse">
        Đang tải...
      </p>
    </div>
  );
}
