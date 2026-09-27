const fallbackSiteUrl = "http://localhost:3000";

export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercelEnvironment = process.env.VERCEL_ENV?.trim();

  // On Vercel production, prefer the platform's configured production URL.
  // This prevents a stale NEXT_PUBLIC_SITE_URL from generating incorrect
  // canonical URLs or authentication redirects after a domain change.
  if (vercelEnvironment === "production" && production) {
    return new URL(`https://${production}`);
  }

  if (configured) return new URL(configured);
  if (production) return new URL(`https://${production}`);

  return new URL(fallbackSiteUrl);
}
