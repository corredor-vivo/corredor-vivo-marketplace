"use client"
import { useQuery } from "@tanstack/react-query";
import { MarketplaceBanner } from "./components/banner";
import { http } from "~/shared/http";
import { ChevronRight, MapPin } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { ProductCard } from "./components/product-card";
import { getConsolidatedProductId, ConsolidatedProduct } from "./models";
import { useMarketplaceCart } from "./hooks/use-cart";

export default function MarkePlace() {
    const { addProduct } = useMarketplaceCart();
    const { data: consolidatedProducts = [], isPending } = useQuery({
        queryKey: ["consolidated_products"],
        queryFn: async (): Promise<ConsolidatedProduct[]> => {
            const response = await http.get<ConsolidatedProduct[]>("/products/consolidated");
            return response.data;
        },
    });

    return (
        <>
            <section>
                <MarketplaceBanner />

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-900">
                                <MapPin className="h-4 w-4 fill-emerald-900" />
                            </div>
                            <h3 className="text-base font-black text-zinc-900 tracking-tight">
                                Destaques na sua região
                            </h3>
                        </div>
                        <button className="text-xs font-bold text-emerald-800 flex items-center gap-0.5 hover:underline">
                            Ver todos <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {isPending ? (
                        <div className="text-center py-12 text-zinc-500 text-xs font-medium">
                            <Spinner />
                        </div>
                    ) : consolidatedProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200/80 text-zinc-500 text-xs font-medium space-y-3">
                            <p>Nenhum produto encontrado na API para os filtros aplicados.</p>
                            <Button className="bg-emerald-900 hover:bg-emerald-950 text-white text-xs px-4 py-2 rounded-xl font-bold">
                                Mostrar todos os produtos
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {consolidatedProducts.map((consolidated) => (
                                 <ProductCard
                                    key={getConsolidatedProductId(consolidated)}
                                    products={consolidated.products}
                                    unit={consolidated.unit}
                                    info={consolidated.info}
                                    onAddToCart={(quantity) => addProduct(consolidated, quantity)}
                                />
                                
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </>
    )
}
