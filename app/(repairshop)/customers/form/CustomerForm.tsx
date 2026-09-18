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

type CustomerFormProps = {
  customer?: selectCustomerSchemaType
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const { getPermission, isLoading } = useKindeBrowserClient()
  const isManager = !isLoading && getPermission('manager')?.isGranted

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    address1: customer?.address1 ?? '',
    address2: customer?.address2 ?? '',
    city: customer?.city ?? '',
    province: customer?.province ?? '',
    zipCode: customer?.zipCode ?? '',
    phoneNumber: customer?.phoneNumber ?? '',
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
    console.log(data)
    toast.success('Customer saved successfully!')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="First Name"
                nameInSchema="firstName"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Last Name"
                nameInSchema="lastName"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Phone Number"
                nameInSchema="phoneNumber"
                type="tel"
              />
              <InputWithLabel<insertCustomerSchemaType>
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
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="customer-form">
          {customer?.id ? 'Update Customer' : 'Create Customer'}
        </Button>
      </CardFooter>
    </Card>
  );
}
