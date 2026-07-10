"use server";

import { revalidatePath } from "next/cache";
import {
  verifyAdminSessionOrThrow,
  createAdminSession,
  destroyAdminSession,
} from "@/lib/admin-auth";

export async function loginAdmin(
  pin: string
): Promise<{ success: boolean; error?: string }> {
  const secretToken = process.env.ADMIN_SECRET_TOKEN || "";

  if (pin !== secretToken) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: false, error: "Code PIN incorrect" };
  }

  await createAdminSession();
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  revalidatePath("/admin");
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    await verifyAdminSessionOrThrow();
    return true;
  } catch {
    return false;
  }
}
