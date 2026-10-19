import test from "node:test";
import assert from "node:assert/strict";
import { fetchPullRequestFiles } from "./detect-ci-changes.mjs";

const response = (entries, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => entries,
});

test("fetches all pages of changed files and validates the expected count", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url: new URL(url), options });
    const page = Number(new URL(url).searchParams.get("page"));
    if (page === 1) {
      return response(Array.from({ length: 100 }, (_, index) => ({ filename: `src/file-${index}.ts` })));
    }
    return response([{ filename: "README.md" }]);
  };

  const files = await fetchPullRequestFiles({
    repository: "Nabouna32/lab",
    pullNumber: 771,
    expectedCount: 101,
    token: "test-token",
    fetchImpl,
  });

  assert.equal(files.length, 101);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url.searchParams.get("per_page"), "100");
  assert.equal(requests[1].url.searchParams.get("page"), "2");
  assert.equal(requests[0].options.headers.Authorization, "Bearer test-token");
});

test("rejects a changed-file count mismatch instead of silently skipping checks", async () => {
  await assert.rejects(
    fetchPullRequestFiles({
      repository: "Nabouna32/lab",
      pullNumber: 771,
      expectedCount: 2,
      token: "test-token",
      fetchImpl: async () => response([{ filename: "README.md" }]),
    }),
    /count mismatch/,
  );
});

test("rejects oversized PRs before making a request", async () => {
  let called = false;
  await assert.rejects(
    fetchPullRequestFiles({
      repository: "Nabouna32/lab",
      pullNumber: 771,
      expectedCount: 3001,
      token: "test-token",
      fetchImpl: async () => {
        called = true;
        return response([]);
      },
    }),
    /3000-file listing limit/,
  );
  assert.equal(called, false);
});

test("fails closed when GitHub rejects the changed-file request", async () => {
  await assert.rejects(
    fetchPullRequestFiles({
      repository: "Nabouna32/lab",
      pullNumber: 771,
      expectedCount: 1,
      token: "test-token",
      fetchImpl: async () => response({ message: "forbidden" }, 403),
    }),
    /HTTP 403/,
  );
});
