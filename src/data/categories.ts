/**
 * The blog post categories. Shared by the CMS editor (as the create/edit
 * options) and by the public blog + admin list filters — under server-side
 * pagination those pages can no longer derive the category list from a full
 * in-memory posts array, so this constant is the single source of truth.
 */
export const CATEGORIES = [
  "Strategy",
  "Real Estate",
  "Business",
  "Entrepreneurship",
  "Finance",
  "Innovation",
  "Technology",
  "AI",
  "Blockchain",
  "Education",
  "Policy",
] as const;

export type Category = (typeof CATEGORIES)[number];
