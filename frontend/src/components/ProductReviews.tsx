"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Review, ReviewsSummary } from "@/types";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-2xl transition-colors ${
            star <= (hovered || value) ? "text-amber-400" : "text-border"
          } ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ slug, summary }: { slug: string; summary?: ReviewsSummary | null }) {
  const { user, init } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    api.get(`/products/${slug}/reviews`)
      .then(r => setReviews(r.data.data?.items ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/products/${slug}/reviews`, { rating, title, body });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      {summary && summary.total_count > 0 && (
        <div className="flex items-center gap-6 pb-6 border-b border-border">
          <div className="text-center">
            <p className="text-4xl font-bold text-ink">{summary.average_rating.toFixed(1)}</p>
            <StarRating value={Math.round(summary.average_rating)} />
            <p className="text-xs text-ink-muted mt-1">{summary.total_count} đánh giá</p>
          </div>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="py-8 text-center text-ink-muted text-sm">Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-ink-muted text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</div>
      ) : (
        <div className="divide-y divide-border">
          {reviews.map(review => (
            <div key={review.id} className="py-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-ink text-sm">{review.user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating value={review.rating} />
                    {review.is_verified_purchase && (
                      <span className="text-xs text-green-600 font-medium">✓ Đã mua hàng</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-ink-muted shrink-0">
                  {new Date(review.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {review.title && (
                <p className="font-semibold text-ink text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-ink-muted leading-relaxed">{review.body}</p>
              <button
                className="text-xs text-ink-muted hover:text-ink mt-2 transition-colors"
                onClick={() => api.post(`/reviews/${review.id}/helpful`)}
              >
                Hữu ích ({review.helpful_count})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Write review */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-ink mb-4">Viết đánh giá</h3>
        {!user ? (
          <p className="text-sm text-ink-muted">
            <a href="/dang-nhap" className="text-brand hover:underline font-medium">Đăng nhập</a> để viết đánh giá.
          </p>
        ) : submitted ? (
          <div className="bg-green-50 border border-green-100 rounded-sm p-4 text-sm text-green-700">
            Cảm ơn bạn đã đánh giá! Đánh giá đang chờ được duyệt.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Xếp hạng</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Tiêu đề (tuỳ chọn)</label>
              <Input placeholder="Tóm tắt nhận xét của bạn" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Nhận xét</label>
              <Textarea
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={body}
                onChange={e => setBody(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
              />
            </div>
            {error && <p className="text-sm text-brand">{error}</p>}
            <Button type="submit" loading={submitting}>Gửi đánh giá</Button>
          </form>
        )}
      </div>
    </div>
  );
}
