import { getCustomer } from '@/lib/queries/getCustomer'
import { getTicket } from '@/lib/queries/getTicket'
import { BackButton } from '@/components/BackButton'

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
      console.error('Error retrieving data:', error.message)
    } else {
      console.error('An unexpected error occurred while retrieving data.')
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

  if (customerNotFound) {
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
      <header className="mb-4">
        <h1 className="text-2xl font-bold">
          {ticket ? `Edit Ticket #${ticket.id}` : 'Create New Ticket'}
        </h1>
        <p className="text-gray-600">
          Customer: {customer?.firstName} {customer?.lastName}
        </p>
      </header>

      {/* Put your Ticket Form markup or Client Component reference here */}
      <div className="border p-4 rounded bg-gray-50">
        <p>Ticket form fields will go here.</p>
      </div>
    </div>
  )
}
