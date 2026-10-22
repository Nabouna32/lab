import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPublicSeoPages } from "@/lib/seo/public-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return getPublicSeoPages().map((page) => ({
    url: new URL(page.path, siteUrl).toString(),
    alternates: {
      languages: Object.fromEntries(
        Object.entries(page.localizedPaths).map(([locale, path]) => [
          locale,
          new URL(path, siteUrl).toString(),
        ]),
      ),
    },
  }));
}
