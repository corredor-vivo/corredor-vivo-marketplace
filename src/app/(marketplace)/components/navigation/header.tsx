"use client"
import { cn } from 'cn';
import { Bell, LogIn, SearchIcon, ShoppingBag } from 'lucide-react';
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

    return (<header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-[max(1.5rem,calc((100vw-1200px)/2))]">
        <div className="flex items-center gap-2 shrink-0">
            <Link href={"/"}>
                <Image
                    src={"/images/logo.jpeg"}
                    width={120}
                    height={32}
                    alt="Corredor Vivo"
                    className="h-8 w-auto object-contain"
                />
            </Link>
        </div>

        <InputGroup className='w-72'>
            <InputGroupInput placeholder="Pesquisar produto..." />
            <InputGroupAddon>
                <Button size={"icon-sm"} className="bg-emerald-700 hover:bg-emerald-800">
                    <SearchIcon />
                </Button>
            </InputGroupAddon>
        </InputGroup>
        <div className="flex items-center gap-1 sm:gap-3">


            {isAuthenticated ? (
                <>

                    <Link
                        href={user?.role === "producer" ? "/panel/orders" : "/orders"}
                        className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 sm:px-3"
                    >
                        Minhas Encomendas
                    </Link>
                    <div className="h-5 w-px bg-zinc-200 mx-1" />

                    <div className="flex gap-3">
                       <ShoppingCart />
                        <div className="relative">
                            <Button variant={"ghost"}>
                                <Bell size={"20"} />
                            </Button>

                            <Badge className="absolute -top-1 -right-1 bg-red-500 px-1 font-bold text-white">
                                3
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
    </header>
    )
}