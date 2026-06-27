import multipart from "@fastify/multipart";
import fp from "fastify-plugin";

import { env } from "../config/index.js";

export const multipartPlugin = fp(async (app) => {
  await app.register(multipart, {
    limits: {
      files: 1,
      fileSize: env.UPLOAD_MAX_FILE_SIZE,
      fields: 0,
      parts: 1,
    },
  });
}, { name: "multipart" });
