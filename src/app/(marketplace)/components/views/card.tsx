"use client"
import { MapPin, Pin, ShoppingCart } from "lucide-react"
import { useAuth } from "~/app/(account)/hooks/use-auth"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { formatCurrency } from "~/shared/utils/currency"
import { useCart } from "../../hooks/use-cart"

export function ProductCard({
    product,
}: {
    product: ConsolidateProductModel
}) {
    const { isAuthenticated } = useAuth()
    const { addCartItem } = useCart();

    const handleAddToCart = async () => {
        await addCartItem(product.uuid);
    }

    return (
        <div className="group overflow-hidden rounded-lg shadow transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-36 w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105 sm:h-48 lg:h-56 xl:h-64"
                />

                {/* Category */}
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                    <Badge className="bg-emerald-700 px-2 text-[10px] text-white sm:px-2.5 sm:text-xs">
                        {product.category.name}
                    </Badge>
                </div>

                {/* Quantity */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <Badge className="bg-emerald-700 px-2 text-[10px] text-white sm:px-2.5 sm:text-xs">
                        <MapPin />
                        {product.province.name}
                    </Badge>

                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-5">
                <div className="mb-2 sm:mb-3">
                    <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-gray-900 sm:text-lg lg:text-xl">
                        {product.name}
                    </h3>

                    <h5 className="mt-1 text-sm font-semibold text-emerald-800 sm:text-base">
                        {formatCurrency(product.price)}
                    </h5>
                </div>

                {/* Quantity info */}
                <div className="flex items-center justify-between gap-2 pt-3 sm:pt-4">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                            Disponível
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-gray-800 sm:text-sm">
                            {(Number(product.quantity) - Number(product.reserverdQuantity)).toLocaleString("pt-PT")}{" "}
                            {product.unit.abbreviation}
                        </p>
                    </div>

                    {isAuthenticated && (
                        <Button size={"icon"} className="bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer" onClick={handleAddToCart}>
                            <ShoppingCart />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}