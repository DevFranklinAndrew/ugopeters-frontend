import { z } from "zod";

/**
 * Mirrors the backend subscribe validation
 * (backend/src/validations/subscriber.validation.ts) so client-side errors
 * match what the server would reject.
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("A valid email is required.").max(200, "Email is too long.")),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
