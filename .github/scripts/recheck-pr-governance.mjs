import {
  getOpenWorkPullRequests,
  getWorkflowRunsForPullRequest,
  githubApi,
  selectPriorityPullRequest,
} from "./pr-governance.mjs";

async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;

  if (!repository || !token) {
    throw new Error("GITHUB_REPOSITORY et GITHUB_TOKEN sont requis.");
  }

  const pullRequests = await getOpenWorkPullRequests(repository, token);
  const priorityPullRequest = selectPriorityPullRequest(pullRequests);

  if (!priorityPullRequest) {
    console.log("Aucune PR de travail ouverte à réévaluer.");
    return;
  }

  const runs = await getWorkflowRunsForPullRequest(
    repository,
    token,
    priorityPullRequest.number,
  );
  const latestFailedRun = runs
    .filter(
      (run) =>
        run.path === ".github/workflows/ci.yml" &&
        run.status === "completed" &&
        run.conclusion === "failure",
    )
    .sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at))[0];

  if (!latestFailedRun) {
    console.log(
      `Aucune exécution CI échouée à réévaluer pour la PR prioritaire #${priorityPullRequest.number}.`,
    );
    return;
  }

  const jobsResponse = await githubApi(
    repository,
    token,
    `/actions/runs/${latestFailedRun.id}/jobs?per_page=100`,
  );
  const governanceJob = (jobsResponse.jobs ?? []).find(
    (job) => job.name === "Vérification finale des contrôles applicables",
  );
  const governanceStepFailed = governanceJob?.steps?.some(
    (step) => step.name === "Contrôle de gouvernance des PR" && step.conclusion === "failure",
  );

  if (!governanceStepFailed) {
    console.log(
      `La dernière CI de la PR #${priorityPullRequest.number} n'a pas échoué sur le contrôle de gouvernance ; aucune relance.`,
    );
    return;
  }

  await githubApi(
    repository,
    token,
    `/actions/runs/${latestFailedRun.id}/rerun-failed-jobs`,
    { method: "POST" },
  );

  console.log(
    `Réévaluation demandée pour la PR prioritaire #${priorityPullRequest.number} après fermeture de la PR précédente.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
