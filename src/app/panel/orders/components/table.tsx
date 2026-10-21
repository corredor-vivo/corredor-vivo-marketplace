"use client";

import { cn } from "cn";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatCurrency } from "~/shared/utils/currency";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { Order } from "../models/order";
import { Button } from "~/components/ui/button";
import { Check, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { http } from "~/shared/http";

const columns = ["#", "Cliente", "Data", "Carga prevista", "Itens", "Total", "Estado"];

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-AO", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendente",
    processing: "Em processamento",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return labels[status.toLowerCase()] ?? status;
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "pending": return "bg-amber-100 text-amber-700";
    case "processing": return "bg-sky-100 text-sky-700";
    case "completed": return "bg-emerald-100 text-emerald-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

export function OrderDataTable({ data }: { data: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [show, setShow] = useState(true);

  const completeOrder = useMutation({
    mutationFn: async () => {
      if (!selectedOrder) return;
      const response = await http.post(`/orders/${selectedOrder.uuid}/sent-product`)

      setSelectedOrder((value) => value ? {...value, status: response.data.order.status} : null)
    },
    onSuccess: () => {
      setShow(false)
    }
  })

  const complete = async () => {
    await completeOrder.mutateAsync();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-slate-500">Nenhuma encomenda encontrada.</TableCell></TableRow>
          ) : data.map((order, index) => {
            const buyerName = `${order.buyer?.firstName ?? ""} ${order.buyer?.lastName ?? ""}`.trim() || "Cliente";
            return (
              <TableRow key={order.uuid} className="cursor-pointer" tabIndex={0} onClick={() => setSelectedOrder(order)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedOrder(order); } }} aria-label={`Ver detalhes da encomenda ${order.id}`}>
                <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                <TableCell><p className="font-medium text-slate-900">{buyerName}</p><p className="text-xs text-slate-500">Encomenda #{order.id}</p></TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{formatDate(order.load_date)}</TableCell>
                <TableCell>{order.items?.length ?? 0}</TableCell>
                <TableCell>{formatCurrency(order.total_price)}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusClass(order.status))}>{statusLabel(order.status)}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Sheet open={selectedOrder !== null} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedOrder && <>
            <SheetHeader className="border-b border-slate-200">
              <SheetTitle className="text-xl">Encomenda #{selectedOrder.id}</SheetTitle>
              <SheetDescription>Detalhes da encomenda recebida.</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 p-6">
              <section className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-500">Cliente</p><p className="font-medium text-slate-900">{`${selectedOrder.buyer?.firstName ?? ""} ${selectedOrder.buyer?.lastName ?? ""}`.trim() || "Cliente"}</p></div>
                <div><p className="text-slate-500">Estado</p><span className={cn("mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusClass(selectedOrder.status))}>{statusLabel(selectedOrder.status)}</span></div>
                <div><p className="text-slate-500">Data da encomenda</p><p className="font-medium text-slate-900">{formatDate(selectedOrder.createdAt)}</p></div>
                <div><p className="text-slate-500">Carga prevista</p><p className="font-medium text-slate-900">{formatDate(selectedOrder.load_date)}</p></div>
                {selectedOrder.buyer?.email && <div className="col-span-2"><p className="text-slate-500">Email</p><p className="font-medium text-slate-900">{selectedOrder.buyer.email}</p></div>}
                {selectedOrder.buyer?.phone && <div className="col-span-2"><p className="text-slate-500">Telefone</p><p className="font-medium text-slate-900">{selectedOrder.buyer.phone}</p></div>}
              </section>
              <section>
                <h3 className="mb-3 font-semibold text-slate-900">Itens da encomenda</h3>
                <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                  {(selectedOrder.items ?? []).map((item) => <div key={item.uuid} className="flex items-start justify-between gap-3 p-3 text-sm">
                    <div><p className="font-medium text-slate-900">{item.product?.name ?? "Produto"}</p><p className="text-xs text-slate-500">{item.quantity} × {formatCurrency(item.unit_price)}</p></div>
                    <p className="shrink-0 font-medium text-slate-900">{formatCurrency(item.total_price)}</p>
                  </div>)}
                  {(!selectedOrder.items || selectedOrder.items.length === 0) && <p className="p-3 text-sm text-slate-500">Sem itens registados.</p>}
                  <div className="flex justify-between bg-slate-50 p-3 text-sm font-semibold"><span>Total</span><span>{formatCurrency(selectedOrder.total_price)}</span></div>
                </div>
              </section>
            </div>
          </>}
          <SheetFooter>
            {(selectedOrder?.status === "pending" && show) && <Button className={"h-11 bg-emerald-700 hover:bg-emerald-800 cursor-pointer"} onClick={complete}>
              <Check />
              Despachar Produto
            </Button>}
            <Button variant={"outline"} className={"cursor-pointer"}>
              <Download />
              Baixar Fatura
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
