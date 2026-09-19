import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "@/db/schema";
import { z } from "zod";

export const insertCustomerSchema = createInsertSchema(customers, {
  fullName: (schema) => schema.min(1, "Full name is required"),
  address1: (schema) => schema.min(1, "Address is required"),
  city: (schema) => schema.min(1, "City is required"),
  province: (schema) =>
    schema
      .min(2, "Invalid province")
      .max(3, "Province must be 2 or 3 characters"),
  email: (schema) => schema.pipe(z.email({ message: "Invalid email address" })),
  zipCode: (schema) =>
    schema.regex(/^\d{4}$/, "Postal code must be exactly 4 digits"),
  phoneNumber: (schema) => schema.pipe(
    z.string().regex(
      /^\+[1-9]\d{1,14}$/,
      "Invalid international phone number structure"
    )
  ),
});

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = z.infer<typeof insertCustomerSchema>;

export type selectCustomerSchemaType = z.infer<typeof selectCustomerSchema>;
