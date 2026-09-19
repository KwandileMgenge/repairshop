'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import PhoneInputPrimitive, { type Value } from 'react-phone-number-input/input'
import { getCountries as getRawCountries, getCountryCallingCode as getRawCode } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import * as React from 'react'

// Safer local alias mapping for standard library country strings
type SafeCountry = Parameters<typeof getRawCode>[0]

type PhoneInputWithLabelProps<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  className?: string
  placeholder?: string
}

export function PhoneInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  placeholder,
}: PhoneInputWithLabelProps<S>) {
  const form = useFormContext()
  const fieldId = `field-${nameInSchema}`
  const [activeCountry, setActiveCountry] = React.useState<SafeCountry>('ZA')

  const countries = getRawCountries()
  
  // Safe multi-stage double casting using unknown to bypass structural strictness check
  const flagMap = flags as unknown as Record<SafeCountry, React.ComponentType<{ country: SafeCountry; title?: string }>>
  const FlagComponent = flagMap[activeCountry]

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
            
            {/* Standard wrapper matching the focus-within styling paradigm */}
            <div className="flex items-center gap-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              
              {/* Native Dropdown Flag Selector */}
              <div className="flex items-center gap-1 relative cursor-pointer group shrink-0 select-none">
                {FlagComponent && (
                  <div className="w-5 h-3.5 overflow-hidden rounded-sm shadow-sm flex items-center justify-center">
                    <FlagComponent country={activeCountry} title={activeCountry} />
                  </div>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  +{getRawCode(activeCountry)}
                </span>
                <select
                  value={activeCountry}
                  onChange={(e) => setActiveCountry(e.target.value as SafeCountry)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country} (+{getRawCode(country)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clean Primitive Phone Input Field */}
              <PhoneInputPrimitive
                id={fieldId}
                country={activeCountry}
                value={(field.value ?? '') as Value}
                onChange={(val) => field.onChange(val || '')}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder ?? '000 000 0000'}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
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
