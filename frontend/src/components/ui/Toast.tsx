"use client";
import { useToastStore } from "@/store/toast";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ICONS = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
  error:   <XCircleIcon className="w-5 h-5 text-brand" />,
  info:    <InformationCircleIcon className="w-5 h-5 text-ink-muted" />,
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 bg-white border border-border rounded-sm px-4 py-3 shadow-lg"
        >
          {ICONS[t.type]}
          <p className="flex-1 text-sm text-ink">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-ink-muted hover:text-ink">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
