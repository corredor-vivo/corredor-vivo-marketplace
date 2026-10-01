import { MapPin, ShoppingCart, Leaf, ShieldCheck } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { formatCurrency } from '~/shared/utils/currency';
import type { ConsolidatedProductInfo, ConsolidatedUnit, ProductDetail } from '../models';
import { useState } from 'react';
import { Input } from '~/components/ui/input';

interface ProductCardProps {
    products: ProductDetail[];
    unit: ConsolidatedUnit;
    info: ConsolidatedProductInfo;
    onAddToCart?: (quantity: number) => void;
}

export function ProductCard({
    products,
    unit,
    info,
    onAddToCart,
}: ProductCardProps) {

    const selected_product = products[0];
    const [quantity, setQuantity] = useState('1');

    return (
        <div className="group rounded-[24px] border border-zinc-200/80 bg-white p-3.5 transition-all duration-300 hover:border-emerald-600/40 hover:shadow-xl hover:shadow-emerald-950/5 flex flex-col justify-between">
            <div>
                {/* Imagem */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
                    <img
                        src={selected_product?.images[0]?.url ?? '/images/logo.jpeg'}
                        alt={info.name}
                        className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge Status */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="rounded-full bg-emerald-900/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-emerald-200 shadow-md border border-emerald-500/20">
                            Disponivel
                        </span>
                    </div>

                </div>

                {/* Informações */}
                <div className="pt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/50">
                            <MapPin className="h-3 w-3 text-emerald-700 fill-emerald-700" />
                            {info.province.name}
                        </span>
                    </div>

                    <h4 className="text-base font-black text-zinc-900 tracking-tight">
                        {info.name}
                    </h4>
                </div>
            </div>

            {/* Preço e Ação */}
            <div className="pt-3 mt-3 border-t border-zinc-100 space-y-3">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Preço</span>
                        <p className="text-base font-black text-emerald-900">
                            {info.averagePrice && formatCurrency(info.averagePrice )}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Disponível</span>
                        <p className="text-xs font-extrabold text-zinc-700">
                            {info.quantity && info.quantity.toLocaleString('pt-AO')}{' '}
                            <span className="text-[10px] font-normal text-zinc-500">{unit.name}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-semibold text-zinc-600 border border-zinc-200/50">
                            <Leaf className="h-2.5 w-2.5 text-emerald-700" /> Local
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-semibold text-zinc-600 border border-zinc-200/50">
                            <ShieldCheck className="h-2.5 w-2.5 text-blue-600" /> Verificado
                        </span>
                    </div>

                    <label className="w-full text-xs text-zinc-600">Quantidade ({unit.name})
                        <Input type="number" min="0.000001" step="0.000001" max={info.quantity} value={quantity}
                            onChange={event => setQuantity(event.target.value)} />
                    </label>
                    <Button
                        disabled={!Number.isFinite(Number(quantity)) || Number(quantity) <= 0 || Number(quantity) > info.quantity}
                        onClick={() => {
                            if (onAddToCart) {
                                onAddToCart(Number(quantity));
                            }
                        }}
                        className="h-8 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-[11px] font-bold px-3 gap-1 shadow-md shadow-emerald-950/10 active:scale-95 transition-all shrink-0"
                    >
                        <ShoppingCart className="h-3 w-3" />
                        Encomendar
                    </Button>
                </div>
            </div>
        </div>
    );
}
