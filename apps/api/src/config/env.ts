import "dotenv/config";

import { z } from "zod";

const optionalEnvironmentValue = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(1).optional(),
);

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  DATABASE_URL: z.string().refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must be a PostgreSQL connection string.",
  ),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters."),
  JWT_ACCESS_EXPIRES_IN: z.string().min(2).default("15m"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  CLOUDINARY_CLOUD_NAME: optionalEnvironmentValue,
  CLOUDINARY_API_KEY: optionalEnvironmentValue,
  CLOUDINARY_API_SECRET: optionalEnvironmentValue,
  UPLOAD_MAX_FILE_SIZE: z.coerce.number().int().min(1_048_576).max(10_485_760).default(5_242_880),
}).superRefine((value, context) => {
  const cloudinaryValues = [value.CLOUDINARY_CLOUD_NAME, value.CLOUDINARY_API_KEY, value.CLOUDINARY_API_SECRET];
  const configuredValues = cloudinaryValues.filter(Boolean).length;
  if (configuredValues > 0 && configuredValues < cloudinaryValues.length) {
    context.addIssue({ code: "custom", path: ["CLOUDINARY_CLOUD_NAME"], message: "Cloudinary credentials must be configured together." });
  }
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid API environment: ${issues}`);
}

export const env = parsedEnvironment.data;
export type Environment = z.infer<typeof environmentSchema>;
