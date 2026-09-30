'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { tickets } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { insertTicketSchema } from '@/zod-schemas/ticket'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const saveTicketAction = actionClient
  .metadata({ actionName: 'saveTicketAction' })
  .inputSchema(insertTicketSchema)
  .action( async ({ parsedInput: ticketData }) => {

    const { isAuthenticated } = getKindeServerSession()
    const isUserAuthenticated = await isAuthenticated()
    
    if (!isUserAuthenticated) {
      throw new Error("Unauthorized access")
    }
    
    let targetTicketId: number;

    // A. NEW TICKET: INSERT PIPELINE
    if (ticketData.id === 0 || ticketData.id === '(New)') {
      const [newTicket] = await db.insert(tickets).values({
        customerId: ticketData.customerId,
        title: ticketData.title,
        description: ticketData.description,
        completed: ticketData.completed,
        technician: ticketData.technician,
      }).returning({ insertedId: tickets.id })

      targetTicketId = newTicket.insertedId

      return { 
        message: 'Ticket created successfully!', 
        ticketId: targetTicketId 
      }
    } else {
      // B. EXISTING TICKET: UPDATE PIPELINE
      // FIX: Explicitly parse or cast the id parameter value to guarantee a safe type definition for Drizzle
      const targetId = typeof ticketData.id === 'string' ? parseInt(ticketData.id, 10) : ticketData.id;

      const [updatedTicket] = await db.update(tickets).set({
        customerId: ticketData.customerId,
        title: ticketData.title,
        description: ticketData.description,
        completed: ticketData.completed,
        technician: ticketData.technician,
      }).where(eq(tickets.id, targetId)).returning({ updatedId: tickets.id })

      targetTicketId = updatedTicket.updatedId

      return { 
        message: 'Ticket updated successfully!', 
        ticketId: targetTicketId 
      }
    }
})