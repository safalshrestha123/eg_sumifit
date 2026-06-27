import Fastify from "fastify";

import { env } from "./config/index.js";
import { corsPlugin, databasePlugin, registerErrorHandlers } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  registerErrorHandlers(app);
  await app.register(corsPlugin);
  await app.register(databasePlugin);
  await registerRoutes(app);

  return app;
}
