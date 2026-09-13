'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

type CheckboxWithLabelProps<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  className?: string
}

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
}: CheckboxWithLabelProps<S>) {
  const form = useFormContext()
  const fieldId = `field-${nameInSchema}`

  return (
    <FieldGroup className={className}>
      <Controller
        name={nameInSchema}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1">
            
            {/* The wrapper that forces the checkbox and text inline tightly together */}
            <div className="flex items-center gap-2">
              <Checkbox
                id={fieldId}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                disabled={field.disabled}
                name={field.name}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
                /* h-4 w-4 shrink-0 locks the square dimensions regardless of surrounding elements */
                className="h-4 w-4 shrink-0 rounded border-input"
              />
              
              <FieldLabel 
                htmlFor={fieldId} 
                className="text-sm font-medium cursor-pointer select-none text-foreground"
              >
                {fieldTitle}
              </FieldLabel>
            </div>

            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  )
}
