import { jwtVerify, type JWTPayload } from "jose";
import type { Role } from "~/app/(account)/enums/role";

export type AccessTokenPayload = JWTPayload & {
  sub: string;
  role?: Role;
  email?: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não está definido no .env");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload | undefined> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    return payload as AccessTokenPayload;
  } catch {
    return undefined;
  }
}
