import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({path: ".env.local"});

const sqlClient = neon(process.env.DATABASE_URL!);

export const db = drizzle(sqlClient);