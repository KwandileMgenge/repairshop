"use client"

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { insertTicketSchema, type insertTicketSchemaType, type selectTicketSchemaType } from '@/zod-schemas/ticket'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { selectCustomerSchemaType } from '@/zod-schemas/customer'

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
    <Card>
      <CardHeader>
        <CardTitle>
          {ticket?.id ? 'Edit' : 'New'} Ticket {ticket?.id ? `# ${ticket.id}` : 'Form'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
            <p>{JSON.stringify(form.getValues())}</p>
        </form>
      </CardContent>
    </Card>
  )
}