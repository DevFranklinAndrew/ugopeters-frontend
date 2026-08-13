/** The single source of truth for categories: with server-side pagination the
 *  filters can't derive them from a full in-memory posts array. */
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
