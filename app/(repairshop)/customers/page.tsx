import CustomerSearch from '@/app/(repairshop)/customers/CustomerSearch'
import { getCustomerSearchResults } from '@/lib/queries/getCustomerSearchResults'

export const metadata = {
  title: 'Customers Search',
  description: 'View and manage customers',
}

export default async function Customers({
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const { searchText } = await searchParams

  if (!searchText) return <CustomerSearch />

  // Query the database
  const results = await getCustomerSearchResults(searchText)

  return (
    <div>
      <CustomerSearch />
      <p>{JSON.stringify(results)}</p>
    </div>
  )
}