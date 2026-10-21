export type ExpenseParticipant = { id: string; name: string };
export type SharedExpense = { id: string; description: string; amountCents: number; paidBy: string };
export type SettlementTransfer = { from: string; to: string; amountCents: number };
export type ExpenseSettlement = {
  totalCents: number;
  balances: Array<{ participantId: string; paidCents: number; shareCents: number; balanceCents: number }>;
  transfers: SettlementTransfer[];
};

/**
 * Every recorded expense is shared equally by every participant.
 * Amounts stay in integer cents so settlement never relies on floating-point money.
 */
export function calculateExpenseSettlement(
  participants: readonly ExpenseParticipant[],
  expenses: readonly SharedExpense[],
): ExpenseSettlement {
  if (participants.length < 1) throw new Error("At least one participant is required.");
  const participantIds = new Set(participants.map(({ id }) => id));
  if (participantIds.size !== participants.length || participants.some(({ id }) => !id)) {
    throw new Error("Participant IDs must be unique and non-empty.");
  }
  for (const expense of expenses) {
    if (!participantIds.has(expense.paidBy)) throw new Error("Every expense must have a known payer.");
    if (!Number.isSafeInteger(expense.amountCents) || expense.amountCents < 0) {
      throw new Error("Expense amounts must be non-negative integer cents.");
    }
  }

  const paid = new Map(participants.map(({ id }) => [id, 0]));
  const share = new Map(participants.map(({ id }) => [id, 0]));
  let totalCents = 0;

  for (const expense of expenses) {
    totalCents += expense.amountCents;
    paid.set(expense.paidBy, (paid.get(expense.paidBy) ?? 0) + expense.amountCents);
    const baseShare = Math.floor(expense.amountCents / participants.length);
    const remainder = expense.amountCents % participants.length;
    participants.forEach(({ id }, index) => {
      share.set(id, (share.get(id) ?? 0) + baseShare + (index < remainder ? 1 : 0));
    });
  }

  const balances = participants.map(({ id }) => ({
    participantId: id,
    paidCents: paid.get(id) ?? 0,
    shareCents: share.get(id) ?? 0,
    balanceCents: (paid.get(id) ?? 0) - (share.get(id) ?? 0),
  }));
  const creditors = balances.filter(({ balanceCents }) => balanceCents > 0)
    .map(({ participantId, balanceCents }) => ({ participantId, remaining: balanceCents }))
    .sort((a, b) => b.remaining - a.remaining);
  const debtors = balances.filter(({ balanceCents }) => balanceCents < 0)
    .map(({ participantId, balanceCents }) => ({ participantId, remaining: -balanceCents }))
    .sort((a, b) => b.remaining - a.remaining);
  const transfers: SettlementTransfer[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountCents = Math.min(debtor.remaining, creditor.remaining);
    if (amountCents > 0) {
      transfers.push({ from: debtor.participantId, to: creditor.participantId, amountCents });
    }
    debtor.remaining -= amountCents;
    creditor.remaining -= amountCents;
    if (debtor.remaining === 0) debtorIndex += 1;
    if (creditor.remaining === 0) creditorIndex += 1;
  }

  return { totalCents, balances, transfers };
}
