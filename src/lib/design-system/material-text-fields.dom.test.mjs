import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement, useState } from "react";

// OutlinedTextField imports a CSS Module that Next.js normally transforms at build time.
// The DOM tests need only stable class tokens, not the production CSS transformation.
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
  "HTMLAnchorElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "InputEvent",
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
const { TextField } = await import("../../components/ui/TextField.tsx");
const { TextArea } = await import("../../components/ui/TextArea.tsx");
const { OutlinedTextField } = await import("../../components/ui/OutlinedTextField.tsx");
const { OutlinedSecureTextField } = await import("../../components/ui/OutlinedSecureTextField.tsx");

const mountedRoots = [];

function setNativeValue(element, value) {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value").set;
  setter.call(element, value);
}

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

test("TextField renders a labelled native input and preserves native input events", async () => {
  let changedValue;
  const container = await render(
    createElement(TextField, {
      label: "Amount",
      inputId: "amount",
      name: "amount",
      type: "number",
      defaultValue: "12",
      "aria-invalid": true,
      onChange: (event) => {
        changedValue = event.currentTarget.value;
      },
    }),
  );

  const input = container.querySelector("input");
  const label = container.querySelector("label");

  assert.ok(input);
  assert.equal(input.id, "amount");
  assert.equal(label.htmlFor, input.id);
  assert.equal(input.name, "amount");
  assert.equal(input.type, "number");
  assert.equal(input.inputMode, "decimal");
  assert.equal(input.getAttribute("step"), "any");
  assert.equal(input.getAttribute("aria-invalid"), "true");
  assert.equal(input.value, "12");
  assert.ok(input.className.includes("motion-reduce:transition-none"));

  await act(async () => {
    setNativeValue(input, "24");
    input.dispatchEvent(new browser.InputEvent("input", { bubbles: true, inputType: "insertText" }));
    input.dispatchEvent(new browser.Event("change", { bubbles: true }));
  });

  assert.equal(changedValue, "24");
});

test("TextField keeps the explicit persistent label association", async () => {
  const container = await render(
    createElement(TextField, {
      label: "Email",
      inputId: "account-email",
      type: "email",
      placeholder: "name@example.com",
    }),
  );

  const input = container.querySelector("input");
  const label = container.querySelector("label");

  assert.equal(input.id, "account-email");
  assert.equal(label.htmlFor, "account-email");
  assert.equal(input.placeholder, "name@example.com");
  assert.ok(input.className.includes("motion-reduce:transition-none"));
});

test("TextArea merges and deduplicates external descriptions with its error", async () => {
  const container = await render(
    createElement(TextArea, {
      label: "Description",
      inputId: "description",
      rows: 6,
      error: "A description is required",
      "aria-describedby": "external-help external-help",
      "aria-invalid": false,
    }),
  );

  const textarea = container.querySelector("textarea");
  const label = container.querySelector("label");
  const error = container.querySelector("#description-error");

  assert.ok(textarea);
  assert.equal(textarea.id, "description");
  assert.equal(label.htmlFor, textarea.id);
  assert.equal(Number(textarea.getAttribute("rows")), 6);
  assert.equal(textarea.getAttribute("aria-describedby"), "external-help description-error");
  assert.equal(textarea.getAttribute("aria-invalid"), "true");
  assert.equal(error.textContent, "A description is required");
});

test("TextArea retains caller invalid state and associates helper text", async () => {
  const container = await render(
    createElement(TextArea, {
      label: "Notes",
      inputId: "notes",
      helperText: "Keep it short",
      "aria-describedby": "external-help",
      "aria-invalid": true,
    }),
  );

  const textarea = container.querySelector("textarea");

  assert.equal(textarea.getAttribute("aria-invalid"), "true");
  assert.equal(textarea.getAttribute("aria-describedby"), "external-help notes-helper");
  assert.equal(container.querySelector("#notes-helper").textContent, "Keep it short");
});

