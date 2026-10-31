import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
let baseUrl = "";
const artifactDir = join(root, "artifacts", "browser");
const axePath = join(dirname(require.resolve("axe-core")), "axe.min.js");
const axeSource = readFileSync(axePath, "utf8");
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const viewports = [
  { width: 320, height: 800, mobile: true },
  { width: 390, height: 844, mobile: true },
  { width: 768, height: 1024, mobile: false },
  { width: 1440, height: 900, mobile: false },
  { width: 1920, height: 1080, mobile: false },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes("/") && spawnSync(candidate, ["--version"], { stdio: "ignore" }).status === 0) {
      return candidate;
    }
    const result = spawnSync("which", [candidate], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  throw new Error("Aucun binaire Chromium/Chrome disponible sur le runner.");
}

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitForHttp(url, timeoutMs, processRef, label) {
  const started = Date.now();
  let lastError = "aucune réponse";
  while (Date.now() - started < timeoutMs) {
    if (processRef && (processRef.exitCode !== null || processRef.signalCode !== null)) {
      throw new Error(label + " s'est arrêté avant d'être prêt (code " + processRef.exitCode + ").");
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = "HTTP " + response.status;
    } catch (error) {
      lastError = error.message;
    }
    await delay(300);
  }
  throw new Error(label + " indisponible : " + lastError);
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message);
        return;
      }

      const listeners = this.listeners.get(message.method);
      if (!listeners?.length) return;
      const listener = listeners.shift();
      clearTimeout(listener.timer);
      listener.resolve(message.params);
    });

    socket.addEventListener("close", () => {
      for (const pending of this.pending.values()) {
        clearTimeout(pending.timer);
        pending.reject(new Error("Connexion Chromium fermée."));
      }
      this.pending.clear();
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("Timeout CDP : " + method));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  waitForEvent(method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const listeners = this.listeners.get(method) ?? [];
      const listener = { resolve, reject, timer: null };
      listener.timer = setTimeout(() => {
        const current = this.listeners.get(method) ?? [];
        const index = current.indexOf(listener);
        if (index >= 0) current.splice(index, 1);
        reject(new Error("Événement Chromium absent : " + method));
      }, timeoutMs);
      listeners.push(listener);
      this.listeners.set(method, listeners);
    });
  }

  async evaluate(expression, awaitPromise = false) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise,
      userGesture: true,
    });
    if (response.result.exceptionDetails) {
      const detail = response.result.exceptionDetails;
      throw new Error("Erreur JavaScript navigateur : " + (detail.text ?? "exception"));
    }
    return response.result.result?.value;
  }
}

async function stopProcess(processRef) {
  if (!processRef || processRef.exitCode !== null || processRef.signalCode !== null) return;
  processRef.kill("SIGTERM");
  const exited = await Promise.race([
    new Promise((resolve) => processRef.once("exit", () => resolve(true))),
    delay(5000).then(() => false),
  ]);
  if (!exited && processRef.exitCode === null && processRef.signalCode === null) {
    processRef.kill("SIGKILL");
    await new Promise((resolve) => {
      if (processRef.exitCode !== null || processRef.signalCode !== null) return resolve();
      processRef.once("exit", resolve);
    });
  }
}

