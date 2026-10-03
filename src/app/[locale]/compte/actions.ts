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
  return value !== null && isLocale(value) ? value : "en";
}

function isRateLimited(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && error.status === 429;
}

function isWeakPassword(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "weak_password";
}

function redirectAuthError(locale: Locale, path: string, error: unknown, fallback: string) {
  const code = isRateLimited(error) ? "rate-limited" : fallback;
  redirect(localePath(locale, `${path}?error=${code}`));
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return { supabase, user: null };
  return { supabase, user: data.user };
}

function authRedirect(locale: Locale, next: string) {
  return new URL(
    localePath(locale, "/auth/callback?next=" + encodeURIComponent(next)),
    getSiteUrl(),
  ).toString();
}

export async function signIn(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";
  const password = readFormString(formData, "password") ?? "";

  if (!isValidEmail(email) || !isValidLength(password, 1, 128)) {
    redirect(localePath(locale, "/compte/connexion?error=invalid"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectAuthError(locale, "/compte/connexion", error, "auth-failed");
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
  const emailRedirectTo = authRedirect(locale, `/${locale}/compte`);

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
    redirectAuthError(locale, "/compte/inscription", error, isWeakPassword(error) ? "weak-password" : "auth-failed");
  }

  if (data.session) {
    redirect(localePath(locale, "/compte"));
  }

  redirect(localePath(locale, "/compte/connexion?status=confirmation"));
}

export async function resendConfirmation(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";

  if (!isValidEmail(email)) {
    redirect(localePath(locale, "/compte/connexion?error=invalid"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: authRedirect(locale, `/${locale}/compte`) },
  });

  if (error) {
    redirect(localePath(locale, `/compte/connexion?error=${isRateLimited(error) ? "rate-limited" : "confirmation-send"}`));
  }

  redirect(localePath(locale, "/compte/connexion?status=confirmation-sent"));
}

export async function requestPasswordReset(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";

  if (!isValidEmail(email)) {
    redirect(localePath(locale, "/compte/mot-de-passe-oublie?error=invalid"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authRedirect(locale, `/${locale}/compte/mot-de-passe/reinitialiser`),
  });

  if (error && !isRateLimited(error)) {
    redirect(localePath(locale, "/compte/mot-de-passe-oublie?error=send"));
  }

  redirect(localePath(locale, `/compte/mot-de-passe-oublie?status=${isRateLimited(error) ? "rate-limited" : "sent"}`));
}

export async function resetPassword(formData: FormData) {
  const locale = readLocale(formData);
  const password = readFormString(formData, "password") ?? "";
  const confirmation = readFormString(formData, "passwordConfirmation") ?? "";

  if (!isValidLength(password, 8, 128) || password !== confirmation) {
    redirect(localePath(locale, "/compte/mot-de-passe/reinitialiser?error=invalid"));
  }

  const { supabase, user } = await requireUser();
  if (!user) {
    redirect(localePath(locale, "/compte/connexion?error=auth-callback"));
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(localePath(locale, `/compte/mot-de-passe/reinitialiser?error=${isWeakPassword(error) ? "weak-password" : "update"}`));
  }

  await supabase.auth.signOut({ scope: "local" });
  redirect(localePath(locale, "/compte/connexion?status=password-reset"));
}

export async function changePassword(formData: FormData) {
  const locale = readLocale(formData);
  const currentPassword = readFormString(formData, "currentPassword") ?? "";
  const password = readFormString(formData, "password") ?? "";
  const confirmation = readFormString(formData, "passwordConfirmation") ?? "";

  if (
    !isValidLength(currentPassword, 1, 128) ||
    !isValidLength(password, 8, 128) ||
    password !== confirmation
  ) {
    redirect(localePath(locale, "/compte/mot-de-passe?error=invalid"));
  }

  const { supabase, user } = await requireUser();
  if (!user) redirect(localePath(locale, "/compte/connexion"));

  const { error } = await supabase.auth.updateUser({
    password,
    current_password: currentPassword,
  });

  if (error) {
    redirect(localePath(locale, `/compte/mot-de-passe?error=${isWeakPassword(error) ? "weak-password" : "current-password"}`));
  }

  redirect(localePath(locale, "/compte?status=password-changed"));
}

export async function updateProfile(formData: FormData) {
  const locale = readLocale(formData);
  const displayName = readFormString(formData, "displayName")?.trim() ?? "";
  const preferredLocale = readFormString(formData, "preferredLocale");

  if (
    displayName.length > 80 ||
    !preferredLocale ||
    !isLocale(preferredLocale)
  ) {
    redirect(localePath(locale, "/compte?error=profile"));
  }

  const { supabase, user } = await requireUser();
  if (!user) redirect(localePath(locale, "/compte/connexion"));

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      locale: preferredLocale,
    })
    .eq("id", user.id);

  if (error) {
    redirect(localePath(locale, "/compte?error=profile"));
  }

  redirect(localePath(preferredLocale, "/compte?status=profile-updated"));
}

export async function changeEmail(formData: FormData) {
  const locale = readLocale(formData);
  const email = readFormString(formData, "email")?.trim() ?? "";

  if (!isValidEmail(email)) {
    redirect(localePath(locale, "/compte/email?error=invalid"));
  }

  const { supabase, user } = await requireUser();
  if (!user) redirect(localePath(locale, "/compte/connexion"));

  if (user.email?.toLowerCase() === email.toLowerCase()) {
    redirect(localePath(locale, "/compte/email?error=same"));
  }

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: authRedirect(locale, `/${locale}/compte?status=email-updated`) },
  );

  if (error) {
    redirect(localePath(locale, `/compte/email?error=${isRateLimited(error) ? "rate-limited" : "update"}`));
  }

  redirect(localePath(locale, "/compte/email?status=confirmation"));
}

export async function deleteAccount(formData: FormData) {
  const locale = readLocale(formData);
  const confirmation = readFormString(formData, "confirmation") ?? "";

  if (confirmation !== "DELETE") {
    redirect(localePath(locale, "/compte/suppression?error=confirmation"));
  }

  const { supabase, user } = await requireUser();
  if (!user) redirect(localePath(locale, "/compte/connexion"));

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    redirect(localePath(locale, "/compte/suppression?error=session"));
  }

  const { data, error } = await supabase.functions.invoke("account-delete", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error || data?.ok !== true) {
    const errorCode = data?.error === "LAST_SUPER_ADMIN" ? "last-super-admin" : "delete";
    redirect(localePath(locale, `/compte/suppression?error=${errorCode}`));
  }

  await supabase.auth.signOut({ scope: "global" });
  redirect(localePath(locale, "/compte?status=deleted"));
}

export async function signOut(formData: FormData) {
  const locale = readLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect(localePath(locale, "/compte/connexion"));
}
