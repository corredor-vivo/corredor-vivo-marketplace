export type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "COMPLETED";
export const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendente", PROCESSING: "Em preparação", DELIVERED: "Entregue", COMPLETED: "Concluída",
};
export interface Contact { name: string; email?: string; phone?: string }
export interface Driver extends Contact { id: number; vehiclePlate: string }
export interface Delivery { province: string; municipality: string; commune: string; street: string; reference?: string }
export interface Order {
  id: number; code: string; createdAt: string; completedAt: string | null; status: OrderStatus;
  customer: Contact; driver: Driver; delivery: Delivery; total: string; currency: string;
  items: { id: number; consolidatedId: number; name: string; unit: string; quantity: string; total: string;
    allocations: { id: number; producerOrderId: number; productId: number; quantity: string; originalQuantity: string; originalUnit: string; unitPrice: string; total: string }[] }[];
  producers: { id: number; sellerId: number; seller: Contact; status: OrderStatus; completedAt: string | null }[];
  history: { id: number; producerOrderId: number; status: OrderStatus; createdAt: string }[];
}
export interface Quote {
  lines: { consolidatedId: number; name: string; quantity: string; unit: string; total: string }[];
  total: string; fingerprint: string; currency: string;
}
export interface Notifications {
  total: number; unread: number; latest: number;
  items: { id: number; orderId: number; title: string; kind: string; readAt: string | null; createdAt: string }[];
}
