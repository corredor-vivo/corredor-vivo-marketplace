type ConsolidateProductModel = {
  id: number;
  uuid: string;
  isDeleted: boolean;
  active: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  reserverdQuantity: number;
  price: number

  unit: {
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

  category: {
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

  province: {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
};