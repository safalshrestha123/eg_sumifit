import type { FastifyPluginAsync } from "fastify";
import { fileTypeFromBuffer } from "file-type";

import { env } from "../../config/index.js";
import { AppError } from "../../utils/errors.js";
import { requireRoles } from "../auth/auth.middleware.js";
import { uploadImage } from "./cloudinary.service.js";

const allowedImageTypes = new Set(["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"]);

export const uploadRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", requireRoles("ADMIN", "TRAINER"));

  app.post("/image", async (request, reply) => {
    if (!request.isMultipart()) {
      throw new AppError("Send one image using multipart/form-data.", 415, "MULTIPART_REQUIRED");
    }

    const part = await request.file();
    if (!part) {
      throw new AppError("Select an image to upload.", 400, "IMAGE_REQUIRED");
    }

    let buffer: Buffer;
    try {
      buffer = await part.toBuffer();
    } catch (error) {
      if (isFileTooLargeError(error)) {
        throw new AppError(`Images must be ${formatMegabytes(env.UPLOAD_MAX_FILE_SIZE)} MB or smaller.`, 413, "FILE_TOO_LARGE");
      }
      throw error;
    }

    const detectedType = await fileTypeFromBuffer(buffer);
    if (!allowedImageTypes.has(part.mimetype.toLowerCase()) || !detectedType || !allowedImageTypes.has(detectedType.mime)) {
      throw new AppError("Only JPEG, PNG, WebP, GIF, or AVIF images are allowed.", 415, "INVALID_IMAGE_TYPE");
    }

    const uploaded = await uploadImage(buffer);
    return reply.status(201).send({
      image: {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
        bytes: uploaded.bytes,
        format: uploaded.format,
      },
    });
  });
};

function isFileTooLargeError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "FST_REQ_FILE_TOO_LARGE";
}

function formatMegabytes(bytes: number) {
  return Math.round(bytes / 1_048_576);
}
