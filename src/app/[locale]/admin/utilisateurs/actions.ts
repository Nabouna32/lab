"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { isValidUuid, readFormString } from "@/lib/validation";

function readLocale(formData: FormData): Locale {
  const value = readFormString(formData, "locale");
  return value !== null && isLocale(value) ? value : "fr";
}

function readUserId(formData: FormData) {
  return readFormString(formData, "userId")?.trim() ?? "";
}

function readRole(formData: FormData) {
  const value = readFormString(formData, "roleKey");
  return value === "admin" || value === "super_admin" ? value : "";
}

async function updateSuspension(formData: FormData, action: "suspend" | "unsuspend") {
  const locale = readLocale(formData);
  const userId = readUserId(formData);

  if (!isValidUuid(userId)) {
    redirect(`/${locale}/admin/utilisateurs?error=invalid`);
  }

  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("admin-user-suspension", {
    body: { action, targetUserId: userId },
  });

  redirect(`/${locale}/admin/utilisateurs?status=${error ? "error" : action === "suspend" ? "suspended" : "unsuspended"}`);
}

export async function suspendUser(formData: FormData) {
  await updateSuspension(formData, "suspend");
}

export async function revokeUserSessions(formData: FormData) {
  const locale = readLocale(formData);
  const userId = readUserId(formData);
  if (!isValidUuid(userId)) redirect(`/${locale}/admin/utilisateurs?error=invalid`);
  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("admin-user-sessions", { body: { targetUserId: userId } });
  redirect(`/${locale}/admin/utilisateurs?status=${error ? "error" : "sessions-revoked"}`);
}

export async function unsuspendUser(formData: FormData) {
  await updateSuspension(formData, "unsuspend");
}

export async function assignAdminRole(formData: FormData) {
  const locale = readLocale(formData);
  const userId = readUserId(formData);
  const roleKey = readRole(formData);

  if (!isValidUuid(userId) || !roleKey) {
    redirect(`/${locale}/admin/utilisateurs?error=invalid`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("assign_admin_role", {
    target_user_id: userId,
    target_role_key: roleKey,
  });

  redirect(`/${locale}/admin/utilisateurs?status=${error ? "error" : "updated"}`);
}

export async function removeAdminRole(formData: FormData) {
  const locale = readLocale(formData);
  const userId = readUserId(formData);
  const roleKey = readRole(formData);

  if (!isValidUuid(userId) || !roleKey) {
    redirect(`/${locale}/admin/utilisateurs?error=invalid`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_admin_role", {
    target_user_id: userId,
    target_role_key: roleKey,
  });

  redirect(`/${locale}/admin/utilisateurs?status=${error ? "error" : "updated"}`);
}
