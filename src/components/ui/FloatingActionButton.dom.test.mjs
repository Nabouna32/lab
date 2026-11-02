import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement } from "react";

const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {
    __esModule: true,
    default: new Proxy({}, { get: (_target, property) => String(property) }),
  };
};

const browser = new Window({ url: "http://localhost" });
const componentCss = readFileSync(new URL("./FloatingActionButton.module.css", import.meta.url), "utf8");
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "Element",
  "Node",
  "Event",
  "MutationObserver",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value: key === "window" ? browser : key === "document" ? browser.document : browser[key],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createRoot } = await import("react-dom/client");
const {
  ExtendedFloatingActionButton,
  FloatingActionButton,
  FloatingActionButtonDefaults,
  LargeFloatingActionButton,
  SmallFloatingActionButton,
} = await import("./FloatingActionButton.tsx");
const roots = [];

async function render(element) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => root.render(element));
  return container;
}

afterEach(async () => {
  await act(async () => {
    for (const root of roots.splice(0)) root.unmount();
  });
  document.body.replaceChildren();
});

after(async () => {
  await browser.happyDOM.abort();
});

test("standard, small and large FABs expose the AndroidX minimum dimensions and semantic button type", async () => {
  const container = await render(
    createElement(
      "div",
      null,
      createElement(FloatingActionButton, { onClick: () => {}, "aria-label": "Create" }, "＋"),
      createElement(SmallFloatingActionButton, { onClick: () => {}, "aria-label": "Small" }, "＋"),
      createElement(LargeFloatingActionButton, { onClick: () => {}, "aria-label": "Large" }, "＋"),
    ),
  );

  const [standard, small, large] = container.querySelectorAll("button");
  assert.equal(standard.type, "button");
  assert.equal(standard.getAttribute("data-variant"), "default");
  assert.equal(small.getAttribute("data-variant"), "small");
  assert.equal(large.getAttribute("data-variant"), "large");
  assert.equal(standard.style.minWidth, "");
  assert.equal(standard.style.getPropertyValue("--fab-container-color"), FloatingActionButtonDefaults.containerColor);
  assert.equal(standard.style.getPropertyValue("--fab-content-color"), "var(--on-primary-container, #041e49)");
  assert.equal(FloatingActionButtonDefaults.LargeIconSize, 36);
});

test("custom FAB container colors inherit content color unless an explicit content color is supplied", async () => {
  const container = await render(
    createElement(
      "div",
      null,
      createElement(FloatingActionButton, {
        onClick: () => {},
        containerColor: "#abcdef",
        "aria-label": "Custom",
      }, "＋"),
      createElement(FloatingActionButton, {
        onClick: () => {},
        containerColor: "#123456",
        contentColor: "#fedcba",
        "aria-label": "Explicit",
      }, "＋"),
    ),
  );

  const [inherited, explicit] = container.querySelectorAll("button");
  assert.equal(inherited.style.getPropertyValue("--fab-container-color"), "#abcdef");
  assert.equal(inherited.style.getPropertyValue("--fab-content-color"), "currentColor");
  assert.equal(explicit.style.getPropertyValue("--fab-content-color"), "#fedcba");
});

test("native disabled state is preserved while theme colors remain CSS-overridable", async () => {
  const container = await render(
    createElement(FloatingActionButton, {
      onClick: () => {},
      disabled: true,
      containerColor: "#abcdef",
      contentColor: "#123456",
      "aria-label": "Unavailable",
    }, "＋"),
  );

  const button = container.querySelector("button");
  assert.equal(button.disabled, true);
  assert.equal(button.style.getPropertyValue("--fab-container-color"), "#abcdef");
  assert.equal(button.style.getPropertyValue("--fab-content-color"), "#123456");
  assert.equal(button.style.boxShadow, "");
});

test("extended FAB content overload keeps the AndroidX minimum width and semantic label", async () => {
  const container = await render(
    createElement(ExtendedFloatingActionButton, {
      onClick: () => {},
      "aria-label": "Create document",
    }, createElement("span", null, "Create document")),
  );

  const button = container.querySelector("button");
  assert.equal(button.getAttribute("data-variant"), "extendedContent");
  assert.equal(button.getAttribute("aria-label"), "Create document");
});

test("extended icon/text FAB exposes expanded and collapsed states accessibly", async () => {
  const container = await render(
    createElement(
      "div",
      null,
      createElement(ExtendedFloatingActionButton, {
        onClick: () => {},
        icon: createElement("span", { "aria-hidden": "true" }, "＋"),
        text: "Create",
      }),
      createElement(ExtendedFloatingActionButton, {
        onClick: () => {},
        icon: createElement("span", { "aria-hidden": "true" }, "＋"),
        text: "Create",
        expanded: false,
        "aria-label": "Create",
      }),
    ),
  );

  const [expanded, collapsed] = container.querySelectorAll("button");
  assert.equal(expanded.getAttribute("data-expanded"), "true");
  assert.equal(expanded.querySelector(".extendedText")?.getAttribute("aria-hidden"), "false");
  assert.equal(expanded.querySelector(".extendedText")?.textContent, "Create");
  assert.equal(collapsed.getAttribute("data-expanded"), "false");
  assert.equal(collapsed.getAttribute("aria-label"), "Create");
  assert.equal(collapsed.querySelector(".extendedText")?.getAttribute("aria-hidden"), "true");
  assert.equal(collapsed.querySelector(".extendedText")?.textContent, "Create");
});

test("FAB elevation presets match the pinned Material 3 1.4.0 tokens", () => {
  assert.deepEqual(FloatingActionButtonDefaults.elevation(), {
    defaultElevation: 6,
    pressedElevation: 6,
    focusedElevation: 6,
    hoveredElevation: 8,
  });
  assert.deepEqual(FloatingActionButtonDefaults.loweredElevation(), {
    defaultElevation: 1,
    pressedElevation: 1,
    focusedElevation: 1,
    hoveredElevation: 3,
  });
  assert.deepEqual(FloatingActionButtonDefaults.bottomAppBarFabElevation(), {
    defaultElevation: 0,
    pressedElevation: 0,
    focusedElevation: 0,
    hoveredElevation: 0,
  });
});

test("FAB CSS uses AndroidX minimum geometry and shared LabelLarge typography", () => {
  assert.match(componentCss, /\.fab\s*\{[^}]*min-width:\s*56px;[^}]*min-height:\s*56px;/s);
  assert.match(componentCss, /\.small\s*\{[^}]*min-width:\s*48px;[^}]*min-height:\s*48px;[^}]*padding:\s*4px;/s);
  assert.match(componentCss, /\.small::before\s*\{[^}]*inset:\s*4px;/s);
  assert.match(componentCss, /\.large\s*\{[^}]*min-width:\s*96px;[^}]*min-height:\s*96px;/s);
  assert.match(componentCss, /\.extended,\s*\.extendedContent\s*\{[^}]*min-width:\s*80px;[^}]*min-height:\s*56px;/s);
  assert.match(componentCss, /font-size:\s*var\(--m3-type-label-large-size/);
  assert.match(componentCss, /\.fab:disabled::before\s*\{[^}]*box-shadow:\s*none;[^}]*background:/s);
});
