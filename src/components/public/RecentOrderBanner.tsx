"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";

export function RecentOrderBanner() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("last_gala_order_id");
    if (stored) setOrderId(stored);
  }, []);

  if (!orderId) return null;

  return (
    <div className="bg-gradient-to-r from-gala-900/80 to-gala-800/40 border-b border-gala-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gala-500/20 flex items-center justify-center flex-shrink-0">
            <Ticket className="w-4 h-4 text-gala-400" />
          </div>
          <p className="text-sm text-gala-200">
            Vous avez une commande en cours&nbsp;!
          </p>
        </div>
        <Link
          href={`/order-status/${orderId}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gala-600 text-white text-sm font-semibold hover:bg-gala-500 active:scale-95 transition-all flex-shrink-0"
        >
          Voir mon billet
        </Link>
      </div>
    </div>
  );
}
