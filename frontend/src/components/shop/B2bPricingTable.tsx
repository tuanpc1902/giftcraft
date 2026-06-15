import { B2bTier } from "@/types";
import { formatPrice } from "@/lib/formatPrice";

export default function B2bPricingTable({ tiers }: { tiers: B2bTier[] }) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="bg-surface-alt px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-ink uppercase tracking-widest">
          Giá doanh nghiệp (B2B)
        </p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2 text-xs text-ink-muted font-medium">Số lượng</th>
            <th className="text-right px-4 py-2 text-xs text-ink-muted font-medium">Đơn giá</th>
            <th className="text-right px-4 py-2 text-xs text-ink-muted font-medium">Tiết kiệm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tiers.map((tier, i) => (
            <tr key={i} className={i === 0 ? "bg-brand-light" : ""}>
              <td className={`px-4 py-3 font-medium ${i === 0 ? "text-brand" : "text-ink"}`}>
                {tier.qty_label}
              </td>
              <td className={`px-4 py-3 text-right font-semibold ${i === 0 ? "text-brand" : "text-ink"}`}>
                {formatPrice(tier.price)}
              </td>
              <td className="px-4 py-3 text-right text-ink-muted">
                {tier.savings_percent > 0 ? `-${tier.savings_percent}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
