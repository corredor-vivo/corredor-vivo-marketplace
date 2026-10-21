"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Boxes, ClipboardList, Package, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { http } from "~/shared/http";
import { formatCurrency } from "~/shared/utils/currency";
import type { Product } from "../products/models/product";
import type { Order } from "../orders/models/order";
import { OrderDataTable } from "../orders/components/table";

type ProductResponse = Product[] | { content?: Product[]; data?: Product[] };

function getProducts(response: ProductResponse): Product[] {
  if (Array.isArray(response)) return response;
  return response.content ?? response.data ?? [];
}

function MetricCard({ title, value, description, icon: Icon, tone }: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Package;
  tone: string;
}) {
  return (
    <Card className="rounded-xl border border-slate-200 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const productsQuery = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const response = await http.get("/products/my-products", { params: { page: 1, perPage: 100 } });
      return getProducts(response.data);
    },
  });
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await http.get("/orders");
      return Array.isArray(response.data) ? response.data as Order[] : [];
    },
  });

  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const activeProducts = products.filter((product) => product.active).length;
  const pendingOrders = orders.filter((order) => order.status.toLowerCase() === "pending").length;
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const isLoading = productsQuery.isLoading || ordersQuery.isLoading;

  return (
    <main className="space-y-6 text-slate-800">
      <section className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Resumo da sua produção e das encomendas recebidas.</p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/panel/products" />} variant="outline" size="sm">Ver produtos <ArrowRight /></Button>
          <Button render={<Link href="/panel/orders" />} size="sm" className={"bg-emerald-700 hover:bg-emerald-800"}>Ver encomendas <ArrowRight /></Button>
        </div>
      </section>

      {isLoading ? <div className="flex min-h-48 items-center justify-center"><Spinner /></div> : <>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Produtos cadastrados" value={products.length} description={`${activeProducts} activos`} icon={Boxes} tone="bg-emerald-50 text-emerald-700" />
          <MetricCard title="Encomendas recebidas" value={orders.length} description={`${pendingOrders} pendentes`} icon={ShoppingCart} tone="bg-amber-50 text-amber-700" />
          <MetricCard title="Unidades em estoque" value={products.reduce((sum, product) => sum + (Number(product.quantity) || 0), 0)} description="Quantidade total dos produtos" icon={Package} tone="bg-sky-50 text-sky-700" />
          <MetricCard title="Valor em produtos" value={formatCurrency(products.reduce((sum, product) => sum + (Number(product.price) || 0) * (Number(product.quantity) || 0), 0))} description="Estimativa do estoque cadastrado" icon={ClipboardList} tone="bg-violet-50 text-violet-700" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <Card className="rounded-xl border border-slate-200 shadow-sm xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Produtos recentes</CardTitle><p className="mt-1 text-sm text-slate-500">Últimos produtos cadastrados.</p></div>
              <Link href="/panel/products" className="text-sm font-medium text-emerald-700 hover:underline">Ver todos</Link>
            </CardHeader>
            <CardContent>
              {recentProducts.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Ainda não há produtos cadastrados.</p> : <div className="divide-y divide-slate-100">
                {recentProducts.map((product) => <div key={product.uuid} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0"><p className="truncate font-medium text-slate-900">{product.name}</p><p className="text-xs text-slate-500">{product.code} · {product.quantity} {product.unit?.abbreviation ?? "un."}</p></div>
                  <span className="shrink-0 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</span>
                </div>)}
              </div>}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm xl:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Encomendas recentes</CardTitle><p className="mt-1 text-sm text-slate-500">Acompanhe os pedidos mais recentes.</p></div>
              <Link href="/panel/orders" className="text-sm font-medium text-emerald-700 hover:underline">Ver todas</Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Ainda não há encomendas recebidas.</p> : <OrderDataTable data={recentOrders} />}
            </CardContent>
          </Card>
        </section>
      </>}
    </main>
  );
}
