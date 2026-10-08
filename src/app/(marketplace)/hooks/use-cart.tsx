import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "~/shared/http";
import { ShoppingCart, ShoppingCartItem } from "../models/shopping-cart";
import { useMarketplace } from "./use-marketplace";

const CART_KEY = "cart_uuid";

type CartItemDto = {
    consolidatedProduct: string
    quantity: number;
}

type useCartType = {
    currentCart: ShoppingCart | null;
    items: ShoppingCartItem[];
    loading: boolean;
    refetch: () => void;
    addCartItem: (product_id: string, quantity?: number) => Promise<void>;
    clearCart: () => void;
}

export function useCart(): useCartType {
    const { refetch } = useMarketplace()
    const query = useQuery({
        queryKey: ["shopping-cart"],
        queryFn: async () => {
            const storedCart = localStorage.getItem(CART_KEY);

            if (storedCart) {
                const response = await http.get(
                    `/shopping-cart/${storedCart}`
                );

                return response.data;
            }

            const response = await http.get("/shopping-cart/current");

            const cart = response.data;

            if (cart?.uuid) {
                localStorage.setItem(CART_KEY, JSON.stringify(cart));
            }

            return cart;
        },

        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const addMutate = useMutation({
        mutationFn: async (data: CartItemDto) => {
            let cart = query.data.uuid;

            if (!cart) {
                const response = await http.post("/shopping-cart/draft");
                cart = response.data.uuid;
                localStorage.setItem(CART_KEY, cart);
            }

            await http.post(`/shopping-cart/${cart}/items`, {
                items: [data]
            });
        }
    });

    return {
        currentCart: query.data ?? null,
        items: query.data?.items ?? [],
        loading: query.isLoading || query.isFetching || addMutate.isPending,
        refetch: query.refetch,
        addCartItem: async (product_id: string, quantity = 0) => {
            await addMutate.mutateAsync({
                quantity,
                consolidatedProduct: product_id
            })
            query.refetch();
            refetch();
        },
        clearCart: () => {
            localStorage.removeItem(CART_KEY)
        }
    };
}
