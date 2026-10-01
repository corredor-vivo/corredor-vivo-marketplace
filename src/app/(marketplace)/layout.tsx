"use client"

import { LogIn, Minus, Plus, SearchIcon, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationsBell } from "~/shared/sales/notifications";
import { useState } from "react";
import { useAuth } from "../(account)/hooks/use-auth"
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Profile } from "../panel/components/navigation/profile";
import { MarketplaceFooter } from "./components/footer";
import { MarketplaceCartProvider, useMarketplaceCart } from "./hooks/use-cart";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import { formatCurrency } from "~/shared/utils/currency";
import { Input } from "~/components/ui/input";

export default function MarkePlaceLayout({ children }: LayoutProps<"/">) {
    return (
        <MarketplaceCartProvider>
            <MarketplaceLayoutContent>{children}</MarketplaceLayoutContent>
        </MarketplaceCartProvider>
    );
}

function MarketplaceLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const { items, totalItems, updateQuantity, removeProduct, isPending } = useMarketplaceCart();
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);

    function handleQuantityChange(productId: string, value: string) {
        const quantity = Number(value);

        if (Number.isFinite(quantity) && quantity > 0) {
            updateQuantity(productId, quantity);
        }
    }

    return (
        <>
            <main className="w-full">
                <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-3.5 px-6 rounded-2xl border border-zinc-200/70 shadow-sm mx-auto w-[80%] my-3    ">
                    <div className="flex items-center gap-2 shrink-0">
                        <img
                            src={"/images/logo.jpeg"}
                            alt="Corredor Vivo"
                            className="h-8 w-auto object-contain"
                        />
                    </div>

                    <InputGroup className="hidden min-w-0 md:flex md:w-full md:max-w-96 md:flex-1">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon align="inline-end">
                            <Button className="bg-emerald-700 hover:bg-emerald-800">
                                <SearchIcon />
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>


                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/">Marketplace</Link>
                        {isAuthenticated && <Link href={user?.role === 'producer' ? '/panel/orders' : '/orders'} className="text-sm">Encomendas</Link>}
                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger
                                render={
                                    <button
                                        type="button"
                                        className="relative rounded-xl p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-emerald-900"
                                        aria-label={`Carrinho com ${totalItems} item${totalItems === 1 ? "" : "s"}`}
                                    />
                                }
                            >
                                <ShoppingCart className="h-4 w-4" />
                                {totalItems > 0 ? (
                                    <span className="absolute top-1 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-emerald-700 px-0.5 text-[9px] font-bold text-white">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                ) : null}
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md">
                                <SheetHeader>
                                    <SheetTitle>Meu carrinho</SheetTitle>
            
                                </SheetHeader>

                                <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6">
                                    {items.length > 0 ? (
                                        items.map((item) => {
                                            const availableQuantity = item.product.info.quantity;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="rounded-xl border border-zinc-200 p-3"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-zinc-900">{item.product.info.name}</p>
                                                            <p className="text-xs text-zinc-500">
                                                                {formatCurrency(item.product.info.averagePrice ?? 0)} por {item.product.unit.name ?? "unidade"}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon-xs"
                                                            className="text-red-600 hover:text-red-700"
                                                            aria-label={`Remover ${item.product.info.name}`}
                                                            onClick={() => removeProduct(item.id)}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-xs text-zinc-500">
                                                            Disponível: {availableQuantity} {item.product.unit.name ?? ""}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-xs"
                                                                aria-label={`Diminuir quantidade de ${item.product.info.name}`}
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            >
                                                                <Minus />
                                                            </Button>
                                                            <Input 
                                                                value={item.quantity}
                                                
                                                                inputMode="numeric"
                                                                className="h-7 w-14 px-2 text-center"
                                                                aria-label={`Quantidade de ${item.product.info.name}`}
                                                                onChange={(event) =>
                                                                    handleQuantityChange(item.id, event.target.value)
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-xs"
                                                                aria-label={`Aumentar quantidade de ${item.product.info.name}`}
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="py-10 text-center text-sm text-zinc-500">
                                            O carrinho está vazio.
                                        </p>
                                    )}
                                </div>
                                <SheetFooter className="border-t border-zinc-200">
                                    <Button
                                        type="button"
                                        className="w-full bg-emerald-700 hover:bg-emerald-800"
                                        disabled={items.length === 0 || isPending}
                                        onClick={() => { setIsCartOpen(false); router.push('/cart'); }}
                                    >
                                        Continuar encomenda
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>

                        {isAuthenticated ? (
                            <>
                                <NotificationsBell />



                                <div className="h-5 w-px bg-zinc-200 mx-1" />

                                <Profile />
                            </>
                        ) : (
                            <Button
                                className="bg-emerald-700 hover:bg-emerald-600 rounded-md"

                            >
                                <Link href={"/sign-in"}>

                                    <LogIn />
                                    Login
                                </Link>
                            </Button>
                        )}
                    </div>
                </header>
                <section className="mx-auto w-[80%] space-y-7 mb-5">

                    {children}

                    <MarketplaceFooter />
                </section>
                
            </main>
            
        </>
    )
}
