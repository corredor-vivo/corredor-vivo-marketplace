import { http } from "~/shared/http";
import type { Order } from "../models/order";

export async function getOrders(): Promise<Order[]> {
  const response = await http.get("/orders");
  return Array.isArray(response.data) ? response.data : [];
}
