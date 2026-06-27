import type { FastifyInstance } from "fastify";

import { env } from "../config/index.js";
import { AppError } from "../utils/errors.js";

export function registerErrorHandlers(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const normalizedError = error instanceof Error ? error : new Error("Unknown request error");
    const httpError = normalizedError as Error & { statusCode?: number; code?: string };
    const statusCode = normalizedError instanceof AppError
      ? normalizedError.statusCode
      : httpError.statusCode && httpError.statusCode >= 400
        ? httpError.statusCode
        : 500;
    const code = normalizedError instanceof AppError ? normalizedError.code : statusCode === 500 ? "INTERNAL_SERVER_ERROR" : (httpError.code ?? "REQUEST_ERROR");
    const message = statusCode === 500 && env.NODE_ENV === "production"
      ? "An unexpected error occurred."
      : normalizedError.message;

    if (statusCode >= 500) {
      request.log.error({ err: normalizedError }, "Request failed");
    }

    return reply.status(statusCode).send({
      error: {
        code,
        message,
        requestId: request.id,
      },
    });
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: {
        code: "NOT_FOUND",
        message: `Route ${request.method} ${request.url} was not found.`,
        requestId: request.id,
      },
    });
  });
}
