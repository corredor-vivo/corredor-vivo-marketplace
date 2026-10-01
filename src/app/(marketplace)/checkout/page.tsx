"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { http } from "~/shared/http";
import { formatCurrency } from "~/shared/utils/currency";
import type { Delivery, Driver, Order, Quote } from "~/shared/sales/types";

const deliveryFields: [keyof Delivery, string, number][] = [["province", "Província", 2], ["municipality", "Município", 2], ["commune", "Comuna", 2], ["street", "Morada de descarga", 3], ["reference", "Ponto de referência (opcional)", 0]];

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const client = useQueryClient();
  const [step, setStep] = useState(1);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", vehiclePlate: "" });
  const [delivery, setDelivery] = useState<Delivery>({ province: "", municipality: "", commune: "", street: "", reference: "" });
  const [quote, setQuote] = useState<Quote | null>(null);
  const checkoutKey = useRef<string | null>(null);
  const [error, setError] = useState("");
  const drivers = useQuery({ queryKey: ["drivers", user?.id], enabled: user?.role === "customer", queryFn: async () => (await http.get<Driver[]>("/drivers")).data });
  const selected = drivers.data?.find(driver => driver.id === driverId);
  const saveDriver = useMutation({ mutationFn: async () => (await http.post<Driver>("/drivers", newDriver)).data,
    onSuccess: async driver => { await client.invalidateQueries({ queryKey: ["drivers", user?.id] }); setDriverId(driver.id); setError(""); },
    onError: () => setError("Não foi possível guardar o motorista. Verifique os dados e tente novamente.") });
  const review = useMutation({ mutationFn: async () => (await http.get<Quote>("/cart/quote")).data,
    onSuccess: data => { setQuote(data); checkoutKey.current = null; setStep(3); setError(""); },
    onError: () => setError("Não foi possível preparar o resumo. Verifique as quantidades no carrinho.") });
  const confirm = useMutation({
    mutationFn: async () => {
      if (!quote || !selected) throw new Error("Dados incompletos");
      checkoutKey.current ??= crypto.randomUUID();
      return (await http.post<Order>("/orders", { checkoutKey: checkoutKey.current, driverId: selected.id,
        delivery, expectedTotal: quote.total, quoteFingerprint: quote.fingerprint })).data;
    },
    onSuccess: async order => {
      client.setQueryData(["cart", user?.id], { items: [] });
      await Promise.all([client.invalidateQueries({ queryKey: ["orders", user?.id] }), client.invalidateQueries({ queryKey: ["consolidated_products"] })]);
      router.replace(`/orders/${order.id}?created=1`);
    },
    onError: err => {
      if (isAxiosError(err) && err.response?.status === 409) { setQuote(null); setStep(2); }
      setError("Não foi possível confirmar. Se o stock ou o preço mudou, reveja o resumo; se a ligação falhou, pode repetir a confirmação.");
    },
  });

  if (isLoading) return <p>A carregar…</p>;
  if (!user) return <Link href="/sign-in">Entre na sua conta para finalizar a compra.</Link>;
  if (user.role !== "customer") return <p>A compra está disponível para contas de cliente.</p>;
  return <section className="mx-auto max-w-3xl space-y-5 py-6">
    <Link href="/cart" className="text-sm underline">Voltar ao carrinho</Link>
    <h1 className="text-3xl font-bold text-emerald-800">Finalizar compra</h1>
    <ol className="flex flex-wrap gap-4 text-sm" aria-label="Etapas da compra">
      {["Motorista", "Local de descarga", "Resumo e confirmação"].map((label, i) => <li key={label} aria-current={step === i + 1 ? "step" : undefined} className={step === i + 1 ? "font-bold text-emerald-800" : "text-zinc-500"}>{i + 1}. {label}</li>)}
    </ol>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
    <Card><CardContent className="space-y-5">
      {step === 1 && <>
        <h2 className="text-xl font-semibold">Quem irá recolher a carga?</h2>
        {drivers.isLoading && <p>A carregar motoristas…</p>}
        {drivers.isError && <p role="alert">Não foi possível carregar os motoristas. <Button variant="outline" onClick={() => void drivers.refetch()}>Tentar novamente</Button></p>}
        <fieldset className="space-y-2"><legend className="mb-2 font-medium">Selecionar motorista</legend>
          {drivers.data?.map(driver => <label key={driver.id} className="flex items-center gap-3 rounded-lg border p-3">
            <input type="radio" name="driver" checked={driverId === driver.id} onChange={() => setDriverId(driver.id)} />
            <span>{driver.name} · {driver.phone} · {driver.vehiclePlate}</span>
          </label>)}
          {drivers.data?.length === 0 && <p className="text-sm text-zinc-500">Ainda não tem motoristas guardados.</p>}
        </fieldset>
        <form className="space-y-3 border-t pt-4" onSubmit={e => { e.preventDefault(); saveDriver.mutate(); }}>
          <h3 className="font-medium">Adicionar o meu motorista</h3>
          <label className="block text-sm">Nome<Input required minLength={2} maxLength={160} value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} /></label>
          <label className="block text-sm">Telefone<Input required type="tel" minLength={7} maxLength={30} value={newDriver.phone} onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })} /></label>
          <label className="block text-sm">Matrícula do veículo<Input required minLength={2} maxLength={30} value={newDriver.vehiclePlate} onChange={e => setNewDriver({ ...newDriver, vehiclePlate: e.target.value })} /></label>
          <Button type="submit" variant="outline" disabled={saveDriver.isPending}>Guardar motorista</Button>
        </form>
        <Button disabled={!selected || saveDriver.isPending} onClick={() => { setStep(2); setError(""); }}>Continuar para local de descarga</Button>
      </>}
      {step === 2 && <form className="space-y-4" onSubmit={e => { e.preventDefault(); review.mutate(); }}>
        <h2 className="text-xl font-semibold">Onde pretende descarregar a carga?</h2>
        {deliveryFields.map(([name, label, min]) => <label key={name} className="block text-sm">{label}
          <Input required={min > 0} minLength={min} maxLength={name === "street" || name === "reference" ? 255 : 120} value={delivery[name] ?? ""} onChange={e => setDelivery({ ...delivery, [name]: e.target.value })} />
        </label>)}
        <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setStep(1)}>Voltar</Button><Button type="submit" disabled={!selected || review.isPending}>{review.isPending ? "A calcular…" : "Rever resumo da compra"}</Button></div>
      </form>}
      {step === 3 && quote && <>
        <h2 className="text-xl font-semibold">Resumo da compra</h2>
        {quote.lines.map(line => <div key={line.consolidatedId} className="flex flex-wrap justify-between gap-2 border-b pb-3"><span>{line.name} — {Number(line.quantity)} {line.unit}</span><strong>{formatCurrency(Number(line.total))}</strong></div>)}
        <p className="text-xl font-bold">Total: {formatCurrency(Number(quote.total))}</p>
        <p>Motorista: {selected?.name} · {selected?.phone} · {selected?.vehiclePlate}</p>
        <p>Descarga: {delivery.province}, {delivery.municipality}, {delivery.commune}, {delivery.street}. {delivery.reference}</p>
        <p className="text-sm text-zinc-500">O stock e os preços serão novamente validados ao confirmar.</p>
        <div className="flex gap-3"><Button variant="outline" disabled={confirm.isPending} onClick={() => setStep(2)}>Editar</Button><Button disabled={confirm.isPending} onClick={() => confirm.mutate()}>{confirm.isPending ? "A confirmar…" : "Confirmar compra"}</Button></div>
      </>}
    </CardContent></Card>
  </section>;
}
