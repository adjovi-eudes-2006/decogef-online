"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findOrdersByPhone } from "@/actions/tickets";
import { X, Search } from "lucide-react";

export function TicketLookup() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<{ id: string; eventTitle: string; status: string; totalAmount: number }[] | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOrders(null);

    const result = await findOrdersByPhone(phone);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.orders && result.orders.length > 0) {
      setOrders(result.orders);
    } else {
      setError("Aucune commande trouvée avec ce numéro.");
    }
  };

  const goToOrder = (id: string) => {
    setOpen(false);
    setPhone("");
    setOrders(null);
    router.push(`/order-status/${id}`);
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setOrders(null);
          setError("");
        }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-zinc-300 font-medium border border-zinc-700 hover:bg-zinc-800 hover:border-gala-500/50 transition-all active:scale-[0.98]"
      >
        <Search className="w-4 h-4" />
        Retrouver mon billet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-white">Retrouver mon billet</h2>
              <button
                onClick={() => { setOpen(false); setOrders(null); setError(""); }}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!orders ? (
              <form onSubmit={handleSearch} className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Entrez le numéro de téléphone que vous avez utilisé lors de l&apos;achat.
                </p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+229 61 23 45 67"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-600 focus:border-gala-500 focus:outline-none text-lg"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !phone.trim()}
                  className="w-full py-3 rounded-xl bg-gala-600 text-white font-bold text-base disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  {loading ? "Recherche..." : "Rechercher"}
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400">
                  {orders.length === 1 ? "1 commande trouvée :" : `${orders.length} commandes trouvées :`}
                </p>
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => goToOrder(order.id)}
                    className="w-full text-left p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-gala-500/50 transition-all active:scale-[0.98]"
                  >
                    <p className="text-white font-semibold text-sm truncate">{order.eventTitle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        order.status === "VALIDATED" ? "bg-emerald-500/20 text-emerald-400" :
                        order.status === "PENDING" ? "bg-gala-500/20 text-gala-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {order.status === "VALIDATED" ? "Validé" : order.status === "PENDING" ? "En attente" : "Rejeté"}
                      </span>
                      <span className="text-sm text-gala-400 font-bold">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(order.totalAmount)}
                      </span>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => { setOrders(null); setError(""); }}
                  className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Nouvelle recherche
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
