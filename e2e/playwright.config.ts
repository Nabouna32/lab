import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 20_000,
  expect: { timeout: 5_000 },
  outputDir: "../test-results/playwright-output",
  reporter: [
    ["list"],
    ["json", { outputFile: "../test-results/report.json" }],
  ],
  use: {
    baseURL,
    browserName: "chromium",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-light",
      use: { ...devices["Desktop Chrome"], colorScheme: "light", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-dark",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-light",
      use: { ...devices["iPhone 13"], browserName: "chromium", colorScheme: "light" },
    },
    {
      name: "mobile-dark",
      use: { ...devices["iPhone 13"], browserName: "chromium", colorScheme: "dark" },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1",
    url: `${baseURL}/fr`,
    reuseExistingServer: false,
    timeout: 90_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
