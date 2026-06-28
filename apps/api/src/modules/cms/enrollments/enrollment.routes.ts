import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { cmsEnrollmentSelect, isPrismaError } from "../../enrollments/enrollment.common.js";
import { AppError } from "../../../utils/errors.js";
import { paginationMeta, paginationQuerySchema, toPrismaPagination } from "../../../utils/pagination.js";
import { parseRequestBody, parseRequestParams, parseRequestQuery } from "../../../utils/validation.js";
import { idParamsSchema } from "../cms.common.js";

const enrollmentStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);
const enrollmentListQuerySchema = paginationQuerySchema.extend({
  status: enrollmentStatusSchema.optional(),
  search: z.string().trim().max(100).optional(),
});
const enrollmentPatchSchema = z.object({ status: enrollmentStatusSchema }).strict();

export const enrollmentCmsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/enrollments", async (request) => {
    const query = parseRequestQuery(enrollmentListQuerySchema, request.query);
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search ? {
        OR: [
          { program: { title: { contains: query.search, mode: "insensitive" as const } } },
          { user: { email: { contains: query.search, mode: "insensitive" as const } } },
          { user: { clientProfile: { fullName: { contains: query.search, mode: "insensitive" as const } } } },
        ],
      } : {}),
    };
    const [data, total] = await app.prisma.$transaction([
      app.prisma.programEnrollment.findMany({
        where,
        select: cmsEnrollmentSelect,
        orderBy: { createdAt: "desc" },
        ...toPrismaPagination(query.page, query.pageSize),
      }),
      app.prisma.programEnrollment.count({ where }),
    ]);

    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.patch("/enrollments/:id", async (request) => {
    const { id } = parseRequestParams(idParamsSchema, request.params);
    const input = parseRequestBody(enrollmentPatchSchema, request.body);
    try {
      const enrollment = await app.prisma.programEnrollment.update({
        where: { id },
        data: input,
        select: cmsEnrollmentSelect,
      });
      return { enrollment };
    } catch (error) {
      if (isPrismaError(error, "P2025")) {
        throw new AppError("Enrollment was not found.", 404, "NOT_FOUND");
      }
      throw error;
    }
  });
};
