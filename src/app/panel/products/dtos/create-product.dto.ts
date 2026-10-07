import z from "zod";

export type ProductFormValues = {
    name: string
    quantity: number
    price: number
    description: string
    categoryId: string
    unitId: string
    images: string[]
}


export const registerSchemas = z.object({
    name: z.string({ error: "Nome é obrigatório" }).min(1, { error: "Nome é obrigatório" }),
    quantity: z.number({ error: "Quantidade é obrigatória" }).positive({ error: "Quantidade deve ser positiva" }),
    price: z.number({ error: "Preço é obrigatório" }).positive({ error: "Preço deve ser positivo" }),
    description: z.string({ error: "Descrição é obrigatória" }).min(1, { error: "Descrição é obrigatória" }),

    categoryId: z.string({ error: "Categoria é obrigatória" }).uuid({ error: "Selecione a categoria" }),
    unitId: z.string({ error: "Unidade é obrigatória" }).uuid({ error: "Selecione a unidade" }),

    images: z.array(z.string())
        .min(1, { error: "Adicione pelo menos uma imagem" })
        .max(10, { error: "Máximo de 10 imagens" }),
})

export const DEFAULT_FORM_VALUES: ProductFormValues = {
    name: "",
    quantity: 0,
    price: 0,
    description: "",
    categoryId: "",
    unitId: "",
    images: [],
}

export type UpdateProductFormValues = {
    name: string
    quantity: number
    price: number
    description: string
    categoryId: string
    unitId: string
    status: "active" | "draft" | "inactive"
}

export const updateSchemas = z.object({
    name: z.string({ error: "Nome é obrigatório" }).min(1, { error: "Nome é obrigatório" }),
    quantity: z.number({ error: "Quantidade é obrigatória" }).positive({ error: "Quantidade deve ser positiva" }),
    price: z.number({ error: "Preço é obrigatório" }).positive({ error: "Preço deve ser positivo" }),
    description: z.string({ error: "Descrição é obrigatória" }).min(1, { error: "Descrição é obrigatória" }),

    categoryId: z.string({ error: "Categoria é obrigatória" }).uuid({ error: "Selecione a categoria" }),
    unitId: z.string({ error: "Unidade é obrigatória" }).uuid({ error: "Selecione a unidade" }),

    status: z.enum(["active", "draft", "inactive"], { error: "Estado é obrigatório" }),
})
