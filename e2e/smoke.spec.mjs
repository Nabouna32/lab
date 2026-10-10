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
  await page.goto(`${baseUrl}/en/tools/percentage-calculator`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Menu" }).click();
  const frenchLink = page.getByRole("link", { name: "Français" });
  await expect(frenchLink).toBeVisible();
  await frenchLink.click();
  await expect(page).toHaveURL(/\/fr\/outils\/calculateur-de-pourcentage$/);
});

test("French homepage renders", async ({ page }) => {
  await page.goto(`${baseUrl}/fr`, { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Loculary/i);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link").first()).toBeVisible();
});

test("homepage search stays concise and category discovery adapts to viewport", async ({ page }) => {
  const locales = [
    { locale: "fr", placeholder: "Que veux-tu faire ?", submitLabel: "Lancer la recherche", allTools: "Tous les outils", categories: "Catégories" },
    { locale: "en", placeholder: "Need a tool?", submitLabel: "Search tools", allTools: "All tools", categories: "Categories" },
  ];
  const widths = [320, 390, 768, 1024, 1440];

  for (const { locale, placeholder, submitLabel, allTools, categories } of locales) {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${baseUrl}/${locale}`, { waitUntil: "networkidle" });

    const search = page.locator("#home-tool-search-v4-input");
    await expect(search).toHaveAttribute("placeholder", placeholder);
    const allToolsLink = page.locator("main").getByRole("link", { name: allTools, exact: true });
    await expect(allToolsLink).toHaveCount(1);
    expect(
      await allToolsLink.evaluate((link) => link.firstElementChild?.tagName.toLowerCase() === "svg"),
      `The ${locale} all-tools link should lead with its navigation arrow.`,
    ).toBe(true);
    await expect(page.locator("main").getByRole("navigation", { name: categories })).toBeVisible();
    const submitButton = page.locator("#home-tool-search-v4").getByRole("button", { name: submitLabel, exact: true });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();

    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      const measurements = await page.evaluate((locale) => {
        const input = document.querySelector("#home-tool-search-v4-input");
        const navigation = document.querySelector("main nav");
        const searchBlock = document.querySelector("#home-search");
        const contentBlock = searchBlock?.parentElement;
        const title = document.querySelector("#home-title");
        if (!input || !navigation || !searchBlock || !contentBlock || !title) return null;

        const searchRect = searchBlock.getBoundingClientRect();
        const contentRect = contentBlock.getBoundingClientRect();
        let finalWordLineOffset = null;
        if (locale === "fr") {
          const titleText = title.textContent ?? "";
          const ideaIndex = titleText.lastIndexOf("idées");
          const tesIndex = titleText.lastIndexOf("tes", ideaIndex);
          const textNode = title.firstChild;
          if (textNode && ideaIndex >= 0 && tesIndex >= 0) {
            const tesRange = document.createRange();
            tesRange.setStart(textNode, tesIndex);
            tesRange.setEnd(textNode, tesIndex + 3);
            const ideaRange = document.createRange();
            ideaRange.setStart(textNode, ideaIndex);
            ideaRange.setEnd(textNode, ideaIndex + 5);
            finalWordLineOffset = Math.abs(tesRange.getBoundingClientRect().top - ideaRange.getBoundingClientRect().top);
          }
        }

        const style = getComputedStyle(input);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return null;

        context.font = style.font;
        return {
          documentWidth: document.documentElement.scrollWidth,
          searchCenterOffset: Math.abs((searchRect.left + searchRect.width / 2) - (contentRect.left + contentRect.width / 2)),
          finalWordLineOffset,
          placeholderWidth: context.measureText(input.placeholder).width,
          availableWidth: input.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight),
          navigationDisplay: getComputedStyle(navigation).display,
          navigationColumns: getComputedStyle(navigation).gridTemplateColumns.split(" ").length,
        };
      }, locale);

      expect(measurements, `Expected search and category navigation at ${width}px.`).not.toBeNull();
      expect(measurements.documentWidth, `Unexpected horizontal overflow at ${width}px in ${locale}.`).toBeLessThanOrEqual(width);
      expect(measurements.searchCenterOffset, `Search should be centered in the hero content at ${width}px in ${locale}.`).toBeLessThanOrEqual(1);
      if (locale === "fr") {
        expect(measurements.finalWordLineOffset, `“idées” should share a line with “tes” at ${width}px.`).toBeLessThanOrEqual(1);
      }
      expect(measurements.placeholderWidth + 8, `Placeholder should fit the input at ${width}px in ${locale}.`).toBeLessThanOrEqual(measurements.availableWidth);
      expect(measurements.navigationDisplay).toBe("grid");
      expect(measurements.navigationColumns).toBe(width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4);
    }
  }
});

test("responsive header keeps search available on mobile and tablet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/fr`, { waitUntil: "networkidle" });

  const header = page.locator("header");
  await header.getByRole("button", { name: "Menu" }).click();
  await expect(header.getByRole("link", { name: "Compte" })).toBeVisible();
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
  await expect(page.locator("#tools-page-search-results").getByText("Calculateur de pourcentage", { exact: true })).toBeVisible();
  await expect(page.locator("#tools-page-search-results").getByText(/Calculs/)).toBeVisible();
  await expect(page.locator("#tools-page-search-result-0")).toContainText("Calculez un pourcentage, une évolution ou l’écart entre deux valeurs.");

  await search.press("ArrowDown");
  await expect(page.locator("#tools-page-search-result-0")).toHaveAttribute("aria-selected", "true");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/fr\/outils\/calculateur-de-pourcentage$/);
});

