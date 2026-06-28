import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsListQuerySchema, paginationMeta, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, nullableText, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(150),
  role: nullableText(150),
  quote: z.string().trim().min(10).max(5_000),
  result: nullableText(300),
  rating: z.number().int().min(1).max(5),
  sortOrder: z.number().int().min(0),
  published: z.boolean(),
}).strict();

const testimonialCreateSchema = testimonialSchema.extend({
  rating: testimonialSchema.shape.rating.default(5),
  sortOrder: testimonialSchema.shape.sortOrder.default(0),
  published: testimonialSchema.shape.published.default(false),
});
const testimonialPatchSchema = testimonialSchema.partial().refine(requirePatchFields, "Provide at least one testimonial field.");

export const testimonialCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/testimonials", async (request) => {
    const query = parseRequestQuery(cmsListQuerySchema, request.query);
    const where = {
      ...(query.published !== undefined ? { published: query.published } : {}),
      ...(query.search ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { quote: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.testimonial.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.testimonial.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/testimonials", async (request, reply) => {
    const input = parseRequestBody(testimonialCreateSchema, request.body);
    const testimonial = await app.prisma.testimonial.create({ data: input });
    return reply.status(201).send({ testimonial });
  });

  app.patch("/testimonials/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(testimonialPatchSchema, request.body);
    try {
      const testimonial = await app.prisma.testimonial.update({ where: { id }, data: input });
      return { testimonial };
    } catch (error) {
      rethrowPrismaError(error, "Testimonial");
    }
  });

  app.delete("/testimonials/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    try {
      await app.prisma.testimonial.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Testimonial");
    }
  });
};
