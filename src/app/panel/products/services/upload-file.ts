import { http } from "~/shared/http"

export async function uploadService(form: FormData) {
    try {
        const response = await http.post("/uploads/images", form);

        return response.data.urls;
    } catch {
        throw new Error("Erro ao carregar a imagem")
    }
}