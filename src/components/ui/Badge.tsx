"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "gold";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300",
  success: "bg-emerald-500/20 text-emerald-400",
  danger: "bg-red-500/20 text-red-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  gold: "bg-gala-500/20 text-gala-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
