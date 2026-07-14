"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Printer, CheckCircle, Clock, AlertCircle, Calendar, MapPin, Shirt } from "lucide-react";
import { formatPrice, formatDateShort } from "@/lib/utils";

interface OrderStatusViewProps {
  order: {
    id: string;
    status: string;
    buyerName: string;
    totalAmount: number;
    tickets: { id: string; categoryName: string; secureToken: string; isUsed: boolean }[];
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
  };
}

function CornerOrnaments() {
  return (
    <>
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/60 rounded-tl" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/60 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/60 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500/60 rounded-br" />
    </>
  );
}

function TicketCard({
  ticket,
  index,
  total,
  order,
  canvasRefs,
}: {
  ticket: { id: string; categoryName: string; secureToken: string; isUsed: boolean };
  index: number;
  total: number;
  order: OrderStatusViewProps["order"];
  canvasRefs: React.MutableRefObject<Record<string, HTMLCanvasElement | null>>;
}) {
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRefs.current[ticket.id];
    if (canvas) {
      QRCode.toCanvas(canvas, ticket.secureToken, {
        width: 160,
        margin: 2,
        color: { dark: "#09090b", light: "#ffffff" },
      });
    }
  }, [ticket.id, ticket.secureToken, canvasRefs]);

  return (
    <div ref={ticketRef} className="print-area">
      <div className="relative bg-zinc-950 border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.08)]">
        <CornerOrnaments />

        <div className="flex min-h-[260px]">
          {/* LEFT SECTION */}
          <div className="flex-1 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400 blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
              <p className="font-display text-amber-400/60 text-xs tracking-[0.4em] uppercase mb-2">
                {ticket.isUsed ? "UTILISÉ" : "INVITATION"}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight tracking-wide">
                {order.eventTitle}
              </h2>
              <p className="text-amber-400/80 text-sm font-display italic mt-1">{ticket.categoryName}</p>

              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-5" />

              <div className="space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">Date</p>
                    <p className="text-zinc-200 text-sm font-medium">{formatDateShort(order.eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">Lieu</p>
                    <p className="text-zinc-200 text-sm font-medium">{order.eventLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Shirt className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">Dress Code</p>
                    <p className="text-zinc-200 text-sm font-medium">Tenue de soirée</p>
                  </div>
                </div>
              </div>

              <p className="text-amber-400/40 italic text-xs mt-5 font-display">
                &ldquo;Une soirée d&apos;exception vous attend&rdquo;
              </p>
            </div>
          </div>

          {/* PERFORATED DIVIDER */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 flex flex-col items-center justify-center px-1">
              <div className="w-px h-full bg-gradient-to-b from-amber-500/60 via-amber-500/40 to-amber-500/60"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, #D4AF37 0px, #D4AF37 2px, transparent 2px, transparent 10px)`,
                }}
              />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 -mt-2 w-3 h-3 rounded-full bg-zinc-950 border border-amber-500/40" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 -mb-2 w-3 h-3 rounded-full bg-zinc-950 border border-amber-500/40" />
          </div>

          {/* RIGHT SECTION */}
          <div className="w-36 sm:w-44 p-4 sm:p-6 flex flex-col items-center justify-center flex-shrink-0 bg-zinc-900/50">
            <div className="bg-white rounded-xl p-1.5 shadow-lg">
              <canvas
                ref={(el) => { canvasRefs.current[ticket.id] = el; }}
                className="block w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
              />
            </div>
            <p className="text-[10px] text-amber-500/70 font-mono mt-3 tracking-wider">
              N° {ticket.secureToken.slice(0, 8).toUpperCase()}
            </p>
            <div className={`mt-3 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              ticket.isUsed ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ticket.isUsed ? "bg-red-400" : "bg-emerald-400"}`} />
              {ticket.isUsed ? "Utilisé" : "Valide"}
            </div>
          </div>
        </div>

        {/* Used watermark */}
        {ticket.isUsed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-7xl sm:text-8xl font-black text-red-500/10 rotate-[-25deg] font-display tracking-widest">
              UTILISÉ
            </p>
          </div>
        )}
      </div>

      {total > 1 && (
        <p className="text-center text-zinc-700 text-xs mt-2">
          Ticket {index + 1} sur {total}
        </p>
      )}
    </div>
  );
}

export function OrderStatusView({ order }: OrderStatusViewProps) {
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const hasRunRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("last_gala_order_id", order.id);
  }, [order.id]);

  if (order.status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
        <Card className="p-10 max-w-lg w-full text-center border-zinc-800 bg-zinc-900">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 mb-6 animate-pulse-slow">
            <Clock className="w-10 h-10" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Paiement en attente de vérification</h1>
          <p className="text-zinc-400 mb-2">Merci {order.buyerName} ! Votre commande est en cours de traitement.</p>
          <p className="text-zinc-500 text-sm mb-6">Notre équipe vérifie manuellement votre transfert MTN MoMo.</p>
          <div className="animate-blink inline-flex items-center gap-3 text-sm bg-zinc-800 rounded-xl px-5 py-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-zinc-300">Vérification en cours...</span>
          </div>
          <Button variant="secondary" fullWidth onClick={() => window.location.reload()}>
            Rafraîchir le statut
          </Button>
        </Card>
      </div>
    );
  }

  if (order.status === "VALIDATED") {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-10 px-4 bg-zinc-950 min-h-screen">
        <div className="text-center space-y-3 no-print">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Paiement confirmé !</h1>
          <p className="text-zinc-400">{order.tickets.length} ticket{order.tickets.length > 1 ? "s" : ""} pour {order.buyerName}</p>
        </div>

        <Card className="p-6 no-print border-zinc-800 bg-zinc-900/80">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-zinc-400 text-sm">Total payé</p>
              <p className="text-2xl font-bold text-amber-400">{formatPrice(order.totalAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-sm">Statut</p>
              <p className="text-emerald-400 font-semibold">Validé</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {order.tickets.map((ticket, idx) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              index={idx}
              total={order.tickets.length}
              order={order}
              canvasRefs={canvasRefs}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 no-print pt-4">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Télécharger / Imprimer
          </Button>
        </div>

        <p className="text-center text-zinc-700 text-xs no-print pb-8">
          Présentez ce billet (numérique ou imprimé) au contrôle d&apos;accès.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
      <Card className="p-10 max-w-lg w-full text-center border-zinc-800 bg-zinc-900">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-400 mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-3">Paiement rejeté</h1>
        <p className="text-zinc-400 mb-6">Votre commande a été rejetée. La référence MTN MoMo fournie est incorrecte.</p>
        <p className="text-zinc-500 text-sm">Veuillez réessayer ou contacter l&apos;organisateur.</p>
      </Card>
    </div>
  );
}
