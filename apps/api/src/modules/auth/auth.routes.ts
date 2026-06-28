import type { FastifyPluginAsync } from "fastify";

import { env } from "../../config/index.js";
import { parseRequestBody } from "../../utils/validation.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";
import type { AccessTokenPayload, UserRole } from "./auth.types.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", async (request, reply) => {
    const input = parseRequestBody(registerSchema, request.body);
    const user = await registerUser(app.prisma, input);
    const accessToken = createAccessToken(app, user.id, user.role);

    return reply.status(201).send(authResponse(user, accessToken));
  });

  app.post("/login", async (request) => {
    const input = parseRequestBody(loginSchema, request.body);
    const user = await loginUser(app.prisma, input);
    const accessToken = createAccessToken(app, user.id, user.role);

    return authResponse(user, accessToken);
  });

  app.get("/me", { preHandler: app.authenticate }, async (request) => {
    const user = await getCurrentUser(app.prisma, request.user.sub);
    return { user };
  });
};

function createAccessToken(app: Parameters<FastifyPluginAsync>[0], userId: string, role: UserRole) {
  const payload: AccessTokenPayload = {
    sub: userId,
    role,
    type: "access",
  };

  return app.jwt.sign(payload);
}

function authResponse<TUser>(user: TUser, accessToken: string) {
  return {
    user,
    accessToken,
    tokenType: "Bearer" as const,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  };
}
