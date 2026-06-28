export type UserRole = "ADMIN" | "TRAINER" | "CLIENT";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  type: "access";
}
