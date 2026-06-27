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
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
}).strict();

export type RegisterInput = z.output<typeof registerSchema>;
export type LoginInput = z.output<typeof loginSchema>;
