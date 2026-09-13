import { getCustomer } from '@/lib/queries/getCustomer'
import { getTicket } from '@/lib/queries/getTicket'
import { BackButton } from '@/components/BackButton'
import * as Sentry from '@sentry/nextjs'
import TicketForm from './TicketForm'

export default async function TicketFormPage({
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const { customerId, ticketId } = await searchParams
  
  let customer = null
  let ticket = null
  
  let customerNotFound = false
  let ticketNotFound = false
  let isCustomerActive = true

  if (!customerId && !ticketId) {
    return (
      <div className="p-4">
        <h2>Customer ID or Ticket ID is required to load the form.</h2>
        <BackButton title="Go Back" />
      </div>
    )
  }

  try {
    
    if (ticketId) {
      const ticketResult = await getTicket(Number(ticketId))
      
      if (ticketResult && (!Array.isArray(ticketResult) || ticketResult.length > 0)) {
        ticket = Array.isArray(ticketResult) ? ticketResult[0] : ticketResult
      } else {
        ticketNotFound = true
      }
    }

    const targetCustomerId = customerId || ticket?.customerId

    if (targetCustomerId) {
      const customerResult = await getCustomer(Number(targetCustomerId))
      
      if (customerResult && customerResult.length > 0) {
        customer = customerResult[0] 

        if (!customer.isActive) {
          isCustomerActive = false
        }
      } else {
        customerNotFound = true
      }
    } else if (ticketNotFound) {
      customerNotFound = true
    }

  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw(error)
    } 
    customerNotFound = true
  }

  if (ticketNotFound) {
    return (
      <div className="p-4">
        <h2>Ticket ID #{ticketId} not found</h2>
        <BackButton title="Go Back" />
      </div>
    )
  }

  if (customerNotFound || !customer) {
    return (
      <div className="p-4">
        <h2>Customer data associated with this request was not found</h2>
        <BackButton title="Go Back" />
      </div>
    )
  }

  if (!isCustomerActive) {
    return (
      <div className="p-4">
        <h2>Customer ID #{customer?.id || customerId} is not active</h2>
        <BackButton title="Go Back" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <TicketForm customer={customer} ticket={ticket ?? undefined} />
    </div>
  )
}
