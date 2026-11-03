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
const componentCss = readFileSync(new URL("./BottomAppBar.module.css", import.meta.url), "utf8");
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLDivElement",
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
const { BottomAppBar } = await import("./BottomAppBar.tsx");
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

test("BottomAppBar renders action and FAB slots without claiming a document footer landmark", async () => {
  const container = await render(
    createElement(
      BottomAppBar,
      {
        actions: createElement("button", { type: "button" }, "Home"),
        floatingActionButton: createElement("button", { type: "button" }, "Create"),
      },
    ),
  );

  const root = container.querySelector('[data-component="BottomAppBar"]');
  assert.ok(root);
  assert.equal(root.tagName, "DIV");
  assert.equal(container.querySelector("footer"), null);
  assert.equal(root.getAttribute("data-has-fab"), "true");
  assert.deepEqual([...root.querySelectorAll("button")].map((button) => button.textContent), ["Home", "Create"]);
});

test("children remains a compatibility alias for the AndroidX actions slot", async () => {
  const container = await render(
    createElement(BottomAppBar, null, createElement("button", { type: "button" }, "Action")),
  );

  const root = container.querySelector('[data-component="BottomAppBar"]');
  assert.equal(root.getAttribute("data-has-fab"), "false");
  assert.equal(root.querySelectorAll(".actions button").length, 1);
  assert.equal(root.querySelector("button").textContent, "Action");
});

test("custom container and content colors and source padding are exposed as CSS variables", async () => {
  const container = await render(
    createElement(
      BottomAppBar,
      {
        containerColor: "#abcdef",
        contentColor: "#123456",
        contentPadding: { start: 8, top: 6, end: 10 },
      },
      createElement("span", null, "Actions"),
    ),
  );

  const root = container.querySelector('[data-component="BottomAppBar"]');
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-container-color"), "#abcdef");
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-content-color"), "#123456");
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-padding-start"), "8px");
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-padding-top"), "6px");
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-padding-end"), "10px");
});

test("default color resolution follows SurfaceContainer and on-surface", async () => {
  const container = await render(createElement(BottomAppBar, null, "Actions"));
  const root = container.querySelector('[data-component="BottomAppBar"]');
  assert.match(root.style.getPropertyValue("--bottom-app-bar-container-color"), /surface-container/);
  assert.equal(root.style.getPropertyValue("--bottom-app-bar-content-color"), "var(--on-surface)");
});

test("CSS preserves the AndroidX 1.4.0 dimensions, padding, FAB slot and safe-area insets", () => {
  assert.match(componentCss, /min-height:\s*calc\(80px \+ env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(componentCss, /padding-block-start:\s*var\(--bottom-app-bar-padding-top, 4px\)/);
  assert.match(componentCss, /padding-inline-start:\s*calc\(var\(--bottom-app-bar-padding-start, 4px\) \+ env\(safe-area-inset-left, 0px\)\)/);
  assert.match(componentCss, /padding-inline-end:\s*calc\(var\(--bottom-app-bar-padding-end, 4px\) \+ env\(safe-area-inset-right, 0px\)\)/);
  assert.match(componentCss, /padding-block-start:\s*8px/);
  assert.match(componentCss, /padding-inline-end:\s*12px/);
  assert.match(componentCss, /box-shadow:\s*none/);
  assert.match(componentCss, /border-radius:\s*0/);
});
