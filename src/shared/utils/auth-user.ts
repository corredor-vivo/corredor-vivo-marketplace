import type { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./jwt";

type AuthenticatedUser = {
  sub: string;
  role?: string;
  email?: string;
};

export async function getAuthenticatedUser(
  request: NextRequest,
): Promise<any | null> {
  const accessToken = request.cookies.get("chegou-access-token")?.value;

  if (accessToken) {
    try {
      return await verifyAccessToken(accessToken);
    } catch {}
  }

  const refreshToken = request.cookies.get("chegou-refresh-token")?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/account/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `chegou-refresh-token=${refreshToken}`,
        },
      },
    );

    if (!refreshResponse.ok) {
      return null;
    }

    const data = await refreshResponse.json();

    const newAccessToken = data.access_token;

    if (!newAccessToken) {
      return null;
    }

    return verifyAccessToken(newAccessToken);
  } catch {
    console.log("Error")
    return null;
  }
}