import type { Environment } from "../../config/index.js";

export function getApiStatus(environment: Environment) {
  return {
    status: "operational" as const,
    service: "sumifitness-api",
    version: "1.0.0",
    environment: environment.NODE_ENV,
    capabilities: {
      database: "configured" as const,
      authentication: environment.JWT_SECRET ? "jwt-ready" as const : "not-configured" as const,
      cmsApi: "not-implemented" as const,
    },
  };
}
