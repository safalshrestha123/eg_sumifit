import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsListQuerySchema, paginationMeta, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, nullableText, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const optionalDate = z.string().datetime().transform((value) => new Date(value)).nullable().optional();

const certificationSchema = z.object({
  title: z.string().trim().min(2).max(200),
  issuer: z.string().trim().min(2).max(200),
  description: nullableText(2_000),
  issuedAt: optionalDate,
  expiresAt: optionalDate,
  credentialUrl: z.union([z.url().max(2_000), z.literal(""), z.null()]).transform((value) => value || null).optional(),
  sortOrder: z.number().int().min(0),
  published: z.boolean(),
}).strict();

const certificationCreateSchema = certificationSchema.extend({
  sortOrder: certificationSchema.shape.sortOrder.default(0),
  published: certificationSchema.shape.published.default(false),
});
const certificationPatchSchema = certificationSchema.partial().refine(requirePatchFields, "Provide at least one certification field.");

export const certificationCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/certifications", async (request) => {
    const query = parseRequestQuery(cmsListQuerySchema, request.query);
    const where = {
      ...(query.published !== undefined ? { published: query.published } : {}),
      ...(query.search ? {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { issuer: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.certification.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.certification.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/certifications", async (request, reply) => {
    const input = parseRequestBody(certificationCreateSchema, request.body);
    const certification = await app.prisma.certification.create({ data: input });
    return reply.status(201).send({ certification });
  });

  app.patch("/certifications/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(certificationPatchSchema, request.body);
    try {
      const certification = await app.prisma.certification.update({ where: { id }, data: input });
      return { certification };
    } catch (error) {
      rethrowPrismaError(error, "Certification");
    }
  });

  app.delete("/certifications/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    try {
      await app.prisma.certification.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Certification");
    }
  });
};
