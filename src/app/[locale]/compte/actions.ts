"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { isLocale, type Locale } from "@/lib/i18n/config";

function localePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

function readLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  const candidate = typeof value === "string" ? value : undefined;
  return isLocale(candidate) ? candidate : "fr";
}

function isRateLimited(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && error.status === 429;
}

export async function signIn(formData: FormData) {
  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || email.length > 254 || !password || password.length > 128) {
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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 80);

  if (!email || email.length > 254 || password.length < 8 || password.length > 128) {
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
