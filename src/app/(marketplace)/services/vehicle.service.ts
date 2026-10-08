import { http } from "~/shared/http";
import { type VehicleModel } from "../models/vehicle";
import { Commune, Province, Zone } from "../models/address";

export async function getVehicle(): Promise<VehicleModel[]> {

    try {
        const response = await http.get<VehicleModel[]>("/vehicle/partners");

        return response.data;
    } catch {
        return []
    }
}

async function getProvince() {
    try {
        const response = await http.get<Province[]>("/provinces");

        return response.data;
    } catch {
        return []
    }
}

async function getCommune() {
    try {
        const response = await http.get<Commune[]>("/communes");

        return response.data;
    } catch {
        return []
    }
}

async function getZone() {
    try {
        const response = await http.get<Zone[]>("/zones");

        return response.data;
    } catch {
        return []
    }
}

export async function fetchAll(): Promise<{
    vehicles: VehicleModel[],
    provinces: Province[]
    communes: Commune[],
    zones: Zone[]
}> {
    try {
        const [vehicles, provinces, communes, zones] = await Promise.all([
            getVehicle(),
            getProvince(),
            getCommune(),
            getZone()
        ])

        return {
            vehicles,
            provinces,
            communes,
            zones
        }
    } catch {
        return {
            vehicles: [],
            provinces: [],
            communes: [],
            zones: []
        }
    }
}