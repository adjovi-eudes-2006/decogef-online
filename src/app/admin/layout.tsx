import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        {children}
      </div>
    );
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
