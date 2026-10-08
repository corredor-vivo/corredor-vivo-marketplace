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
        <div className="group shadow rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                />

                {/* Category */}
                <div className="absolute left-4 bottom-4">
                    <Badge className="bg-emerald-700 text-white">
                        {product.category.name}
                    </Badge>
                </div>

                {/* Quantity */}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-700 text-white">
                        <MapPin />
                        {product.province.name}
                    </Badge>

                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">
                        {product.name}
                    </h3>

                    <h5 className="text-emerald-800 font-semibold">
                        {formatCurrency(product.price)}
                    </h5>
                </div>

                {/* Quantity info */}
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Disponível
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-gray-800">
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