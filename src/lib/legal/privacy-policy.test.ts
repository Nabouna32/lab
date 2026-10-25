import assert from "node:assert/strict";
import test from "node:test";
import { getPrivacyPolicyContent } from "./privacy-policy-content.ts";
import { getPrivacyPolicyPath, getLocalizedPath } from "../tools/routes.ts";

test("privacy policy provides contact and temporary-status disclosures in French and English", () => {
  for (const locale of ["fr", "en"] as const) {
    const policy = getPrivacyPolicyContent(locale);
    assert.ok(policy.sections.length >= 8);
    assert.ok(policy.contactAddress.trim().length > 0);
    assert.ok(policy.temporaryNotice.trim().length > 0);
    assert.ok(policy.contactWarning.trim().length > 0);
    assert.ok(policy.sections.some((section) => /retention|conservation/i.test(section.title)));
    assert.ok(policy.sections.some((section) => /rights|droits/i.test(section.title)));
  }
});

test("privacy policy paths are localised and switch language correctly", () => {
  assert.equal(getPrivacyPolicyPath("fr"), "/fr/politique-de-confidentialite");
  assert.equal(getPrivacyPolicyPath("en"), "/en/privacy-policy");
  assert.equal(getLocalizedPath("/fr/politique-de-confidentialite", "en"), "/en/privacy-policy");
  assert.equal(getLocalizedPath("/en/privacy-policy", "fr"), "/fr/politique-de-confidentialite");
});
