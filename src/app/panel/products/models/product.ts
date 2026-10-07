export type Category = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    parentId: number | null;
    type: string;
  };
  
  export type Unit = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    abbreviation: string;
    baseUnitId: number | null;
    value: number;
  };
  
  export type ProductImage = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    url: string;
    productId: number;
  };
  
  export type Product = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    slug: string;
    code: string;
    description: string;
    quantity: string;
    price: number;
    status: string;
    categoryId: number;
    unitId: number;
    producerId: number;
    category: Category;
    unit: Unit;
    images: ProductImage[];
  };