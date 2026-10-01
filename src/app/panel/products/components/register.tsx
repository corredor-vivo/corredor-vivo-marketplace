"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, ImagePlus, PackagePlus, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"
import { Textarea } from "~/components/ui/textarea"
import { Spinner } from "~/components/ui/spinner"
import { cn } from "~/lib/utils"
import { http } from "~/shared/http"
import { registerSchemas } from "../schemas/register"
import { currencyToNumber, formatCurrency } from '~/shared/utils/currency';
import { uploadService } from "../services/upload-file"

const categories = [
    { id: "f6e9f2d4-1c8b-4f55-8a11-000000000001", name: "Frutas e legumes" },
    { id: "f6e9f2d4-1c8b-4f55-8a11-000000000002", name: "Cereais" },
    { id: "f6e9f2d4-1c8b-4f55-8a11-000000000003", name: "Bebidas" },
]

const units = [
    { id: "a1b2c3d4-5e6f-4a7b-8c9d-000000000001", name: "Unidade" },
    { id: "a1b2c3d4-5e6f-4a7b-8c9d-000000000002", name: "Quilograma" },
    { id: "a1b2c3d4-5e6f-4a7b-8c9d-000000000003", name: "Litro" },
]

type ProductFormValues = {
    name: string
    quantity: number
    price: number
    description: string
    categoryId: number
    unitId: number
    images: string[]
}

type ImagePreview = {
    name: string
    url: string
    file: File
}

