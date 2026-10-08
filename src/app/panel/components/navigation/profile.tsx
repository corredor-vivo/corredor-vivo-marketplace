"use client";

import { LogOut, Store, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSidebar } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

export function getAcronim(name: string = ""): string {
  const ignoredWords = ["de", "da", "do", "das", "dos", "e"];

  return name
    .trim()
    .split(/\s+/)
    .filter((word) => !ignoredWords.includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function Profile() {
  const { user, signOut } = useAuth();
  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "";
  const acronym = getAcronim(fullName);
  const router = useRouter();

  const logOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="size-10 rounded-full bg-white p-0 md:h-auto md:w-auto md:px-3"
                aria-label="Abrir perfil"
              />
            }
          >
            <div className="items-center gap-3 rounded-full bg-emerald-700 text-white md:flex">
              <span className="pl-3 hidden md:block">{acronym}</span>
              <div className="bg-white rounded-full p-1">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={fullName}
                  />
                  <AvatarFallback>{acronym}</AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={logOut}>
                <LogOut />
                Terminar Sessão
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export function NavbarProfile() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div
      className={cn(
        "flex gap-3 items-center",
        state !== "expanded" && "justify-center",
      )}
    >
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt={fullName} />
        <AvatarFallback>{getAcronim(fullName)}</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
      {state === "expanded" && (
        <div>
          <p className="font-medium text-sm text-slate-800">{fullName}</p>
          <p></p>
        </div>
      )}
    </div>
  );
}
