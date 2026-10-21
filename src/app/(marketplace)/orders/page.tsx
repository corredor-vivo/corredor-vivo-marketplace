"use client"

import { useQuery } from "@tanstack/react-query"
import {
    Package,
    Calendar,
    Clock,
    ChevronDown,
    AlertCircle,
    ShoppingBag,
    Download,
} from "lucide-react"
import { useState } from "react"
import { Product } from "~/app/panel/products/models/product"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/components/ui/collapsible"
import { Skeleton } from "~/components/ui/skeleton"
import { http } from "~/shared/http"
import { UserModel } from "../models/vehicle"
import { formatCurrency } from "~/shared/utils/currency"
import { cn } from "cn"
import { downloadOrderInvoice } from "../services/order.service"

export type OrderItem = {
    id: number
    uuid: string
    product: Product
    quantity: string
    unit_price: number
    total_price: number
    status: string
}
export type Order = {
    id: number
    uuid: string
    createdAt: string
    updatedAt: string
    buyer: UserModel
    total_price: number
    load_date: string
    status: "pending" | "processing" | "completed" | "cancelled" | string
    items: OrderItem[]
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-AO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString))
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "pending":
            return (
                <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
                >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Pendente
                </Badge>
            )
        case "completed":
            return (
                <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
                >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Concluído
                </Badge>
            )
        case "cancelled":
            return (
                <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-400"
                >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Cancelado
                </Badge>
            )
        default:
            return (
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {status}
                </Badge>
            )
    }
}

// --- Componente do Item do Pedido ---

function OrderCard({ order }: { order: Order }) {
    const [isOpen, setIsOpen] = useState(false)

    const donwloadInvoice = async () => {
        await downloadOrderInvoice(order.id)
    }
    
    return (
        <Card className="group overflow-hidden rounded-2xl border border-black/5 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.03] dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-white/20">
            <CardHeader className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                <Package className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    Encomenda #{order.id}
                                </CardTitle>
                                <div className="flex items-center gap-1.5 text-xs font-normal text-neutral-500 dark:text-neutral-400">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                        {getStatusBadge(order.status)}
                        <span className="text-lg font-bold tracking-tight dark:text-white text-emerald-700">
                            {formatCurrency(order.total_price)}
                        </span>
                    </div>

                </div>
                <div className="flex justify-end">
                    <Button variant={"ghost"} className={"text-slate-700 cursor-pointer"} onClick={donwloadInvoice}>
                        <Download />
                        Baixar fatura
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Previsão de carga: {formatDate(order.load_date)}
                        </span>

                        <CollapsibleTrigger render={<Button variant="ghost"
                            size="sm"
                            className="h-8 gap-1 rounded-full px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        />}>

                            <span>
                                {isOpen ? "Ocultar itens" : `Ver itens (${order.items.length})`}
                            </span>
                            <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="mt-4 space-y-3">
                        <div className="rounded-xl bg-neutral-50/80 p-4 dark:bg-neutral-800/40">
                            <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                Resumo da compra
                            </h4>
                            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-700/50">
                                {order.items.map((item) => (
                                    <div
                                        key={item.uuid}
                                        className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                                Cód. {item.product.code} • {parseFloat(item.quantity)} un. x{" "}
                                                {formatCurrency(item.unit_price)}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-neutral-900 dark:text-white">
                                            {formatCurrency(item.total_price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )
}

// --- Componente da Página Principal ---

export default function UserOrdersPage() {
    const [status, setStatus] = useState("Todas Encomendas");

    const { data: orders, isLoading, isError, error } = useQuery<Order[]>({
        queryKey: ["user-orders", status],
        queryFn: async () => {

            const filterStatus = {
                "Todas Encomendas": undefined,
                "Encomendas Pendentes": "pending",
                "Encomendas Encerradas": "completed",
            }[status];

            const response = await http.get("/orders", {
                params: {
                    status: filterStatus
                }
            })
            return response.data
        },
    })

    if (isLoading) {
        return (
            <div className="py-10 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                </div>
                <div className="space-y-4 pt-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-36 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="py-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/30">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Não foi possível carregar suas encomendas
                    </h2>
                    <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">
                        {error instanceof Error
                            ? error.message
                            : "Ocorreu um erro ao conectar ao servidor. Tente novamente mais tarde."}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Minhas Encomendas
                </h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Acompanhe o histórico e o status dos seus pedidos em tempo real.
                </p>
            </div>

            <div className="flex gap-4">
                {["Todas Encomendas", "Encomendas Pendentes", "Encomendas Encerradas"].map(item => <Badge key={item} variant={status === item ? "default" : "outline"} className={cn("px-3 py-2 cursor-pointer", status === item && "bg-emerald-700")} onClick={() => setStatus(item)}>{item}</Badge>)}
            </div>
            {!orders || orders.length === 0 ? (
                <Card className="border border-black/5 bg-white/70 p-12 text-center backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/60 rounded">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                            Nenhuma encomenda por aqui
                        </h3>
                        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                            Você ainda não fez nenhum pedido. Quando fizer, suas encomendas aparecerão nesta área.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.uuid} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}