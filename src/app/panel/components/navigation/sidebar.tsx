"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { isNavbarItemActive, NAVBAR_ITEMS } from "~/shared/utils/navbar";
import { NavbarProfile } from "./profile";

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r bg-white">
      <SidebarHeader className="bg-white">
        <NavbarProfile />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            {NAVBAR_ITEMS.filter(
              (item) => user && item.roles.includes(user.role),
            ).map((item) => {
              const Icon = item.icon;
              const isActive = isNavbarItemActive(pathname, item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className="data-active:bg-emerald-700! data-active:text-white! data-active:hover:bg-emerald-700! data-active:hover:text-white!"
                    render={
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                      />
                    }
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}