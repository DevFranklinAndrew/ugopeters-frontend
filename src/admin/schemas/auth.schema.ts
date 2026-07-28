import { z } from "zod";

/** Mirrors the backend login validation (backend/src/validations/auth.validation.ts). */
export const loginSchema = z.object({
  // Normalize first, then validate with the current top-level `z.email()` API.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("A valid email is required.")),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
