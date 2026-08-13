import { z } from "zod";

/** Keep in sync with backend/src/validations/message.validation.ts, so the
 *  client rejects exactly what the server would. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("A valid email is required.").max(200, "Email is too long.")),
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required.")
    .max(200, "Reason is too long."),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(200, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message is too long."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
