import { getCustomer } from '@/lib/queries/getCustomer'
import { getTicket } from '@/lib/queries/getTicket'
import { BackButton } from '@/components/BackButton'
import * as Sentry from '@sentry/nextjs'
import TicketForm from './TicketForm'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Users, init as kindeInit } from '@kinde/management-api-js'

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

  // 1. SAFELY FETCH PERMISSIONS AND USER INFORMATION
  const { getPermission, getUser } = await getKindeServerSession()
  const [managerPermission, user] = await Promise.all([
    getPermission('manager'),
    getUser()
  ])
  
  const isManager = managerPermission?.isGranted

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
      ticketNotFound = true
      customerNotFound = true
    }

  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
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

  // 2. DECLARE CONTROL VARIABLES OUTSIDE BLOCK SCOPES
  let technicians: { id: string; description: string }[] = []
  let isEditable = false

  if (isManager) {
    // Managers can always edit all tickets
    isEditable = true 

    try {
      kindeInit()
      const apiResponse = await Users.getUsers()
      const userList = apiResponse?.users || []

      technicians = userList
        .filter((u: { email?: string }) => !!u.email)
        .map((user: { email?: string }) => ({
          id: user.email!,
          description: user.email!,
        }))
    } catch (kindeError) {
      console.error("Kinde Management API Error:", kindeError)
      Sentry.captureException(kindeError)
    }
  } else {
    // If NOT a manager, they can edit only if they are the assigned technician, OR if it's a brand new ticket
    isEditable = !ticketId || (!!user?.email && user.email === ticket?.technician)
  }

  // 3. FINAL INTEGRATION RETURN PASSING SCOPED VARIABLES
  return (
    <div className="p-4">
      <TicketForm 
        customer={customer} 
        ticket={ticket ?? undefined} 
        technicians={technicians} 
        isEditable={isEditable}
      />
    </div>
  )
}
