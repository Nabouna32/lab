import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

test("account entry points render in French", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/compte`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Votre compte" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Se connecter" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Créer un compte" })).toBeVisible();
});

test("authentication pages are localized in English", async ({ page }) => {
  await page.goto(`${baseUrl}/en/compte/connexion`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/\/en\/compte\/mot-de-passe-oublie$/);
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();

  await page.goto(`${baseUrl}/en/compte/inscription`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
});

test("password reset form performs browser validation", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/compte/mot-de-passe-oublie`, { waitUntil: "networkidle" });

  const email = page.getByLabel("Adresse e-mail");
  await expect(email).toHaveAttribute("type", "email");
  await email.fill("not-an-email");
  await page.getByRole("button", { name: "Mot de passe oublié ?" }).click();
  await expect(email).toBeInvalid();
});

test("protected account security pages redirect unauthenticated users", async ({ page }) => {
  for (const path of [
    "/fr/compte/mot-de-passe",
    "/fr/compte/email",
    "/fr/compte/suppression",
  ]) {
    await page.goto(baseUrl + path, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/fr\/compte\/connexion(?:\?|$)/);
  }
});

test("reset callback rejects unsafe redirects", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/auth/callback?code=invalid&next=https%3A%2F%2Fevil.example`, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/fr\/compte\/connexion\?error=auth-callback$/);
});

test("account security pages are also available in English", async ({ page }) => {
  await page.goto(`${baseUrl}/en/compte/mot-de-passe-oublie`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
});
