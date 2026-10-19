import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.spec.mjs",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
  reporter: "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: isCI ? "npm run start -- --port 3100" : "npm run dev -- --port 3100",
    cwd: "..",
    url: `${baseURL}/fr`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
