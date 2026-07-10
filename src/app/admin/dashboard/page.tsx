import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDashboardData } from "@/actions/admin";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) redirect("/admin");

  const data = await getDashboardData();
  if (!data) redirect("/admin");

  return <DashboardContent data={data} />;
}
