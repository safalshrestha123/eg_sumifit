import { prisma, type DatabaseClient } from "@sumifitness/db";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: DatabaseClient;
  }
}

export const databasePlugin = fp(async (app) => {
  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}, { name: "database" });
