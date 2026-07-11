import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SmsLogsPage() {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) redirect("/admin");

  const logs = await prisma.incomingSmsLog.findMany({
    orderBy: { receivedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">SMS reçus</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Derniers {logs.length} SMS reçus via le webhook MoMo.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-left">
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Texte brut</th>
              <th className="pb-3 pr-4 font-medium">Montant</th>
              <th className="pb-3 pr-4 font-medium">Référence</th>
              <th className="pb-3 pr-4 font-medium">Matché</th>
              <th className="pb-3 font-medium">Commande</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="pt-8 text-center text-zinc-600">
                  Aucun SMS reçu pour le moment.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-zinc-800/50 text-zinc-300">
                <td className="py-3 pr-4 whitespace-nowrap text-xs text-zinc-500">
                  {new Date(log.receivedAt).toLocaleString("fr-FR")}
                </td>
                <td className="py-3 pr-4 max-w-xs truncate" title={log.rawText}>
                  {log.rawText}
                </td>
                <td className="py-3 pr-4">
                  {log.parsedAmount ? `${log.parsedAmount.toLocaleString("fr-FR")} FCFA` : "—"}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">{log.parsedRef || "—"}</td>
                <td className="py-3 pr-4">
                  {log.matched ? (
                    <span className="text-emerald-400 font-medium">Oui</span>
                  ) : (
                    <span className="text-zinc-600">Non</span>
                  )}
                </td>
                <td className="py-3 font-mono text-xs">
                  {log.orderId ? (
                    <a
                      href={`/admin/dashboard`}
                      className="text-amber-400 hover:underline"
                    >
                      {log.orderId.slice(0, 8)}...
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
