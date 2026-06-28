import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { paginationMeta, paginationQuerySchema, toPrismaPagination } from "../../utils/pagination.js";
import { parseRequestBody, parseRequestQuery } from "../../utils/validation.js";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  phone: z.string().trim().max(40).nullable().optional(),
  subject: z.string().trim().max(200).nullable().optional(),
  message: z.string().trim().min(10).max(5_000),
}).strict();

export const publicRoutes: FastifyPluginAsync = async (app) => {
  app.get("/profile", async () => {
    const profile = await app.prisma.trainerProfile.findFirst({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        displayName: true,
        professionalTitle: true,
        shortBio: true,
        biography: true,
        avatarUrl: true,
        phone: true,
        location: true,
        specialization: true,
        yearsExperience: true,
        clientsCoached: true,
        updatedAt: true,
      },
    });
    return { profile };
  });

  app.get("/achievements", async (request) => {
    const query = parseRequestQuery(paginationQuerySchema, request.query);
    const [data, total] = await app.prisma.$transaction([
      app.prisma.achievement.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.achievement.count({ where: { published: true } }),
    ]);
    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.get("/certifications", async (request) => {
    const query = parseRequestQuery(paginationQuerySchema, request.query);
    const [data, total] = await app.prisma.$transaction([
      app.prisma.certification.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.certification.count({ where: { published: true } }),
    ]);
    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.get("/programs", async (request) => {
    const query = parseRequestQuery(paginationQuerySchema, request.query);
    const [data, total] = await app.prisma.$transaction([
      app.prisma.program.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.program.count({ where: { published: true } }),
    ]);
    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.get("/gallery", async (request) => {
    const query = parseRequestQuery(paginationQuerySchema, request.query);
    const [data, total] = await app.prisma.$transaction([
      app.prisma.galleryImage.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.galleryImage.count({ where: { published: true } }),
    ]);
    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.get("/testimonials", async (request) => {
    const query = parseRequestQuery(paginationQuerySchema, request.query);
    const [data, total] = await app.prisma.$transaction([
      app.prisma.testimonial.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], ...toPrismaPagination(query.page, query.pageSize) }),
      app.prisma.testimonial.count({ where: { published: true } }),
    ]);
    return { data, pagination: paginationMeta(total, query.page, query.pageSize) };
  });

  app.post("/contact", async (request, reply) => {
    const input = parseRequestBody(contactSchema, request.body);
    const contactMessage = await app.prisma.contactMessage.create({
      data: input,
      select: { id: true, createdAt: true },
    });

    return reply.status(201).send({
      message: {
        ...contactMessage,
        status: "received" as const,
      },
    });
  });
};
