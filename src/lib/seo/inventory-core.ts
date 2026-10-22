export type LocalizedSeoResource = {
  id: string;
  paths: Readonly<Record<string, string | undefined>>;
};

export type PublicSeoPage = {
  id: string;
  locale: string;
  path: string;
  localizedPaths: Readonly<Record<string, string>>;
};

/**
 * Builds one entry per available localized URL from the explicitly indexable
 * resources supplied by the application. It never invents a translation path.
 */
export function buildPublicSeoInventory(
  locales: readonly string[],
  resources: readonly LocalizedSeoResource[],
): PublicSeoPage[] {
  const supportedLocales = new Set(locales);
  if (supportedLocales.size !== locales.length) {
    throw new Error("SEO inventory locales must be unique.");
  }

  const resourceIds = new Set<string>();
  const pathOwners = new Map<string, string>();
  const pages: PublicSeoPage[] = [];

  for (const resource of resources) {
    if (resourceIds.has(resource.id)) {
      throw new Error(`Duplicate SEO resource id "${resource.id}".`);
    }
    resourceIds.add(resource.id);

    for (const locale of Object.keys(resource.paths)) {
      if (!supportedLocales.has(locale)) {
        throw new Error(`SEO resource "${resource.id}" uses unsupported locale "${locale}".`);
      }
    }

    const localizedPaths: Record<string, string> = {};
    for (const locale of locales) {
      const path = resource.paths[locale];
      if (path === undefined) continue;

      if (
        !path.startsWith("/") ||
        path.startsWith("//") ||
        path.includes("?") ||
        path.includes("#") ||
        (path !== "/" && path.endsWith("/"))
      ) {
        throw new Error(`Invalid canonical path "${path}" for SEO resource "${resource.id}".`);
      }

      const pathKey = `${locale}:${path}`;
      const existingOwner = pathOwners.get(pathKey);
      if (existingOwner) {
        throw new Error(
          `SEO path "${path}" for locale "${locale}" is shared by "${existingOwner}" and "${resource.id}".`,
        );
      }
      pathOwners.set(pathKey, resource.id);
      localizedPaths[locale] = path;
    }

    if (Object.keys(localizedPaths).length === 0) {
      throw new Error(`SEO resource "${resource.id}" has no localized paths.`);
    }

    for (const locale of locales) {
      const path = localizedPaths[locale];
      if (path === undefined) continue;
      pages.push({ id: resource.id, locale, path, localizedPaths });
    }
  }

  return pages;
}
