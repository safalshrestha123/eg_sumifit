import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import { env } from "../../config/index.js";
import { AppError } from "../../utils/errors.js";

export async function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError("Image uploads are not configured.", 503, "UPLOAD_NOT_CONFIGURED");
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    return await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: "image",
        folder: "sumifitness",
        overwrite: false,
        unique_filename: true,
        use_filename: false,
      }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary returned no upload result."));
          return;
        }
        resolve(result);
      });

      stream.end(buffer);
    });
  } catch {
    throw new AppError("The image could not be uploaded. Please try again.", 502, "UPLOAD_FAILED");
  }
}
