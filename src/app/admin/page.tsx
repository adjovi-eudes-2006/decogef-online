"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, Ticket } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await loginAdmin(pin);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Code PIN incorrect");
    }
  };

  return (
    <Card className="p-8 w-full max-w-md text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gala-500/20 text-gala-400 mb-6">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">Espace Organisateur</h1>
      <p className="text-zinc-400 text-sm mb-8">Entrez le code PIN pour accéder au dashboard</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="Code PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
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
