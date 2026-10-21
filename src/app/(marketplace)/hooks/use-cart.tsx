import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    refetch: () => Promise<unknown>;
    addCartItem: (product_id: string, quantity?: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export function useCart(): useCartType {
    const { refetch } = useMarketplace()
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["shopping-cart"],
        queryFn: async () => {
            const storedCart = localStorage.getItem(CART_KEY);

            if (storedCart) {
                const cart = JSON.parse(storedCart) as ShoppingCart;
                const response = await http.get(
                    `/shopping-cart/${cart.uuid}`
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
            let cart = query.data;

            if (!cart) {
                const currentCart = await http.get("/shopping-cart/current");
                cart = currentCart.data;

                if (!cart?.uuid) {
                    const draftCart = await http.post("/shopping-cart/draft");
                    cart = draftCart.data;
                }

                localStorage.setItem(CART_KEY, JSON.stringify(cart));
            }

            await http.post(`/shopping-cart/${cart.uuid}/items`, {
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
            await queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
            await refetch();
        },
        clearCart: async () => {
            localStorage.removeItem(CART_KEY)
            await queryClient.resetQueries({ queryKey: ["shopping-cart"] });
        }
    };
}
