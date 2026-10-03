import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";

export async function getTicketSearchResults(searchText: string) {
  const results = await db
    .select({
      ticketDate: tickets.createdAt,
      title: tickets.title,
      fullName: customers.fullName,
      email: customers.email,
      technician: tickets.technician,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      or(
        ilike(tickets.title, `%${searchText}%`),
        ilike(tickets.description, `%${searchText}%`),
        ilike(tickets.technician, `%${searchText}%`),
        ilike(customers.fullName, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phoneNumber, `%${searchText}%`),
        ilike(customers.address1, `%${searchText}%`),
        ilike(customers.address2, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.province, `%${searchText}%`),
        ilike(customers.zipCode, `%${searchText}%`)
      )
    );

  return results;
}
