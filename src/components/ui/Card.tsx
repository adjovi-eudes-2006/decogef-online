"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glow = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden",
          hover && "hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300",
          glow && "shadow-lg shadow-gala-500/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
