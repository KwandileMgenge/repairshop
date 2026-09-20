'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { buttonVariants } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

import PhoneInputPrimitive, { type Value } from 'react-phone-number-input/input'
import { getCountries as getRawCountries, getCountryCallingCode as getRawCode } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import * as React from 'react'

type SafeCountry = Parameters<typeof getRawCode>[0]

type PhoneNumberInputWithLabelProps<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  className?: string
  placeholder?: string
}

export function PhoneNumberInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  placeholder,
}: PhoneNumberInputWithLabelProps<S>) {
  const form = useFormContext()
  const fieldId = `field-${nameInSchema}`
  const [activeCountry, setActiveCountry] = React.useState<SafeCountry>('ZA')
  const [open, setOpen] = React.useState(false)

  const countries = getRawCountries()
  
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
            
            <div className="flex gap-2 w-full items-center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  type="button"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-28 justify-between px-3 font-normal shrink-0"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {FlagComponent && (
                      <div className="w-5 h-3.5 overflow-hidden rounded-sm shadow-sm flex items-center justify-center shrink-0">
                        <FlagComponent country={activeCountry} title={activeCountry} />
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground truncate">
                      +{getRawCode(activeCountry)}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>
                
                <PopoverContent className="w-72 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country code..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => {
                          const ItemFlag = flagMap[country]
                          const code = getRawCode(country)
                          return (
                            <CommandItem
                              key={country}
                              value={`${country} +${code}`}
                              onSelect={() => {
                                setActiveCountry(country)
                                setOpen(false)
                              }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                {ItemFlag && (
                                  <div className="w-5 h-3.5 overflow-hidden rounded-sm shadow-sm flex items-center justify-center">
                                    <ItemFlag country={country} title={country} />
                                  </div>
                                )}
                                <span className="font-medium">{country}</span>
                                <span className="text-muted-foreground">(+{code})</span>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  activeCountry === country ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Pure Shadcn Input for the phone digits */}
              <div className="relative flex-1 min-w-0">
                <PhoneInputPrimitive
                  id={fieldId}
                  country={activeCountry}
                  value={(field.value ?? '') as Value}
                  onChange={(val) => field.onChange(val || '')}
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                  placeholder={placeholder ?? '000 000 0000'}
                  inputComponent={Input}
                  className="w-full"
                />
              </div>
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
