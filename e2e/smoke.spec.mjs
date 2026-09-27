import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

// Protected Vercel previews can be accessed by CI through a short-lived
// GitHub Actions OIDC token when the project authorizes GitHub Actions as a
// Trusted Source. Local browser tests remain unchanged when no token exists.
test.beforeEach(async ({ page }) => {
  const token = process.env.VERCEL_TRUSTED_OIDC_TOKEN;

  if (token) {
    await page.setExtraHTTPHeaders({
      "x-vercel-trusted-oidc-idp-token": token,
    });
  }
});

test("French homepage renders", async ({ page }) => {
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Utiluna/i);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link").first()).toBeVisible();
});

test("mobile header keeps account action unique and opens search on demand", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  const header = page.locator("header");
  await expect(header.getByRole("link", { name: "Compte" })).toHaveCount(1);
  await expect(header.locator("#header-tool-search-mobile-input")).toHaveCount(0);

  await header.getByRole("button", { name: "Rechercher un outil" }).click();
  await expect(header.locator("#header-tool-search-mobile-input")).toBeVisible();
  await expect(header.locator("#header-tool-search-mobile-input")).toBeFocused();

  await header.getByRole("button", { name: "Fermer la recherche" }).click();
  await expect(header.locator("#header-tool-search-mobile-input")).toHaveCount(0);
});

test("tools page is search-first and exposes category discovery", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Tous les outils" })).toBeVisible();
  await expect(page.getByLabel("Rechercher un outil")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Parcourir par catégorie" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Calculs.*4 outils/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Informatique.*4 outils/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Calculateur de pourcentage" })).toHaveCount(0);
});

test("all published tool pages render", async ({ page }) => {
  const publishedToolRoutes = [
    "/fr/outils/calculs/pourcentage",
    "/fr/outils/calculs/reduction",
    "/fr/outils/calculs/tva",
    "/fr/outils/calculs/regle-de-trois",
    "/fr/outils/dates/age",
    "/fr/outils/dates/duree",
    "/fr/outils/informatique/vitesse-telechargement",
    "/fr/outils/informatique/temps-telechargement",
    "/fr/outils/informatique/taille-fichier",
    "/fr/outils/informatique/convertisseur-taille",
    "/fr/outils/fichiers/mots-caracteres",
  ];

  for (const route of publishedToolRoutes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    expect(response?.ok(), `Expected ${route} to return a successful response.`).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("processing status exposes an accessible information disclosure", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculs/pourcentage`, { waitUntil: "networkidle" });

  const status = page.getByText("Traitement local", { exact: true });
  await expect(status).toBeVisible();

  const info = page.locator('summary').filter({ hasText: "Traitement local" }).getByText("ⓘ", { exact: true });
  await expect(info).toBeVisible();

  await page.locator("summary").filter({ hasText: "Traitement local" }).click();
  await expect(page.getByText("Aucune donnée n'est envoyée à un serveur ni stockée par Utiluna.", { exact: true })).toBeVisible();
});

test("English locale renders", async ({ page }) => {
  await page.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });

  await expect(page.locator("main")).toBeVisible();
});

test("file size calculator computes an estimated size", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/informatique/taille-fichier`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Calculateur de taille de fichier" })).toBeVisible();
  await page.getByRole("spinbutton", { name: "Durée" }).fill("10");
  await page.getByRole("spinbutton", { name: "Débit" }).fill("8");
  await expect(page.getByText("Taille estimée", { exact: true }).locator("..")).toContainText("600 Mo");
});

test("text counter tool renders and counts words", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(`${baseUrl}/fr/outils/fichiers/mots-caracteres`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Compteur de mots et caractères" })).toBeVisible();
  const input = page.getByLabel("Votre texte");
  await input.fill("Bonjour le monde");
  await expect(page.getByText("Mots", { exact: true }).locator("..")).toContainText("3");
  await expect(page.getByText("Caractères", { exact: true }).locator("..")).toContainText("16");
  await page.getByRole("button", { name: "Copier les statistiques" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});
