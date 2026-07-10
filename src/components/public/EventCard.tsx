"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { EventData } from "@/types";

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const minPrice = Math.min(...event.categories.map((c) => c.price));

  return (
    <Link href={`/event/${event.id}`}>
      <Card hover className="group h-full cursor-pointer">
        <div className="relative h-52 overflow-hidden">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gala-900 to-zinc-900 flex items-center justify-center">
              <Ticket className="w-16 h-16 text-gala-500/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge variant="gold">{event.categories.length} catégorie{event.categories.length > 1 ? "s" : ""}</Badge>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <h3 className="font-display text-xl font-bold text-white group-hover:text-gala-400 transition-colors line-clamp-2">{event.title}</h3>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4 text-gala-400 flex-shrink-0" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="w-4 h-4 text-gala-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="pt-2 border-t border-zinc-800">
            <span className="text-gala-400 font-bold">À partir de {formatPrice(minPrice)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