async function main() {
  mkdirSync(artifactDir, { recursive: true });
  const chromeBin = findChrome();
  const appPort = await reservePort();
  baseUrl = "http://127.0.0.1:" + appPort;
  const chromePort = await reservePort();
  const profileDir = mkdtempSync(join(tmpdir(), "loculary-chrome-"));
  const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
  let serverLogs = "";
  let chromeLogs = "";
  let server;
  let chrome;
  let socket;

  try {
    server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(appPort)], {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "ignore", "pipe"],
    });
    server.stderr.on("data", (chunk) => { serverLogs += chunk.toString(); });
    await waitForHttp(baseUrl + "/fr/design-lab", 60000, server, "Serveur Next.js");

    chrome = spawn(chromeBin, [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--no-first-run",
      "--remote-allow-origins=*",
      "--remote-debugging-port=" + chromePort,
      "--user-data-dir=" + profileDir,
      "about:blank",
    ], { stdio: ["ignore", "ignore", "pipe"] });
    chrome.stderr.on("data", (chunk) => { chromeLogs += chunk.toString(); });

    const cdpBase = "http://127.0.0.1:" + chromePort;
    await waitForHttp(cdpBase + "/json/version", 20000, chrome, "Chromium DevTools");
    const targetResponse = await fetch(cdpBase + "/json/new?about:blank", { method: "PUT" });
    assert(targetResponse.ok, "Impossible de créer un onglet Chromium : HTTP " + targetResponse.status);
    const target = await targetResponse.json();

    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    const cdp = new CdpClient(socket);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    async function navigate(path) {
      const loaded = cdp.waitForEvent("Page.loadEventFired");
      await cdp.send("Page.navigate", { url: baseUrl + path });
      await loaded;
      await cdp.evaluate("document.fonts.ready.then(() => true)", true);
      await delay(200);
    }

    async function setViewport(viewport) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      await delay(120);
    }

    async function capture(name) {
      const screenshot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      writeFileSync(join(artifactDir, name + ".png"), Buffer.from(screenshot.result.data, "base64"));
    }

    async function checkOverflow(path, locale, viewport) {
      await setViewport(viewport);
      const metrics = await cdp.evaluate("(() => { const root = document.documentElement; return { width: innerWidth, clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, bodyWidth: document.body.scrollWidth, lang: root.lang, title: document.title }; })()");
      assert(metrics.lang.startsWith(locale), path + " : langue inattendue (" + metrics.lang + ").");
      assert(metrics.scrollWidth <= metrics.clientWidth + 1,
        path + " déborde horizontalement à " + viewport.width + "px : " + JSON.stringify(metrics));
      assert(metrics.bodyWidth <= metrics.clientWidth + 1,
        path + " : le body déborde à " + viewport.width + "px : " + JSON.stringify(metrics));
      if (viewport.width <= 390) {
        const guidedLabel = await cdp.evaluate("(() => { const link = Array.from(document.querySelectorAll('a[data-nav-key=\"guided\"]')).find((item) => item.getClientRects().length); const label = link?.lastElementChild; return link && label ? { text: label.textContent.trim(), width: label.clientWidth, scrollWidth: label.scrollWidth, ariaLabel: link.getAttribute('aria-label') } : null; })()");
        const expectedLabel = locale === "fr" ? "Parcours" : "Guides";
        const expectedAccessibleName = expectedLabel;
        assert(guidedLabel && guidedLabel.text === expectedLabel && guidedLabel.scrollWidth <= guidedLabel.width + 1,
          path + " : libellé du parcours tronqué sur mobile : " + JSON.stringify(guidedLabel));
        assert(guidedLabel.ariaLabel === expectedAccessibleName,
          path + " : nom accessible du parcours mobile incorrect : " + JSON.stringify(guidedLabel));
      }
      await capture(locale + "-design-lab-light-" + viewport.width);
      console.log("Responsive OK " + path + " " + viewport.width + "px");
    }

    async function checkLongLabel(locale) {
      const result = await cdp.evaluate("(() => { const el = document.querySelector('[data-testid=\"long-label-button\"]'); if (!el) return null; const range = document.createRange(); range.selectNodeContents(el); const rect = el.getBoundingClientRect(); return { text: el.innerText, whiteSpace: getComputedStyle(el).whiteSpace, lines: range.getClientRects().length, width: rect.width, right: rect.right, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }; })()");
      assert(result, "Spécimen de libellé long absent pour " + locale + ".");
      assert(result.whiteSpace === "pre-line", "Le libellé long ne permet pas le retour à la ligne : " + JSON.stringify(result));
      assert(result.lines >= 2, "Le libellé " + locale + " ne se replie pas sur plusieurs lignes : " + JSON.stringify(result));
      assert(result.scrollWidth <= result.clientWidth + 1, "Le libellé " + locale + " déborde dans son bouton : " + JSON.stringify(result));
      assert(result.right <= 321, "Le bouton long dépasse le viewport mobile : " + JSON.stringify(result));
      console.log("Libellé long " + locale + " OK : " + result.lines + " lignes.");
    }

    async function runAxe(label) {
      await cdp.evaluate(axeSource);
      const result = await cdp.evaluate(
        "axe.run(document, { runOnly: { type: 'tag', values: " + JSON.stringify(wcagTags) + " } }).then(function (r) { return { violations: r.violations.map(function (v) { return { id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(function (n) { return { target: n.target, summary: n.failureSummary }; }) }; }), incomplete: r.incomplete.map(function (v) { return v.id; }) }; })",
        true,
      );
      if (result.violations.length) {
        throw new Error("Violations axe-core " + label + " : " + JSON.stringify(result.violations, null, 2));
      }
      console.log("axe-core " + label + " : 0 violation WCAG ; contrôles incomplets : " + result.incomplete.join(", "));
    }

    async function testFocusVisible() {
      await cdp.evaluate("if (document.activeElement) document.activeElement.blur(); document.body.setAttribute('tabindex', '-1'); document.body.focus(); true");
      let found = false;
      for (let index = 0; index < 50; index += 1) {
        await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
        await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
        found = await cdp.evaluate("document.activeElement?.getAttribute('data-testid') === 'long-label-button'");
        if (found) break;
      }
      assert(found, "Le bouton de libellé long n'est pas atteignable au clavier en 50 tabulations.");
      const focus = await cdp.evaluate("(() => { const el = document.activeElement; const style = getComputedStyle(el); return { focusVisible: el.matches(':focus-visible'), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow }; })()");
      const visibleRing = focus.outlineStyle !== "none" && focus.outlineWidth !== "0px" || focus.boxShadow !== "none";
      assert(focus.focusVisible && visibleRing, "Le focus clavier du bouton n'est pas visuellement identifiable : " + JSON.stringify(focus));
      console.log("Focus clavier visible OK.");
    }

    async function testSearchKeyboard() {
      await navigate("/fr/design-lab");
      await setViewport({ width: 390, height: 844, mobile: true });
      const opened = await cdp.evaluate("(() => { const trigger = document.querySelector('[data-testid=header-search-trigger]'); if (!trigger) return false; trigger.click(); return true; })()");
      assert(opened, "Déclencheur de recherche mobile introuvable.");
      await delay(120);
      const focused = await cdp.evaluate("(() => { const input = document.getElementById('header-tool-search-input'); if (!input) return false; input.focus(); return true; })()");
      assert(focused, "Champ de recherche combobox introuvable après ouverture.");
      await cdp.send("Input.insertText", { text: "json" });
      await delay(500);
      const readState = "(() => { const input = document.getElementById('header-tool-search-input'); const list = input?.getAttribute('aria-controls') ? document.getElementById(input.getAttribute('aria-controls')) : null; return { expanded: input?.getAttribute('aria-expanded'), listRole: list?.getAttribute('role'), options: list?.querySelectorAll('[role=option]').length ?? 0 }; })()";
      let state = await cdp.evaluate(readState);
      assert(state.expanded === "true" && state.listRole === "listbox" && state.options > 0,
        "Les suggestions de recherche ne s'ouvrent pas : " + JSON.stringify(state));

      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40, nativeVirtualKeyCode: 40 });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40, nativeVirtualKeyCode: 40 });
      state = await cdp.evaluate("(() => { const input = document.getElementById('header-tool-search-input'); const id = input?.getAttribute('aria-activedescendant'); const option = id ? document.getElementById(id) : null; return { id, role: option?.getAttribute('role'), expanded: input?.getAttribute('aria-expanded') }; })()");
      assert(state.id && state.role === "option" && state.expanded === "true",
        "ArrowDown ne sélectionne pas une suggestion accessible : " + JSON.stringify(state));

      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await delay(100);
      state = await cdp.evaluate("document.getElementById('header-tool-search-input')?.getAttribute('aria-expanded')");
      assert(state === "false", "Escape ne ferme pas la liste de suggestions.");

      await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40, nativeVirtualKeyCode: 40 });
      await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40, nativeVirtualKeyCode: 40 });
      await delay(150);
      state = await cdp.evaluate("document.getElementById('header-tool-search-input')?.getAttribute('aria-expanded')");
      assert(state === "true", "ArrowDown ne rouvre pas les suggestions après Escape.");
      console.log("Recherche clavier OK : ouverture, sélection, Escape et réouverture.");
    }

    const locales = [
      { locale: "fr", path: "/fr/design-lab" },
      { locale: "en", path: "/en/design-lab" },
    ];

    for (const entry of locales) {
      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
      await navigate(entry.path);
      for (const viewport of viewports) {
        await checkOverflow(entry.path, entry.locale, viewport);
        if (viewport.width === 320) await checkLongLabel(entry.locale);
      }
      await setViewport({ width: 390, height: 844, mobile: true });
      await testFocusVisible();
      await runAxe(entry.locale + " light");

      await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
      await navigate(entry.path);
      await setViewport({ width: 390, height: 844, mobile: true });
      await capture(entry.locale + "-design-lab-dark-390");
      await runAxe(entry.locale + " dark");
    }

    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await navigate("/fr/design-lab");
    await setViewport({ width: 390, height: 844, mobile: true });
    const reducedMotion = await cdp.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches");
    assert(reducedMotion, "Le navigateur n'émule pas prefers-reduced-motion: reduce.");
    const transition = await cdp.evaluate("(() => { const style = getComputedStyle(document.querySelector('[data-testid=long-label-button]')); return { property: style.transitionProperty, durations: style.transitionDuration.split(',').map((value) => { const item = value.trim(); const amount = Number.parseFloat(item); return item.endsWith('ms') ? amount / 1000 : amount; }) }; })()");
    assert(transition.property === "none" || (transition.durations.length > 0 && transition.durations.every((value) => Number.isFinite(value) && value <= 0.001)),
      "Le bouton conserve une transition sous réduction des animations : " + JSON.stringify(transition));
    console.log("Réduction des animations OK.");

    await testSearchKeyboard();
    console.log("Browser smoke tests terminés. Captures disponibles dans artifacts/browser/.");
  } finally {
    if (socket && socket.readyState === WebSocket.OPEN) socket.close();
    await stopProcess(chrome);
    await stopProcess(server);
    try {
      rmSync(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    } catch (error) {
      console.warn("Profil Chromium temporaire non supprimé : " + error.message);
    }
    if (serverLogs.includes("Error:")) console.error("Next server logs:\n" + serverLogs);
    if (chromeLogs.includes("ERROR")) console.error("Chromium logs:\n" + chromeLogs);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
