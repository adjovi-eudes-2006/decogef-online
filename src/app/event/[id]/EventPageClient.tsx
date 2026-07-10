"use client";

import Link from "next/link";
import { TicketSelector } from "@/components/public/TicketSelector";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TicketCategoryData } from "@/types";

interface EventPageClientProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    coverImage: string;
    categories: TicketCategoryData[];
  };
}

export function EventPageClient({ event }: EventPageClientProps) {
  return (
    <main className="min-h-screen">
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gala-900 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-3">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gala-400" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gala-400" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-gala-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-white mb-4">À propos</h2>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-display text-xl font-bold text-white mb-6">Choisissez vos tickets</h2>
            <TicketSelector eventId={event.id} categories={event.categories} />
          </div>
        </div>
      </section>
    </main>
  );
}
