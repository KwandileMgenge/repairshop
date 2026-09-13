"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from '@/zod-schemas/customer'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormProvider } from 'react-hook-form'
import { InputWithLabel } from '../../../../components/inputs/InputWithLabel'
import { TextareaWithLabel } from '@/components/inputs/TextareaWithLabel'

type CustomerFormProps = {
  customer?: selectCustomerSchemaType
}

export default function CustomerForm({ customer }: CustomerFormProps) {
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {customer?.id ? 'Edit Customer' : 'New Customer'} Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          {/* Fix 1: Added explicit id attribute to hook into the footer submit button */}
          <form 
            id="customer-form" 
            onSubmit={form.handleSubmit(submitForm)} 
            className="space-y-4"
          >
            <div>
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
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Email"
                nameInSchema="email"
                type="email"
              />
            </div>
            
            <div>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Address 1"
                nameInSchema="address1"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Address 2"
                nameInSchema="address2"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="City"
                nameInSchema="city"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Province"
                nameInSchema="province"
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Zip Code"
                nameInSchema="zipCode"
              />
            </div>
            
            <div>
              <TextareaWithLabel<insertCustomerSchemaType>
                fieldTitle="Notes"
                nameInSchema="notes"
                rows={4}
              />
            </div>


          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
