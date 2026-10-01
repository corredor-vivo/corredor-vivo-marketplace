"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useMarketplaceCart, type CartItem } from "../hooks/use-cart";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { formatCurrency } from "~/shared/utils/currency";

function CartLine({ item, disabled, update, remove }: { item: CartItem; disabled: boolean; update: (q: number) => void; remove: () => void }) {
  const [value, setValue] = useState(String(item.quantity));
  return <Card><CardContent className="flex flex-wrap items-center justify-between gap-4">
    <div><h2 className="font-semibold">{item.product.info.name}</h2>
      <p className="text-sm text-zinc-500">Disponível: {item.product.info.quantity} {item.product.unit.name}</p>
      <p className="text-sm">Preço médio indicativo: {formatCurrency(item.product.info.averagePrice ?? 0)} / {item.product.unit.name}</p>
      {item.quantity > item.product.info.quantity && <p role="alert" className="text-sm text-red-700">O stock mudou. Reduza a quantidade para continuar.</p>}
    </div>
    <form className="flex flex-wrap items-end gap-2" onSubmit={e => { e.preventDefault(); update(Number(value)); }}>
      <label className="text-sm">Quantidade ({item.product.unit.name})
        <Input className="w-36" required type="number" min="0.000001" max={item.product.info.quantity} step="0.000001" value={value} onChange={e => setValue(e.target.value)} disabled={disabled} />
      </label>
      <Button type="submit" variant="outline" disabled={disabled}>Atualizar</Button>
      <Button type="button" variant="ghost" disabled={disabled} onClick={remove}>Remover</Button>
    </form>
  </CardContent></Card>;
}

export default function CartPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, isLoading, isError, isPending, updateQuantity, removeProduct } = useMarketplaceCart();
  if (authLoading || isLoading) return <p role="status">A carregar carrinho…</p>;
  if (!user) return <Link href="/sign-in">Entre na sua conta para aceder ao carrinho.</Link>;
  if (user.role !== "customer") return <p>O carrinho está disponível para contas de cliente.</p>;
  if (isError) return <p role="alert">Não foi possível carregar o carrinho. Volte a tentar.</p>;
  const valid = items.length > 0 && items.every(item => item.quantity > 0 && item.quantity <= item.product.info.quantity);
  return <section className="space-y-5 py-6">
    <h1 className="text-3xl font-bold text-emerald-800">Meu carrinho</h1>
    <p className="text-zinc-600">Confirme as quantidades. O valor exato será apresentado no resumo da compra.</p>
    {!items.length && <p>O carrinho está vazio. <Link className="underline" href="/">Explorar produtos</Link></p>}
    {items.map(item => <CartLine key={`${item.id}-${item.quantity}`} item={item} disabled={isPending} update={q => updateQuantity(item.id, q)} remove={() => removeProduct(item.id)} />)}
    {valid && !isPending && <Button render={<Link href="/checkout" />}>Selecionar motorista e continuar</Button>}
  </section>;
}
