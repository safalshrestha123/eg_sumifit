import "dotenv/config";

import { defineConfig } from "prisma/config";

const generationUrl = "postgresql://postgres:postgres@127.0.0.1:5432/sumifitness";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? generationUrl,
  },
});
