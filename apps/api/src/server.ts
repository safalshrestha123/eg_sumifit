import { buildApp } from "./app.js";
import { env } from "./config/index.js";

const app = await buildApp();
let shuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;

  app.log.info({ signal }, "Stopping API server");
  await app.close();
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void shutdown(signal);
  });
}

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (error) {
  app.log.fatal({ err: error }, "API server failed to start");
  process.exitCode = 1;
}
