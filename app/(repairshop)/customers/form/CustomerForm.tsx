// File: app/(repairshop)/customers/form/CustomerForm.tsx
"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from '@/zod-schemas/customer'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormProvider } from 'react-hook-form'

import { InputWithLabel } from '@/components/inputs/InputWithLabel'
import { TextareaWithLabel } from '@/components/inputs/TextareaWithLabel'
import { SelectWithLabel } from '@/components/inputs/SelectWithLabel'
import { CheckboxWithLabel } from '@/components/inputs/CheckboxWithLabel'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

import { PROVINCES } from '@/lib/constants/ProvincesArray'
import { PhoneNumberInputWithLabel } from '@/components/inputs/PhoneNumberInputWithLabel'
import { useAction } from 'next-safe-action/hooks'
import { saveCustomerAction } from '@/app/actions/saveCustomerAction'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'
import { useRouter } from 'next/navigation' // ✅ Added client side router for smooth redirects

type CustomerFormProps = {
  customer?: selectCustomerSchemaType
}

function formatToE164(phone: string | undefined | null): string {
  if (!phone) return ''
  const trimmed = phone.trim().replace(/\s+/g, '')
  
  if (trimmed.startsWith('0') && !trimmed.startsWith('00')) {
    return `+27${trimmed.slice(1)}`
  }
  
  if (trimmed.startsWith('27')) {
    return `+${trimmed}`
  }
  
  return trimmed
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter() // ✅ Initialize client router instance
  const { getPermission, isLoading } = useKindeBrowserClient()
  const isManager = !isLoading && getPermission('manager')?.isGranted

  const { execute: executeSaveCustomer, result, isExecuting: isSavingCustomer } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      if (data && typeof data === 'object' && 'message' in data) {
        const payload = data as { message: string; customerId: number };
        
        // 1. Immediately fire off the client notification alert
        toast.success(payload.message)
        
        // 2. Perform smooth soft routing without breaking execution callbacks
        router.push(`/customers/form?customerId=${payload.customerId}`)
        router.refresh() // Refreshes server components to show up-to-date form values
      }
    },
    onError({ error }) {
      const errMsg = error.serverError || 'An unexpected runtime error occurred while saving.'
      toast.error(errMsg)
    }
  })

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    fullName: customer?.fullName ?? '',
    address1: customer?.address1 ?? '',
    address2: customer?.address2 ?? '',
    city: customer?.city ?? '',
    province: customer?.province ?? '',
    zipCode: customer?.zipCode ?? '',
    phoneNumber: formatToE164(customer?.phoneNumber),
    email: customer?.email ?? '',
    notes: customer?.notes ?? '',
    isActive: customer?.isActive ?? true,
  }

  const form = useForm<insertCustomerSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  })

  async function submitForm(data: insertCustomerSchemaType) {
    executeSaveCustomer(data)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <DisplayServerActionResponse result={result} />

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>
            {customer?.id ? 'Edit' : 'New'} Customer {customer?.id ? `#${customer.id}` : 'Form'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form 
              id="customer-form" 
              onSubmit={form.handleSubmit(submitForm)} 
              className="space-y-6"
            >
              {/* Section 1: Personal Metadata Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full overflow-hidden">
                <InputWithLabel<insertCustomerSchemaType> className="col-span-1 sm:col-span-2"
                  fieldTitle="Full Name"
                  nameInSchema="fullName"
                />
                <PhoneNumberInputWithLabel<insertCustomerSchemaType> className="col-span-1"
                  fieldTitle="Phone Number"
                  nameInSchema="phoneNumber"
                />
                <InputWithLabel<insertCustomerSchemaType> className="col-span-1"
                  fieldTitle="Email"
                  nameInSchema="email"
                  type="email"
                />
              </div>
              
              {/* Section 2: Address Specification Profile Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWithLabel<insertCustomerSchemaType>
                    fieldTitle="Address 1"
                    nameInSchema="address1"
                  />
                  <InputWithLabel<insertCustomerSchemaType>
                    fieldTitle="Address 2"
                    nameInSchema="address2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputWithLabel<insertCustomerSchemaType>
                    fieldTitle="City"
                    nameInSchema="city"
                  />
                  <SelectWithLabel<insertCustomerSchemaType>
                    fieldTitle="Province"
                    nameInSchema="province"
                    data={PROVINCES}
                  />
                  <InputWithLabel<insertCustomerSchemaType>
                    fieldTitle="Zip Code"
                    nameInSchema="zipCode"
                  />
                </div>
              </div>
              
              {/* Section 3: Multi-Line Notes Blocks */}
              <div className="block">
                <TextareaWithLabel<insertCustomerSchemaType>
                  fieldTitle="Notes"
                  nameInSchema="notes"
                  rows={4}
                />

                {isLoading ? <div className="h-6 w-32 animate-pulse bg-gray-200 rounded mt-2" /> : isManager && customer?.id ? (
                  <CheckboxWithLabel<insertCustomerSchemaType>  fieldTitle="Active Customer" nameInSchema="isActive" className="mt-2" />
                ) : null}
              </div>

            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSavingCustomer}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            form="customer-form"
            disabled={isSavingCustomer}
          >
            {isSavingCustomer ? 'Saving...' : customer?.id ? 'Update Customer' : 'Create Customer'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
