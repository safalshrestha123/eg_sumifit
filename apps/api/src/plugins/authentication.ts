import fastifyJwt from "@fastify/jwt";
import type { preHandlerHookHandler } from "fastify";
import fp from "fastify-plugin";

import { env } from "../config/index.js";
import type { AccessTokenPayload } from "../modules/auth/auth.types.js";
import { AppError } from "../utils/errors.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AccessTokenPayload;
    user: AccessTokenPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: preHandlerHookHandler;
  }
}

const supportedRoles = new Set(["ADMIN", "TRAINER", "CLIENT"]);

export const authenticationPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  });

  const authenticate: preHandlerHookHandler = async (request) => {
    try {
      await request.jwtVerify();

      if (request.user.type !== "access" || !request.user.sub || !supportedRoles.has(request.user.role)) {
        throw new Error("Invalid access token payload");
      }
    } catch {
      throw new AppError("Authentication is required.", 401, "UNAUTHORIZED");
    }
  };

  app.decorate("authenticate", authenticate);
}, { name: "authentication" });
