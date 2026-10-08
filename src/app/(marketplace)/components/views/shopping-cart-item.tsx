import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ShoppingCartItem } from "../../models/shopping-cart";
import { formatCurrency } from "~/shared/utils/currency";
import { Input } from "~/components/ui/input";
import { useCart } from "../../hooks/use-cart";

type CartItemProps = {
    item: ShoppingCartItem;
    onIncrease?: (item: ShoppingCartItem) => void;
    onDecrease?: (item: ShoppingCartItem) => void;
    onRemove?: (item: ShoppingCartItem) => void;
};

export function CartItem({
    item,
    onRemove,
}: CartItemProps) {
    const { product } = item;
    const { addCartItem, loading } = useCart();

    const updateQuantity = async (value: string) => {
        const quantity = Number(value);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity === Number(item.quantity)) {
            return;
        }

        await addCartItem(product.uuid, quantity);
    };

    return (
        <div className="flex gap-4 border-b py-4">
            {/* Imagem */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Informações */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="truncate font-medium">
                            {product.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {product.unit.name} ({product.unit.abbreviation})
                        </p>
                    </div>

                    <Button
                        type="button"
                        aria-label={`Remover ${product.name} do carrinho`}
                        size="icon"
                        className="border-0 hover:bg-red-400 bg-red-600 text-white cursor-pointer"
                        onClick={() => onRemove?.(item)}
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    {/* Quantidade */}
                    <div className="flex items-center gap-2">
                      
                        <Input
                            id={`cart-item-quantity-${item.uuid}`}
                         
                            min={1}
                            step={1}
                            inputMode="decimal"
                            defaultValue={Number(item.quantity)}
                            disabled={loading}
                            aria-label={`Quantidade de ${product.name}`}
                            className="h-9 w-20 rounded-lg text-center"
                            onBlur={(event) => void updateQuantity(event.currentTarget.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.currentTarget.blur();
                                }
                            }}
                        />
                    </div>

                    {/* Preço */}
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.product.price)}
                             / 1 {product.unit.abbreviation}
                        </p>

                        <p className="font-semibold text-emerald-800">
                            {formatCurrency(item.total_price)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
