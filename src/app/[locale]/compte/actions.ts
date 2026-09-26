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
  return isLocale(typeof value === "string" ? value : undefined) ? value : "fr";
}

export async function signIn(formData: FormData) {
  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(localePath(locale, "/compte/connexion?error=missing"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(localePath(locale, `/compte/connexion?error=${encodeURIComponent(error.message)}`));
  }

  redirect(localePath(locale, "/compte"));
}

export async function signUp(formData: FormData) {
  const locale = readLocale(formData);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || password.length < 8) {
    redirect(localePath(locale, "/compte/inscription?error=invalid"));
  }

  const supabase = await createClient();
  const emailRedirectTo = new URL(
    localePath(locale, "/compte"),
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
    redirect(localePath(locale, `/compte/inscription?error=${encodeURIComponent(error.message)}`));
  }

  if (data.session) {
    redirect(localePath(locale, "/compte"));
  }

  redirect(localePath(locale, "/compte/connexion?status=confirmation"));
}

export async function signOut(formData: FormData) {
  const locale = readLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(localePath(locale, "/compte/connexion"));
}
