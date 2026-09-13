"use client"

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { insertTicketSchema, type insertTicketSchemaType, type selectTicketSchemaType } from '@/zod-schemas/ticket'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { selectCustomerSchemaType } from '@/zod-schemas/customer'
import { InputWithLabel } from '@/components/inputs/InputWithLabel'
import { TextareaWithLabel } from '@/components/inputs/TextareaWithLabel'
// Make sure to add a checkbox wrapper if your schema requires tracking the 'completed' value
import { CheckboxWithLabel } from '@/components/inputs/CheckboxWithLabel' 

type TicketFormProps = {
  customer: selectCustomerSchemaType,
  ticket?: selectTicketSchemaType
}

export default function TicketForm({ customer, ticket }: TicketFormProps) {
  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? 0,
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    technician: ticket?.technician ?? 'new-ticket@example.com',
  }

  const form = useForm<insertTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  })

  async function submitForm(data: insertTicketSchemaType) {
    console.log(data)
    toast.success('Ticket saved successfully!')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>
          {ticket?.id ? 'Edit' : 'New'} Ticket {ticket?.id ? `#${ticket.id}` : 'Form'}
        </CardTitle>
        <CardDescription>
          Provide technical service details below for the customer account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form 
            id="ticket-form" 
            onSubmit={form.handleSubmit(submitForm)} 
            className="space-y-6"
          >
            {/* Ticket Settings Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputWithLabel<insertTicketSchemaType>
                fieldTitle="Ticket Title"
                nameInSchema="title"
                placeholder="e.g., Laptop screen flickering"
              />

              <InputWithLabel<insertTicketSchemaType>
                fieldTitle="Assigned Technician"
                nameInSchema="technician"
                disabled={true}
                className="bg-muted pointer-events-none cursor-not-allowed opacity-80"
              />
            </div>

            {/* Render a completion toggle strictly when editing a pre-existing ticket instance */}
            {ticket?.id ? (
              <div className="p-3 border rounded-lg bg-muted/40">
                <CheckboxWithLabel<insertTicketSchemaType>
                  fieldTitle="Mark this ticket as Completed"
                  nameInSchema="completed"
                />
              </div>
            ) : null}

            {/* Structured Customer Information Overlay Card */}
            <div className="rounded-lg border bg-card p-4 space-y-2 text-sm shadow-sm">
              <h3 className="font-semibold text-base text-foreground tracking-tight">
                Associated Customer Profile
              </h3>
              <hr className="border-border/60" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
                <div>
                  <p className="font-medium text-foreground">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p>{customer.address1}</p>
                  {customer.address2 && <p>{customer.address2}</p>}
                  <p>{customer.city}, {customer.province} {customer.zipCode}</p>
                </div>
                <div className="sm:text-right space-y-0.5">
                  <p className="tabular-nums">📞 {customer.phoneNumber}</p>
                  <p>✉️ {customer.email}</p>
                </div>
              </div>
            </div>

            {/* Description Text Area Input */}
            <div className="block">
              <TextareaWithLabel<insertTicketSchemaType>
                fieldTitle="Detailed Fault Description"
                nameInSchema="description"
                placeholder="Detail diagnostics data or steps required to resolve..."
                rows={5}
              />
            </div>

          </form>
        </FormProvider>
      </CardContent>
      {/* Explicit Actions Container block syncing directly to standard form submission definitions */}
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="ticket-form">
          {ticket?.id ? 'Save Changes' : 'Open Ticket'}
        </Button>
      </CardFooter>
    </Card>
  )
}
