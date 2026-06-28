import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { AppError } from "../../../utils/errors.js";
import { parseRequestBody } from "../../../utils/validation.js";
import { nullableText, requirePatchFields } from "../cms.common.js";

const profilePatchSchema = z.object({
  displayName: z.string().trim().min(2).max(100).optional(),
  professionalTitle: z.string().trim().min(2).max(150).optional(),
  shortBio: nullableText(500),
  biography: nullableText(5_000),
  avatarUrl: nullableText(2_000),
  phone: nullableText(40),
  location: nullableText(150),
  specialization: nullableText(200),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  clientsCoached: z.number().int().min(0).max(10_000_000).optional(),
  published: z.boolean().optional(),
}).strict().refine(requirePatchFields, "Provide at least one profile field.");

export const profileCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/profile", async (request) => {
    const profile = await app.prisma.trainerProfile.findUnique({
      where: { userId: request.user.sub },
    });

    return { profile };
  });

  app.patch("/profile", async (request) => {
    const input = parseRequestBody(profilePatchSchema, request.body);
    const existingProfile = await app.prisma.trainerProfile.findUnique({
      where: { userId: request.user.sub },
      select: { id: true },
    });

    if (!existingProfile && (!input.displayName || !input.professionalTitle)) {
      throw new AppError(
        "displayName and professionalTitle are required when creating a profile.",
        400,
        "PROFILE_FIELDS_REQUIRED",
      );
    }

    const profile = existingProfile
      ? await app.prisma.trainerProfile.update({
          where: { userId: request.user.sub },
          data: input,
        })
      : await app.prisma.trainerProfile.create({
          data: {
            ...input,
            displayName: input.displayName!,
            professionalTitle: input.professionalTitle!,
            userId: request.user.sub,
          },
        });

    return { profile };
  });
};