test("search submission opens all matching tools and handles unique/no-result queries", async ({ page }) => {
  for (const locale of [
    { code: "fr", submitLabel: "Lancer la recherche", route: `${baseUrl}/fr/recherche#q=json`, heading: /Résultats pour/ },
    { code: "en", submitLabel: "Search tools", route: `${baseUrl}/en/search#q=json`, heading: /Results for/ },
  ]) {
    await page.goto(`${baseUrl}/${locale.code}`, { waitUntil: "domcontentloaded" });
    const search = page.locator("#home-tool-search-v4-input");
    await search.fill("json");
    const suggestions = page.locator("#home-tool-search-v4-results");
    await expect(suggestions.getByRole("option").nth(1)).toBeVisible();
    await page.locator("#home-tool-search-v4").getByRole("button", { name: locale.submitLabel }).click();
    await expect(page).toHaveURL(locale.route);
    await expect(page.getByRole("heading", { name: locale.heading })).toBeVisible();
    const resultCount = await page.locator("#search-results-list a").count();
    expect(resultCount).toBeGreaterThan(1);
  }

  await page.goto(`${baseUrl}/fr`, { waitUntil: "domcontentloaded" });
  const uniqueSearch = page.locator("#home-tool-search-v4-input");
  await uniqueSearch.fill("calculer 17 % de 283");
  await expect(page.locator("#home-tool-search-v4-results").getByRole("option").first()).toBeVisible();
  await page.locator("#home-tool-search-v4").getByRole("button", { name: "Lancer la recherche" }).click();
  await expect(page).toHaveURL(`${baseUrl}/fr/outils/calculateur-de-pourcentage`);

  await page.goto(`${baseUrl}/fr`, { waitUntil: "domcontentloaded" });
  const unmatchedSearch = page.locator("#home-tool-search-v4-input");
  await unmatchedSearch.fill("zzzzzzzz");
  await expect(page.locator("#home-tool-search-v4-results").getByText(/Aucun outil ne correspond à/)).toBeVisible();
  await page.locator("#home-tool-search-v4").getByRole("button", { name: "Lancer la recherche" }).click();
  await expect(page).toHaveURL(`${baseUrl}/fr/recherche#q=zzzzzzzz`);
  await expect(page.getByRole("heading", { name: /Aucun outil ne correspond à/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "TVA", exact: true })).toBeVisible();

  await page.goto(`${baseUrl}/en/search#q=json`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Français" }).click();
  await expect(page).toHaveURL(`${baseUrl}/fr/recherche#q=json`);
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

  await expect(page.getByRole("heading", { name: "Tous les outils", exact: true })).toBeVisible();
  await expect(page.locator("#tools-page-search-input")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Parcourir par catégorie" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Calculs.*6 outils/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Informatique.*6 outils/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Calculateur de pourcentage", exact: true })).toBeVisible();
});

