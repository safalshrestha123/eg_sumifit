import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsListQuerySchema, paginationMeta, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, nullableText, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const gallerySchema = z.object({
  title: z.string().trim().min(2).max(200),
  altText: z.string().trim().min(2).max(300),
  imageUrl: z.string().trim().min(1).max(2_000),
  category: nullableText(100),
  description: nullableText(2_000),
  sortOrder: z.number().int().min(0),
  published: z.boolean(),
}).strict();

const galleryCreateSchema = gallerySchema.extend({
  sortOrder: gallerySchema.shape.sortOrder.default(0),
  published: gallerySchema.shape.published.default(false),
});
const galleryPatchSchema = gallerySchema.partial().refine(requirePatchFields, "Provide at least one gallery field.");

export const galleryCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/gallery", async (request) => {
    const query = parseRequestQuery(cmsListQuerySchema, request.query);
    const where = {
      ...(query.published !== undefined ? { published: query.published } : {}),
      ...(query.search ? {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { altText: { contains: query.search, mode: "insensitive" as const } },
          { category: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.galleryImage.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.galleryImage.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/gallery", async (request, reply) => {
    const input = parseRequestBody(galleryCreateSchema, request.body);
    const image = await app.prisma.galleryImage.create({ data: input });
    return reply.status(201).send({ image });
  });

  app.patch("/gallery/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(galleryPatchSchema, request.body);
    try {
      const image = await app.prisma.galleryImage.update({ where: { id }, data: input });
      return { image };
    } catch (error) {
      rethrowPrismaError(error, "Gallery image");
    }
  });

  app.delete("/gallery/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    try {
      await app.prisma.galleryImage.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Gallery image");
    }
  });
};
