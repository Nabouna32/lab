const categoryColorVariables = {
  calculations: "--category-calculations",
  dates: "--category-dates",
  computing: "--category-computing",
  images: "--category-images",
  files: "--category-files",
  video: "--category-video",
  development: "--category-development",
} as const;

export type CategoryColorId = keyof typeof categoryColorVariables;
export const categoryColorIds = Object.keys(categoryColorVariables) as CategoryColorId[];

export function getCategoryColor(categoryId: string): string {
  const variable = categoryColorVariables[categoryId as CategoryColorId];
  return variable ? `var(${variable})` : "var(--accent)";
}

export function getCategoryContainerColor(categoryId: string): string {
  const variable = categoryColorVariables[categoryId as CategoryColorId];
  return variable ? `var(${variable}-container)` : "var(--accent-soft)";
}