export function RegisterProduct() {
    const queryClient = useQueryClient()
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
    const imageUrls = useRef(new Set<string>());

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(registerSchemas),
        defaultValues: {
            name: "",
            quantity: 0,
            price: 0,
            description: "",
            categoryId: 0,
            unitId: 0,
            images: [],
        },
    })

    const images = useWatch({ control: form.control, name: "images" }) ?? []
    const imageCount = images.length

    const { mutate, isPending } = useMutation({
        mutationFn: async (product: ProductFormValues) => {
            const imagesForm = new FormData()

            imagePreviews.forEach((image) => {
                imagesForm.append("images", image.file)
            })

            const images = await uploadService(imagesForm);

            await http.post("/products", {
                ...product,
                images
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", "mine"] })
            clearImages()
            form.reset()
            setStep(0)
            setIsOpen(false)
        },
    })

    const { data } = useQuery({
        queryKey: ['data'],
        queryFn: async () => {
            const [category, unit] = await Promise.all([
                http.get<{ id: number; name: string }[]>("/categories"),
                http.get<{ id: number; name: string }[]>("/units")
            ]);

            return {
                categories: category.data ?? [],
                units: unit.data ?? [] 
            }
        }
    })

    useEffect(() => {
        const urls = imageUrls.current

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [])

    function addImages(files: File[]) {
        const previews = files.map((file) => {
            const url = URL.createObjectURL(file)

            imageUrls.current.add(url)

            return { name: file.name, url, file }
        })

        const updatedPreviews = [...imagePreviews, ...previews]

        setImagePreviews(updatedPreviews)
        form.setValue(
            "images",
            updatedPreviews.map((image) => image.name),
            { shouldDirty: true, shouldValidate: true }
        )
    }

    function clearImages() {
        imageUrls.current.forEach((url) => URL.revokeObjectURL(url))
        imageUrls.current.clear()
        setImagePreviews([])
    }

    function removeImage(url: string) {
        URL.revokeObjectURL(url)
        imageUrls.current.delete(url)

        const previews = imagePreviews.filter((image) => image.url !== url)

        setImagePreviews(previews)
        form.setValue(
            "images",
            previews.map((image) => image.name),
            { shouldDirty: true, shouldValidate: true }
        )
    }

    function onSubmit(product: ProductFormValues) {
        mutate(product)
    }

    async function goToImages() {
        const isValid = await form.trigger([
            "name",
            "quantity",
            "price",
            "description",
            "categoryId",
            "unitId",
        ])

        if (isValid) {
            setStep(1)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
                render={
                    <Button className="h-11 bg-emerald-700 hover:bg-emerald-900" />
                }
            >
                <PlusIcon />
                Novo
            </SheetTrigger>

            <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Novo produto</SheetTitle>
                </SheetHeader>

                <form
                    className="flex min-h-[calc(100%-8.25rem)] flex-col px-6 pb-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <ol className="mb-8 grid grid-cols-2 gap-3" aria-label="Etapas do cadastro">
                        {[
                            { number: 1, label: "Informações" },
                            { number: 2, label: "Imagens" },
                        ].map((item, index) => (
                            <li
                                key={item.number}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium",
                                    step === index
                                        ? "text-emerald-700"
                                        : "text-muted-foreground"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-7 items-center justify-center rounded-full border text-xs",
                                        step === index
                                            ? "border-emerald-700 bg-emerald-700 text-white"
                                            : "border-border bg-muted"
                                    )}
                                >
                                    {item.number}
                                </span>
                                {item.label}
                            </li>
                        ))}
                    </ol>

                    {step === 0 ? (
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="product-name">
                                            Nome <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="product-name"
                                            placeholder="Ex.: Tomate"
                                            aria-invalid={fieldState.invalid}
                                            className="h-11"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="price"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="product-price">
                                                Preço <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                id="product-price"
                                                inputMode="numeric"
                                                placeholder="0,00 Kz"
                                                value={formatCurrency(field.value)}
                                                onBlur={field.onBlur}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        currencyToNumber(event.target.value)
                                                    )
                                                }
                                                className="h-11"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="quantity"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="product-quantity">
                                                Quantidade <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="product-quantity"
                                                type="number"
                                                min="0"
                                                step="any"
                                                className="h-11"
                                                onChange={(event) => field.onChange(Number(event.target.value))}
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <Controller
                                name="categoryId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="product-category">
                                            Categoria <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}

                                        >
                                            <SelectTrigger
                                                id="product-category"
                                                aria-invalid={fieldState.invalid}
                                                className="w-full h-11"
                                            >
                                                <SelectValue placeholder="Selecione a categoria">
                                                    {(value: number | null) =>
                                                        data?.categories.find(
                                                            (category) => category.id === value
                                                        )?.name ?? "Selecione a categoria"
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data?.categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="unitId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="product-unit">
                                            Unidade <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="product-unit"
                                                aria-invalid={fieldState.invalid}
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Selecione a unidade">
                                                    {(value: number | null) =>
                                                        data?.units.find((unit) => unit.id === value)
                                                            ?.name ?? "Selecione a unidade"
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data?.units.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="product-description">
                                            Descrição
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="product-description"
                                            placeholder="Descreva o produto"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />


                        </FieldGroup>
                    ) : (
                        <FieldGroup>
                            <Controller
                                name="images"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="product-images">
                                            Imagens do produto
                                        </FieldLabel>
                                        <Input
                                            id="product-images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="sr-only"
                                            onBlur={field.onBlur}
                                            onChange={(event) => {
                                                const files = Array.from(
                                                    event.target.files ?? []
                                                )

                                                addImages(files)
                                                event.currentTarget.value = ""
                                            }}
                                        />
                                        <FieldDescription>
                                            Selecione uma ou mais imagens do produto.
                                            {imageCount > 0 && ` ${imageCount} imagem(ns) selecionada(s).`}
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <label
                                htmlFor="product-images"
                                className="block cursor-pointer"
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                    event.preventDefault()
                                    addImages(
                                        Array.from(event.dataTransfer.files).filter((file) =>
                                            file.type.startsWith("image/")
                                        )
                                    )
                                }}
                            >
                                <Card className="min-h-40 items-center justify-center gap-2 border border-dashed border-border bg-muted/30 p-6 text-center text-muted-foreground shadow-none transition-colors hover:bg-muted/50">
                                    <ImagePlus className="size-8" />
                                    <p className="text-sm font-medium">
                                        Arraste imagens aqui ou clique para selecionar.
                                    </p>
                                </Card>
                            </label>

                            {imagePreviews.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {imagePreviews.map((image) => (
                                        <Card key={image.url} className="relative gap-0 py-0 shadow-sm">
                                            <Image
                                                src={image.url}
                                                alt={image.name}
                                                width={240}
                                                height={240}
                                                unoptimized
                                                className="aspect-square w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                size="icon-xs"
                                                className="absolute top-2 right-2 rounded-full bg-red-600 hover:bg-red-800 shadow"
                                                aria-label={`Eliminar ${image.name}`}
                                                onClick={() => removeImage(image.url)}
                                            >
                                                <X />
                                            </Button>
                                            <CardContent className="p-3">
                                                <p className="truncate text-xs font-medium" title={image.name}>
                                                    {image.name}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : null}
                        </FieldGroup>
                    )}

                    <SheetFooter className="mt-auto px-0 pt-8">
                        {step === 0 ? (
                            <Button
                                type="button"
                                className="bg-emerald-700 hover:bg-emerald-900"
                                onClick={goToImages}
                            >
                                Continuar
                                <ChevronRight />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(0)}
                                >
                                    <ChevronLeft />
                                    Voltar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-emerald-700 hover:bg-emerald-900"
                                >
                                    {isPending ? <Spinner /> : "Guardar produto"}
                                </Button>
                            </>
                        )}
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

function PlusIcon() {
    return <PackagePlus />
}
