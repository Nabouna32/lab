import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("video bitrate calculator finds bitrate from a target size in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/video/calculateur-de-bitrate-video", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Bitrate vidéo" })).toBeVisible();

  await page.getByLabel("Minutes").fill("10");
  await page.getByLabel("Taille cible").fill("0.75");

  await expect(page.getByText("10 Mbps", { exact: true })).toBeVisible();
});

test("video bitrate calculator estimates file size in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/video/video-bitrate-calculator", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Video bitrate calculator" })).toBeVisible();

  await page.getByRole("button", { name: "Estimate size" }).click();
  await page.getByLabel("Minutes").fill("10");
  await page.getByLabel("Average total bitrate").fill("10");

  await expect(page.getByText("750 MB · 0.75 GB", { exact: true })).toBeVisible();
});

test("video bitrate calculator rejects an invalid duration", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/video/calculateur-de-bitrate-video", { waitUntil: "networkidle" });

  await page.getByLabel("Minutes").fill("60");
  await page.getByLabel("Taille cible").fill("1");

  await expect(page.getByText("La durée doit être supérieure à 0, avec 0 à 59 minutes et secondes.", { exact: true })).toBeVisible();
});
