import React from "react";

type BadgeVariant = "default" | "brand" | "success" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "bg-surface-alt text-ink",
  brand:   "bg-brand-light text-brand",
  success: "bg-green-100 text-green-700",
  muted:   "bg-border text-ink-muted",
};

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span className={`badge ${VARIANT_CLASS[variant]} ${className}`}>
      {children}
    </span>
  );
}
