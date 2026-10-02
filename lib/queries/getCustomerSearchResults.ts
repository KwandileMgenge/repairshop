import { db } from '@/db'
import { customers } from '@/db/schema'
import { ilike, or } from 'drizzle-orm'

export async function getCustomerSearchResults(searchText: string) {
  const results = await db.select().from(customers).where(
    or(
      ilike(customers.fullName, `%${searchText}%`),
      ilike(customers.email, `%${searchText}%`),
      ilike(customers.phoneNumber, `%${searchText}%`),
      ilike(customers.address1, `%${searchText}%`),
      ilike(customers.address2, `%${searchText}%`),
      ilike(customers.city, `%${searchText}%`),
      ilike(customers.province, `%${searchText}%`),
      ilike(customers.zipCode, `%${searchText}%`),
      ilike(customers.notes, `%${searchText}%`)
    )
  )

  return results
}