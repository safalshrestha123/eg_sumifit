import type { DatabaseClient } from "@sumifitness/db";
import bcrypt from "bcrypt";

import { env } from "../../config/index.js";
import { AppError } from "../../utils/errors.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function registerUser(database: DatabaseClient, input: RegisterInput) {
  const existingUser = await database.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Unable to create an account with these credentials.", 409, "ACCOUNT_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  try {
    return await database.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AppError("Unable to create an account with these credentials.", 409, "ACCOUNT_EXISTS");
    }

    throw error;
  }
}

export async function loginUser(database: DatabaseClient, input: LoginInput) {
  const user = await database.user.findUnique({
    where: { email: input.email },
    select: { ...publicUserSelect, passwordHash: true },
  });

  if (!user) {
    await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    throw invalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches || !user.active) {
    throw invalidCredentialsError();
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getCurrentUser(database: DatabaseClient, userId: string) {
  const user = await database.user.findFirst({
    where: { id: userId, active: true },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError("Authentication is required.", 401, "UNAUTHORIZED");
  }

  return user;
}

function invalidCredentialsError() {
  return new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
