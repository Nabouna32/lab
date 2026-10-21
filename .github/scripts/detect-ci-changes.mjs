import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { classifyCiChanges } from "./classify-ci-changes.mjs";

const MAX_CHANGED_FILES = 3000;
const PAGE_SIZE = 100;

export async function fetchPullRequestFiles({
  repository,
  pullNumber,
  expectedCount,
  token,
  fetchImpl = fetch,
}) {
  if (typeof repository !== "string" || !/^[^/]+\/[^/]+$/.test(repository)) {
    throw new Error("GITHUB_REPOSITORY is missing or invalid.");
  }
  if (!Number.isInteger(pullNumber) || pullNumber < 1) {
    throw new Error("Pull request number is missing or invalid.");
  }
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    throw new Error("Pull request changed-file count is missing or invalid.");
  }
  if (expectedCount > MAX_CHANGED_FILES) {
    throw new Error(`This PR exceeds GitHub's ${MAX_CHANGED_FILES}-file listing limit; CI scope cannot be classified safely.`);
  }
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("GitHub token is missing; cannot classify pull request changes safely.");
  }

  const filenames = [];
  // The pull_request webhook count can lag behind the live file list after rapid pushes.
  // Treat the API listing as authoritative and paginate up to GitHub's documented cap.
  const maxPages = Math.ceil(MAX_CHANGED_FILES / PAGE_SIZE);

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL(
      `https://api.github.com/repos/${repository}/pulls/${pullNumber}/files`,
    );
    url.searchParams.set("per_page", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));

    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub returned HTTP ${response.status} while listing pull request files (page ${page}).`);
    }

    const entries = await response.json();
    if (!Array.isArray(entries) || entries.some((entry) => typeof entry?.filename !== "string" || entry.filename.length === 0)) {
      throw new Error(`GitHub returned an invalid changed-file listing (page ${page}).`);
    }

    filenames.push(...entries.map((entry) => entry.filename));
    if (filenames.length > MAX_CHANGED_FILES) {
      throw new Error(`This PR exceeds GitHub's ${MAX_CHANGED_FILES}-file listing limit; CI scope cannot be classified safely.`);
    }
    if (entries.length < PAGE_SIZE) break;
    if (page === maxPages) {
      throw new Error(`This PR reaches GitHub's ${MAX_CHANGED_FILES}-file listing limit; CI scope cannot be classified safely.`);
    }
  }

  if (filenames.length !== expectedCount) {
    console.warn(`Pull request file count changed during the event: webhook reported ${expectedCount}, GitHub lists ${filenames.length}; using the live listing.`);
  }

  return filenames;
}

async function main() {
  const eventName = process.env.EVENT_NAME;
  let result = {
    lightweight_only: false,
    dependencies_changed: false,
    governance_changed: false,
  };

  if (eventName === "pull_request") {
    const countText = process.env.PR_CHANGED_FILES ?? "";
    if (!/^\d+$/.test(countText)) {
      throw new Error("Pull request changed-file count is missing or invalid.");
    }

    const filenames = await fetchPullRequestFiles({
      repository: process.env.GITHUB_REPOSITORY,
      pullNumber: Number(process.env.PR_NUMBER),
      expectedCount: Number(countText),
      token: process.env.GH_TOKEN,
    });
    result = classifyCiChanges(filenames, filenames.length);
  } else if (eventName !== "workflow_dispatch") {
    throw new Error(`Unsupported event for CI change detection: ${eventName ?? "missing"}.`);
  }

  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) throw new Error("GITHUB_OUTPUT is not available.");

  for (const [key, value] of Object.entries(result)) {
    appendFileSync(outputPath, `${key}=${value}\n`);
    console.log(`${key}=${value}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
