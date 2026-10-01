import { PackageCheck, SearchIcon } from "lucide-react";
import { NotificationsBell } from "~/shared/sales/notifications";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Profile } from "./profile";

export function Header() {
  return (
    <header className="mb-4 flex w-full items-center justify-between gap-3 border-b bg-white px-4 py-4 shadow sm:px-6 md:px-4 lg:px-8">
      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white md:hidden">
        <PackageCheck className="size-5" aria-hidden="true" />
        <span className="sr-only">Chegou</span>
      </div>
      <SidebarTrigger
        className="hidden bg-emerald-700 hover:bg-emerald-800 text-white md:inline-flex"
        size="icon-lg"
        variant="default"
      />

      <InputGroup className="hidden min-w-0 md:flex md:w-full md:max-w-96 md:flex-1">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            <SearchIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        <NotificationsBell />
        <Profile />
      </div>
    </header>
  );
}
