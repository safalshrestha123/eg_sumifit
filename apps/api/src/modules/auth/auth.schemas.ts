import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

const passwordSchema = z.string()
  .min(12, "Password must contain at least 12 characters.")
  .max(72, "Password must not exceed 72 characters.")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Password must not exceed 72 UTF-8 bytes.");

const loginPasswordSchema = z.string()
  .min(1, "Password is required.")
  .max(72, "Password must not exceed 72 characters.")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Password must not exceed 72 UTF-8 bytes.");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["TRAINER", "CLIENT"]).default("CLIENT"),
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  fitnessGoal: z.string().trim().max(500).nullable().optional(),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
}).strict().superRefine((value, context) => {
  if (value.role === "CLIENT" && !value.fullName) {
    context.addIssue({ code: "custom", path: ["fullName"], message: "Full name is required for client accounts." });
  }
});

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
}).strict();

export type RegisterInput = z.output<typeof registerSchema>;
export type LoginInput = z.output<typeof loginSchema>;
