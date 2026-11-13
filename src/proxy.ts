import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canAccessRoute, isPublicRoute } from "./shared/utils/guard";
import { getAuthenticatedUser } from "./shared/utils/auth-user";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic = isPublicRoute(path);

  if (isPublic) return NextResponse.next();

  const { user, setCookie } = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!user.role || !canAccessRoute(path, user.role)) {
    return new NextResponse("Acesso negado", { status: 403 });
  }

  const response = NextResponse.next();

  // Renova o cookie do access token no browser quando o backend
  // devolve um novo token no refresh.
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
