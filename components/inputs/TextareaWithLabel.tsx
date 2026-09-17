"use client"

import { Controller, useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

type TextareaWithLabelProps<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  placeholder?: string
  disabled?: boolean
  rows?: number
}

export function TextareaWithLabel<S>({
  fieldTitle,
  nameInSchema,
  placeholder,
  disabled = false,
  rows = 4,
  ...props
}: TextareaWithLabelProps<S>) {
  const form = useFormContext()

  const fieldId = `field-${nameInSchema}`

  return (
    <FieldGroup>
      <Controller
        name={nameInSchema}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={fieldId}>
              {fieldTitle}
            </FieldLabel>
            
            <Textarea
              {...props}
              {...field} 
              id={fieldId}
              value={(field.value ?? '') as string | number}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder ?? `Enter ${fieldTitle.toLowerCase()}`}
              disabled={disabled}
              rows={rows}
            />

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  )
}