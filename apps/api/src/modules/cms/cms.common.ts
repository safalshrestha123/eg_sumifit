import { z } from "zod";

import { AppError } from "../../utils/errors.js";

export const idParamsSchema = z.object({
  id: z.string().trim().min(1).max(64),
}).strict();

export const nullableText = (maxLength: number) => z.string().trim().max(maxLength).nullable().optional();

export function requirePatchFields<T extends Record<string, unknown>>(value: T) {
  return Object.keys(value).length > 0;
}

export function resourceNotFound(resource: string) {
  return new AppError(`${resource} was not found.`, 404, "NOT_FOUND");
}

export function rethrowPrismaError(error: unknown, resource: string): never {
  if (isPrismaError(error, "P2025")) {
    throw resourceNotFound(resource);
  }

  if (isPrismaError(error, "P2002")) {
    throw new AppError(`${resource} conflicts with an existing record.`, 409, "CONFLICT");
  }

  throw error;
}

function isPrismaError(error: unknown, code: string) {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}
