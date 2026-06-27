import "dotenv/config";

import { z } from "zod";

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
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters.").optional(),
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
