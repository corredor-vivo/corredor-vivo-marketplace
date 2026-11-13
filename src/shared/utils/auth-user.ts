import type { NextRequest } from "next/server";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";

export type AuthResult = {
  user: AccessTokenPayload | null;
  // Cookie emitido pelo backend ao renovar o access token.
  // Precisa ser repassado ao browser para não renovar a cada request.
  setCookie?: string;
};

function getBackendUrl() {
  const url = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  return url.replace(/\/+$/, "");
}

export async function getAuthenticatedUser(
  request: NextRequest,
): Promise<AuthResult> {
  const accessToken = request.cookies.get("chegou-access-token")?.value;

  if (accessToken) {
    const user = await verifyAccessToken(accessToken);

    if (user) {
      return { user };
    }
  }

  const refreshToken = request.cookies.get("chegou-refresh-token")?.value;

  if (!refreshToken) {
    return { user: null };
  }

  try {
    const refreshResponse = await fetch(`${getBackendUrl()}/account/refresh`, {
      method: "POST",
      headers: {
        Cookie: `chegou-refresh-token=${refreshToken}`,
      },
    });

    if (!refreshResponse.ok) {
      return { user: null };
    }

    const data = await refreshResponse.json();

    const newAccessToken = data.access_token;

    if (!newAccessToken) {
      return { user: null };
    }

    const user = await verifyAccessToken(newAccessToken);

    return {
      user: user ?? null,
      setCookie: refreshResponse.headers.get("set-cookie") ?? undefined,
    };
  } catch {
    return { user: null };
  }
}
