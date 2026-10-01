"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/app/(account)/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { http } from "~/shared/http";
import { formatCurrency } from "~/shared/utils/currency";
import { type Order, type OrderStatus, statusLabels } from "./types";

const formatDate = (date: string) => new Date(date).toLocaleString("pt-AO");

export function OrdersList({ producer = false }: { producer?: boolean }) {
  const { user, isLoading } = useAuth();
  const [page, setPage] = useState(1);
  const base = producer ? "/panel/orders" : "/orders";
  const query = useQuery({ queryKey: ["orders", user?.id, "list", page], enabled: !!user,
    queryFn: async () => (await http.get<{ items: Order[]; total: number; pageSize: number }>("/orders", { params: { page } })).data });
  if (isLoading) return <p>A carregar…</p>;
  if (!user) return <Link href="/sign-in">Entre na sua conta para consultar as encomendas.</Link>;
  return <section className="space-y-5 py-6">
    <h1 className="text-3xl font-bold text-emerald-800">{producer ? "Minhas vendas" : "Minhas encomendas"}</h1>
    <p className="text-zinc-600">Encomendas atuais e histórico de vendas concluídas.</p>
    {query.isLoading && <p role="status">A carregar encomendas…</p>}
    {query.isError && <p role="alert">Não foi possível carregar as encomendas. <Button variant="outline" onClick={() => void query.refetch()}>Tentar novamente</Button></p>}
    {query.data?.items.length === 0 && <p>Nenhuma encomenda encontrada.</p>}
    {query.data?.items.map(order => <Card key={order.id}><CardContent className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link className="font-bold text-emerald-800 underline" href={`${base}/${order.id}`}>{order.code}</Link><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm">{statusLabels[order.status]}</span></div>
      <p className="text-sm text-zinc-500">{formatDate(order.createdAt)}</p>
      {order.items.map(item => <p key={item.id}>{item.name} — {Number(item.quantity)} {item.unit}</p>)}
      <p className="font-semibold">Total: {formatCurrency(Number(order.total))}</p>
      <p className="text-sm">{producer ? `Cliente: ${order.customer.name}` : `Produtores: ${order.producers.map(p => p.seller.name).join(", ")}`}</p>
      <p className="text-sm">Motorista: {order.driver.name} · {order.driver.vehiclePlate}</p>
      <p className="text-sm">Descarga: {order.delivery.province}, {order.delivery.municipality}, {order.delivery.commune}, {order.delivery.street}</p>
    </CardContent></Card>)}
    <div className="flex items-center gap-3"><Button variant="outline" disabled={page === 1 || query.isFetching} onClick={() => setPage(page - 1)}>Anterior</Button><span>Página {page}</span><Button variant="outline" disabled={!query.data || page * query.data.pageSize >= query.data.total || query.isFetching} onClick={() => setPage(page + 1)}>Próxima</Button></div>
  </section>;
}

