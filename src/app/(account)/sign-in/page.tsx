"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeClosed, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "~/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "~/components/ui/input-group";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { LoginDto, loginSchema } from "../schemas/login.schemas";
import { LoginResponse } from "../dtos/login-response";
import { http } from "~/shared/http";
import { useAuth } from "../hooks/use-auth";
import { RedirectTo } from "~/shared/utils/guard";

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: async (credentials: LoginDto): Promise<LoginResponse> => {
            const { data } = await http.post<LoginResponse>(
                "/account/sign-in",
                credentials,
            );

            return data;
        },
    });

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [show, setShow] = useState(false);

    const onSubmit = (data: LoginDto) => {
        mutate(data, {
            onSuccess: (session) => {
                signIn(session);
                router.replace(RedirectTo(session.user.role));
            },
        });
    };

    return (
        <main className="space-y-7">
            <div className="space-y-2">
                <div className="flex items-center gap-5">
                    <img src={"/images/logo.jpeg"} alt="Logo" className="w-20" />

                    <div>
                        <h1 className="font-semibold text-lg">
                            Bem-vindo ao corredor vivo
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Insira suas credenciais para acessar sua conta
                        </p>
                    </div>
                </div>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">
                                    Endereço de email <span className="text-destructive">*</span>
                                </FieldLabel>
                                <InputGroup className="h-12">
                                    <InputGroupInput
                                        placeholder="example@gmail.com"
                                        aria-invalid={fieldState.invalid}
                                        id="email"
                                        type="email"
                                        {...field}
                                    />
                                    <InputGroupAddon>
                                        <Mail />
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">
                                    Palavra-Passe <span className="text-destructive">*</span>
                                </FieldLabel>
                                <InputGroup className="h-12">
                                    <InputGroupInput
                                        placeholder="*********"
                                        aria-invalid={fieldState.invalid}
                                        id="password"
                                        type={show ? "text" : "password"}
                                        {...field}
                                    />
                                    <InputGroupAddon>
                                        <Lock />
                                    </InputGroupAddon>

                                    <InputGroupAddon align="inline-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShow(!show)}
                                        >
                                            {show ? <EyeClosed /> : <Eye />}
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Link
                        href="/forgeted-password"
                        className="text-end hover:underline text-sm font-medium text-emerald-800"
                    >
                        Esqueceste a senha?
                    </Link>
                    <Button
                        className="h-12 bg-emerald-700 hover:bg-emerald-900 cursor-pointer"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Spinner />
                        ) : (
                            <>
                                <LogIn />
                                Entrar
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-3">
                        <Separator className="flex-1" />

                        <p className="text-sm font-medium text-slate-700">ou</p>

                        <Separator className="flex-1" />
                    </div>

                    <p className="text-center text-sm text-slate-700 mt-3">
                        Não tens uma conta?{" "}
                        <Link
                            href={"/sign-up"}
                            className="font-semibold text-slate-800 hover:underline"
                        >
                            Criar Conta
                        </Link>
                    </p>
                </FieldGroup>
            </form>
        </main>

    );
}
