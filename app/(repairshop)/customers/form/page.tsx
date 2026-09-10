import { getCustomer } from '@/lib/queries/getCustomer'
import { BackButton } from '@/components/BackButton'
import * as Sentry from '@sentry/nextjs'

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
      const customerResult = await getCustomer(Number(customerId))

      if (customerResult && customerResult.length > 0) {
        customer = customerResult[0]
      } else {
        notFound = true
      }
    } else {
      notFound = true
    }

  } catch (error) {

    if (error instanceof Error) {
      Sentry.captureException(error)
      throw(error)
    } 

  }

  if (notFound) {
    return (
      <div>
        <h2>Customer ID #{customerId} not found</h2>
        <BackButton title="Go Back" />
      </div>
    )
  } 
  
  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Edit Customer Profile</h1>
        <p className="text-gray-600">ID: #{customer?.id}</p>
      </header>

      {/* Your Customer Edit Form goes here */}
      <div className="border p-4 rounded bg-gray-50">
        <p>Name: {customer?.firstName} {customer?.lastName}</p>
        <p>Email: {customer?.email}</p>
      </div>
    </div>
  )
}