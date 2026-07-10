import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) redirect("/admin");

  return <EventForm />;
}
