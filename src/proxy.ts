import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canAccessRoute, isPublicRoute } from "./shared/utils/guard";
import { getAuthenticatedUser } from "./shared/utils/auth-user";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic = isPublicRoute(path);

  if (isPublic) return NextResponse.next();

  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!canAccessRoute(path, user.role)) {
    return new NextResponse("Acesso negado", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};