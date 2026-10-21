"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { calculateExpenseSettlement, type SharedExpense } from "@/lib/expense-splitter";

type Participant = { id: string; name: string };
type Currency = "EUR" | "USD" | "GBP" | "CHF" | "CAD";

const initialParticipants: Participant[] = [
  { id: "person-1", name: "Alex" },
  { id: "person-2", name: "Sam" },
];

const copy = {
  fr: {
    intro: "Notez les dépenses du groupe, et découvrez qui rembourse qui. Tous les frais sont partagés à parts égales entre les participants.",
    people: "Participants", addPerson: "Ajouter une personne", personName: "Nom", removePerson: "Retirer",
    expenses: "Dépenses", expenseName: "Ex. : courses, hôtel, restaurant", amount: "Montant", payer: "Payé par",
    addExpense: "Ajouter la dépense", noExpenses: "Ajoutez les dépenses déjà payées par le groupe pour calculer les remboursements.",
    total: "Total des dépenses", perPerson: "Part par personne", balances: "Bilan par personne", paid: "A payé", owes: "Sa part", getsBack: "À recevoir", owesOthers: "À rembourser", settled: "Tout le monde est quitte.", transfers: "Remboursements à effectuer", from: "doit payer", to: "à", removeExpense: "Supprimer la dépense",
    needTwo: "Ajoutez au moins deux participants.", invalidExpense: "Saisissez un libellé et un montant positif valide.", payerHasExpenses: "Supprimez d’abord les dépenses payées par cette personne.", copySettlement: "Copier le bilan", copied: "Bilan copié", copyFailed: "Copie impossible dans ce navigateur.", localNote: "Calcul local uniquement : aucun nom ni montant n’est envoyé ou enregistré.",
  },
  en: {
    intro: "Record group expenses to see who should pay whom. Every expense is split equally among all participants.",
    people: "Participants", addPerson: "Add person", personName: "Name", removePerson: "Remove",
    expenses: "Expenses", expenseName: "E.g. groceries, hotel, dinner", amount: "Amount", payer: "Paid by",
    addExpense: "Add expense", noExpenses: "Add expenses already paid by the group to calculate reimbursements.",
    total: "Total expenses", perPerson: "Share per person", balances: "Per-person balance", paid: "Paid", owes: "Share", getsBack: "To receive", owesOthers: "To reimburse", settled: "Everyone is settled up.", transfers: "Suggested reimbursements", from: "pays", to: "to", removeExpense: "Remove expense",
    needTwo: "Add at least two participants.", invalidExpense: "Enter a description and a valid positive amount.", payerHasExpenses: "Remove this person's expenses first.", copySettlement: "Copy summary", copied: "Summary copied", copyFailed: "This browser could not copy the summary.", localNote: "Calculated locally only: no names or amounts are sent or saved.",
  },
} as const;

const inputClass = "mt-1 w-full min-w-0 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";
const buttonClass = "inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--outline-variant)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] outline-none transition-colors hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50";

