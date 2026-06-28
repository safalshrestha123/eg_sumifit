import cors from "@fastify/cors";
import fp from "fastify-plugin";

import { env } from "../config/index.js";

export const corsPlugin = fp(async (app) => {
  const origins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

  await app.register(cors, {
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: !origins.includes("*"),
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
}, { name: "cors" });
