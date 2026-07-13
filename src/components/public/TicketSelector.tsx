"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { TicketCategoryData } from "@/types";

interface TicketSelectorProps {
  eventId: string;
  categories: TicketCategoryData[];
}

export function TicketSelector({ eventId, categories }: TicketSelectorProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const total = categories.reduce((sum, cat) => {
    const qty = quantities[cat.id] || 0;
    return sum + cat.price * qty;
  }, 0);

  const hasSelection = Object.values(quantities).some((q) => q > 0);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(0, Math.min(current + delta, 99)) };
    });
  };

  const handleContinue = () => {
    const params = new URLSearchParams();
    for (const cat of categories) {
      const qty = quantities[cat.id] || 0;
      if (qty > 0) params.append("items", `${cat.id}:${qty}`);
    }
    router.push(`/checkout/${eventId}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const qty = quantities[cat.id] || 0;

        return (
          <div key={cat.id} className={`bg-zinc-900/60 border ${qty > 0 ? "border-gala-500/40" : "border-zinc-800"} rounded-xl p-5 transition-all duration-200`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                <p className="text-2xl font-bold text-gala-400 mt-1">{formatPrice(cat.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(cat.id, -1)} disabled={qty === 0} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 disabled:opacity-30 transition-all">
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="w-8 text-center font-bold text-lg text-white">{qty}</span>
                <button onClick={() => updateQuantity(cat.id, 1)} disabled={qty >= 99} className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 disabled:opacity-30 transition-all">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {hasSelection && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-lg text-zinc-300">Total</span>
            <span className="text-2xl font-bold text-gala-400">{formatPrice(total)}</span>
          </div>
          <Button fullWidth variant="gold" onClick={handleContinue}>
            <ShoppingCart className="w-4 h-4" /> Commander
          </Button>
        </div>
      )}
    </div>
  );
}
