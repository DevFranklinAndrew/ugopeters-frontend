import { z } from "zod";
import type { Post } from "../../data/post";

/** Local calendar date as `yyyy-mm-dd`, the format <input type="date"> uses. */
const toDateInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** Today, for the new-post default. */
export const todayDateInput = (): string => toDateInput(new Date());

/**
 * Turns an existing post's date into the input format. Prefers the ISO
 * `publishedAt`; falls back to parsing the display string for any older row
 * saved before publishedAt existed, and to today if that fails too.
 */
const postDateInput = (post: Post): string => {
  const parsed = new Date(post.publishedAt ?? post.date);
  return Number.isNaN(parsed.getTime())
    ? todayDateInput()
    : toDateInput(parsed);
};

/**
 * Mirrors the backend create/update validation
 * (backend/src/validations/post.validation.ts). The server owns the derived
 * fields (slug, readTime, author, and excerpt when blank), so the form only
 * carries what the CMS edits — including the publish date.
 */
export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  category: z.string().trim().min(1, "Please select a category."),
  // Base64 data URL or an external URL — the backend requires a cover image.
  image: z.string().trim().min(1, "A cover image is required."),
  content: z
    .string()
    // The editor emits HTML; treat tag-only markup (e.g. "<p></p>") as empty,
    // but allow an image-only body.
    .refine(
      (html) =>
        html.replace(/<[^>]*>/g, "").trim().length > 0 || /<img/i.test(html),
      "Content is required.",
    ),
  excerpt: z.string().trim().optional(),
  featured: z.boolean(),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a publish date.")
    .refine((value) => {
      // Reject dates the calendar doesn't have (e.g. 2026-02-31), matching the
      // server's check so the form fails inline instead of round-tripping a 422.
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(year, month - 1, day, 12);
      return (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      );
    }, "That date does not exist."),
});

export type PostFormValues = z.infer<typeof postSchema>;

/**
 * Blank form — the defaults for creating a new post. A function, not a
 * constant, so the date is "today" whenever the editor opens rather than
 * whenever the module was first loaded.
 */
export const postFormDefaults = (): PostFormValues => ({
  title: "",
  category: "",
  featured: false,
  image: "",
  excerpt: "",
  content: "",
  date: todayDateInput(),
});

/** Maps an existing post into the form's value shape (for edit mode). */
export const toPostFormValues = (post: Post): PostFormValues => ({
  title: post.title,
  category: post.category,
  featured: Boolean(post.featured),
  image: post.image,
  excerpt: post.excerpt,
  content: post.content,
  date: postDateInput(post),
});
