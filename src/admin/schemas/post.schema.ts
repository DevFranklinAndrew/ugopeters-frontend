import { z } from "zod";
import type { Post } from "../../data/post";

/**
 * Mirrors the backend create/update validation
 * (backend/src/validations/post.validation.ts). The server owns the derived
 * fields (slug, date, readTime, author, and excerpt when blank), so the form
 * only carries what the CMS edits.
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
});

export type PostFormValues = z.infer<typeof postSchema>;

/** Blank form — the defaults for creating a new post. */
export const postFormDefaults: PostFormValues = {
  title: "",
  category: "",
  featured: false,
  image: "",
  excerpt: "",
  content: "",
};

/** Maps an existing post into the form's value shape (for edit mode). */
export const toPostFormValues = (post: Post): PostFormValues => ({
  title: post.title,
  category: post.category,
  featured: Boolean(post.featured),
  image: post.image,
  excerpt: post.excerpt,
  content: post.content,
});
