export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  active?: boolean;
}

export interface ConsolidatedProductInfo {
  name: string;
  quantity: number;
  averagePrice?: number;
  province: {
    name: string;
  };
}

export interface ConsolidatedUnit {
  id: string | number;
  uuid?: string;
  name?: string;
  symbol?: string;
}

export interface ProductDetail {
  id: string | number;
  status?: string;
  location?: string;
  producer?: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  unit?: string;
  imageUrl?: string;
  images: {
    url: string;
  }[];
  categoryId?: string;
}

export interface ConsolidatedProduct {
  id?: string | number;
  unitId?: string;
  info: ConsolidatedProductInfo;
  unit: ConsolidatedUnit;
  products: ProductDetail[];
  category?: string; 
  imageUrl?: string;
}

export function getConsolidatedProductId(product: ConsolidatedProduct) {
  const id = product.id ?? product.products[0]?.id;

  return id === undefined ? product.info.name : String(id);
}


export interface ShippingAddress {
  province: string;
  municipe: string;
  commune: string;
  lat?: number;
  lng?: number;
  observations?: string;
}

export interface OrderItemInput {
  product: string; 
  quantity: number;
  unit: string;    
}

export interface CreateOrderPayload {
  shipping_address: ShippingAddress;
  items: OrderItemInput[];
  send_email?: boolean;
  email?: string;
}

export interface OrderResponse {
  message?: string;
  order?: {
    id: string;
    code: string;
    status: 
      | 'CREATED'
      | 'PROCESSING'
      | 'ASSIGNED_DRIVER'
      | 'IN_TRANSIT'
      | 'PARTIALLY_DELIVERED'
      | 'DELIVERED'
      | 'PARTIALLY_CANCELLED'
      | 'CANCELLED'
      | 'RETURNED'
      | 'COMPLETED';
    createdAt: string;
    [key: string]: unknown;
  };
}
