
export type UserModel = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    photo: string | null;
};

export type VehicleModel = {
    id: number;
    uuid: string;
    isDeleted: boolean;
    active: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    name: string;
    license_plate: string;
    status: 'active' | 'inactive';
    owner: UserModel;
    partners: UserModel[];
};