test("representative published tool pages render", async ({ page }) => {
  const representativeToolRoutes = [
    "/fr/outils/calculateur-de-pourcentage",
    "/fr/outils/calculateur-d-interets-composes",
    "/fr/outils/calculateur-de-reduction",
    "/fr/outils/calculateur-de-tva",
    "/fr/outils/regle-de-trois",
    "/fr/outils/calculateur-d-age",
    "/fr/outils/calculateur-de-duree",
    "/fr/outils/convertisseur-de-debit-internet",
    "/fr/outils/calculateur-de-temps-de-telechargement",
    "/fr/outils/calculateur-de-taille-de-fichier",
    "/fr/outils/convertisseur-de-taille-de-fichier",
    "/fr/outils/generateur-de-mot-de-passe",
    "/fr/outils/convertisseur-d-unites",
    "/fr/outils/compteur-de-mots-et-caracteres",
    "/fr/outils/convertisseur-de-casse",
    "/fr/outils/convertisseur-de-couleur",
    "/fr/outils/generateur-de-palette-de-couleurs",
    "/fr/outils/formateur-json",
    "/fr/outils/encodeur-decodeur-url",
    "/fr/outils/encodeur-base64",
    "/fr/outils/encodeur-decodeur-entites-html",
    "/fr/outils/convertisseur-csv-json",
    "/fr/outils/json-vers-typescript",
    "/en/tools/json-to-typescript",
    "/en/tools/csv-json-converter",
    "/en/tools/html-entity-encoder-decoder",
    "/fr/outils/generateur-uuid",
    "/fr/outils/convertisseur-de-bases",
  "/en/tools/word-character-counter",
  ];

  for (const route of representativeToolRoutes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    expect(response?.status(), `Expected ${route} to return HTTP 200.`).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("unit converter converts values and swaps units", async ({ page }) => {
  await page.goto(baseUrl + "/fr/outils/convertisseur-d-unites", { waitUntil: "networkidle" });

  const value = page.locator("#unit-converter-value");
  await value.fill("1,5");
  await page.locator("#unit-converter-from").selectOption("m");
  await page.locator("#unit-converter-to").selectOption("cm");
  await expect(page.getByRole("region", { name: "Résultat" })).toContainText("150");

  await page.getByRole("button", { name: "Inverser les unités" }).click();
  await expect(page.getByRole("region", { name: "Résultat" })).toContainText("0,015");
});

test("tool page keeps the primary task hierarchy compact", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl + "/fr/outils/calculateur-de-pourcentage", { waitUntil: "networkidle" });

  const toolHeader = page.locator("main > header");
  await expect(toolHeader).toBeVisible();
  await expect(toolHeader.getByText("Loculary", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }).getByRole("link", { name: "Outils" })).toHaveAttribute("href", "/fr/outils");
  await expect(page.getByRole("navigation", { name: "Fil d’Ariane" }).getByRole("link", { name: "Accueil" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "← Tous les outils" })).toHaveCount(0);

  const headings = await page.locator("main h2").allTextContents();
  expect(headings.indexOf("Pour continuer")).toBeGreaterThanOrEqual(0);
  expect(headings.indexOf("Calculer un pourcentage")).toBeGreaterThan(
    headings.indexOf("Pour continuer"),
  );
});

