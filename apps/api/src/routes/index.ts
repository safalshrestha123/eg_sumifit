import type { FastifyInstance } from "fastify";

import { authRoutes } from "../modules/auth/auth.routes.js";
import { cmsRoutes } from "../modules/cms/cms.routes.js";
import { publicRoutes } from "../modules/public/public.routes.js";
import { uploadRoutes } from "../modules/uploads/upload.routes.js";
import { healthRoutes } from "./health.js";
import { statusRoutes } from "./status.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(statusRoutes, { prefix: "/api" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(cmsRoutes, { prefix: "/api/cms" });
  await app.register(publicRoutes, { prefix: "/api/public" });
  await app.register(uploadRoutes, { prefix: "/api/uploads" });
}
