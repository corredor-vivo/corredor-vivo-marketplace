import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DEFAULT_PAGINATION } from "~/shared/constants/pagination";
import { DEFAULT_METRIC, fetchData } from "../services/product.service";

export type FilterProduct = {
  search?: string;
  startPrice?: number;
  endPrice?: number;
  category?: string;
  quantity?: number;
};

export function useProduct() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterProduct | null>(null);

  const { isLoading, refetch, data, isFetching } = useQuery({
    queryKey: ["products", page, perPage, filters],
    queryFn: async () => fetchData(page, perPage, filters),
  });

  return {
    products: data?.productsData ?? [],
    metrics: data?.metrics ?? DEFAULT_METRIC,
    meta: {
      page,
      perPage,
    },
    isLoading,
    refetch,
    setPage,
    setSearch: (value: string) => setFilters(data => ({
        ...data,
        search: value
    })),
    setPerPage,
    page,
    perPage,
    filters,
    isFetching,
  };
}
