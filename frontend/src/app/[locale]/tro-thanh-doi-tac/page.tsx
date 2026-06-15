"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

interface FormState {
  company_name: string;
  tax_code: string;
  contact_name: string;
  phone: string;
  email: string;
  product_types: string;
  has_vat_invoice: boolean;
  min_order_quantity: string;
  description: string;
}

const init: FormState = {
  company_name: "",
  tax_code: "",
  contact_name: "",
  phone: "",
  email: "",
  product_types: "",
  has_vat_invoice: false,
  min_order_quantity: "",
  description: "",
};

function reducer(s: FormState, patch: Partial<FormState>) {
  return { ...s, ...patch };
}

export default function TroThanhDoiTacPage() {
  const t = useTranslations("supplier");
  const [form, dispatch] = useReducer(reducer, init);
  const set = (patch: Partial<FormState>) => dispatch(patch);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/supplier/apply", {
        ...form,
        min_order_quantity: form.min_order_quantity ? parseInt(form.min_order_quantity) : null,
      });
      setDone(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? t("errorFallback"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-ink mb-3">{t("successTitle")}</h2>
          <p className="text-ink-muted mb-8">{t("successMsg")}</p>
          <Link href="/" className="btn-primary px-8 py-3">{t("backHome")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">{t("title")}</h1>
        <p className="text-ink-muted text-lg max-w-xl mx-auto">{t("subtitle")}</p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {(["benefit1", "benefit2", "benefit3"] as const).map((key, i) => {
          const icons = ["📦", "💳", "🤝"];
          return (
            <div key={key} className="bg-surface-alt rounded-sm p-5 text-center">
              <div className="text-3xl mb-3">{icons[i]}</div>
              <h3 className="font-semibold text-ink mb-1">{t(`${key}Title`)}</h3>
              <p className="text-sm text-ink-muted">{t(`${key}Desc`)}</p>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
        <h2 className="text-xl font-bold text-ink mb-6">{t("formTitle")}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">{t("company")} <span className="text-brand">*</span></label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => set({ company_name: e.target.value })}
                placeholder={t("companyPlaceholder")}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">{t("taxCode")} <span className="text-brand">*</span></label>
              <input
                type="text"
                value={form.tax_code}
                onChange={e => set({ tax_code: e.target.value })}
                placeholder="0123456789"
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">{t("contact")} <span className="text-brand">*</span></label>
              <input
                type="text"
                value={form.contact_name}
                onChange={e => set({ contact_name: e.target.value })}
                placeholder={t("contactPlaceholder")}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">{t("phone")} <span className="text-brand">*</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set({ phone: e.target.value })}
                placeholder="0901 234 567"
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">{t("email")} <span className="text-brand">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={e => set({ email: e.target.value })}
              placeholder="contact@company.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">{t("productTypes")} <span className="text-brand">*</span></label>
            <textarea
              value={form.product_types}
              onChange={e => set({ product_types: e.target.value })}
              placeholder={t("productTypesPlaceholder")}
              required
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">{t("moq")}</label>
              <input
                type="number"
                min="1"
                value={form.min_order_quantity}
                onChange={e => set({ min_order_quantity: e.target.value })}
                placeholder="50"
                className="input-field"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="vat"
                checked={form.has_vat_invoice}
                onChange={e => set({ has_vat_invoice: e.target.checked })}
                className="w-4 h-4 rounded border-border accent-brand"
              />
              <label htmlFor="vat" className="text-sm font-medium text-ink">{t("vatInvoice")}</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">{t("description")}</label>
            <textarea
              value={form.description}
              onChange={e => set({ description: e.target.value })}
              placeholder={t("descPlaceholder")}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {error && (
            <div className="bg-brand-light text-brand text-sm px-4 py-3 rounded-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-50"
          >
            {submitting ? "..." : t("submitBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
