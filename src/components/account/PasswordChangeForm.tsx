"use client";

import { useState } from "react";
import { changePassword } from "@/app/[locale]/compte/actions";
import { TextField } from "@/components/ui/TextField";
import SubmitButton from "@/components/account/SubmitButton";
import type { Messages } from "@/lib/i18n/messages";

function Rule({ valid, label }: { valid: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 m3-type-body-small" data-valid={valid ? "true" : "false"}>
      <span aria-hidden="true" className={"grid size-5 shrink-0 place-items-center rounded-full text-xs font-bold " + (valid ? "bg-[var(--success-soft)] text-[var(--success-foreground)]" : "bg-[var(--error-container)] text-[var(--on-error-container)]")}>{valid ? "✓" : "×"}</span>
      <span className={valid ? "text-[var(--success-foreground)]" : "text-[var(--on-surface-variant)]"}>{label}</span>
    </li>
  );
}

export default function PasswordChangeForm({ locale, t, serverError }: { locale: string; t: Messages; serverError?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentEdited, setCurrentEdited] = useState(false);
  const minOk = password.length >= 8;
  const maxOk = password.length <= 128;
  const matchOk = confirmation.length > 0 && password === confirmation;
  const currentOk = currentPassword.length > 0;
  const valid = currentOk && minOk && maxOk && matchOk;

  return (
    <form action={changePassword} className="mt-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-[var(--space-5)]">
        <div className="grid gap-2">
          <TextField label={t.account.currentPassword} inputId="current-password" name="currentPassword" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => { setCurrentPassword(event.target.value); setCurrentEdited(true); }} aria-invalid={serverError === "current-password" && !currentEdited ? true : undefined} aria-describedby={serverError === "current-password" && !currentEdited ? "current-password-error" : undefined} />
          {serverError === "current-password" && !currentEdited ? <p id="current-password-error" className="m3-type-body-small text-[var(--on-error-container)]" role="alert">{t.account.currentPasswordError}</p> : null}
          {!currentOk ? <p className="m3-type-body-small text-[var(--on-surface-variant)]">{t.account.passwordRuleRequired}</p> : null}
        </div>
        <div className="grid gap-3">
          <TextField label={t.account.password} inputId="new-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={password.length > 0 && (!minOk || !maxOk) ? true : undefined} aria-describedby="password-rules" />
          <ul id="password-rules" className="grid gap-2" aria-live="polite">
            <Rule valid={minOk} label={t.account.passwordRuleMin} />
            <Rule valid={password.length > 0 && maxOk} label={t.account.passwordRuleMax} />
          </ul>
        </div>
        <div className="grid gap-3">
          <TextField label={t.account.passwordConfirmation} inputId="password-confirmation" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} aria-invalid={confirmation.length > 0 && !matchOk ? true : undefined} aria-describedby="confirmation-rule" />
          <ul id="confirmation-rule" aria-live="polite"><Rule valid={matchOk} label={t.account.passwordRuleMatch} /></ul>
        </div>
        {serverError === "weak-password" ? <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">{t.account.weakPassword}</p> : null}
        {serverError && !["weak-password", "current-password"].includes(serverError) ? <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">{t.account.passwordError}</p> : null}
        <p className="m3-type-body-small text-[var(--on-surface-variant)]">{t.account.passwordStrengthNote}</p>
        <SubmitButton pendingLabel={t.account.changePassword} disabled={!valid} className="w-full">{t.account.changePassword}</SubmitButton>
      </div>
    </form>
  );
}
