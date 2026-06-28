import type { FastifyPluginAsync } from "fastify";

import { requireRoles } from "../auth/auth.middleware.js";
import { achievementCmsRoutes } from "./achievements/achievement.routes.js";
import { certificationCmsRoutes } from "./certifications/certification.routes.js";
import { enrollmentCmsRoutes } from "./enrollments/enrollment.routes.js";
import { galleryCmsRoutes } from "./gallery/gallery.routes.js";
import { messageCmsRoutes } from "./messages/message.routes.js";
import { profileCmsRoutes } from "./profile/profile.routes.js";
import { programCmsRoutes } from "./programs/program.routes.js";
import { testimonialCmsRoutes } from "./testimonials/testimonial.routes.js";

export const cmsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", requireRoles("ADMIN", "TRAINER"));

  await app.register(profileCmsRoutes);
  await app.register(achievementCmsRoutes);
  await app.register(certificationCmsRoutes);
  await app.register(enrollmentCmsRoutes);
  await app.register(programCmsRoutes);
  await app.register(galleryCmsRoutes);
  await app.register(testimonialCmsRoutes);
  await app.register(messageCmsRoutes);
};
