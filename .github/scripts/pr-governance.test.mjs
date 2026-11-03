import assert from "node:assert/strict";
import test from "node:test";
import {
  hasLinkedIssueReference,
  isBotPullRequest,
  selectPriorityPullRequest,
  validatePullRequestBody,
  validateRequiredChecklist,
} from "./pr-governance.mjs";

const completeChecklist = `## Checklist avant fusion

- [x] Issue liée mise à jour (état et prochaine action).
- [x] Référence \`Refs\` ou \`Closes\` adaptée aux critères.
- [x] Documentation canonique à jour ou sans objet.
- [x] Vérifications non exécutées signalées.
- [x] CI du dernier commit terminée et lue avant fusion.
`;

test("une référence d'issue doit être explicite dans la section dédiée", () => {
  assert.equal(
    hasLinkedIssueReference("## Résumé\nRefs #12\n\n## Issues liées\n- Refs #1244"),
    true,
  );
  assert.equal(
    hasLinkedIssueReference("## Résumé\nRefs #12\n\n## Issues liées\n<!-- Refs #99 -->"),
    false,
  );
  assert.equal(
    hasLinkedIssueReference("## Issues liées\nAucun lien\n\n## Vérifications\nRefs #12"),
    false,
  );
  assert.equal(
    hasLinkedIssueReference("## Issues liées\n\\x60\\x60\\x60md\nRefs #99\n\\x60\\x60\\x60"),
    false,
  );
});

test("la checklist de fusion exige cinq cases présentes et cochées", () => {
  assert.equal(validateRequiredChecklist(completeChecklist).valid, true);
  assert.equal(
    validateRequiredChecklist(completeChecklist.replace("[x] CI", "[ ] CI")).valid,
    false,
  );
  assert.equal(
    validateRequiredChecklist(completeChecklist.replace("- [x] Vérifications non exécutées signalées.\n", "")).valid,
    false,
  );
});

test("les références et la checklist sont toutes deux obligatoires", () => {
  assert.equal(
    validatePullRequestBody(`## Issues liées\nRefs #1244\n\n${completeChecklist}`).valid,
    true,
  );
  assert.equal(validatePullRequestBody(completeChecklist).valid, false);
});

test("les PR de bots sont identifiées sans dépendre uniquement du suffixe du login", () => {
  assert.equal(isBotPullRequest({ user: { login: "dependabot[bot]", type: "Bot" } }), true);
  assert.equal(isBotPullRequest({ user: { login: "automation[bot]", type: "User" } }), true);
  assert.equal(isBotPullRequest({ user: { login: "Nabouna32", type: "User" } }), false);
});

test("la PR de travail la plus ancienne reste prioritaire et les bots sont ignorés", () => {
  const pullRequests = [
    { number: 14, created_at: "2026-11-03T10:00:00Z", user: { login: "Nabouna32", type: "User" } },
    { number: 13, created_at: "2026-11-03T09:00:00Z", user: { login: "Nabouna32", type: "User" } },
    { number: 12, created_at: "2026-11-03T08:00:00Z", user: { login: "dependabot[bot]", type: "Bot" } },
  ];

  assert.equal(selectPriorityPullRequest(pullRequests).number, 13);
  assert.equal(
    selectPriorityPullRequest([
      { number: 20, created_at: "2026-11-03T09:00:00Z", user: { login: "Nabouna32", type: "User" } },
      { number: 19, created_at: "2026-11-03T09:00:00Z", user: { login: "Nabouna32", type: "User" } },
    ]).number,
    19,
  );
  assert.equal(selectPriorityPullRequest([pullRequests[2]]), null);
});
