const requiredVars = ["DATABASE_URL", "ADMIN_SECRET_TOKEN", "SMS_WEBHOOK_SECRET"] as const;

let validated = false;

function validateEnv(): void {
  if (validated) return;
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];

  for (const key of requiredVars) {
    if (!process.env[key] || process.env[key]!.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const message = `VARIABLES D'ENVIRONNEMENT MANQUANTES EN PRODUCTION : ${missing.join(", ")}. L'application va s'arrêter pour éviter tout comportement imprévisible.`;
    console.error(message);
    throw new Error(message);
  }

  validated = true;
  console.log("Toutes les variables d'environnement de production sont présentes.");
}

validateEnv();

export {};
