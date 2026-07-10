import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} Billetterie Gala — Tous droits réservés
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
        >
          <Lock className="w-3 h-3" />
          Accès Staff
        </Link>
      </div>
    </footer>
  );
}
