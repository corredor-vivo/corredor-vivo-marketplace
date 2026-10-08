"use client";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { useCart } from "../../hooks/use-cart";
import { CartItem } from "./shopping-cart-item";
import { formatCurrency } from "~/shared/utils/currency";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAll, getVehicle } from "../../services/vehicle.service";
import { Spinner } from "~/components/ui/spinner";
import { VehicleCard } from "./vehicle-card";
import { VehicleModel } from "../../models/vehicle";
import { AddressForm } from "~/components/address-form";
import { addressSchema, type AddressFormValues } from "~/components/address-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateOrderDto } from "../../models/orders";
import { http } from "~/shared/http";

export function ShoppingCart() {

    const { items, currentCart, clearCart, refetch } = useCart();
    const [step, setStep] = useState(1);
    const [open, setIsOpen] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null)
    const addressForm = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            observations: "",
        },
    })
    const { data: { vehicles, provinces, communes, zones }, isLoading } = useQuery({
        initialData: {
            vehicles: [],
            provinces: [],
            communes: [],
            zones: []
        },
        queryKey: ["drivers"],
        queryFn: () => {
            return fetchAll()
        }
    })
    const next = async () => {
        if (step > 3) return;

        if (step === 3) {
            const isAddressValid = await addressForm.trigger();
            if (!isAddressValid) return;

            const address: AddressFormValues = addressForm.getValues();
            console.log("Endereço validado:", address);
            return;
        }

        setStep((value) => value + 1)
    }

    const previous = () => {
        if (step === 1) return;
        setStep((value) => value - 1)
    }

    const canNext = () => {
        if ((step === 2 && selectedVehicle === null) || step === 3) return false;

        return true;
    }

    const orderMutate = useMutation({
        mutationFn: async (data: CreateOrderDto) => {
            await http.post("/orders/checkout", data)
        },
        onSuccess: () => {
            clearCart()
            setIsOpen(false)
            refetch()
            setStep(1)
        }
    })
    const finishOrder = async () => {
        const isAddressValid = await addressForm.trigger();

        if (!isAddressValid || !selectedVehicle) return;

        const address = addressForm.getValues();
        await orderMutate.mutateAsync({
            address: {
                provinceId: provinces.find(province => province.id === address.provinceId)?.uuid ?? "",
                communeId: communes.find(communes => communes.id === address.communeId)?.uuid ?? "",
                zoneId: zones.find(zone => zone.id === address.zoneId)?.uuid ?? "",
                street: address.street,
                observations: address.observations
            },
            driver: selectedVehicle.owner.uuid,
            load_date: new Date(),
            shoppingCartId: currentCart?.uuid ?? ""
        })
    }
    return (
        <>
            <Sheet open={open} onOpenChange={setIsOpen}>
                <SheetTrigger render={<Button variant="ghost" size="icon-lg" />}>
                    <div className="relative">
                        <ShoppingBag size={20} />

                        {items.length > 0 && (
                            <Badge className="absolute -right-3 -top-3 min-w-5 h-4 px-1 flex items-center justify-center bg-emerald-700 text-white font-bold">
                                {items.length}
                            </Badge>
                        )}

                    </div>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Meu Carrinho de compras {step}</SheetTitle>
                    </SheetHeader>

                    {items.length === 0 ? <>
                        <p>Sem produto no carrinho</p>
                    </> : <section className="px-4">
                        {step === 1 && <section>
                            {items.map((item) => (
                                <CartItem item={item} key={item.uuid} />
                            ))}

                            <div>
                                <h1 className="mt-4 text-right">

                                    Preço: <span className="font-semibold text-slate-700">
                                        {formatCurrency(currentCart?.total_price ?? 0)}
                                    </span>
                                </h1>
                            </div>
                        </section>}

                        {step === 2 && (
                            <>
                                <section>
                                    <h1 className="text-slate-700 font-semibold mb-2">
                                        Selecionar Motorista
                                    </h1>

                                    {isLoading ?

                                        <>
                                            <Spinner />
                                        </>
                                        :
                                        <section>
                                            {(vehicles ?? []).map(vehicle => (
                                                <VehicleCard key={vehicle.uuid}
                                                    vehicle={vehicle}
                                                    active={selectedVehicle?.uuid === vehicle.uuid}
                                                    onSelect={(vehicle) => setSelectedVehicle(vehicle)} />
                                            ))}
                                        </section>
                                    }
                                </section>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <section>
                                    <h1 className="text-slate-700 font-semibold mb-2">
                                        Endereço de entrega
                                    </h1>

                                    {isLoading ?

                                        <>
                                            <Spinner />
                                        </>
                                        :
                                        <section>
                                            <AddressForm
                                                form={addressForm}
                                                zones={zones}
                                                provinces={provinces}
                                                communes={communes}
                                            />
                                        </section>
                                    }
                                </section>
                            </>
                        )}
                    </section>}



                    <SheetFooter>
                        <Button variant="outline" className="w-full" onClick={previous} disabled={step === 1}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </Button>
                        {step !== 3 ? <Button className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={next} disabled={!canNext()}>
                            Próximo
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button> : <Button className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={finishOrder}>
                           {orderMutate.isPending ? <Spinner /> : " Finalizar encomenda"}
                        </Button>}
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}
