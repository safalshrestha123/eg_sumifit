import type { FastifyPluginAsync } from "fastify";

import { AppError } from "../../utils/errors.js";
import { parseRequestBody } from "../../utils/validation.js";
import { requireRoles } from "../auth/auth.middleware.js";
import { clientProfilePatchSchema } from "./client.schemas.js";

export const clientRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", requireRoles("CLIENT"));

  app.get("/profile", async (request) => {
    return getClientProfile(app, request.user.sub);
  });

  app.patch("/profile", async (request) => {
    const input = parseRequestBody(clientProfilePatchSchema, request.body);
    const existingProfile = await app.prisma.clientProfile.findUnique({
      where: { userId: request.user.sub },
      select: { id: true, fullName: true },
    });

    const profileFullName = input.fullName ?? existingProfile?.fullName;
    if (!profileFullName) {
      throw new AppError("Full name is required when creating a client profile.", 400, "PROFILE_FIELDS_REQUIRED");
    }

    const { email, ...profileInput } = input;
    try {
      await app.prisma.$transaction(async (transaction) => {
        if (email) {
          await transaction.user.update({ where: { id: request.user.sub }, data: { email } });
        }
        await transaction.clientProfile.upsert({
          where: { userId: request.user.sub },
          update: profileInput,
          create: {
            ...profileInput,
            fullName: profileFullName,
            userId: request.user.sub,
          },
        });
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError("That email address is already in use.", 409, "EMAIL_IN_USE");
      }
      throw error;
    }

    return getClientProfile(app, request.user.sub);
  });
};

async function getClientProfile(app: Parameters<FastifyPluginAsync>[0], userId: string) {
  const user = await app.prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      clientProfile: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          fitnessGoal: true,
          experienceLevel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) throw new AppError("Authentication is required.", 401, "UNAUTHORIZED");
  return { email: user.email, profile: user.clientProfile };
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
