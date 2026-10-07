import { http } from "~/shared/http";
import { FilterProduct } from "../hooks/use-product";

export const DEFAULT_METRIC = {
  total: 0,
  active: 0,
  outOfStock: 0,
  inactive: 0,
  totalQuantity: 0,
  stockValue: 0,
};

export async function getProducts(
  page: number,
  perPage: number,
  filters: FilterProduct | null,
) {
  try {
    const response = await http.get("/products/my-products", {
      params: {
        ...filters,
        page,
        perPage,
      },
    });

    return response.data;
  } catch {
    return [];
  }
}

export async function getProductMetrics() {
  const response = await http.get("/products/my-products/metrics");
  return response.data;
}

export async function updateProduct(
  uuid: string,
  data: UpdateProductPayload,
) {
  const response = await http.patch(`/products/${uuid}`, data);
  return response.data;
}

export async function deleteProduct(uuid: string) {
  const response = await http.delete(`/products/${uuid}`);
  return response.data;
}

export type UpdateProductPayload = {
  name?: string;
  quantity?: number;
  price?: number;
  description?: string;
  category?: string;
  unit?: string;
  status?: string;
};

export async function fetchData(
  page: number,
  perPage: number,
  filters: FilterProduct | null,
) {
  const [productsData, metrics] = await Promise.all([
    getProducts(page, perPage, filters),
    getProductMetrics(),
  ]);

  return {
    productsData,
    metrics,
  };
}
