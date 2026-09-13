'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ComponentPropsWithoutRef } from 'react'

type InputWithLabelProps<S> = ComponentPropsWithoutRef<typeof Input> & {
  fieldTitle: string
  nameInSchema: keyof S & string
}

export function InputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: InputWithLabelProps<S>) {
  const form = useFormContext()

  const fieldId = props.id || `field-${nameInSchema}`

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
            
            <Input
              {...props} 
              {...field} 
              id={fieldId}
              value={(field.value ?? '') as string | number}
              aria-invalid={fieldState.invalid}
              placeholder={props.placeholder ?? `Enter ${fieldTitle.toLowerCase()}`}
              autoComplete={props.autoComplete ?? "off"}
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