test("OutlinedTextField controls its value and updates supporting and counter content", async () => {
  function ControlledField() {
    const [value, setValue] = useState("hello");
    return createElement(OutlinedTextField, {
      id: "profile-name",
      name: "name",
      label: "Name",
      value,
      onChange: setValue,
      supportingText: "Your public name",
      maxLength: 20,
      showCharacterCount: true,
    });
  }

  const container = await render(createElement(ControlledField));
  const input = container.querySelector("input");
  const label = container.querySelector("label");
  const describedBy = input.getAttribute("aria-describedby").split(" ");

  assert.equal(input.id, "profile-name");
  assert.equal(label.htmlFor, input.id);
  assert.equal(input.value, "hello");
  assert.equal(describedBy.length, 2);
  assert.equal(document.getElementById(describedBy[0]).textContent, "Your public name");
  assert.equal(document.getElementById(describedBy[1]).textContent, "5/20");

  await act(async () => {
    setNativeValue(input, "hello world");
    input.dispatchEvent(new browser.InputEvent("input", { bubbles: true, inputType: "insertText" }));
    input.dispatchEvent(new browser.Event("change", { bubbles: true }));
  });

  assert.equal(input.value, "hello world");
  assert.equal(document.getElementById(describedBy[1]).textContent, "11/20");
});

test("OutlinedTextField gives its error priority while retaining the character counter", async () => {
  const container = await render(
    createElement(OutlinedTextField, {
      id: "email",
      label: "Email",
      value: "bad",
      onChange: () => {},
      supportingText: "Enter your email",
      error: "Enter a valid email address",
      maxLength: 20,
      showCharacterCount: true,
    }),
  );

  const input = container.querySelector("input");
  const describedBy = input.getAttribute("aria-describedby").split(" ");

  assert.equal(input.getAttribute("aria-invalid"), "true");
  assert.equal(describedBy.length, 2);
  assert.equal(document.getElementById(describedBy[0]).textContent, "Enter a valid email address");
  assert.equal(document.getElementById(describedBy[1]).textContent, "3/20");
  assert.equal(container.textContent.includes("Enter your email"), false);
});

test("OutlinedSecureTextField reveals a secure value with a localized Material icon button", async () => {
  const container = await render(
    createElement(OutlinedSecureTextField, {
      id: "password",
      label: "Mot de passe",
      value: "secret-value",
      onChange: () => {},
      showPasswordLabel: "Afficher le mot de passe",
      hidePasswordLabel: "Masquer le mot de passe",
    }),
  );

  const input = container.querySelector("input");
  const toggle = container.querySelector("button");
  const initialIconPath = toggle.querySelector("svg path").getAttribute("d");

  assert.equal(input.type, "password");
  assert.equal(input.autocomplete, "current-password");
  assert.equal(input.getAttribute("spellcheck"), "false");
  assert.equal(input.getAttribute("autocapitalize"), "off");
  assert.equal(toggle.getAttribute("aria-label"), "Afficher le mot de passe");
  assert.equal(toggle.getAttribute("aria-pressed"), null);
  assert.ok(toggle.className.includes("h-12") && toggle.className.includes("w-12"), "the IconButton keeps its 48px touch target");
  assert.ok(initialIconPath.length > 0);

  await act(async () => {
    toggle.dispatchEvent(new browser.MouseEvent("click", { bubbles: true }));
  });

  assert.equal(input.type, "text");
  assert.equal(toggle.getAttribute("aria-label"), "Masquer le mot de passe");
  assert.notEqual(toggle.querySelector("svg path").getAttribute("d"), initialIconPath);

  await act(async () => {
    toggle.dispatchEvent(new browser.MouseEvent("click", { bubbles: true }));
  });

  assert.equal(input.type, "password");
  assert.equal(toggle.getAttribute("aria-label"), "Afficher le mot de passe");
  assert.equal(toggle.querySelector("svg path").getAttribute("d"), initialIconPath);
});

test("OutlinedSecureTextField keeps secure controls disabled when the field is disabled", async () => {
  const container = await render(
    createElement(OutlinedSecureTextField, {
      id: "disabled-password",
      label: "Password",
      value: "secret",
      onChange: () => {},
      showPasswordLabel: "Afficher le mot de passe",
      hidePasswordLabel: "Masquer le mot de passe",
      disabled: true,
    }),
  );

  const input = container.querySelector("input");
  const toggle = container.querySelector("button");

  assert.equal(input.disabled, true);
  assert.equal(toggle.disabled, true);
  assert.equal(container.querySelector("[data-disabled='true']") !== null, true);
});
