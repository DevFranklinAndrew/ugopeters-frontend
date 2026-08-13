import { z } from "zod";

/** Keep in sync with backend/src/validations/auth.validation.ts. */
export const loginSchema = z.object({
  // Normalize before validating, hence the pipe.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("A valid email is required.")),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
