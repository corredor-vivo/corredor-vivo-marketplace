export type Province = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
};

export type Commune = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    provinceId: number
}

export type Zone = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    communeId: number
}