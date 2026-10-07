import { PackageCheck } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Profile } from "./profile";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white md:hidden">
        <PackageCheck className="size-5" aria-hidden="true" />
        <span className="sr-only">Chegou</span>
      </div>
      <SidebarTrigger
        className="hidden rounded-xl border border-slate-100 bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 md:inline-flex"
        size="icon-lg"
        variant="default"
      />

      <p className="mr-auto hidden text-xs text-slate-400 sm:block">
        Corredor Vivo <span className="mx-2 text-slate-200">/</span>
        <span className="font-medium text-slate-600">Área do produtor</span>
      </p>

      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        <Profile />
      </div>
    </header>
  );
}
