"use client"

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { insertCustomerSchema, type insertCustomerSchemaType, type selectCustomerSchemaType } from '@/zod-schemas/customer'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type CustomerFormProps = {
  customer?: selectCustomerSchemaType
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id || 0,
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    address1: customer?.address1 || '',
    address2: customer?.address2 || '',
    city: customer?.city || '',
    province: customer?.province || '',
    zipCode: customer?.zipCode || '',
    phoneNumber: customer?.phoneNumber || '',
    email: customer?.email || '',
    notes: customer?.notes || '',
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
    <Card>
      <CardHeader>
        <CardTitle>
          {customer?.id ? 'Edit Customer' : 'Add Customer'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-firstName">
                    First Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="John"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            </FieldGroup>
            <p>{JSON.stringify(form.getValues())}</p>
        </form>
      </CardContent>
    </Card>
  );
}


