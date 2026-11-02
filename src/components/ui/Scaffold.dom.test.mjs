import assert from "node:assert/strict";
import { createRequire } from "node:module";
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

const observers = [];
class TestResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.target = null;
    observers.push(this);
  }
  observe(target) {
    this.target = target;
  }
  disconnect() {
    this.target = null;
  }
  notify() {
    if (this.target) this.callback([{ target: this.target, contentRect: this.target.getBoundingClientRect() }]);
  }
}
globalThis.ResizeObserver = TestResizeObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createRoot } = await import("react-dom/client");
const { FabPosition, Scaffold } = await import("./Scaffold.tsx");
const mountedRoots = [];

async function render(element) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);
  await act(async () => root.render(element));
  return container;
}

function setSize(element, width, height) {
  element.getBoundingClientRect = () => ({
    x: 0, y: 0, top: 0, left: 0, right: width, bottom: height,
    width, height, toJSON: () => ({}),
  });
  const observer = observers.find((candidate) => candidate.target === element);
  assert.ok(observer, "expected a ResizeObserver for the measured slot");
  observer.notify();
}

afterEach(async () => {
  await act(async () => {
    for (const root of mountedRoots.splice(0)) root.unmount();
  });
  document.body.replaceChildren();
  observers.length = 0;
});

after(async () => {
  await browser.happyDOM.abort();
});

test("Scaffold exposes the AndroidX slots without inventing a navigation-rail slot", async () => {
  let receivedPadding;
  const container = await render(
    createElement(Scaffold, {
      topBar: createElement("header", null, "Top"),
      bottomBar: createElement("footer", null, "Bottom"),
      snackbarHost: createElement("div", null, "Snackbar"),
      floatingActionButton: createElement("button", null, "Create"),
    }, (padding) => {
      receivedPadding = padding;
      return createElement("div", { "data-testid": "body" }, "Content");
    }),
  );

  assert.ok(container.querySelector('[data-slot="top-bar"]'));
  assert.ok(container.querySelector('[data-slot="bottom-bar"]'));
  assert.ok(container.querySelector('[data-slot="snackbar-host"]'));
  assert.ok(container.querySelector('[data-slot="floating-action-button"]'));
  assert.ok(container.querySelector('[data-testid="body"]'));
  assert.equal(container.querySelector("main"), null);
  assert.deepEqual(receivedPadding, {
    top: "env(safe-area-inset-top, 0px)",
    bottom: "env(safe-area-inset-bottom, 0px)",
    start: "var(--scaffold-inset-start)",
    end: "var(--scaffold-inset-end)",
  });
  assert.equal(FabPosition.EndOverlay, "end-overlay");
});

test("Scaffold passes measured top/bottom bar sizes and positions FAB and snackbar", async () => {
  let receivedPadding;
  const container = await render(
    createElement(Scaffold, {
      topBar: createElement("header", null, "Top"),
      bottomBar: createElement("footer", null, "Bottom"),
      snackbarHost: createElement("div", null, "Snackbar"),
      floatingActionButton: createElement("button", null, "Create"),
    }, (padding) => {
      receivedPadding = padding;
      return createElement("div", null, "Content");
    }),
  );

  await act(async () => {
    setSize(container.querySelector('[data-slot="top-bar"]'), 360, 64);
    setSize(container.querySelector('[data-slot="bottom-bar"]'), 360, 72);
    setSize(container.querySelector('[data-slot="floating-action-button"]'), 56, 56);
  });

  assert.equal(receivedPadding.top, "64px");
  assert.equal(receivedPadding.bottom, "72px");
  assert.equal(
    container.querySelector('[data-slot="floating-action-button"]').style.insetBlockEnd,
    "calc(16px + 72px)",
  );
  assert.equal(
    container.querySelector('[data-slot="snackbar-host"]').style.insetBlockEnd,
    "calc(56px + 16px + 72px)",
  );
});

test("Scaffold EndOverlay overlaps the bottom bar while Start and Center use their AndroidX positions", async () => {
  const container = await render(
    createElement(
      "div",
      null,
      createElement(Scaffold, {
        bottomBar: createElement("footer", null, "Bottom"),
        floatingActionButton: createElement("button", null, "Overlay"),
        floatingActionButtonPosition: FabPosition.EndOverlay,
        contentWindowInsets: { bottom: 10, left: 12, right: 20 },
      }, () => createElement("div", null, "Overlay content")),
      createElement(Scaffold, {
        floatingActionButton: createElement("button", null, "Start"),
        floatingActionButtonPosition: FabPosition.Start,
      }, () => null),
      createElement(Scaffold, {
        floatingActionButton: createElement("button", null, "Center"),
        floatingActionButtonPosition: FabPosition.Center,
      }, () => null),
    ),
  );

  const [overlay, start, center] = container.querySelectorAll('[data-slot="floating-action-button"]');
  assert.equal(overlay.style.insetBlockEnd, "calc(16px + 10px)");
  assert.equal(start.style.insetInlineStart, "calc(var(--scaffold-inset-start) + 16px)");
  assert.equal(center.style.left, "calc((100% - var(--scaffold-fab-width) + var(--scaffold-inset-left) - var(--scaffold-inset-right)) / 2)");
  assert.equal(container.querySelector('[data-component="scaffold"]').style.getPropertyValue("--scaffold-inset-left"), "12px");
});

test("Scaffold places a snackbar above the bottom bar when no visible FAB exists", async () => {
  const container = await render(
    createElement(Scaffold, {
      bottomBar: createElement("footer", null, "Bottom"),
      snackbarHost: createElement("div", null, "Snackbar"),
    }, () => null),
  );

  await act(async () => {
    setSize(container.querySelector('[data-slot="bottom-bar"]'), 360, 72);
  });

  assert.equal(
    container.querySelector('[data-slot="snackbar-host"]').style.insetBlockEnd,
    "72px",
  );
});
