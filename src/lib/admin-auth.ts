import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

function getSecretToken(): string {
  const token = process.env.ADMIN_SECRET_TOKEN;
  if (!token) {
    throw new Error("ADMIN_SECRET_TOKEN n'est pas configuré dans les variables d'environnement");
  }
  return token;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(COOKIE_NAME)?.value;
  return stored === getSecretToken();
}

export async function verifyAdminSessionOrThrow(): Promise<void> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    throw new Error("Accès refusé : Session administrateur invalide ou expirée.");
  }
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getSecretToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
