import { getCustomer } from '@/lib/queries/getCustomer'
import { BackButton } from '@/components/BackButton'

export default async function CustomerFormPage({
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const customerId: string | undefined = (await searchParams).customerId
  let customer = null
  let notFound = false

  try {

    if (customerId) {
      customer = await getCustomer(Number(customerId))

      if (!customer) {
        notFound = true
      }
      console.log(customer)
    }

  } catch (error) {

    if (error instanceof Error) {
      console.error('Error retrieving search parameters:', error.message)
    } else {
      console.error('An unexpected error occurred while retrieving search parameters.')
    }

  }

  if (notFound) {
    return (
      <div>
        <h2>Customer ID #{customerId} not found</h2>
        <BackButton title="Go Back" />
      </div>
    )
  } else {

  }
}