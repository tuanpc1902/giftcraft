"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Review } from "@/types";

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
            star <= (hovered || value) ? "text-amber-400" : "text-gray-200"
          } ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ slug }: { slug: string }) {
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
      {/* Review list */}
      {loading ? (
        <div className="py-8 text-center text-gray-400 text-sm">Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {reviews.map(review => (
            <div key={review.id} className="py-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating value={review.rating} />
                    {review.is_verified_purchase && (
                      <span className="text-xs text-green-600 font-medium">✓ Đã mua hàng</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(review.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {review.title && (
                <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
              <button
                className="text-xs text-gray-400 hover:text-gray-600 mt-2 transition-colors"
                onClick={async () => {
                  await api.post(`/reviews/${review.id}/helpful`);
                }}
              >
                Hữu ích ({review.helpful_count})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Write review */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Viết đánh giá</h3>
        {!user ? (
          <p className="text-sm text-gray-500">
            <a href="/dang-nhap" className="text-amber-600 hover:underline font-medium">Đăng nhập</a> để viết đánh giá.
          </p>
        ) : submitted ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-700">
            Cảm ơn bạn đã đánh giá! Đánh giá đang chờ được duyệt.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xếp hạng</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề (tuỳ chọn)</label>
              <input
                className="input-field"
                placeholder="Tóm tắt nhận xét của bạn"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={body}
                onChange={e => setBody(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm px-6 disabled:opacity-40"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
