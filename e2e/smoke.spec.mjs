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

test("root uses English as the default locale", async ({ page }) => {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("main")).toBeVisible();
});

test("language selector maps the same tool to its localized URL", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/calculations/percentage-calculator`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /language/i }).click().catch(() => {});
  const frenchLink = page.getByRole("link", { name: "Français" });
  await expect(frenchLink).toBeVisible();
  await frenchLink.click();
  await expect(page).toHaveURL(/\/fr\/outils\/calculs\/calculateur-de-pourcentage$/);
});

test("French homepage renders", async ({ page }) => {
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/Loculary/i);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link").first()).toBeVisible();
});

test("responsive header keeps search available on mobile and tablet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  const header = page.locator("header");
  await expect(header.getByRole("link", { name: "Compte" })).toHaveCount(1);
  await expect(header.locator("#header-tool-search-mobile-input")).toHaveCount(0);

  await header.getByRole("button", { name: "Rechercher dans les outils" }).click();
  await expect(header.locator("#header-tool-search-mobile-input")).toBeVisible();
  await expect(header.locator("#header-tool-search-mobile-input")).toBeFocused();

  await header.getByRole("button", { name: "Fermer la recherche" }).click();
  await expect(header.locator("#header-tool-search-mobile-input")).toHaveCount(0);

  await page.setViewportSize({ width: 820, height: 900 });
  await page.reload({ waitUntil: "networkidle" });
  await expect(header.locator("#header-tool-search-mobile-input")).toHaveCount(0);
  await expect(header.getByRole("button", { name: "Rechercher dans les outils" })).toBeVisible();
  await header.getByRole("button", { name: "Rechercher dans les outils" }).click();
  await expect(header.locator("#header-tool-search-mobile-input")).toBeVisible();
  await header.getByRole("button", { name: "Fermer la recherche" }).click();

  await page.setViewportSize({ width: 1024, height: 900 });
  await page.reload({ waitUntil: "networkidle" });
  await expect(header.locator("#header-tool-search-input")).toBeVisible();
});

test("tool search shows useful result context", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils`, { waitUntil: "domcontentloaded" });

  const search = page.locator("#tools-page-search-input");
  await search.fill("calculer 17 % de 283");
  await expect(page.locator("#tools-page-search-results")).toBeVisible();
  await expect(page.locator("#tools-page-search-results").getByText("Pourcentage", { exact: true })).toBeVisible();
  await expect(page.locator("#tools-page-search-results").getByText(/Calculs/)).toBeVisible();
  await expect(page.locator("#tools-page-search-result-0")).toContainText("Calculez un pourcentage, une évolution ou l’écart entre deux valeurs.");

  await search.press("ArrowDown");
  await expect(page.locator("#tools-page-search-result-0")).toHaveAttribute("aria-selected", "true");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/fr\/outils\/calculs\/calculateur-de-pourcentage$/);
});

test("tool search offers suggestions when nothing matches", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils`, { waitUntil: "domcontentloaded" });

  const search = page.locator("#tools-page-search-input");
  await search.fill("zzzzzzzz");
  const results = page.locator("#tools-page-search-results");
  await expect(results.getByText(/Aucun outil ne correspond à/)).toBeVisible();
  await expect(results.getByRole("button", { name: "TVA", exact: true })).toBeVisible();
  await results.getByRole("button", { name: "TVA", exact: true }).click();
  await expect(results.getByText("TVA", { exact: true })).toBeVisible();
});

test("tools page is search-first and exposes category discovery", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils`, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Tous les outils" })).toBeVisible();
  await expect(page.locator("#tools-page-search-input")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Parcourir par catégorie" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Calculs.*4 outils/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Informatique.*4 outils/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pourcentage" })).toHaveCount(0);
});

