"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageDown, Plus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "~/shared/http";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { currencyToNumber, formatCurrency } from "~/shared/utils/currency";
import {
  DEFAULT_FORM_VALUES,
  ProductFormValues,
  registerSchemas,
} from "../dtos/create-product.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImagePreview = {
  name: string
  url: string
  file: File
}


export function Register() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(registerSchemas),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data } = useQuery({
    queryKey: ["product-form-data"],
    queryFn: async () => {
      const [categories, units] = await Promise.all([
        http.get<{ id: number; uuid: string; name: string }[]>("/categories"),
        http.get<{ id: number; uuid: string; name: string }[]>("/unit"),
      ]);

      return {
        categories: categories.data ?? [],
        units: units.data ?? [],
      };
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("quantity", String(values.quantity));
      formData.append("price", String(values.price));
      formData.append("description", values.description);
      formData.append("category", values.categoryId);
      formData.append("unit", values.unitId);

      imagePreviews.forEach((image) => {
        formData.append("files", image.file);
      });

      await http.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      clearImages();
      form.reset();
      setIsOpen(false);
    },
  });

  function onSubmit(values: ProductFormValues) {
    mutate(values);
  }

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
  const imageUrls = useRef(new Set<string>());

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
    form.setValue("images", [], { shouldDirty: true, shouldValidate: true })
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
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button className="h-11 bg-emerald-700 hover:bg-emerald-800 cursor-pointer" />
          }
        >
          <Plus />
          Novo
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Criar Novo Produto</SheetTitle>
          </SheetHeader>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {imagePreviews.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 cursor-pointer"
                    onClick={clearImages}
                  >
                    <X size={14} />
                    Limpar imagens
                  </Button>
                </div>
              )}
              <div
                className={`grid w-full gap-3 ${imagePreviews.length === 0
                  ? "grid-cols-1"
                  : "grid-cols-4"
                  }`}
              >


                {imagePreviews.map((image) => (
                  <div
                    key={image.url}
                    className="relative h-24 w-full overflow-hidden rounded-md border"
                  >
                    <Image
                      src={image.url}
                      alt={image.name}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-full w-full object-cover"
                    />

                    <Button
                      type="button"
                      size="icon-xs"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 shadow hover:bg-red-800"
                      aria-label={`Eliminar ${image.name}`}
                      onClick={() => removeImage(image.url)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}

                <label
                  htmlFor="images"
                  className={imagePreviews.length === 0 ? "col-span-1" : "col-span-1"}
                >
                  <div className="h-24 rounded-md border border-dashed bg-slate-50 text-slate-500 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 transition">
                    <ImageDown size={28} />
                    <span className="text-xs text-center px-2">
                      Adicionar imagem
                    </span>
                  </div>
                </label>
              </div>
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
                          field.onChange(currencyToNumber(event.target.value))
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
                        type="number"
                        id="product-quantity"
                        min="0"
                        step="any"
                        className="h-11"
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="product-category"
                        aria-invalid={fieldState.invalid}
                        className="w-full h-11"
                      >
                        <SelectValue placeholder="Selecione a categoria">
                          {(value: string | null) =>
                            data?.categories.find(
                              (category) => category.uuid === value
                            )?.name ?? "Selecione a categoria"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {data?.categories.map((category) => (
                          <SelectItem key={category.uuid} value={category.uuid}>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="product-unit"
                        aria-invalid={fieldState.invalid}
                        className="w-full h-11"
                      >
                        <SelectValue placeholder="Selecione a unidade">
                          {(value: string | null) =>
                            data?.units.find((unit) => unit.uuid === value)
                              ?.name ?? "Selecione a unidade"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {data?.units.map((unit) => (
                          <SelectItem key={unit.uuid} value={unit.uuid}>
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
                      className="h-28"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="images"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>

                    <Input
                      type="file"
                      id="images"
                      placeholder="Ex.: Tomate"
                      aria-invalid={fieldState.invalid}
                      className="hidden"
                      accept="image/*"
                      onBlur={field.onBlur}
                      multiple
                      onChange={(event) => {
                        const files = Array.from(
                          event.target.files ?? []
                        )

                        addImages(files)
                        event.currentTarget.value = ""
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <SheetFooter className="border-t border-slate-200 px-4 py-4">
              <div className="flex gap-5 w-full">
                <SheetClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-1/2 cursor-pointer"
                    />
                  }
                >
                  Cancelar
                </SheetClose>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-emerald-700 hover:bg-emerald-800 h-11 w-1/2 cursor-pointer"
                >
                  {isPending ? <Spinner /> : "Salvar"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
