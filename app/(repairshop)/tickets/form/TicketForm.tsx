"use client"

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

import { type selectCustomerSchemaType } from '@/zod-schemas/customer'
import { insertTicketSchema, type insertTicketSchemaType, type selectTicketSchemaType } from '@/zod-schemas/ticket'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { InputWithLabel } from '@/components/inputs/InputWithLabel'
import { TextareaWithLabel } from '@/components/inputs/TextareaWithLabel'
import { CheckboxWithLabel } from '@/components/inputs/CheckboxWithLabel' 
import { SelectWithLabel } from '@/components/inputs/SelectWithLabel'


import { useAction } from 'next-safe-action/hooks'
import { saveTicketAction } from '@/app/actions/saveTicketAction'
import { DisplayServerActionResponse } from '@/components/DisplayServerActionResponse'
import { useRouter } from 'next/navigation'

type TicketFormProps = {
  customer: selectCustomerSchemaType,
  ticket?: selectTicketSchemaType
  technicians?: {
    id: string,
    description: string,
  }[],
  isEditable?: boolean
}

export default function TicketForm({ customer, ticket, technicians, isEditable }: TicketFormProps) {
  const router = useRouter() 
  const isManager = Array.isArray(technicians) && technicians.length > 0

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

  const { execute: executeSaveTicket, result, isExecuting: isSavingTicket } = useAction(saveTicketAction, {
      onSuccess({ data }) {
        if (data && typeof data === 'object' && 'message' in data) {
          const payload = data as { message: string; ticketId: number };
          
          // 1. Immediately fire off the client notification alert
          toast.add({
            title: 'Success! Ticket Saved',
            description: payload.message,
            type: 'success', // Automatically styles it as green
          })

          form.reset({
            ...form.getValues(),
            id: payload.ticketId
          })
          
          // 2. Perform smooth soft routing without breaking execution callbacks
          router.push(`/tickets/form?ticketId=${payload.ticketId}`)
          router.refresh() // Refreshes server components to show up-to-date form values
        }
      },
      onError({ error }) {
        const errMsg = error.serverError || 'An unexpected runtime error occurred while saving.'
        
        toast.add({
          title: 'Error Saving Ticket',
          description: errMsg,
          type: 'error', // Automatically styles it as bold red matching your screenshot reference
        })
      }
    })

  async function submitForm(data: insertTicketSchemaType) {
    // console.log(data)
    executeSaveTicket(data)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <DisplayServerActionResponse result={result} />
      <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>
          {ticket?.id && isEditable ? 'Edit' : ticket?.id ? 'View' : 'New'} Ticket {ticket?.id ? `#${ticket.id}` : 'Form'}
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
                disabled={!isEditable}
              />

              {isManager ? (
                <SelectWithLabel<insertTicketSchemaType>
                  fieldTitle="Assigned Technician"
                  nameInSchema="technician"
                  data={[{
                    id: 'new-ticket@example.com',
                    description: 'Unassigned (New Ticket)',
                  }, ...technicians]}
                />
              ) : (
                <InputWithLabel<insertTicketSchemaType>
                  fieldTitle="Assigned Technician"
                  nameInSchema="technician"
                  disabled={true}
                  className="bg-muted pointer-events-none cursor-not-allowed opacity-80"
                />
              )}
              
            </div>

            {/* Render a completion toggle strictly when editing a pre-existing ticket instance */}
            {ticket?.id ? (
              <div className="p-3 border rounded-lg bg-muted/40">
                <CheckboxWithLabel<insertTicketSchemaType>
                  fieldTitle="Mark this ticket as Completed"
                  nameInSchema="completed"
                  disabled={!isEditable}
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
                    {customer.fullName}
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
                disabled={!isEditable}
                rows={5}
              />
            </div>

          </form>
        </FormProvider>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => form.reset()}
          disabled={!isEditable || form.formState.isSubmitting}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          form="ticket-form"
          disabled={!isEditable || form.formState.isSubmitting || isSavingTicket}
        >
          {isSavingTicket 
            ? 'Saving...' 
            : ticket?.id ? 'Save Changes' : 'Open Ticket'}
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
