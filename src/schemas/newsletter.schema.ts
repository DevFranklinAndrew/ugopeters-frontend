import { z } from "zod";

/** Keep in sync with backend/src/validations/subscriber.validation.ts, so the
 *  client rejects exactly what the server would. */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("A valid email is required.").max(200, "Email is too long.")),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
