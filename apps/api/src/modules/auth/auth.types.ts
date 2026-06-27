export interface AccessTokenPayload {
  sub: string;
  role: "ADMIN";
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion: number;
  type: "refresh";
}
