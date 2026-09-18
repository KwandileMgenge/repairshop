'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { customers } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { insertCustomerSchema } from '@/zod-schemas/customer'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const saveCustomerAction = actionClient
  .metadata({ actionName: 'saveCustomerAction' })
  .inputSchema(insertCustomerSchema)
  .action( async ({ parsedInput: customerData }) => {

    const { isAuthenticated } = getKindeServerSession()
    const isUserAuthenticated = await isAuthenticated()
    
    if (!isUserAuthenticated) {
      redirect('/login')
    }

    let targetCustomerId: number;

    // A. NEW CUSTOMER: INSERT PIPELINE
    if (customerData.id === 0) {
      const [newCustomer] = await db.insert(customers).values({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        address1: customerData.address1,
        ...(customerData.address2?.trim() ? { address2: customerData.address2 } : {}),
        city: customerData.city,
        province: customerData.province,
        zipCode: customerData.zipCode,
        ...(customerData.notes?.trim() ? { notes: customerData.notes } : {}),
      }).returning({ insertedId: customers.id })

      targetCustomerId = newCustomer.insertedId
    } else {
      // B. EXISTING CUSTOMER: UPDATE PIPELINE
      const targetId = customerData.id ?? 0;

      const [updatedCustomer] = await db.update(customers).set({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        address1: customerData.address1,
        address2: customerData.address2?.trim() || null,
        city: customerData.city,
        province: customerData.province,
        zipCode: customerData.zipCode,
        notes: customerData.notes?.trim() || null,
        isActive: customerData.isActive,
      }).where(eq(customers.id, targetId)).returning({ updatedId: customers.id })

      targetCustomerId = updatedCustomer.updatedId
    }

    redirect(`/customers/form?customerId=${targetCustomerId}`)
  })