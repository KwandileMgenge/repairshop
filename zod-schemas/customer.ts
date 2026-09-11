import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { customers } from '@/db/schema'
import { z } from 'zod'

export const insertCustomerSchema = createInsertSchema(customers, {
  firstName: (schema) => schema.min(1, "First name is required"),
  lastName: (schema) => schema.min(1, "Last name is required"),
  address1: (schema) => schema.min(1, "Address is required"),
  city: (schema) => schema.min(1, "City is required"),
  province: (schema) => schema.min(2, "Invalid province").max(3, "Province must be 2 or 3 characters"),
  email: (schema) => schema.email("Invalid email address"), 
  zipCode: (schema) => schema.regex(/^\d{4}$/, "Postal code must be exactly 4 digits"),
  phoneNumber: (schema) => schema.regex(/^(?:\+27|27|0)[1-8]\d{8}$/, "Invalid South African phone number"),
})

export const selectCustomerSchema = createSelectSchema(customers)

export type InsertCustomerSchemaType = z.infer<typeof insertCustomerSchema>
export type SelectCustomerSchemaType = z.infer<typeof selectCustomerSchema>