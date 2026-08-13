import { z } from "zod";
import type { Post } from "../../data/post";

/** Keep in sync with backend/src/validations/post.validation.ts. Derived fields
 *  (slug, date, readTime, author) are server-owned and absent here. */
export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  category: z.string().trim().min(1, "Please select a category."),
  // Either a base64 data URL or a hosted one.
  image: z.string().trim().min(1, "A cover image is required."),
  content: z
    .string()
    // Tag-only markup ("<p></p>") counts as empty, but an image-only body is fine.
    .refine(
      (html) =>
        html.replace(/<[^>]*>/g, "").trim().length > 0 || /<img/i.test(html),
      "Content is required.",
    ),
  excerpt: z.string().trim().optional(),
  featured: z.boolean(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export const postFormDefaults = (): PostFormValues => ({
  title: "",
  category: "",
  featured: false,
  image: "",
  excerpt: "",
  content: "",
});

export const toPostFormValues = (post: Post): PostFormValues => ({
  title: post.title,
  category: post.category,
  featured: Boolean(post.featured),
  image: post.image,
  excerpt: post.excerpt,
  content: post.content,
});
