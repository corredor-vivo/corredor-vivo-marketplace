import { http } from "~/shared/http";

export async function getConsolidatedProduct() {
    try {

        const response = await http.get("/products/consolidate");

        return response.data;
    } catch {
        return []
    }
}