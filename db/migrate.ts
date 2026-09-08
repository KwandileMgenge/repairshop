import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();