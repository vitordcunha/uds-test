/**
 * Setup validation test
 * This test verifies that the integration test setup is working correctly
 * It should be the first test to run and validates:
 * - Database connection works
 * - Database cleanup works
 * - Environment variables are set correctly
 */

import { createTestDb, cleanDatabase, closeDatabase } from "./helpers/database";

describe("Integration Test Setup", () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeAll(() => {
    // Verify environment variables
    expect(
      process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
    ).toBeDefined();
    expect(process.env.NODE_ENV).toBe("test");
  });

  beforeEach(async () => {
    // Create test database connection
    testDb = createTestDb();

    // Clean database before each test
    await cleanDatabase(testDb.db);
  });

  afterEach(async () => {
    // Clean database after each test
    await cleanDatabase(testDb.db);
  });

  afterAll(async () => {
    // Close database connection pool
    if (testDb?.pool) {
      await cleanDatabase(testDb.db);
      await closeDatabase(testDb.pool);
      // Wait a bit for connections to close
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });

  it("should connect to test database", () => {
    expect(testDb).toBeDefined();
    expect(testDb.db).toBeDefined();
    expect(testDb.pool).toBeDefined();
  });

  it("should clean database successfully", async () => {
    // This test verifies that cleanDatabase doesn't throw errors
    await expect(cleanDatabase(testDb.db)).resolves.not.toThrow();
  });

  it("should have correct test environment", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});
