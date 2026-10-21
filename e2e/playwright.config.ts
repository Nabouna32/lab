import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

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
  // Resolve from the repository root (the npm run e2e working directory), not the config file directory.
  outputDir: resolve(process.cwd(), "test-results/playwright-output"),
  reporter: [
    ["list"],
    ["json", { outputFile: resolve(process.cwd(), "test-results/report.json") }],
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
      testMatch: "**/smoke.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "light", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-dark",
      testMatch: "**/smoke.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-light",
      testMatch: "**/smoke.spec.ts",
      use: { ...devices["iPhone 13"], browserName: "chromium", colorScheme: "light" },
    },
    {
      name: "mobile-dark",
      testMatch: "**/smoke.spec.ts",
      use: { ...devices["iPhone 13"], browserName: "chromium", colorScheme: "dark" },
    },
    {
      name: "tablet-portrait-light",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["iPad (gen 7)"], browserName: "chromium", colorScheme: "light", viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
    {
      name: "tablet-portrait-dark",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["iPad (gen 7)"], browserName: "chromium", colorScheme: "dark", viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
    {
      name: "tablet-landscape-light",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "light", viewport: { width: 1024, height: 768 }, isMobile: false, hasTouch: true },
    },
    {
      name: "tablet-landscape-dark",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark", viewport: { width: 1024, height: 768 }, isMobile: false, hasTouch: true },
    },
    {
      name: "desktop-large-light",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "light", viewport: { width: 1920, height: 1080 } },
    },
    {
      name: "desktop-large-dark",
      testMatch: "**/visual.spec.ts",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark", viewport: { width: 1920, height: 1080 } },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1",
    url: `${baseURL}/fr`,
    reuseExistingServer: false,
    timeout: 90_000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_e2e_placeholder",
    },
  },
});
