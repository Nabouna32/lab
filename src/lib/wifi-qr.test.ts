import assert from "node:assert/strict";
import test from "node:test";
import { buildWifiQrPayload, escapeWifiValue } from "./wifi-qr.ts";

test("escapes reserved Wi-Fi QR payload characters", () => {
  assert.equal(escapeWifiValue('Studio;A,B:C\\D"E'), 'Studio\\;A\\,B\\:C\\\\D\\"E');
});

test("escapes line breaks so they cannot split a Wi-Fi payload", () => {
  assert.equal(escapeWifiValue("first\nsecond\rthird"), "first\\nsecond\\rthird");
});

test("builds WPA payloads and marks hidden networks", () => {
  assert.equal(
    buildWifiQrPayload({ ssid: "Studio", password: "p;ass", security: "WPA", hidden: true }),
    "WIFI:T:WPA;S:Studio;P:p\\;ass;H:true;;",
  );
});

test("builds open-network payloads without requiring a password", () => {
  assert.equal(
    buildWifiQrPayload({ ssid: "Guest", password: "", security: "nopass", hidden: false }),
    "WIFI:T:nopass;S:Guest;P:;H:false;;",
  );
});

test("does not produce a payload for missing required values", () => {
  assert.equal(buildWifiQrPayload({ ssid: "", password: "secret", security: "WPA", hidden: false }), null);
  assert.equal(buildWifiQrPayload({ ssid: "Home", password: "", security: "WPA", hidden: false }), null);
});
