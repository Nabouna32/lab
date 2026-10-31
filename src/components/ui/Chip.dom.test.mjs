import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement } from "react";

// CSS Modules are transformed by Next.js in production; the DOM test needs
// only stable class tokens to exercise the real React component.
const require = createRequire(import.meta.url);
require.extensions[".css"] = (module) => {
  module.exports = {
    __esModule: true,
    default: new Proxy({}, { get: (_target, property) => String(property) }),
  };
};

const browser = new Window({ url: "http://localhost" });
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
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
const { Chip } = await import("./Chip.tsx");
const mountedRoots = [];

async function render(element) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);
  await act(async () => root.render(element));
  return container;
}

afterEach(async () => {
  await act(async () => {
    for (const root of mountedRoots.splice(0)) root.unmount();
  });
  document.body.replaceChildren();
});

after(async () => {
  await browser.happyDOM.abort();
});

test("FilterChip n'alterne pas sa sélection lorsque le gestionnaire annule le clic", async () => {
  let selectedChangeCalls = 0;
  let clickCalls = 0;
  const container = await render(
    createElement(Chip, {
      variant: "filter",
      label: "Disponible",
      selected: false,
      onClick: (event) => {
        clickCalls += 1;
        event.preventDefault();
      },
      onSelectedChange: () => {
        selectedChangeCalls += 1;
      },
    }),
  );

  const button = container.querySelector("button");
  assert.ok(button);
  assert.equal(button.getAttribute("aria-pressed"), "false");

  await act(async () => {
    button.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  assert.equal(clickCalls, 1);
  assert.equal(selectedChangeCalls, 0);
  assert.equal(button.getAttribute("aria-pressed"), "false");
});

test("FilterChip alterne normalement sa sélection lorsque le clic n'est pas annulé", async () => {
  const selectedValues = [];
  const container = await render(
    createElement(Chip, {
      variant: "filter",
      label: "Disponible",
      selected: false,
      onSelectedChange: (selected) => selectedValues.push(selected),
    }),
  );

  const button = container.querySelector("button");
  assert.ok(button);

  await act(async () => {
    button.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  assert.deepEqual(selectedValues, [true]);
  assert.equal(button.getAttribute("aria-pressed"), "false", "le composant reste contrôlé par sa prop selected");
});

test("FilterChip désactivé et SuggestionChip ne déclenchent pas onSelectedChange", async () => {
  let selectedChangeCalls = 0;
  const container = await render(
    createElement(
      "div",
      null,
      createElement(Chip, {
        variant: "filter",
        label: "Désactivé",
        disabled: true,
        onSelectedChange: () => {
          selectedChangeCalls += 1;
        },
      }),
      createElement(Chip, {
        variant: "suggestion",
        label: "Suggestion",
        onSelectedChange: () => {
          selectedChangeCalls += 1;
        },
      }),
    ),
  );

  const [disabledButton, suggestionButton] = container.querySelectorAll("button");

  await act(async () => {
    disabledButton.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
    suggestionButton.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  assert.equal(selectedChangeCalls, 0);
});

test("InputChip expose son état sélectionné et son action de retrait avec un nom accessible", async () => {
  let dismissCalls = 0;
  const container = await render(
    createElement(Chip, {
      variant: "input",
      label: "Cuisine",
      selected: true,
      onDismiss: () => {
        dismissCalls += 1;
      },
      dismissLabel: "Retirer Cuisine",
    }),
  );

  const [chipButton, dismissButton] = container.querySelectorAll("button");
  assert.equal(chipButton.getAttribute("aria-pressed"), "true");
  assert.equal(dismissButton.getAttribute("aria-label"), "Retirer Cuisine");

  await act(async () => {
    dismissButton.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  assert.equal(dismissCalls, 1);
  assert.equal(chipButton.getAttribute("aria-pressed"), "true", "le retrait est distinct de la sélection du chip");
});

test("InputChip désactivé désactive aussi l'action de retrait", async () => {
  let dismissCalls = 0;
  const container = await render(
    createElement(Chip, {
      variant: "input",
      label: "Cuisine",
      disabled: true,
      onDismiss: () => {
        dismissCalls += 1;
      },
      dismissLabel: "Retirer Cuisine",
    }),
  );

  const [chipButton, dismissButton] = container.querySelectorAll("button");
  assert.equal(chipButton.disabled, true);
  assert.equal(dismissButton.disabled, true);

  await act(async () => {
    dismissButton.dispatchEvent(new browser.MouseEvent("click", { bubbles: true, cancelable: true }));
  });

  assert.equal(dismissCalls, 0);
});
