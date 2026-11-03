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
const componentCss = readFileSync(new URL("./Snackbar.module.css", import.meta.url), "utf8");
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
const { Snackbar } = await import("./Snackbar.tsx");
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

test("dismiss action is opt-in, matching SnackbarVisuals.withDismissAction", async () => {
  const onDismiss = () => {};
  const withoutDismiss = await render(
    createElement(Snackbar, { open: true, message: "Saved", onDismiss }),
  );
  assert.equal(withoutDismiss.querySelector('[aria-label="Dismiss"]'), null);

  const withDismiss = await render(
    createElement(Snackbar, { open: true, message: "Saved", onDismiss, withDismissAction: true }),
  );
  assert.ok(withDismiss.querySelector('[aria-label="Dismiss"]'));
});

test("action invokes its callback and then dismisses the snackbar", async () => {
  let actionCount = 0;
  let dismissCount = 0;
  const container = await render(
    createElement(
      Snackbar,
      {
        open: true,
        message: "Archived",
        actionLabel: "Undo",
        onAction: () => { actionCount += 1; },
        onDismiss: () => { dismissCount += 1; },
      },
    ),
  );

  const action = [...container.querySelectorAll("button")].find((button) => button.textContent === "Undo");
  assert.ok(action);
  await act(async () => action.click());
  assert.equal(actionCount, 1);
  assert.equal(dismissCount, 1);
});

test("visual colors and shape are configurable without changing the message semantics", async () => {
  const container = await render(
    createElement(Snackbar, {
      open: true,
      message: "Saved",
      onDismiss: () => {},
      containerColor: "#123456",
      contentColor: "#abcdef",
      actionContentColor: "#fedcba",
      dismissActionContentColor: "#010203",
      shape: "12px",
      withDismissAction: true,
    }),
  );

  const snackbar = container.querySelector('[role="status"]');
  assert.equal(snackbar.textContent.includes("Saved"), true);
  assert.equal(snackbar.style.getPropertyValue("--snackbar-container-color"), "#123456");
  assert.equal(snackbar.style.getPropertyValue("--snackbar-content-color"), "#abcdef");
  assert.equal(snackbar.style.getPropertyValue("--snackbar-action-color"), "#fedcba");
  assert.equal(snackbar.style.getPropertyValue("--snackbar-dismiss-color"), "#010203");
  assert.equal(snackbar.style.getPropertyValue("--snackbar-shape"), "12px");
});

test("actionOnNewLine is applied only when an action is actually rendered", async () => {
  const withAction = await render(
    createElement(Snackbar, {
      open: true,
      message: "Saved",
      actionLabel: "Undo",
      onAction: () => {},
      onDismiss: () => {},
      actionOnNewLine: true,
    }),
  );
  assert.ok(withAction.querySelector(".actionOnNewLine"));

  const withoutAction = await render(
    createElement(Snackbar, {
      open: true,
      message: "Saved",
      onDismiss: () => {},
      actionOnNewLine: true,
    }),
  );
  assert.equal(withoutAction.querySelector(".actionOnNewLine"), null);
});

test("snackbar keeps a polite atomic live announcement and source visual tokens", async () => {
  const container = await render(
    createElement(Snackbar, { open: true, message: "Saved", onDismiss: () => {} }),
  );
  const snackbar = container.querySelector('[role="status"]');
  assert.equal(snackbar.getAttribute("aria-live"), "polite");
  assert.equal(snackbar.getAttribute("aria-atomic"), "true");
  assert.match(componentCss, /min-height:\s*var\(--m3-size-snackbar-single-line-height\)/);
  assert.match(componentCss, /max-width:\s*var\(--m3-size-snackbar-max-width\)/);
  assert.match(componentCss, /box-shadow:/);
  assert.match(componentCss, /border-radius:\s*var\(--snackbar-shape/);
});