test("all published tool pages render", async ({ page }) => {
  const publishedToolRoutes = [
    "/fr/outils/calculs/calculateur-de-pourcentage",
    "/fr/outils/calculs/calculateur-de-reduction",
    "/fr/outils/calculs/calculateur-de-tva",
    "/fr/outils/calculs/regle-de-trois",
    "/fr/outils/dates/calculateur-d-age",
    "/fr/outils/dates/calculateur-de-duree",
    "/fr/outils/informatique/convertisseur-de-debit-internet",
    "/fr/outils/informatique/calculateur-de-temps-de-telechargement",
    "/fr/outils/informatique/calculateur-de-taille-de-fichier",
    "/fr/outils/informatique/convertisseur-de-taille-de-fichier",
    "/fr/outils/fichiers/compteur-de-mots-et-caracteres",
  "/en/tools/files/word-character-counter",
  ];

  for (const route of publishedToolRoutes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    expect(response?.ok(), `Expected ${route} to return a successful response.`).toBe(true);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("tool page keeps the primary task hierarchy compact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl + "/fr/outils/calculs/calculateur-de-pourcentage", { waitUntil: "networkidle" });

  const toolHeader = page.locator("main > header");
  await expect(toolHeader).toBeVisible();
  await expect(toolHeader.getByText("Loculary", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }).getByRole("link", { name: "Calculs" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }).getByRole("link", { name: "Accueil" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "← Tous les outils" })).toHaveCount(0);

  const headings = await page.locator("main h2").allTextContents();
  expect(headings.indexOf("Pour continuer")).toBeGreaterThanOrEqual(0);
  expect(headings.indexOf("Calculer un pourcentage")).toBeGreaterThan(
    headings.indexOf("Pour continuer"),
  );
});

test("processing status exposes an accessible information disclosure", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculs/calculateur-de-pourcentage`, { waitUntil: "networkidle" });

  const status = page.getByText("Traitement local", { exact: true });
  await expect(status).toBeVisible();
  await expect(page.locator("[data-tool-surface]").getByText("Traitement local", { exact: true })).toBeVisible();

  const info = page.locator('summary').filter({ hasText: "Traitement local" }).getByText("ⓘ", { exact: true });
  await expect(info).toBeVisible();

  await page.locator("summary").filter({ hasText: "Traitement local" }).click();
  await expect(page.getByText("Aucune donnée n'est envoyée à un serveur ni stockée par Loculary.", { exact: true })).toBeVisible();
});

test("English locale renders", async ({ page }) => {
  await page.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });

  await expect(page.locator("main")).toBeVisible();
});

test("calculator empty and error states explain what to do", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculs/calculateur-de-reduction`, { waitUntil: "networkidle" });

  await expect(page.getByText("Prix après réduction", { exact: true }).locator("..")).toContainText("Saisissez le prix et la remise");
  await page.getByRole("spinbutton", { name: "Prix initial" }).fill("100");
  await page.getByRole("spinbutton", { name: "Réduction" }).fill("101");
  await expect(page.locator("#reduction-error")).toHaveAttribute("role", "alert");
  await expect(page.locator("#reduction-error")).toHaveText(/Saisissez un prix positif/);
  await expect(page.locator("#reduction-error")).toHaveClass(/text-\[var\(--danger\)\]/);
});

test("calculator empty states are localized in English", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/dates/age-calculator`, { waitUntil: "networkidle" });

  const emptyResults = page.getByText("Enter a birth date to see the calculated age.", { exact: true });
  await expect(emptyResults).toHaveCount(3);
  await expect(emptyResults.first()).toBeVisible();
});

test("file size calculator computes an estimated size", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/informatique/calculateur-de-taille-de-fichier`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Taille de fichier" })).toBeVisible();
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

  await page.goto(`${baseUrl}/fr/outils/fichiers/compteur-de-mots-et-caracteres`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Mots & caractères" })).toBeVisible();
  const input = page.getByLabel("Votre texte");
  await input.fill("Bonjour le monde");
  await expect(page.getByText("Mots", { exact: true }).locator("..")).toContainText("3");
  await expect(page.getByText("Caractères", { exact: true }).locator("..")).toContainText("16");
  await page.getByRole("button", { name: "Copier les statistiques" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});
