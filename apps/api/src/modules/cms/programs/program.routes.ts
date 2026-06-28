import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsListQuerySchema, paginationMeta, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, nullableText, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const programSchema = z.object({
  slug: z.string().trim().toLowerCase().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(5_000),
  imageUrl: nullableText(2_000),
  duration: nullableText(100),
  format: nullableText(100),
  benefits: z.array(z.string().trim().min(1).max(200)).max(30),
  sortOrder: z.number().int().min(0),
  published: z.boolean(),
}).strict();

const programCreateSchema = programSchema.extend({
  benefits: programSchema.shape.benefits.default([]),
  sortOrder: programSchema.shape.sortOrder.default(0),
  published: programSchema.shape.published.default(false),
});
const programPatchSchema = programSchema.partial().refine(requirePatchFields, "Provide at least one program field.");

export const programCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/programs", async (request) => {
    const query = parseRequestQuery(cmsListQuerySchema, request.query);
    const where = {
      ...(query.published !== undefined ? { published: query.published } : {}),
      ...(query.search ? {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { description: { contains: query.search, mode: "insensitive" as const } },
          { slug: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.program.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.program.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/programs", async (request, reply) => {
    const input = parseRequestBody(programCreateSchema, request.body);
    try {
      const program = await app.prisma.program.create({ data: input });
      return reply.status(201).send({ program });
    } catch (error) {
      rethrowPrismaError(error, "Program");
    }
  });

  app.patch("/programs/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(programPatchSchema, request.body);
    try {
      const program = await app.prisma.program.update({ where: { id }, data: input });
      return { program };
    } catch (error) {
      rethrowPrismaError(error, "Program");
    }
  });

  app.delete("/programs/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    try {
      await app.prisma.program.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Program");
    }
  });
};
