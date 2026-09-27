import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "./site-url.ts";

const original = {
  configured: process.env.NEXT_PUBLIC_SITE_URL,
  production: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  environment: process.env.VERCEL_ENV,
};

function restoreEnvironment() {
  if (original.configured === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = original.configured;

  if (original.production === undefined) delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  else process.env.VERCEL_PROJECT_PRODUCTION_URL = original.production;

  if (original.environment === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = original.environment;
}

test.afterEach(restoreEnvironment);

test("prefers the configured Vercel production URL in production", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://stale.example";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "utiluna.example";
  process.env.VERCEL_ENV = "production";

  assert.equal(getSiteUrl().origin, "https://utiluna.example");
});

test("uses the explicit site URL outside Vercel production", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://utiluna.example";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "preview.example";
  process.env.VERCEL_ENV = "preview";

  assert.equal(getSiteUrl().origin, "https://utiluna.example");
});
