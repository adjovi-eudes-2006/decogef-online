import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
  };
}

export default async function EditEventPage({ params }: Props) {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) redirect("/admin");

  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <div className="text-center py-20">
      <h1 className="font-display text-2xl font-bold text-white mb-4">{event.title}</h1>
      <p className="text-zinc-400 mb-8">L&apos;édition d&apos;événement sera disponible dans une prochaine version.</p>
      <Link href="/admin/dashboard">
        <Button variant="secondary">Retour au dashboard</Button>
      </Link>
    </div>
  );
}
