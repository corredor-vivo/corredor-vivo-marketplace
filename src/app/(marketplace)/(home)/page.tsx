"use client"

import Link from "next/link"
import { ProductCard } from "../components/views/card"
import { useMarketplace } from "../hooks/use-marketplace"
import { MarketplaceBanner } from "../components/views/banner"

export default function MarketPlace() {
    const { products } = useMarketplace()
    return (
        <>

            <MarketplaceBanner />
            <section className="space-y-4">

                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-900">
                    Produtos destacados
                </h1>
                <Link href="/products" className="text-emerald-700 font-semibold text-sm hover:underline">
                    Ver mais
                </Link>
                </div>


               <section className="grid md:grid-cols-4 sm:grid-cols-2 gap-5">
                 {products.map((product) => (
                    <ProductCard product={product} key={product.id} />

                ))}
               </section>
            </section>
        </>
    )
}