import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("IPv4 subnet calculator computes a CIDR range in French", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/calculateur-de-sous-reseau-ipv4", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Calculateur de sous-réseau IPv4" })).toBeVisible();

  const input = page.getByLabel("Réseau IPv4 (CIDR)");
  await input.fill("192.168.1.42/24");

  await expect(page.getByText("192.168.1.0", { exact: true })).toBeVisible();
  await expect(page.getByText("192.168.1.255", { exact: true })).toBeVisible();
  await expect(page.getByText("255.255.255.0", { exact: true })).toBeVisible();
  await expect(page.getByText("254", { exact: true })).toBeVisible();
});

test("IPv4 subnet calculator reports invalid input in English", async ({ page }) => {
  await page.goto(baseUrl + "/en/tools/ipv4-subnet-calculator", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "IPv4 Subnet Calculator" })).toBeVisible();

  const input = page.getByLabel("IPv4 network (CIDR)");
  await input.fill("192.168.1.42/33");

  await expect(page.getByText("Enter a valid IPv4 address and prefix from /0 to /32.", { exact: true })).toBeVisible();
  await expect(input).toHaveAttribute("aria-invalid", "true");
});
