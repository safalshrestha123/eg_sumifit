import type { FastifyInstance } from "fastify";

import { healthRoutes } from "./health.js";
import { statusRoutes } from "./status.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(statusRoutes, { prefix: "/api" });
}
