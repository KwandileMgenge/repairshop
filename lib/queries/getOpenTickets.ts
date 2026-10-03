import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOpenTickets() {
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
    .where(eq(tickets.completed, false));

  return results;
}