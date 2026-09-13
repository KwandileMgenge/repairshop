import { getCustomer } from '@/lib/queries/getCustomer'
import { BackButton } from '@/components/BackButton'
import * as Sentry from '@sentry/nextjs'
import CustomerForm from './CustomerForm'

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
      notFound = false
    }

  } catch (error) {

    if (error instanceof Error) {
      Sentry.captureException(error)
      throw(error)
    } 

  }

  if (notFound && customerId) {
    return (
      <div>
        <h2>Customer ID #{customerId} not found</h2>
        <BackButton title="Go Back" />
      </div>
    )
  } 
  
  return (
    <div className="p-4">
      <CustomerForm customer={customer ?? undefined} />
    </div>
  )
}