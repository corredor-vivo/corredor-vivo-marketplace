import { Role } from "~/app/(account)/enums/role";

const publicRoutes = ["/sign-in", "/sign-up", "/forgeted-password", "/"];

const roleRoutes: Record<string, readonly Role[]> = {
  "/panel": ["producer"],
  "/cart": ["customer"],
  "/checkout": ["customer"],
  "/orders": ["customer"],
};

function matchesRoute(path: string, route: string) {
  return path === route || path.startsWith(`${route}/`);
}

export function isPublicRoute(path: string) {
  return publicRoutes.some((route) => matchesRoute(path, route));
}

export function canAccessRoute(path: string, role: Role) {
  const restrictedRoute = Object.entries(roleRoutes).find(([route]) =>
    matchesRoute(path, route),
  );
  return !restrictedRoute || restrictedRoute[1].includes(role);
}

export function RedirectTo(role: Role) {

  if (["customer"].includes(role)) return "/"
  return "/panel"
}
