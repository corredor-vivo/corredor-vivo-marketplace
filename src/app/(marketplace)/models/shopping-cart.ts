export type ShoppingCart = {
  id: number;
  uuid: string;
  isDeleted: boolean;
  active: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  total_price: number;
  status: 'active';
  checked_out_at: string | null;
};

export type ShoppingCartItem = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    product: ConsolidateProductModel;
    quantity: string;
    unit_price: string;
    total_price: number;
};