test("processing status exposes an accessible information disclosure", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculateur-de-pourcentage`, { waitUntil: "networkidle" });

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
  await page.goto(`${baseUrl}/fr/outils/calculateur-de-reduction`, { waitUntil: "networkidle" });

  await expect(page.getByRole("region", { name: "Prix après réduction" })).toContainText("Saisissez le prix et la remise");
  await page.getByRole("spinbutton", { name: "Prix initial" }).fill("100");
  await page.getByRole("spinbutton", { name: "Réduction" }).fill("101");
  await expect(page.locator("#reduction-error")).toHaveAttribute("role", "alert");
  await expect(page.locator("#reduction-error")).toHaveText(/Saisissez un prix positif/);
  await expect(page.locator("#reduction-error")).toHaveClass(/text-\[var\(--danger\)\]/);
});

test("calculator empty states are localized in English", async ({ page }) => {
  await page.goto(`${baseUrl}/en/tools/age-calculator`, { waitUntil: "networkidle" });

  const emptyResults = page.getByText("Enter a birth date to see the calculated age.", { exact: true });
  await expect(emptyResults).toHaveCount(3);
  await expect(emptyResults.first()).toBeVisible();
});

test("file size calculator computes an estimated size", async ({ page }) => {
  await page.goto(`${baseUrl}/fr/outils/calculateur-de-taille-de-fichier`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "Taille de fichier" })).toBeVisible();
  await page.getByRole("spinbutton", { name: "Durée" }).fill("10");
  await page.getByRole("spinbutton", { name: "Débit" }).fill("8");
  await expect(page.getByRole("region", { name: "Taille estimée" })).toContainText("600 Mo");
});

test("text counter tool renders and counts words", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(`${baseUrl}/fr/outils/compteur-de-mots-et-caracteres`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Compteur de mots et caractères" })).toBeVisible();
  const input = page.getByLabel("Votre texte");
  await input.fill("Bonjour le monde");
  await expect(page.getByRole("region", { name: "Mots" })).toContainText("3");
  await expect(page.getByRole("region", { name: "Caractères", exact: true })).toContainText("16");
  await page.getByRole("button", { name: "Copier les statistiques" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});


test("JSON to TypeScript generator creates typed interfaces", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/json-vers-typescript", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "JSON vers TypeScript" })).toBeVisible();

  await page.getByRole("textbox", { name: "Votre JSON" }).fill('{"user":{"name":"Alice"},"active":true}');
  await page.getByRole("textbox", { name: "Nom du type racine" }).fill("Profile");
  await page.getByRole("button", { name: "Générer" }).click();
  await expect(page.locator("pre")).toContainText("export interface Profile");
  await expect(page.locator("pre")).toContainText("user: ProfileUser;");
  await expect(page.locator("pre")).toContainText("active: boolean;");
  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(page.getByRole("textbox", { name: "Votre JSON" })).toHaveValue("");
});

test("CSV and JSON converter transforms tabular data", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/convertisseur-csv-json", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Convertisseur CSV et JSON" })).toBeVisible();
  const input = page.getByRole("textbox", { name: "Données" });
  await input.fill('name,city\nAlice,"Paris, France"');
  await page.getByRole("button", { name: "CSV → JSON" }).click();
  await expect(page.locator("pre")).toContainText('"city": "Paris, France"');

  await page.getByRole("button", { name: "JSON → CSV" }).click();
  await input.fill('[{"name":"Alice","city":"Paris, France"},{"name":"Bob","city":"Lyon"}]');
  await page.getByRole("button", { name: "JSON → CSV" }).click();
  await expect(page.locator("pre")).toContainText('Alice,"Paris, France"');
  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});

test("HTML entity encoder and decoder transform and copy text", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(baseUrl + "/fr/outils/encodeur-decodeur-entites-html", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Encodeur et décodeur d’entités HTML" })).toBeVisible();
  const input = page.getByLabel("Votre texte");
  await input.fill("<p>Tom & Jerry</p>");
  await expect(page.locator("pre")).toContainText("&lt;p&gt;Tom &amp; Jerry&lt;/p&gt;");
  await page.getByRole("button", { name: "Décoder" }).click();
  await input.fill("&lt;p&gt;Bonjour &amp; bienvenue&lt;/p&gt;");
  await expect(page.locator("pre")).toContainText("<p>Bonjour & bienvenue</p>");
  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});

test("text case converter transforms and copies text", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });

  await page.goto(`${baseUrl}/fr/outils/convertisseur-de-casse`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Convertisseur de casse" })).toBeVisible();
  const input = page.getByLabel("Votre texte");
  await input.fill("hello world");
  await page.getByRole("button", { name: "camelCase" }).click();
  await expect(page.locator("pre")).toContainText("helloWorld");
  await page.getByRole("button", { name: "Copier" }).click();
  await expect(page.getByRole("button", { name: "Copié" })).toBeVisible();
  await page.getByRole("button", { name: "Effacer" }).click();
  await expect(input).toHaveValue("");
});
