import type { Product } from "~/app/panel/products/models/product";
import type { UserModel } from "~/app/(marketplace)/models/vehicle";

export type OrderItem = {
  id: number;
  uuid: string;
  product: Product;
  quantity: string;
  unit_price: number;
  total_price: number;
  status: string;
};

export type Order = {
  id: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  buyer: UserModel;
  total_price: number;
  load_date: string;
  status: string;
  items: OrderItem[];
};
