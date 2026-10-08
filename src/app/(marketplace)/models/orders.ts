export type CreateOrderDto = {
    shoppingCartId: string;
    address: {
        provinceId: string;
        communeId: string;
        zoneId: string;
        street: string;
        buildingNumber?: number;
        unit?: string;
        postalCode?: number;
        reference?: string;
        lat?: number;
        long?: number;
        observations?: string;
    };
    driver: string;
    load_date: Date;
    notes?: string;
};