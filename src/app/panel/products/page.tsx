"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { CardMetric } from "./components/card-metrics";
import { useProduct } from "./hooks/use-product";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Filter, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PAGINATION } from "~/shared/constants/pagination";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ProductDataTable } from "./components/table";
import { Register } from "./components/register";

export default function Products() {
  const {
    metrics,
    setPerPage,
    setSearch,
    perPage,
    filters,
    isFetching,
    isLoading,
    products,
    page
  } = useProduct();

  const cards_metric = [
    {
      name: "Total de Produtos",
      value: metrics.total,
      textStyle: "text-slate-900",
    },

    {
      name: "Produtos Activos",
      value: metrics.active,
      textStyle: "text-emerald-700",
    },
    {
      name: "Produtos Inativos",
      value: metrics.inactive,
      textStyle: "text-slate-400",
    },
    {
      name: "Baixo Estoque (Alerta)",
      value: metrics.outOfStock,
      textStyle: "text-red-700",
    },
  ];
  return (
    <>
      <main className="space-y-3 text-slate-800">
        <section className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Meus Produtos
          </h1>
          <p className="text-sm text-slate-500">
            Gerencie os itens da sua produção, estoque e status de venda.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cards_metric.map((card, index) => (
            <CardMetric
              name={card.name}
              value={card.value}
              textStyle={card.textStyle}
              key={index}
            />
          ))}
        </section>

        <Card className="rounded-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Select
                value={String(perPage)}
                onValueChange={(v) => setPerPage(Number(v))}
              >
                <SelectTrigger className="w-full sm:w-45 rounded-lg">
                  <SelectValue placeholder="Selecionar Quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PAGINATION.map((item) => (
                      <SelectItem key={item} value={String(item)}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex gap-3">
                <InputGroup className=" h-11 w-96">
                  <InputGroupInput
                    placeholder="Pesquisar produto..."
                    value={filters?.search ?? ""}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Filter />
                  </InputGroupAddon>
                </InputGroup>

                <Register />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || isFetching ? (
              <Spinner />
            ) : (
              <ProductDataTable data={products} />
            )}
          </CardContent>

          <CardFooter>
            <span>
              Mostrado {page} até {perPage}
            </span>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
