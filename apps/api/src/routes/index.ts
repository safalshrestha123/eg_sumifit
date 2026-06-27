import type { FastifyInstance } from "fastify";

import { authRoutes } from "../modules/auth/auth.routes.js";
import { healthRoutes } from "./health.js";
import { statusRoutes } from "./status.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(statusRoutes, { prefix: "/api" });
  await app.register(authRoutes, { prefix: "/api/auth" });
}
