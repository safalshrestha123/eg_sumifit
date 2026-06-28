import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsListQuerySchema, paginationMeta, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, nullableText, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const achievementSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(2_000),
  year: z.number().int().min(1900).max(2200).nullable().optional(),
  category: nullableText(100),
  sortOrder: z.number().int().min(0),
  published: z.boolean(),
}).strict();

const achievementCreateSchema = achievementSchema.extend({
  sortOrder: achievementSchema.shape.sortOrder.default(0),
  published: achievementSchema.shape.published.default(false),
});
const achievementPatchSchema = achievementSchema.partial().refine(requirePatchFields, "Provide at least one achievement field.");

export const achievementCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/achievements", async (request) => {
    const query = parseRequestQuery(cmsListQuerySchema, request.query);
    const where = {
      ...(query.published !== undefined ? { published: query.published } : {}),
      ...(query.search ? {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { description: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.achievement.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.achievement.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/achievements", async (request, reply) => {
    const input = parseRequestBody(achievementCreateSchema, request.body);
    const achievement = await app.prisma.achievement.create({ data: input });
    return reply.status(201).send({ achievement });
  });

  app.patch("/achievements/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(achievementPatchSchema, request.body);

    try {
      const achievement = await app.prisma.achievement.update({ where: { id }, data: input });
      return { achievement };
    } catch (error) {
      rethrowPrismaError(error, "Achievement");
    }
  });

  app.delete("/achievements/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);

    try {
      await app.prisma.achievement.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Achievement");
    }
  });
};