export default function ExpenseSplitter() {
  const locale = useLocale();
  const t = copy[locale];
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [expenses, setExpenses] = useState<SharedExpense[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("person-1");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const formatMoney = (cents: number) => new Intl.NumberFormat(locale, {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(cents / 100);
  const settlement = useMemo(
    () => participants.length ? calculateExpenseSettlement(participants, expenses) : null,
    [participants, expenses],
  );
  const perPersonShare = participants.length ? Math.floor((settlement?.totalCents ?? 0) / participants.length) : 0;

  function addParticipant() {
    const name = newPerson.trim();
    if (!name || participants.length >= 30) return;
    const id = crypto.randomUUID();
    setParticipants((current) => [...current, { id, name }]);
    if (!participants.some((person) => person.id === payer)) setPayer(id);
    setNewPerson("");
    setError("");
  }

  function updateParticipant(id: string, name: string) {
    setParticipants((current) => current.map((person) => person.id === id ? { ...person, name } : person));
  }

  function removeParticipant(id: string) {
    if (expenses.some((expense) => expense.paidBy === id)) {
      setError(t.payerHasExpenses);
      return;
    }
    setParticipants((current) => current.filter((person) => person.id !== id));
    setError("");
  }

  function addExpense() {
    const numericAmount = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1_000_000_000) {
      setError(t.invalidExpense);
      return;
    }
    if (participants.length < 2) {
      setError(t.needTwo);
      return;
    }
    const amountCents = Math.round(numericAmount * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setError(t.invalidExpense);
      return;
    }
    setExpenses((current) => [...current, {
      id: crypto.randomUUID(), description: description.trim().slice(0, 120), amountCents, paidBy: payer,
    }]);
    setDescription("");
    setAmount("");
    setError("");
    setCopyMessage("");
  }

  const summaryText = settlement ? [
    t.total + ": " + formatMoney(settlement.totalCents),
    ...settlement.transfers.map((transfer) => {
      const from = participants.find((person) => person.id === transfer.from)?.name ?? transfer.from;
      const to = participants.find((person) => person.id === transfer.to)?.name ?? transfer.to;
      return `${from} → ${to}: ${formatMoney(transfer.amountCents)}`;
    }),
  ].join("\n") : "";

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyMessage(t.copied);
    } catch {
      setCopyMessage(t.copyFailed);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-[var(--muted)]">{t.intro}</p>

      <section className="rounded-2xl border border-[var(--outline-variant)] p-4 sm:p-5" aria-labelledby="expense-people-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="expense-people-title" className="text-lg font-semibold">{t.people}</h2>
          <span className="text-sm text-[var(--muted)]">{participants.length}/30</span>
        </div>
        <div className="mt-3 space-y-3">
          {participants.map((person, index) => (
            <div key={person.id} className="flex items-end gap-2">
              <label className="min-w-0 flex-1 text-sm font-medium">
                {t.personName} {index + 1}
                <input className={inputClass} value={person.name} maxLength={60} onChange={(event) => updateParticipant(person.id, event.target.value)} />
              </label>
              <button type="button" className={buttonClass} onClick={() => removeParticipant(person.id)} disabled={participants.length <= 1} aria-label={`${t.removePerson}: ${person.name}`}>{t.removePerson}</button>
            </div>
          ))}
        </div>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); addParticipant(); }}>
          <label className="min-w-0 flex-1 text-sm font-medium">
            {t.personName}
            <input className={inputClass} value={newPerson} maxLength={60} onChange={(event) => setNewPerson(event.target.value)} placeholder={locale === "fr" ? "Nouveau participant" : "New participant"} />
          </label>
          <button type="submit" className={buttonClass} disabled={!newPerson.trim() || participants.length >= 30}>{t.addPerson}</button>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--outline-variant)] p-4 sm:p-5" aria-labelledby="expense-list-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="expense-list-title" className="text-lg font-semibold">{t.expenses}</h2>
          <label className="text-sm font-medium">{locale === "fr" ? "Devise" : "Currency"}
            <select className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
              {(["EUR", "USD", "GBP", "CHF", "CAD"] as const).map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </label>
        </div>
        <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); addExpense(); }}>
          <label className="text-sm font-medium sm:col-span-2">{t.expenseName}
            <input className={inputClass} value={description} maxLength={120} onChange={(event) => setDescription(event.target.value)} placeholder={locale === "fr" ? "Courses du premier soir" : "First night's groceries"} />
          </label>
          <label className="text-sm font-medium">{t.amount}
            <input className={inputClass} inputMode="decimal" type="number" min="0.01" max="1000000000" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={locale === "fr" ? "45,90" : "45.90"} />
          </label>
          <label className="text-sm font-medium">{t.payer}
            <select className={inputClass} value={payer} onChange={(event) => setPayer(event.target.value)}>
              {participants.map((person) => <option key={person.id} value={person.id}>{person.name.trim() || (locale === "fr" ? "Sans nom" : "Unnamed")}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass} disabled={participants.length < 2}>{t.addExpense}</button>
          </div>
        </form>
        {expenses.length === 0 ? <p className="mt-4 text-sm text-[var(--muted)]">{t.noExpenses}</p> : (
          <ul className="mt-4 divide-y divide-[var(--outline-variant)]">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium">{expense.description}</p>
                  <p className="text-xs text-[var(--muted)]">{t.payer}: {participants.find((person) => person.id === expense.paidBy)?.name}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums">{formatMoney(expense.amountCents)}</span>
                  <button type="button" className={buttonClass} onClick={() => { setExpenses((current) => current.filter((item) => item.id !== expense.id)); setError(""); }}>{t.removeExpense}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p role="alert" className="rounded-xl bg-[var(--error-container)] px-3 py-2 text-sm text-[var(--on-error-container)]">{error}</p>}

      {settlement && expenses.length > 0 && (
        <section className="space-y-4" aria-labelledby="expense-result-title" aria-live="polite">
          <div className="rounded-2xl bg-[var(--surface-container)] p-4 sm:p-5">
            <h2 id="expense-result-title" className="text-lg font-semibold">{t.total}</h2>
            <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{formatMoney(settlement.totalCents)}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.perPerson}: {formatMoney(perPersonShare)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--outline-variant)] p-4 sm:p-5">
            <h2 className="text-lg font-semibold">{t.balances}</h2>
            <ul className="mt-3 space-y-3">
              {settlement.balances.map((balance) => {
                const person = participants.find((candidate) => candidate.id === balance.participantId);
                return (
                  <li key={balance.participantId} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{person?.name.trim() || (locale === "fr" ? "Sans nom" : "Unnamed")}</span>
                    <span className="text-right text-sm tabular-nums">
                      <span className="block">{t.paid}: {formatMoney(balance.paidCents)}</span>
                      <span className="block text-[var(--muted)]">{t.owes}: {formatMoney(balance.shareCents)}</span>
                      <strong className={balance.balanceCents > 0 ? "text-[var(--success)]" : balance.balanceCents < 0 ? "text-[var(--error)]" : ""}>
                        {balance.balanceCents > 0 ? t.getsBack : balance.balanceCents < 0 ? t.owesOthers : t.settled}
                        {balance.balanceCents !== 0 ? ": " + formatMoney(Math.abs(balance.balanceCents)) : ""}
                      </strong>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--outline-variant)] p-4 sm:p-5">
            <h2 className="text-lg font-semibold">{t.transfers}</h2>
            {settlement.transfers.length === 0 ? <p className="mt-3 text-sm text-[var(--muted)]">{t.settled}</p> : (
              <ol className="mt-3 space-y-2">
                {settlement.transfers.map((transfer, index) => {
                  const from = participants.find((person) => person.id === transfer.from)?.name.trim() || (locale === "fr" ? "Sans nom" : "Unnamed");
                  const to = participants.find((person) => person.id === transfer.to)?.name.trim() || (locale === "fr" ? "Sans nom" : "Unnamed");
                  return <li key={`${transfer.from}-${transfer.to}-${index}`} className="rounded-xl bg-[var(--surface-container)] px-3 py-3 text-sm"><strong>{from}</strong> {t.from} <strong>{formatMoney(transfer.amountCents)}</strong> {t.to} <strong>{to}</strong></li>;
                })}
              </ol>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" className={buttonClass} onClick={copySummary}>{t.copySettlement}</button>
              {copyMessage && <span role="status" className="text-sm text-[var(--muted)]">{copyMessage}</span>}
            </div>
          </div>
        </section>
      )}
      <p className="text-xs leading-5 text-[var(--muted)]">{t.localNote}</p>
    </div>
  );
}
