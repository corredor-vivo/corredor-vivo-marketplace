import { LayoutDashboard, LucideIcon, Package, ShoppingCart } from "lucide-react";
import { Role } from "~/app/(account)/enums/role";

export const NAVBAR_ITEMS: {
    icon: LucideIcon;
    href: string;
    name: string;
    roles: Role[];
}[] = [
        {
            icon: LayoutDashboard,
            href: "/panel",
            name: "Painel de Controlo",
            roles: ["producer"],
        },
        {
            icon: Package,
            href: "/panel/products",
            name: "Meus Produtos",
            roles: ["producer"],
        },
        {
            icon: ShoppingCart,
            href: "/panel/orders",
            name: "Minhas Encomendas",
            roles: ["producer"]
        }
    ];
export function isNavbarItemActive(pathname: string, href: string) {
    return (
        pathname === href || (href !== "/panel" && pathname.startsWith(`${href}/`))
    );
}