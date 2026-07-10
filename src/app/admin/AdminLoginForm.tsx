"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (data.success) {
        router.refresh();
      } else {
        setError("Code PIN incorrect");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gala-500/20 text-gala-400 mb-6">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">
        Espace Organisateur
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Entrez le code PIN pour accéder au dashboard
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="Code PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          className="text-center text-2xl tracking-widest"
          error={error}
        />
        <Button type="submit" fullWidth isLoading={isLoading}>
          Accéder
        </Button>
      </form>
    </Card>
  );
}
