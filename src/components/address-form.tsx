"use client"

import { useEffect } from "react"
import { Controller, useWatch, type UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { Commune, Province, Zone } from "~/app/(marketplace)/models/address"

import {
  Field,
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
import { Textarea } from "~/components/ui/textarea"

const addressSchema = z.object({
  provinceId: z.number({ message: "Selecione uma província" }),
  communeId: z.number({ message: "Selecione uma comuna" }),
  zoneId: z.number({ message: "Selecione uma zona" }),
  street: z.string().trim().min(1, { message: "A rua é obrigatória" }),
  observations: z.string().optional(),
})

export type AddressFormValues = z.infer<typeof addressSchema>

export type AddressFormOption = {
  id: string
  name: string
}

type AddressFormProps = {
  form: UseFormReturn<AddressFormValues>
  provinces: Province[]
  communes: Commune[]
  zones: Zone[]
}

export function AddressForm({
  form,
  provinces,
  communes,
  zones,
}: AddressFormProps) {
  const selectedProvinceId = useWatch({
    control: form.control,
    name: "provinceId",
  })

  const selectedCommuneId = useWatch({
    control: form.control,
    name: "communeId",
  })

  const filteredCommunes = selectedProvinceId
    ? communes.filter((commune) => commune.provinceId === selectedProvinceId)
    : []

  // Filtra as zonas pertencentes à comuna selecionada
  const filteredZones = selectedCommuneId
    ? zones.filter((zone) => zone.communeId === selectedCommuneId)
    : []

  // Reseta os campos dependentes quando a província muda
  useEffect(() => {
    if (selectedProvinceId) {
      const currentCommune = form.getValues("communeId")
      const isCommuneValid = filteredCommunes.some(
        (c) => c.id === currentCommune
      )

      if (!isCommuneValid) {
        form.resetField("communeId")
        form.resetField("zoneId")
      }
    } else {
      form.resetField("communeId")
        form.resetField("zoneId")
    }
  }, [selectedProvinceId])

  useEffect(() => {
    if (selectedCommuneId) {
      const currentZone = form.getValues("zoneId")
      const isZoneValid = filteredZones.some((z) => z.id === currentZone)

      if (!isZoneValid) {
        form.resetField("zoneId")
      }
    } else {
      form.resetField("zoneId")
    }
  }, [selectedCommuneId])

  return (
    <div className="w-full">
      <FieldGroup>
        {/* Província */}
        <Controller
          name="provinceId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-province">Província</FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={field.onChange}
                onOpenChange={(open) => {
                  if (!open) field.onBlur()
                }}
              >
                <SelectTrigger
                  id="address-province"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue placeholder="Selecione a província">
                    {provinces.find(province => province.id === form.getValues("provinceId"))?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
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

        {/* Comuna */}
        <Controller
          name="communeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-commune">Comuna</FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={field.onChange}
                disabled={!selectedProvinceId || filteredCommunes.length === 0}
                onOpenChange={(open) => {
                  if (!open) field.onBlur()
                }}
              >
                <SelectTrigger
                  id="address-commune"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      !selectedProvinceId
                        ? "Selecione primeiro uma província"
                        : "Selecione a comuna"
                    }
                  >
                    {communes.find(commune => commune.id === form.getValues("communeId"))?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredCommunes.map((commune) => (
                    <SelectItem key={commune.id} value={commune.id}>
                      {commune.name}
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

        {/* Zona */}
        <Controller
          name="zoneId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-zone">Zona</FieldLabel>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={field.onChange}
                disabled={!selectedCommuneId || filteredZones.length === 0}
                onOpenChange={(open) => {
                  if (!open) field.onBlur()
                }}
              >
                <SelectTrigger
                  id="address-zone"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      !selectedCommuneId
                        ? "Selecione primeiro uma comuna"
                        : "Selecione a zona"
                    }
                  >
                    {zones.find(zone => zone.id === form.getValues("zoneId"))?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredZones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
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

        {/* Rua */}
        <Controller
          name="street"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-street">Rua</FieldLabel>
              <Input
                {...field}
                id="address-street"
                placeholder="Ex.: Rua da Paz"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Observações */}
        <Controller
          name="observations"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-observations">
                Observações
              </FieldLabel>
              <Textarea
                {...field}
                id="address-observations"
                placeholder="Informações adicionais para encontrar o endereço"
                aria-invalid={fieldState.invalid}
                rows={4}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  )
}

export { addressSchema }