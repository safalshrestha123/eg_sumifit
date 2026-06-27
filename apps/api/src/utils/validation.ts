import { z } from "zod";

import { AppError } from "./errors.js";

export function parseRequestBody<TSchema extends z.ZodType>(schema: TSchema, input: unknown): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new AppError(
      "The request payload is invalid.",
      400,
      "VALIDATION_ERROR",
      result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
}
