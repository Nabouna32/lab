const API_VERSION = "2022-11-28";
const API_ROOT = "https://api.github.com";

export function isBotPullRequest(pullRequest) {
  const login = pullRequest?.user?.login ?? "";
  return pullRequest?.user?.type === "Bot" || login.endsWith("[bot]");
}

export function selectPriorityPullRequest(pullRequests) {
  return [...pullRequests]
    .filter((pullRequest) => !isBotPullRequest(pullRequest))
    .sort((left, right) => {
      const byCreation = Date.parse(left.created_at) - Date.parse(right.created_at);
      return byCreation || left.number - right.number;
    })[0] ?? null;
}

function sectionBody(markdown, heading) {
  const source = markdown.replace(/<!--[\s\S]*?-->/g, "");
  const headingPattern = new RegExp(`^##\\s+${heading}\\s*$`, "im");
  const match = headingPattern.exec(source);

  if (!match) return "";

  const start = match.index + match[0].length;
  const remainder = source.slice(start);
  const nextHeading = /^#{1,6}\s+/m.exec(remainder);
  return nextHeading ? remainder.slice(0, nextHeading.index) : remainder;
}

export function hasLinkedIssueReference(body) {
  const section = sectionBody(body, "Issues liées");
  return /^\s*(?:[-*]\s*)?(?:Refs|Closes)\s+#\d+\b/im.test(section);
}

export function validateRequiredChecklist(body) {
  const section = sectionBody(body, "Checklist avant fusion");
  const checkboxes = [...section.matchAll(/^\s*[-*]\s+\[([ xX])\]\s+.+$/gm)];

  if (checkboxes.length !== 5) {
    return {
      valid: false,
      reason: `La checklist obligatoire doit contenir exactement 5 cases (trouvé : ${checkboxes.length}).`,
    };
  }

  if (checkboxes.some((checkbox) => checkbox[1].toLowerCase() !== "x")) {
    return {
      valid: false,
      reason: "Toutes les cases de la checklist obligatoire doivent être cochées avant la fusion.",
    };
  }

  return { valid: true, reason: "" };
}

export function validatePullRequestBody(body) {
  if (!hasLinkedIssueReference(body)) {
    return {
      valid: false,
      reason: "La section « Issues liées » doit contenir au moins une référence explicite « Refs #N » ou « Closes #N ».",
    };
  }

  return validateRequiredChecklist(body);
}

export async function githubApi(repository, token, path, options = {}) {
  const response = await fetch(`${API_ROOT}/repos/${repository}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": API_VERSION,
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 204) return null;

  const responseBody = await response.text();
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} sur ${path}: ${responseBody}`);
  }

  return responseBody ? JSON.parse(responseBody) : null;
}

export async function getOpenWorkPullRequests(repository, token) {
  const pullRequests = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubApi(
      repository,
      token,
      `/pulls?state=open&per_page=100&page=${page}`,
    );
    pullRequests.push(...batch);

    if (batch.length < 100) break;
  }

  return pullRequests.filter((pullRequest) => !isBotPullRequest(pullRequest));
}

export async function getWorkflowRunsForPullRequest(repository, token, pullRequestNumber) {
  const runs = [];

  for (let page = 1; ; page += 1) {
    const result = await githubApi(
      repository,
      token,
      `/actions/runs?event=pull_request&per_page=100&page=${page}`,
    );
    const batch = result.workflow_runs ?? [];
    runs.push(
      ...batch.filter((run) =>
        run.pull_requests?.some((pullRequest) => pullRequest.number === pullRequestNumber),
      ),
    );

    if (batch.length < 100) break;
  }

  return runs;
}
