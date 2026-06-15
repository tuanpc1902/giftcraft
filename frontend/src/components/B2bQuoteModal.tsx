"use client";
import { useState } from "react";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToastStore } from "@/store/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function B2bQuoteModal({ open, onClose, productName }: Props) {
  const { add: addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
    email: "",
    occasion: "",
    quantity_requested: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    custom_requirements: productName ? `Sản phẩm: ${productName}\n` : "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/b2b/quotes", {
        ...form,
        quantity_requested: Number(form.quantity_requested),
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
      });
      addToast("Yêu cầu đã được gửi! Chúng tôi sẽ liên hệ trong 24h.", "success");
      onClose();
    } catch {
      addToast("Gửi thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Báo giá B2B / Yêu cầu tùy chỉnh" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Tên công ty *" required value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
          <Input placeholder="Người liên hệ *" required value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Số điện thoại *" required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <Input placeholder="Email *" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Số lượng cần *" required type="number" min="20" value={form.quantity_requested} onChange={(e) => set("quantity_requested", e.target.value)} />
          <Input placeholder="Deadline (nếu có)" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Ngân sách tối thiểu" type="number" value={form.budget_min} onChange={(e) => set("budget_min", e.target.value)} />
          <Input placeholder="Ngân sách tối đa" type="number" value={form.budget_max} onChange={(e) => set("budget_max", e.target.value)} />
        </div>
        <Textarea
          placeholder="Yêu cầu tùy chỉnh (in logo, màu sắc, thiết kế...)"
          rows={4}
          value={form.custom_requirements}
          onChange={(e) => set("custom_requirements", e.target.value)}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">Gửi yêu cầu</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
        </div>
      </form>
    </Modal>
  );
}
