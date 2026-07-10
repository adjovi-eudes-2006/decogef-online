import "@/lib/env";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grand Gala — Billetterie Officielle",
  description: "Réservez vos tickets pour une soirée d'exception.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
