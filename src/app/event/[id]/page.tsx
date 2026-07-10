import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventPageClient } from "./EventPageClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { categories: true },
  });
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    location: event.location,
    coverImage: event.coverImage,
    categories: event.categories.map((c) => ({
      id: c.id,
      eventId: c.eventId,
      name: c.name,
      price: c.price,
      maxQuantity: c.maxQuantity,
      soldQuantity: c.soldQuantity,
    })),
  };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return <EventPageClient event={event} />;
}
