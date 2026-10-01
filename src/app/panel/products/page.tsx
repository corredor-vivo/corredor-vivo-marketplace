"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@base-ui/react/dialog";
import { Filter, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { DEFAULT_PAGINATION, PAGINATION } from "~/shared/constants/pagination";
import { http } from "~/shared/http";
import { formatCurrency } from "~/shared/utils/currency";
import { RegisterProduct } from "./components/register";

const columns = [
    { name: "#", className: "" },
    { name: "Codigo" },
    { name: "Nome do Produto" },
    { name: "Preço" },
    { name: "Quantidade" },
    { name: "Estado" },
    { name: "Ações" },
];

type Product = {
    id: number;
    uuid: string;
    name: string;
    code: string;
    price: number;
    quantity: number;
    status: string;
    active: boolean;
    category?: { name: string } | null;
    unit?: { name: string } | null;
};

const LOW_STOCK_THRESHOLD = 5;

function getStatusLabel(product: Product) {
    if (!product.active) return "Inativo";

    const statuses: Record<string, string> = {
        active: "Ativo",
        draft: "Rascunho",
        inactive: "Inativo",
    };

    return statuses[product.status.toLowerCase()] ?? product.status;
}

export default function Products() {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(DEFAULT_PAGINATION);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const queryClient = useQueryClient();
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products", "mine"],
        queryFn: async (): Promise<Product[]> => {
            const response = await http.get<Product[]>("/products/mine");
            return response.data;
        },
    });
    const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
        mutationFn: (productId: number) => http.delete(`/products/${productId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", "mine"] });
            setProductToDelete(null);
        },
    });

    const normalizedSearch = search.trim().toLocaleLowerCase();
    const filteredProducts = products.filter((product) =>
        [product.name, product.code, product.category?.name]
            .filter(Boolean)
            .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch))
    );
    const visibleProducts = filteredProducts.slice(0, limit);

    const dashboard = {
        total: products.length,
        active: products.filter((product) => product.active).length,
        disabled: products.filter((product) => !product.active).length,
        lowStock: products.filter((product) => product.quantity <= LOW_STOCK_THRESHOLD).length,
    }

    function confirmDelete() {
        if (productToDelete) {
            deleteProduct(productToDelete.id);
        }
    }

    return (
        <>
            <div className="space-y-6 text-slate-800 ">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Meus Produtos
                        </h1>
                        <p className="text-sm text-slate-500">
                            Gerencie os itens da sua produção, estoque e status de venda.
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-500 font-medium">
                            Total de Produtos
                        </p>
                        <p className="text-2xl font-bold text-slate-900">{dashboard.total}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-500 font-medium">Produtos Ativos</p>
                        <p className="text-2xl font-bold text-emerald-700">
                            {dashboard.active}
                        </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-500 font-medium">
                            Produtos Inativos
                        </p>
                        <p className="text-2xl font-bold text-slate-400">
                            {dashboard.disabled}
                        </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-500 font-medium">
                            Baixo Estoque (Alerta)
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                            {dashboard.lowStock}
                        </p>
                    </div>
                </div>
                <Card className="rounded-lg">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <Select
                                value={String(limit)}
                                onValueChange={(v) => setLimit(Number(v))}
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
                                        value={search ?? ""}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <InputGroupAddon>
                                        <Filter />
                                    </InputGroupAddon>
                                </InputGroup>

                                <RegisterProduct />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table className="min-w-150">
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="py-10 text-center text-slate-500">
                                            <span className="inline-flex items-center gap-2">
                                                <Spinner />
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ) : visibleProducts.length > 0 ? (
                                    visibleProducts.map((product, index) => (
                                        <TableRow key={product.uuid}>
                                            <TableCell className="font-medium text-slate-600">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-600">
                                                {product.code}
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-slate-900">{product.name}</p>
                                                {product.category?.name ? (
                                                    <p className="text-xs text-slate-500">{product.category.name}</p>
                                                ) : null}
                                            </TableCell>
                                            <TableCell>{formatCurrency(product.price)}</TableCell>
                                            <TableCell>
                                                {product.quantity} {product.unit?.name ?? ""}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                                                        product.active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    )}
                                                >
                                                    {getStatusLabel(product)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon-sm"
                                                    aria-label={`Eliminar ${product.name}`}
                                                    title="Eliminar produto"
                                                    onClick={() => setProductToDelete(product)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="py-10 text-center text-slate-500">
                                            {search ? "Nenhum produto encontrado para a pesquisa." : "Ainda não existem produtos registados."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="text-sm text-slate-500">
                        {filteredProducts.length > limit
                            ? `A mostrar ${visibleProducts.length} de ${filteredProducts.length} produtos`
                            : `${filteredProducts.length} produto${filteredProducts.length === 1 ? "" : "s"}`}
                    </CardFooter>
                </Card>
            </div>

            <Dialog.Root
                open={productToDelete !== null}
                disablePointerDismissal={isDeleting}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setProductToDelete(null);
                }}
            >
                <Dialog.Portal>
                    <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
                    <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-semibold text-slate-900">
                            Eliminar produto
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-slate-600">
                            Tem a certeza de que deseja eliminar o produto {" "}
                            <strong>{productToDelete?.name}</strong>? Esta ação não pode ser revertida.
                        </Dialog.Description>
                        <div className="mt-6 flex justify-end gap-3">
                            <Dialog.Close
                                disabled={isDeleting}
                                render={<Button type="button" variant="outline" />}
                            >
                                Cancelar
                            </Dialog.Close>
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                            >
                                {isDeleting ? <Spinner /> : <Trash2 />}
                                {isDeleting ? "A eliminar..." : "Eliminar"}
                            </Button>
                        </div>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}
