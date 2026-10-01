import z from "zod";

export const registerSchemas = z.object({
    name: z.string({ error: "Nome é obrigatório" }),
    quantity: z.number({ error: "Quantidade é obrigatória" }).nonnegative({ error: "Quantidade deve ser não negativa" }),
    price: z.number({ error: "Preço é obrigatório" }).positive({ error: "Preço deve ser positivo" }),
    description: z.string({ error: "Descrição é obrigatória" }),

    categoryId: z.number().int().positive(),
    unitId: z.number().int().positive(),

    images: z.array(z.string())
})
