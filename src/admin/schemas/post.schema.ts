import { z } from "zod";
import type { Post } from "../../data/post";

/**
 * Today in the site's display format, e.g. "August 11, 2026" — the new-post
 * default. Matches `formatDate` in backend/src/utils/post.util.ts so a post
 * saved without editing the field reads identically to a server-dated one.
 */
export const todayDisplayDate = (): string =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
  // Free text, shown verbatim on the blog — no format is enforced so the
  // wording is entirely the author's ("January 15, 2020", "Winter 2024", …).
  date: z.string().trim().min(1, "Publish date is required."),
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
  date: todayDisplayDate(),
});

/** Maps an existing post into the form's value shape (for edit mode). */
export const toPostFormValues = (post: Post): PostFormValues => ({
  title: post.title,
  category: post.category,
  featured: Boolean(post.featured),
  image: post.image,
  excerpt: post.excerpt,
  content: post.content,
  // Round-trips the stored string unchanged, so editing another field can't
  // quietly reformat the date.
  date: post.date,
});
