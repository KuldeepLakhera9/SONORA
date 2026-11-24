import { z } from "zod";

/**
 * Username validation rule:
 * - 3 to 30 characters
 * - Alphanumeric, underscores, hyphens only
 * - Case-insensitive
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens"
  )
  .transform((val) => val.toLowerCase());

/**
 * Password validation rule:
 * - At least 8 characters
 * - At least 1 letter and 1 digit or symbol
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must include at least one letter")
  .regex(/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include at least one number or symbol");

/**
 * Registration (Sign Up) Schema
 */
export const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name must not exceed 60 characters"),
    username: usernameSchema,
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy to proceed",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must not exceed 50 characters"),
  username: usernameSchema,
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Helper to calculate password strength metrics (0 - 4 score)
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Excellent";
  color: string;
} {
  if (!password) {
    return { score: 0, label: "Very Weak", color: "bg-red-500/20" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3 || score === 4) return { score: 3, label: "Strong", color: "bg-purple-500" };
  return { score: 4, label: "Excellent", color: "bg-emerald-500" };
}
