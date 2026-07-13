import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/public/EventCard";
import { Footer } from "@/components/public/Footer";
import { HomeClient } from "@/components/public/HomeClient";
import type { EventData } from "@/types";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<EventData[]> {
  const events = await prisma.event.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    location: e.location,
    coverImage: e.coverImage,
    categories: e.categories.map((c) => ({
      id: c.id,
      eventId: c.eventId,
      name: c.name,
      price: c.price,
      soldQuantity: c.soldQuantity,
    })),
    createdAt: e.createdAt.toISOString(),
  }));
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen">
      <HomeClient />
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-4 leading-tight">
            Grand <span className="bg-gradient-to-r from-gala-400 to-gala-500 bg-clip-text text-transparent">Gala</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Billetterie officielle — Réservez vos places pour une soirée d&apos;exception
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Aucun événement disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
