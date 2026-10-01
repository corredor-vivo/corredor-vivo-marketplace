"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../(account)/hooks/use-auth";
import { Spinner } from "~/components/ui/spinner";
import { AppSidebar } from "./components/navigation/sidebar";
import { Header } from "./components/navigation/header";
import { SidebarProvider } from "~/components/ui/sidebar";


export default function PanelLayout({ children }: LayoutProps<"/panel">) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/sign-in");
        }
    }, [isLoading, router, user]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex min-h-svh min-w-0 flex-1 flex-col bg-violet-50 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-0">
                <Header />
                <section className="px-4 sm:px-6 md:px-10">{children}</section>
            </main>
        </SidebarProvider>
    )
}
