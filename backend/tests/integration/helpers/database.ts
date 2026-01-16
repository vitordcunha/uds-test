// Re-export database helpers from e2e helpers
// Integration tests use the same database helpers as E2E tests
export {
  createTestDb,
  cleanDatabase,
  closeDatabase,
} from "../../e2e/helpers/database";

// Import the global db instance that repositories use
import { db } from "../../../src/db";
import { sql } from "drizzle-orm";

/**
 * Cleans the database using the global db instance
 * This ensures we're cleaning the same database connection that repositories use
 */
export async function cleanDatabaseGlobal() {
  await db.execute(
    sql.raw(`TRUNCATE TABLE cards, columns, boards RESTART IDENTITY CASCADE`)
  );
}
