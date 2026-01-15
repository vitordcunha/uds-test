import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../src/db/schema";
import { sql } from "drizzle-orm";

/**
 * Creates a database connection for testing
 * Returns both the drizzle instance and the pool for cleanup
 */
export function createTestDb() {
  const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "TEST_DATABASE_URL or DATABASE_URL environment variable is not set"
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle(pool, { schema });
  
  return { db, pool };
}

/**
 * Cleans all tables in the database
 * This should be called before/after each test to ensure clean state
 */
export async function cleanDatabase(db: ReturnType<typeof createTestDb>["db"]) {
  // Delete in reverse order of dependencies (cards -> columns -> boards)
  // Using CASCADE to handle foreign key constraints
  // Using literal table names since drizzle-orm table names are known
  await db.execute(
    sql.raw(`TRUNCATE TABLE cards, columns, boards RESTART IDENTITY CASCADE`)
  );
}

/**
 * Closes the database connection pool
 */
export async function closeDatabase(pool: Pool) {
  await pool.end();
}
