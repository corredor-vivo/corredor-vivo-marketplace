import { http } from "~/shared/http";

export async function downloadOrderInvoice(orderId: number): Promise<void> {
    const response = await http.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
    });

    const blob = new Blob([response.data], {
        type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `fatura-encomenda-${orderId}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}