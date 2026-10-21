"use client";

import { cn } from "cn";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatCurrency } from "~/shared/utils/currency";
import { Product } from "../models/product";
import { deleteProduct } from "../services/product.service";
import { EditProduct } from "./edit";
import { Button } from "~/components/ui/button";

function DeleteProductButton({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteProduct(product.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      aria-label={`Eliminar ${product.name}`}
      onClick={() => {
        if (window.confirm(`Eliminar "${product.name}"?`)) {
          mutate();
        }
      }}
    >
      <Trash2 size={16} className="text-destructive" />
    </Button>
  );
}

const columns = [
  { name: "#", className: "" },
  { name: "Codigo" },
  { name: "Nome do Produto" },
  { name: "Preço" },
  { name: "Quantidade" },
  { name: "Estado" },
  { name: "Ações" },
];

function getStatusLabel(product: Product) {
    if (!product.active) return "Inativo";

    const statuses: Record<string, string> = {
        active: "Ativo",
        draft: "Rascunho",
        inactive: "Inativo",
    };

    return statuses[product.status.toLowerCase()] ?? product.status;
}

type DataTableProps = {
  data: Product[];
};

export function ProductDataTable({ data }: DataTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.name} className={cn(column.className)}>
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.uuid}>
              <TableCell className="font-medium text-slate-600">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-slate-600">
                {product.code}
              </TableCell>
              <TableCell>
                <p className="font-medium text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category.name}</p>
              </TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>
                {product.quantity - product.reserverdQuantity} {product.unit.abbreviation}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                    product.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {getStatusLabel(product)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <EditProduct product={product} />
                  <DeleteProductButton product={product} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
