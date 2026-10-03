import TicketSearch from '@/app/(repairshop)/tickets/TicketSearch'
import { getOpenTickets } from '@/lib/queries/getOpenTickets'
import { getTicketSearchResults } from '@/lib/queries/getTicketSearchResults'

export const metadata = {
  title: 'Ticket Search',
  description: 'View and manage tickets',
}

export default async function Tickets({
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const { searchText } = await searchParams

  if (!searchText) {
    // Query default results
    const openTickets = await getOpenTickets()
    return (
      <div>
        <TicketSearch />
        <p>{JSON.stringify(openTickets)}</p>
      </div>
    )
  }

  const searchResults = await getTicketSearchResults(searchText)
  
  // Query the database
  return (
    <div>
      <TicketSearch />
      <p>{JSON.stringify(searchResults)}</p>
    </div>
  )
}