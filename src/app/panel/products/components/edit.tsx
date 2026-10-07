"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { currencyToNumber, formatCurrency } from "~/shared/utils/currency";
import { http } from "~/shared/http";
import { Product } from "../models/product";
import { updateProduct } from "../services/product.service";
import {
  UpdateProductFormValues,
  updateSchemas,
} from "../dtos/create-product.dto";

const STATUS_OPTIONS = [
  { value: "active", label: "Ativo" },
  { value: "draft", label: "Rascunho" },
  { value: "inactive", label: "Inativo" },
];

type EditProps = {
  product: Product;
};

export function EditProduct({ product }: EditProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateSchemas),
    defaultValues: {
      name: product.name,
      quantity: Number(product.quantity),
      price: product.price,
      description: product.description,
      categoryId: product.category?.uuid ?? "",
      unitId: product.unit?.uuid ?? "",
      status: (product.status?.toLowerCase() as UpdateProductFormValues["status"]) ?? "active",
    },
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
    mutationFn: async (values: UpdateProductFormValues) => {
      await updateProduct(product.uuid, {
        name: values.name,
        quantity: values.quantity,
        price: values.price,
        description: values.description,
        category: values.categoryId,
        unit: values.unitId,
        status: values.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
    },
  });

  function onSubmit(values: UpdateProductFormValues) {
    mutate(values);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${product.name}`}
          />
        }
      >
        <Pencil size={16} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Produto</SheetTitle>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-name">
                    Nome <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="edit-product-name"
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
                    <FieldLabel htmlFor="edit-product-price">
                      Preço <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="edit-product-price"
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
                    <FieldLabel htmlFor="edit-product-quantity">
                      Quantidade <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="edit-product-quantity"
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
                  <FieldLabel htmlFor="edit-product-category">
                    Categoria <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-product-category"
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
                  <FieldLabel htmlFor="edit-product-unit">
                    Unidade <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-product-unit"
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
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-product-status">
                    Estado <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-product-status"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-11"
                    >
                      <SelectValue placeholder="Selecione o estado">
                        {(value: string | null) =>
                          STATUS_OPTIONS.find((option) => option.value === value)
                            ?.label ?? "Selecione o estado"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                  <FieldLabel htmlFor="edit-product-description">
                    Descrição
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-product-description"
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
  );
}
