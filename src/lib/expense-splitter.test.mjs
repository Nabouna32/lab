import assert from "node:assert/strict";
import test from "node:test";
import { calculateExpenseSettlement } from "./expense-splitter.ts";

const group = [
  { id: "a", name: "Alex" },
  { id: "b", name: "Blair" },
  { id: "c", name: "Casey" },
];

test("settles shared expenses with the fewest greedy transfers", () => {
  const result = calculateExpenseSettlement(group, [
    { id: "e1", description: "Dinner", amountCents: 9000, paidBy: "a" },
    { id: "e2", description: "Taxi", amountCents: 3000, paidBy: "b" },
  ]);
  assert.equal(result.totalCents, 12000);
  assert.deepEqual(result.balances.map(({ balanceCents }) => balanceCents), [5000, -1000, -4000]);
  assert.deepEqual(result.transfers, [
    { from: "c", to: "a", amountCents: 4000 },
    { from: "b", to: "a", amountCents: 1000 },
  ]);
});

test("distributes leftover cents deterministically and balances to zero", () => {
  const result = calculateExpenseSettlement(group, [
    { id: "e1", description: "Snack", amountCents: 100, paidBy: "a" },
  ]);
  assert.deepEqual(result.balances.map(({ shareCents }) => shareCents), [34, 33, 33]);
  assert.equal(result.balances.reduce((sum, item) => sum + item.balanceCents, 0), 0);
  assert.equal(result.transfers.reduce((sum, item) => sum + item.amountCents, 0), 66);
});

test("returns no transfers when everyone has paid their exact share", () => {
  const result = calculateExpenseSettlement(group, [
    { id: "e1", description: "Meal", amountCents: 3000, paidBy: "a" },
    { id: "e2", description: "Meal", amountCents: 3000, paidBy: "b" },
    { id: "e3", description: "Meal", amountCents: 3000, paidBy: "c" },
  ]);
  assert.deepEqual(result.transfers, []);
});

test("rejects unknown payers and invalid money values", () => {
  assert.throws(() => calculateExpenseSettlement(group, [
    { id: "e1", description: "Bad", amountCents: 100, paidBy: "missing" },
  ]), /known payer/);
  assert.throws(() => calculateExpenseSettlement(group, [
    { id: "e1", description: "Bad", amountCents: 1.5, paidBy: "a" },
  ]), /integer cents/);
});

test("rejects duplicate participant IDs", () => {
  assert.throws(() => calculateExpenseSettlement([
    { id: "a", name: "Alex" }, { id: "a", name: "Other Alex" },
  ], []), /unique/);
});

test("rejects totals that exceed safe integer precision", () => {
  assert.throws(() => calculateExpenseSettlement(group, [
    { id: "e1", description: "A", amountCents: Number.MAX_SAFE_INTEGER, paidBy: "a" },
    { id: "e2", description: "B", amountCents: 1, paidBy: "b" },
  ]), /safe integer range/);
});
