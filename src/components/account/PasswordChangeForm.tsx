"use client";

import { useState } from "react";
import { changePassword } from "@/app/[locale]/compte/actions";
import { MaterialTextField } from "@/components/ui/MaterialTextField";
import SubmitButton from "@/components/account/SubmitButton";
import type { Messages } from "@/lib/i18n/messages";

export default function PasswordChangeForm({ locale, t, serverError }: { locale: string; t: Messages["account"]; serverError?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentEdited, setCurrentEdited] = useState(false);
  const minOk = password.length >= 8;
  const currentOk = currentPassword.length > 0;
  const confirmationMismatch = confirmation.length > 0 && password !== confirmation;
  const matchOk = confirmation.length > 0 && password === confirmation;
  const valid = currentOk && minOk && password.length <= 128 && matchOk;

  return (
    <form action={changePassword} className="mt-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-[var(--space-5)]">
        <MaterialTextField id="current-password" name="currentPassword" label={t.currentPassword} type="password"
          value={currentPassword} onChange={(value) => { setCurrentPassword(value); setCurrentEdited(true); }}
          autoComplete="current-password" required
          error={serverError === "current-password" && !currentEdited ? t.currentPasswordError : undefined} />
        <MaterialTextField id="new-password" name="password" label={t.password} type="password"
          value={password} onChange={setPassword} autoComplete="new-password" minLength={8} maxLength={128} required
          supportingText={!minOk && password.length > 0 ? undefined : t.passwordRuleMin}
          error={password.length > 0 && !minOk ? t.passwordRuleMin : undefined} />
        <MaterialTextField id="password-confirmation" name="passwordConfirmation" label={t.passwordConfirmation} type="password"
          value={confirmation} onChange={setConfirmation} autoComplete="new-password" minLength={8} maxLength={128} required
          error={confirmationMismatch ? t.passwordRuleMatch : undefined} />
        {serverError === "weak-password" ? <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">{t.weakPassword}</p> : null}
        {serverError && !["weak-password", "current-password"].includes(serverError) ? <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">{t.passwordError}</p> : null}
        <SubmitButton pendingLabel={t.changePassword} disabled={!valid} className="w-full">{t.changePassword}</SubmitButton>
      </div>
    </form>
  );
}
