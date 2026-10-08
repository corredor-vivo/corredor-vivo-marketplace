import { useQuery } from "@tanstack/react-query"
import { getConsolidatedProduct } from "../services/product.service"

export function useMarketplace() {

    const { data: products, isFetched, isLoading, refetch } = useQuery<ConsolidateProductModel[]>({
        initialData: [],
        queryKey: ["marketplace"],
        queryFn: async () => {
            return await getConsolidatedProduct()
        }
    })

    return {
        isFetched,
        isLoading,
        products,
        refetch
    }
}