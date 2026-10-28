"use client";

import { useState } from "react";
import { changePassword } from "@/app/[locale]/compte/actions";
import { TextField } from "@/components/ui/TextField";
import SubmitButton from "@/components/account/SubmitButton";
import type { Messages } from "@/lib/i18n/messages";

export default function PasswordChangeForm({ locale, t, serverError }: { locale: string; t: Messages["account"]; serverError?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [currentEdited, setCurrentEdited] = useState(false);
  const minOk = password.length >= 8;
  const maxOk = password.length <= 128;
  const currentOk = currentPassword.length > 0;
  const confirmationMismatch = confirmation.length > 0 && password !== confirmation;
  const matchOk = confirmation.length > 0 && password === confirmation;
  const valid = currentOk && minOk && maxOk && matchOk;

  return (
    <form action={changePassword} className="mt-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-[var(--space-5)]">
        <div className="grid gap-2">
          <TextField
            label={t.currentPassword}
            inputId="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setCurrentEdited(true);
            }}
            aria-invalid={serverError === "current-password" && !currentEdited ? true : undefined}
            aria-describedby={serverError === "current-password" && !currentEdited ? "current-password-error" : undefined}
          />
          {serverError === "current-password" && !currentEdited ? (
            <p id="current-password-error" className="m3-type-body-small text-[var(--on-error-container)]" role="alert">
              {t.currentPasswordError}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <TextField
            label={t.password}
            inputId="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={password.length > 0 && !minOk ? true : undefined}
            aria-describedby="password-hint"
          />
          <p
            id="password-hint"
            className={"m3-type-body-small " + (password.length > 0 && !minOk ? "text-[var(--error)]" : "text-[var(--on-surface-variant)]")}
            aria-live="polite"
          >
            {t.passwordRuleMin}
          </p>
        </div>

        <div className="grid gap-2">
          <TextField
            label={t.passwordConfirmation}
            inputId="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            aria-invalid={confirmationMismatch ? true : undefined}
            aria-describedby={confirmationMismatch ? "confirmation-error" : undefined}
          />
          {confirmationMismatch ? (
            <p id="confirmation-error" className="m3-type-body-small text-[var(--error)]" aria-live="polite">
              {t.passwordRuleMatch}
            </p>
          ) : null}
        </div>

        {serverError === "weak-password" ? (
          <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">
            {t.weakPassword}
          </p>
        ) : null}
        {serverError && !["weak-password", "current-password"].includes(serverError) ? (
          <p className="rounded-[var(--shape-corner-medium)] bg-[var(--error-container)] px-4 py-3 m3-type-body-medium text-[var(--on-error-container)]" role="alert">
            {t.passwordError}
          </p>
        ) : null}

        <SubmitButton pendingLabel={t.changePassword} disabled={!valid} className="w-full">
          {t.changePassword}
        </SubmitButton>
      </div>
    </form>
  );
}
