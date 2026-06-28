import { z } from "zod";

const nullableText = (maximum: number) => z.string().trim().max(maximum).nullable().optional();

export const clientProfilePatchSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")).optional(),
  phone: nullableText(40),
  fitnessGoal: nullableText(500),
  experienceLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Provide at least one profile field.");
