"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  isValidEmail,
  isValidLength,
  readFormString,
} from "@/lib/validation";

function localePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

function readLocale(formData: FormData): Locale {
  const value = readFormString(formData, "locale");
  return value !== null && isLocale(value) ? value : "fr";
}

function isRateLimited(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && error.status === 429;
}

export async function signIn(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";
  const password = readFormString(formData, "password") ?? "";

  if (!isValidEmail(email) || !isValidLength(password, 1, 128)) {
    redirect(localePath(locale, "/compte/connexion?error=missing"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorCode = isRateLimited(error) ? "rate-limited" : "auth-failed";
    redirect(localePath(locale, `/compte/connexion?error=${errorCode}`));
  }

  redirect(localePath(locale, "/compte"));
}

export async function signUp(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";
  const password = readFormString(formData, "password") ?? "";
  const displayName = readFormString(formData, "displayName")?.trim() ?? "";

  if (!isValidEmail(email) || !isValidLength(password, 8, 128) || displayName.length > 80) {
    redirect(localePath(locale, "/compte/inscription?error=invalid"));
  }

  const supabase = await createClient();
  const emailRedirectTo = new URL(
    localePath(
      locale,
      "/auth/callback?next=" + encodeURIComponent("/" + locale + "/compte"),
    ),
    getSiteUrl(),
  ).toString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        display_name: displayName || null,
      },
    },
  });

  if (error) {
    const errorCode = isRateLimited(error) ? "rate-limited" : "auth-failed";
    redirect(localePath(locale, `/compte/inscription?error=${errorCode}`));
  }

  if (data.session) {
    redirect(localePath(locale, "/compte"));
  }

  redirect(localePath(locale, "/compte/connexion?status=confirmation"));
}

export async function signOut(formData: FormData) {
  const locale = readLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect(localePath(locale, "/compte/connexion"));
}
