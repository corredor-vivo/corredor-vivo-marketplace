export function formatCurrency(value: number) {
    if (!value) {
        return ""
    }

    return new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
    }).format(value)
}

export function currencyToNumber(value: string) {
    const digits = value.replace(/\D/g, "")

    return digits ? Number(digits) / 100 : 0
}
