import {
  getOpenWorkPullRequests,
  selectPriorityPullRequest,
  validatePullRequestBody,
} from "./pr-governance.mjs";

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const pullRequestNumber = Number(process.env.PR_NUMBER);
  const body = process.env.PR_BODY ?? "";

  if (!repository || !token || !Number.isInteger(pullRequestNumber) || pullRequestNumber < 1) {
    throw new Error("GITHUB_REPOSITORY, GITHUB_TOKEN et PR_NUMBER sont requis.");
  }

  const pullRequests = await getOpenWorkPullRequests(repository, token);
  const priorityPullRequest = selectPriorityPullRequest(pullRequests);

  if (!priorityPullRequest) {
    throw new Error("Aucune PR de travail ouverte n'a été trouvée pour la PR courante.");
  }

  if (priorityPullRequest.number !== pullRequestNumber) {
    throw new Error(
      `La PR #${priorityPullRequest.number}, ouverte le ${priorityPullRequest.created_at}, est prioritaire. La PR #${pullRequestNumber} ne peut pas être fusionnée avant sa fermeture.`,
    );
  }

  const validation = validatePullRequestBody(body);
  if (!validation.valid) throw new Error(validation.reason);

  console.log(
    `Gouvernance valide : la PR de travail #${pullRequestNumber} est prioritaire, liée à une issue et sa checklist est complète.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
