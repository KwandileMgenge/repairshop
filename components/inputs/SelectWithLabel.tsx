"use client"

import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type DataObj = {
  id: string 
  description: string
}

type SelectWithLabelProps<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  data: DataObj[]
  className?: string
}

export function SelectWithLabel<S>({
  fieldTitle,
  nameInSchema,
  data,
  className,
}: SelectWithLabelProps<S>) {
  const form = useFormContext()

  const fieldId = `field-${nameInSchema}`

  return (
    <FieldGroup className={className}>
      <Controller
        name={nameInSchema}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={fieldId}>
              {fieldTitle}
            </FieldLabel>
            
            <Select
              value={(field.value ?? '') as string}
              onValueChange={field.onChange}
              name={field.name}
              disabled={field.disabled}
            >
              <SelectTrigger 
                id={fieldId} 
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder={`Select ${fieldTitle.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.description}
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
    </FieldGroup>
  )
}
