import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { act, createElement, useState } from "react";

// MaterialTextField imports a CSS Module that Next.js normally transforms at build time.
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
const { MaterialTextField } = await import("../../components/ui/MaterialTextField.tsx");

const mountedRoots = [];

function setNativeValue(element, value) {
  const setter = Object.getOwnPropertyDescriptor(Obj¶»§q«^