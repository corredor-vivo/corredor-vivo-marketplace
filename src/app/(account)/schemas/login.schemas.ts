import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email é obrigatório" }),
  password: z.string().min(1, { message: "Palavra-Passe é obrigatório" }),
});

export type LoginDto = z.infer<typeof loginSchema>;