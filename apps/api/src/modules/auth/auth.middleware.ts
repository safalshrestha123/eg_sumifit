import type { preHandlerHookHandler } from "fastify";

import { AppError } from "../../utils/errors.js";
import type { UserRole } from "./auth.types.js";

export function requireRoles(...allowedRoles: UserRole[]): preHandlerHookHandler {
  return async (request) => {
    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError("You do not have permission to access this resource.", 403, "FORBIDDEN");
    }
  };
}
