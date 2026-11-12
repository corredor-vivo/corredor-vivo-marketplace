"use client"
import { cn } from 'cn';
import { Bell, LogIn, Package, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '~/app/(account)/hooks/use-auth';
import { Profile } from '~/app/panel/components/navigation/profile';
import { Badge } from '~/components/ui/badge';
import { Button, buttonVariants } from '~/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group';
import { ShoppingCart } from '../views/shopping-cart';

export function MarketPlaceHeader() {

    const { isAuthenticated, user } = useAuth();

    return (<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-312 grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
            <Link href={"/"} className="col-start-1 row-start-1 shrink-0">
                <Image
                    src={"/images/logo.jpeg"}
                    width={120}
                    height={32}
                    alt="Corredor Vivo"
                    className="h-8 w-auto object-contain"
                />
            </Link>

            <InputGroup className="col-span-2 row-start-2 w-full lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:max-w-md">
                <InputGroupInput placeholder="Pesquisar produto..." />
                <InputGroupAddon>
                    <Button size={"icon-sm"} className="bg-emerald-700 hover:bg-emerald-800">
                        <SearchIcon />
                    </Button>
                </InputGroupAddon>
            </InputGroup>

            <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 sm:gap-3 lg:col-start-3">
                {isAuthenticated ? (
                    <>

                        <Link
                            href={user?.role === "producer" ? "/panel/orders" : "/orders"}
                            aria-label="Minhas Encomendas"
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 sm:px-3"
                        >
                            <Package className="size-5 lg:hidden" aria-hidden="true" />
                            <span className="hidden lg:inline">Minhas Encomendas</span>
                        </Link>
                        <div className="mx-1 hidden h-5 w-px bg-zinc-200 lg:block" />

                        <div className="flex items-center gap-1 sm:gap-3">
                            <ShoppingCart />
                            <div className="relative">
                                <Button variant={"ghost"} aria-label="Notificações">
                                    <Bell size={"20"} />
                                </Button>

                                <Badge className="absolute -top-1 -right-1 bg-red-500 px-1 font-bold text-white">
                                    0
                                </Badge>
                            </div>

                            <Profile />
                        </div>
                    </>
                ) : (

                    <a
                        href="/sign-in"
                        className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-emerald-700 hover:bg-emerald-800 text-white ")}
                    >
                        <LogIn />
                        Entrar
                    </a>

                )}
            </div>
        </div>
    </header>
    )
}