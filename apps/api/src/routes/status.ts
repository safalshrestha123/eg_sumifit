import type { FastifyPluginAsync } from "fastify";

import { env } from "../config/index.js";
import { getApiStatus } from "../modules/system/system.service.js";

export const statusRoutes: FastifyPluginAsync = async (app) => {
  app.get("/status", async () => getApiStatus(env));
};
