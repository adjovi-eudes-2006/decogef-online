import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { QRScanner } from "@/components/admin/QRScanner";

export default async function ScanPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) redirect("/admin");

  return <QRScanner />;
}
