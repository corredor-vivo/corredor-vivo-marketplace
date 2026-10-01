"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { http } from "~/shared/http";
import { getConsolidatedProductId, type ConsolidatedProduct } from "../models";

export type CartItem = { id: string; product: ConsolidatedProduct; quantity: number };
type Cart = { items: CartItem[] };
type CartContext = {
  items: CartItem[]; totalItems: number; isPending: boolean; isLoading: boolean; isError: boolean;
  addProduct: (product: ConsolidatedProduct, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeProduct: (id: string) => void;
};
const Context = createContext<CartContext | null>(null);

export function MarketplaceCartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const client = useQueryClient();
  const key = ["cart", user?.id];
  const query = useQuery({ queryKey: key, enabled: user?.role === "customer", queryFn: async () => (await http.get<Cart>("/cart")).data });
  const items = user?.role === "customer" ? query.data?.items ?? [] : [];
  const mutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => quantity <= 0
      ? (await http.delete<Cart>(`/cart/items/${id}`)).data
      : (await http.put<Cart>("/cart/items", { consolidatedId: Number(id), quantity })).data,
    onSuccess: data => { client.setQueryData(key, data); void client.invalidateQueries({ queryKey: ["quote"] }); },
    onError: () => { void client.invalidateQueries({ queryKey: key }); },
  });
  function updateQuantity(id: string, quantity: number) {
    if (mutation.isPending) return;
    if (!Number.isFinite(quantity) || quantity < 0 || Number(quantity.toFixed(6)) !== quantity) {
      toast.error("Indique uma quantidade válida, com até 6 casas decimais."); return;
    }
    const item = items.find(item => item.id === id);
    if (item && quantity > item.product.info.quantity) { toast.error("Quantidade superior ao stock disponível."); return; }
    mutation.mutate({ id, quantity });
  }
  function addProduct(product: ConsolidatedProduct, quantity = 1) {
    if (!user) { router.push("/sign-in"); return; }
    if (user.role !== "customer") { toast.error("Entre com uma conta de cliente para comprar."); return; }
    if (mutation.isPending || query.isLoading) return;
    const id = getConsolidatedProductId(product);
    const total = Number(((items.find(item => item.id === id)?.quantity ?? 0) + quantity).toFixed(6));
    if (!Number.isFinite(quantity) || quantity <= 0 || total > product.info.quantity) { toast.error("Quantidade superior ao stock disponível ou inválida."); return; }
    mutation.mutate({ id, quantity: total });
  }
  return <Context.Provider value={{ items, totalItems: items.length, isPending: mutation.isPending,
    isLoading: query.isLoading, isError: query.isError, addProduct, updateQuantity,
    removeProduct: id => { if (!mutation.isPending) mutation.mutate({ id, quantity: 0 }); } }}>{children}</Context.Provider>;
}

export function useMarketplaceCart() {
  const context = useContext(Context);
  if (!context) throw new Error("Carrinho indisponível fora do MarketplaceCartProvider.");
  return context;
}
