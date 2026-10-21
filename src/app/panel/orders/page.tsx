"use client";

import { Filter } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { PAGINATION } from "~/shared/constants/pagination";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { CardMetric } from "./components/card-metrics";
import { OrderDataTable } from "./components/table";
import { useOrder } from "./hooks/use-order";

export default function Orders() {
  const { metrics, setPerPage, setSearch, perPage, search, isFetching, isLoading, orders, page, totalOrders, setPage } = useOrder();
  const cards = [
    { name: "Total de Encomendas", value: metrics.total, textStyle: "text-slate-900" },
    { name: "Pendentes", value: metrics.pending, textStyle: "text-amber-700" },
    { name: "Em processamento", value: metrics.processing, textStyle: "text-sky-700" },
    { name: "Concluídas", value: metrics.completed, textStyle: "text-emerald-700" },
  ];

  return (
    <main className="space-y-3 text-slate-800">
      <section className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Encomendas</h1>
        <p className="text-sm text-slate-500">Acompanhe as encomendas recebidas, os clientes e o estado de cada pedido.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map((card) => <CardMetric key={card.name} {...card} />)}
      </section>

      <Card className="rounded-md">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <Select value={String(perPage)} onValueChange={(value) => setPerPage(Number(value))}>
              <SelectTrigger className="w-full rounded-lg sm:w-45"><SelectValue placeholder="Selecionar quantidade" /></SelectTrigger>
              <SelectContent><SelectGroup>{PAGINATION.map((item) => <SelectItem key={item} value={String(item)}>{item}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
            <InputGroup className="h-11 w-full sm:w-96">
              <InputGroupInput placeholder="Pesquisar encomenda ou cliente..." value={search} onChange={(event) => setSearch(event.target.value)} />
              <InputGroupAddon><Filter /></InputGroupAddon>
            </InputGroup>
          </div>
        </CardHeader>
        <CardContent>{isLoading || isFetching ? <Spinner /> : <OrderDataTable data={orders} />}</CardContent>
        <CardFooter className="flex justify-between gap-3">
          <span className="text-sm text-slate-500">Mostrando {totalOrders === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, totalOrders)} de {totalOrders}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={page * perPage >= totalOrders} onClick={() => setPage(page + 1)}>Seguinte</Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