export function OrderDetail({ id, producer = false, created = false }: { id: string; producer?: boolean; created?: boolean }) {
  const { user, isLoading } = useAuth();
  const client = useQueryClient();
  const [downloadError, setDownloadError] = useState("");
  const query = useQuery({ queryKey: ["orders", user?.id, id], enabled: !!user,
    queryFn: async () => (await http.get<Order>(`/orders/${id}`)).data });
  const transition = useMutation({ mutationFn: (status: OrderStatus) => http.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["orders", user?.id] }) });
  const download = useMutation({ mutationFn: async () => {
    setDownloadError("");
    const response = await http.get(`/orders/${id}/invoice`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a"); link.href = url; link.download = `${query.data?.code ?? "documento"}.html`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, onError: () => setDownloadError("Não foi possível baixar o documento. Tente novamente.") });
  if (isLoading || query.isLoading) return <p role="status">A carregar encomenda…</p>;
  if (!user) return <Link href="/sign-in">Entre na sua conta para consultar esta encomenda.</Link>;
  if (query.isError || !query.data) return <p role="alert">Encomenda indisponível ou sem permissão de acesso. <Button variant="outline" onClick={() => void query.refetch()}>Tentar novamente</Button></p>;
  const order = query.data;
  const next: Partial<Record<OrderStatus, OrderStatus>> = { PENDING: "PROCESSING", PROCESSING: "DELIVERED", DELIVERED: "COMPLETED" };
  const action: Partial<Record<OrderStatus, string>> = { PENDING: "Iniciar preparação", PROCESSING: "Marcar como entregue", DELIVERED: "Concluir venda" };
  return <section className="space-y-5 py-6">
    <Link className="text-sm underline" href={producer ? "/panel/orders" : "/orders"}>Voltar às encomendas</Link>
    {created && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-800">Encomenda criada com sucesso. Os produtores foram notificados.</p>}
    <h1 className="break-all text-2xl font-bold text-emerald-800">{order.code}</h1>
    <p>{statusLabels[order.status]} · {formatDate(order.createdAt)}</p>
    {order.completedAt && <p>Concluída em {formatDate(order.completedAt)}</p>}
    <Card><CardContent>
      <Table><TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Quantidade</TableHead><TableHead>Total</TableHead></TableRow></TableHeader><TableBody>
        {order.items.map(item => <TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell>{Number(item.quantity)} {item.unit}</TableCell><TableCell>{formatCurrency(Number(item.total))}</TableCell></TableRow>)}
      </TableBody></Table>
      <p className="mt-4 text-right text-xl font-bold">Total: {formatCurrency(Number(order.total))}</p>
    </CardContent></Card>
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardContent className="space-y-2"><h2 className="font-bold">Cliente</h2><p>{order.customer.name}</p><p>{order.customer.email}</p><p>{order.customer.phone}</p></CardContent></Card>
      <Card><CardContent className="space-y-2"><h2 className="font-bold">Motorista e descarga</h2><p>{order.driver.name} · {order.driver.phone}</p><p>Matrícula: {order.driver.vehiclePlate}</p><p>{order.delivery.province}, {order.delivery.municipality}, {order.delivery.commune}</p><p>{order.delivery.street}</p><p>{order.delivery.reference}</p></CardContent></Card>
    </div>
    <Card><CardContent className="space-y-4"><h2 className="font-bold">{producer ? "Produtos a entregar" : "Produtores e entregas"}</h2>
      {order.producers.map(p => <div key={p.id} className="space-y-2 border-b pb-3"><p className="font-semibold">{p.seller.name} — {statusLabels[p.status]}</p>
        {order.items.flatMap(item => item.allocations.filter(a => a.producerOrderId === p.id).map(a => <p key={a.id} className="text-sm">{item.name}: {Number(a.quantity)} {item.unit} · {formatCurrency(Number(a.unitPrice))} / {a.originalUnit} · Total {formatCurrency(Number(a.total))}</p>))}
      </div>)}
    </CardContent></Card>
    {producer && next[order.status] && <Button disabled={transition.isPending} onClick={() => transition.mutate(next[order.status]!)}>{transition.isPending ? "A atualizar…" : action[order.status]}</Button>}
    {transition.isError && <p role="alert" className="text-red-700">Não foi possível atualizar o estado. Atualize os detalhes e tente novamente.</p>}
    {order.status === "COMPLETED" && <div className="space-y-2"><Button variant="outline" disabled={download.isPending} onClick={() => download.mutate()}>Baixar documento da compra</Button><p className="text-sm text-zinc-500">Documento HTML, disponível para impressão ou guardar como PDF.</p></div>}
    {downloadError && <p role="alert" className="text-red-700">{downloadError}</p>}
    <Card><CardContent className="space-y-3"><h2 className="font-bold">Histórico de estados</h2>{order.history.map(h => <p key={h.id} className="text-sm">{formatDate(h.createdAt)} · {order.producers.find(p => p.id === h.producerOrderId)?.seller.name} · {statusLabels[h.status]}</p>)}</CardContent></Card>
  </section>;
}
