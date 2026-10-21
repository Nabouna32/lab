import { expect, test, type Locator, type Page } from "@playwright/test";

type BrowserIssues = {
  consoleErrors: string[];
  pageErrors: string[];
  abortedRequests: string[];
  failedRequests: string[];
  badResponses: string[];
};

const browserIssues = new WeakMap<Page, BrowserIssues>();

async function getContrastRatio(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    function relativeLuminance(color: string): number {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      if (!channels || channels.length !== 3) {
        throw new Error("Could not parse computed RGB color: " + color);
      }
      const linear = channels.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    }

    const backgroundElement = element.parentElement;
    if (!backgroundElement) throw new Error("Contrast sample has no background element.");
    const foreground = relativeLuminance(getComputedStyle(element).color);
    const background = relativeLuminance(getComputedStyle(backgroundElement).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
}

test.beforeEach(async ({ page }) => {
  const issues: BrowserIssues = {
    consoleErrors: [],
    pageErrors: [],
    abortedRequests: [],
    failedRequests: [],
    badResponses: [],
  };
  browserIssues.set(page, issues);

  page.on("console", (message) => {
    if (message.type() === "error") issues.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => issues.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "failed";
    const entry = `${request.method()} ${request.url()}: ${reason}`;
    // Next.js cancels speculative RSC prefetches when navigation state changes.
    if (reason === "net::ERR_ABORTED") issues.abortedRequests.push(entry);
    else issues.failedRequests.push(entry);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      issues.badResponses.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const issues = browserIssues.get(page) ?? {
    consoleErrors: [],
    pageErrors: [],
    abortedRequests: [],
    failedRequests: [],
    badResponses: [],
  };

  let metrics: Record<string, unknown> = {};
  let accessibilityTree = "Unavailable: page did not expose an accessibility snapshot.";

  try {
    metrics = await page.evaluate(() => {
      const visible = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      };
      const controls = Array.from(document.querySelectorAll(
        'a,button,input,select,textarea,[role="button"],[role="combobox"],[tabindex]:not([tabindex="-1"])',
      )).filter(visible);
      const unnamedControls = controls.filter((element) => {
        const ariaLabel = element.getAttribute("aria-label")?.trim();
        const labelledBy = element.getAttribute("aria-labelledby");
        const title = element.getAttribute("title")?.trim();
        const text = element.textContent?.trim();
        const hasNativeLabel = (
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
        ) && Boolean(element.labels?.length);
        return !ariaLabel && !labelledBy && !title && !text && !hasNativeLabel;
      });
      const visibleLayout = Array.from(document.querySelectorAll(
        "header,main,footer,h1,h2,h3,form,[role='search'],[role='region'],button,a,input,[role='combobox']",
      )).filter(visible).slice(0, 60).map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const text = (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\\s+/g, " ");
        return {
          element: element.tagName.toLowerCase(),
          role: element.getAttribute("role"),
          text: text.slice(0, 90),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          display: style.display,
          position: style.position,
        };
      });
      const ids = Array.from(document.querySelectorAll("[id]")).map((element) => element.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      const imagesWithoutAlt = Array.from(document.images)
        .filter((image) => !image.hasAttribute("alt"))
        .map((image) => image.currentSrc || image.src);
      return {
        title: document.title,
        url: location.href,
        language: document.documentElement.lang,
        viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
        document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        headings: Array.from(document.querySelectorAll("h1,h2,h3"))
          .filter(visible)
          .slice(0, 20)
          .map((heading) => ({ level: heading.tagName, text: heading.textContent?.trim().replace(/\\s+/g, " ").slice(0, 160) })),
        visibleControlCount: controls.length,
        controlsWithoutAccessibleName: unnamedControls.slice(0, 30).map((element) => ({
          element: element.tagName.toLowerCase(),
          role: element.getAttribute("role"),
          id: element.id,
          text: element.textContent?.trim().slice(0, 80),
        })),
        imagesWithoutAlt: imagesWithoutAlt.slice(0, 30),
        duplicateIds: [...new Set(duplicateIds)].slice(0, 30),
        visibleLayout,
      };
    });
    accessibilityTree = await page.locator("body").ariaSnapshot();
  } catch (error) {
    metrics = { captureError: error instanceof Error ? error.message : String(error) };
  }

  const report = [
    `# Browser observation — ${testInfo.title}`,
    "",
    `- Project: ${testInfo.project.name}`,
    `- Result: ${testInfo.status ?? "unknown"}`,
    `- URL: ${page.url()}`,
    "",
    "## Runtime signals",
    `- JavaScript page errors: ${issues.pageErrors.length}`,
    `- Console errors: ${issues.consoleErrors.length}`,
    `- Aborted requests (often expected during navigation/prefetch): ${issues.abortedRequests.length}`,
    `- Failed requests: ${issues.failedRequests.length}`,
    `- HTTP responses >= 400: ${issues.badResponses.length}`,
    "",
    "## Layout and accessibility heuristics",
    "```json",
    JSON.stringify(metrics, null, 2),
    "```",
    "",
    "## Accessibility tree (Playwright ARIA snapshot)",
    "```text",
    accessibilityTree.slice(0, 8_000),
    "```",
    "",
    "## Console errors",
    ...issues.consoleErrors.map((message) => `- ${message}`),
    ...(issues.consoleErrors.length ? [] : ["- None observed"]),
    "",
    "## JavaScript errors",
    ...issues.pageErrors.map((message) => `- ${message}`),
    ...(issues.pageErrors.length ? [] : ["- None observed"]),
    "",
    "## Aborted requests (often expected during navigation/prefetch)",
    ...issues.abortedRequests.map((message) => `- ${message}`),
    ...(issues.abortedRequests.length ? [] : ["- None observed"]),
    "",
    "## Failed requests",
    ...issues.failedRequests.map((message) => `- ${message}`),
    ...(issues.failedRequests.length ? [] : ["- None observed"]),
    "",
    "## HTTP error responses",
    ...issues.badResponses.map((message) => `- ${message}`),
    ...(issues.badResponses.length ? [] : ["- None observed"]),
    "",
    "> Heuristic report only: overlap detection, color contrast and visual judgement are not claimed by this first smoke suite. PNG screenshots are attached separately.",
    "",
  ].join("\n");

  await testInfo.attach("visual-report", { body: report, contentType: "text/markdown" });

  try {
    const screenshot = await page.screenshot({ fullPage: true, scale: "css", animations: "disabled", timeout: 10_000 });
    await testInfo.attach("page-screenshot", { body: screenshot, contentType: "image/png" });
  } catch (error) {
    console.log(`Screenshot unavailable: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log(`\n${report}\n`);

  expect(issues.pageErrors, "unexpected JavaScript errors in the page").toEqual([]);
  expect(issues.consoleErrors, "unexpected browser console errors").toEqual([]);
});

test("French homepage renders and exposes the search combobox state", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const search = page.locator("#home-tool-search-v4").getByRole("combobox");
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute("aria-expanded", "false");
  await search.fill("sous réseau");
  await expect(search).toHaveAttribute("aria-expanded", "true", { timeout: 8_000 });
  await expect(page.locator('[data-search-popup-owner="home-tool-search-v4"]')).toBeVisible();
});

test("English homepage renders in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("IPv4 subnet calculator updates results end to end", async ({ page }) => {
  await page.goto("/fr/outils/calculateur-de-sous-reseau-ipv4");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const input = page.locator("#ip-subnet-input");
  await expect(input).toHaveValue("192.168.1.42/24");
  await input.fill("10.0.0.5/24");
  await expect(page.getByText("10.0.0.0", { exact: true })).toBeVisible();
  await expect(page.getByText("10.0.0.255", { exact: true })).toBeVisible();
});

test("image metadata cleaner processes multiple images and downloads a ZIP", async ({ page }) => {
  await page.goto("/fr/outils/analyseur-de-metadonnees-image");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/hZcAAAAASUVORK5CYII=",
    "base64",
  );
  await page.locator("#image-metadata-file").setInputFiles([
    { name: "first.png", mimeType: "image/png", buffer: png },
    { name: "second.png", mimeType: "image/png", buffer: png },
  ]);

  await expect(page.getByText("2 images sélectionnées")).toBeVisible();
  await expect(page.getByText("1 × 1 px").first()).toBeVisible();
  await page.getByRole("button", { name: "Nettoyer toutes les images" }).click();
  await expect(page.getByText("Nettoyée", { exact: true })).toHaveCount(2);
  await expect(page.getByText("2 images nettoyées sur 2. Téléchargez l’archive ZIP pour les récupérer.")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger les images nettoyées (.zip)" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("loculary-images-cleaned.zip");

  await page.getByRole("button", { name: "Réinitialiser" }).click();
  await page.locator("#image-metadata-file").setInputFiles([
    { name: "first.png", mimeType: "image/png", buffer: png },
    { name: "second.png", mimeType: "image/png", buffer: png },
  ]);
  await expect(page.getByText("2 images sélectionnées")).toBeVisible();
  await page.getByLabel("Nettoyer et optimiser en une seule opération").check();
  await page.getByRole("button", { name: "Nettoyer et optimiser toutes les images" }).click();
  await expect(page.getByText("Nettoyée et optimisée", { exact: true })).toHaveCount(2);

  const optimizedDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger les images préparées (.zip)" }).click();
  const optimizedDownload = await optimizedDownloadPromise;
  expect(optimizedDownload.suggestedFilename()).toBe("loculary-images-prepared.zip");
});

test("JSON formatter hands its result to the comparator without manual copy and paste", async ({ page }) => {
  await page.goto("/fr/outils/formateur-json");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.locator("#json-formatter-input").fill('{"name":"Loculary","version":1}');
  await page.getByRole("button", { name: "Formater", exact: true }).click();
  await expect(page.locator("pre")).toContainText('"name": "Loculary"');

  await page.getByRole("button", { name: "Comparer avec un autre JSON" }).click();
  await expect(page).toHaveURL(/\/fr\/outils\/comparateur-json$/);
  await expect(page.locator("#json-diff-right")).toHaveValue('{\n  "name": "Loculary",\n  "version": 1\n}');
  await expect(page.getByRole("status").filter({ hasText: "Le JSON formaté a été placé" })).toBeVisible();

  await page.locator("#json-diff-left").fill('{"name":"Loculary","version":0}');
  await page.getByRole("button", { name: "Comparer", exact: true }).click();
  await expect(page.getByText('$["version"]', { exact: true })).toBeVisible();
  await expect(page.getByText("1 différence", { exact: true })).toBeVisible();
});

test("JSON diff checker reports structural changes", async ({ page }) => {
  await page.goto("/fr/outils/comparateur-json");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.locator("#json-diff-left").fill('{"name":"draft","count":2}');
  await page.locator("#json-diff-right").fill('{"name":"published","count":2,"active":true}');
  await page.getByRole("button", { name: "Comparer", exact: true }).click();

  await expect(page.getByText('$["name"]', { exact: true })).toBeVisible();
  await expect(page.getByText('$["active"]', { exact: true })).toBeVisible();
  await expect(page.getByText("2 différences", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Effacer", exact: true }).click();
  await page.getByLabel("Importer un fichier: JSON de référence").setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not JSON") });
  await expect(page.locator('p[role="alert"]')).toHaveText("Choisissez un fichier JSON (.json).");
  await page.getByLabel("Importer un fichier: JSON de référence").setInputFiles({ name: "reference.json", mimeType: "application/json", buffer: Buffer.from('{"status":"draft"}') });
  await page.getByLabel("Importer un fichier: Nouveau JSON").setInputFiles({ name: "new.json", mimeType: "application/json", buffer: Buffer.from('{"status":"published"}') });
  await page.getByRole("button", { name: "Comparer", exact: true }).click();
  await expect(page.getByText('$["status"]', { exact: true })).toBeVisible();

  const exampleCode = page.getByText('{"status":"draft"} → {"status":"published"}', { exact: true });
  const exampleDescription = page.getByText('Le résultat identifie le changement à $["status"].', { exact: true });
  await expect(exampleCode).toBeVisible();
  await expect(exampleDescription).toBeVisible();
  expect(await getContrastRatio(exampleCode)).toBeGreaterThanOrEqual(4.5);
  expect(await getContrastRatio(exampleDescription)).toBeGreaterThanOrEqual(4.5);
});

test("YAML tool converts configuration values to JSON and back", async ({ page }) => {
  await page.goto("/fr/outils/formateur-validateur-yaml");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByLabel("Action").selectOption("yaml-to-json");
  await page.getByLabel("Votre YAML").fill("name: Loculary\nactive: true\ntools:\n  - JSON\n  - YAML");
  await page.getByRole("button", { name: "Convertir", exact: true }).click();
  await expect(page.locator("pre").last()).toContainText('"name": "Loculary"');
  await expect(page.locator("pre").last()).toContainText('"active": true');

  await page.getByLabel("Action").selectOption("json-to-yaml");
  await page.getByLabel("Votre JSON").fill('{"name":"Loculary","active":true}');
  await page.getByRole("button", { name: "Convertir", exact: true }).click();
  await expect(page.locator("pre").last()).toContainText("name: Loculary");
  await expect(page.locator("pre").last()).toContainText("active: true");
});


test("image compressor processes multiple local files and offers one ZIP download", async ({ page }) => {
  await page.goto("/fr/outils/compresseur-d-image");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/S5cAAAAASUVORK5CYII=", "base64");
  await page.locator("#image-compressor-file").setInputFiles([
    { name: "first.png", mimeType: "image/png", buffer: png },
    { name: "second.png", mimeType: "image/png", buffer: png },
  ]);
  await expect(page.getByText("2 images sélectionnées")).toBeVisible();
  await expect(page.getByText("2 sur 2 images optimisées")).toBeVisible({ timeout: 15000 });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger les résultats (.zip)" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("loculary-images.zip");
});
