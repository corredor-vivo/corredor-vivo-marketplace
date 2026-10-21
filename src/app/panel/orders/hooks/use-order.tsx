import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DEFAULT_PAGINATION } from "~/shared/constants/pagination";
import { getOrders } from "../services/order.service";

export function useOrder() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION);
  const [search, setSearch] = useState("");
  const { data = [], isLoading, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-AO");
    if (!term) return data;

    return data.filter((order) => {
      const buyer = `${order.buyer?.firstName ?? ""} ${order.buyer?.lastName ?? ""}`;
      return [String(order.id), buyer, order.status].some((value) =>
        value.toLocaleLowerCase("pt-AO").includes(term),
      );
    });
  }, [data, search]);

  const orders = filteredOrders.slice((page - 1) * perPage, page * perPage);
  const metrics = {
    total: data.length,
    pending: data.filter((order) => order.status.toLowerCase() === "pending").length,
    processing: data.filter((order) => order.status.toLowerCase() === "processing").length,
    completed: data.filter((order) => order.status.toLowerCase() === "completed").length,
  };

  return {
    orders,
    metrics,
    totalOrders: filteredOrders.length,
    page,
    perPage,
    search,
    isLoading,
    isFetching,
    setPage,
    setPerPage: (value: number) => {
      setPerPage(value);
      setPage(1);
    },
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
  };
}
