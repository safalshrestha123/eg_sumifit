import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { paginationMeta, paginationQuerySchema, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema, requirePatchFields, rethrowPrismaError } from "../cms.common.js";

const booleanQuery = z.enum(["true", "false"]).transform((value) => value === "true").optional();
const messageListSchema = paginationQuerySchema.extend({
  read: booleanQuery,
  archived: booleanQuery,
  search: z.string().trim().max(100).optional(),
});
const messagePatchSchema = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
}).strict().refine(requirePatchFields, "Provide at least one message field.");

export const messageCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/messages", async (request) => {
    const query = parseRequestQuery(messageListSchema, request.query);
    const where = {
      ...(query.read !== undefined ? { read: query.read } : {}),
      ...(query.archived !== undefined ? { archived: query.archived } : {}),
      ...(query.search ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { email: { contains: query.search, mode: "insensitive" as const } },
          { subject: { contains: query.search, mode: "insensitive" as const } },
          { message: { contains: query.search, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.contactMessage.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.patch("/messages/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(messagePatchSchema, request.body);
    try {
      const message = await app.prisma.contactMessage.update({ where: { id }, data: input });
      return { message };
    } catch (error) {
      rethrowPrismaError(error, "Contact message");
    }
  });

  app.delete("/messages/:id", async (request, reply) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    try {
      await app.prisma.contactMessage.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      rethrowPrismaError(error, "Contact message");
    }
  });
};
