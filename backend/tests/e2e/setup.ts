import { createTestDb, cleanDatabase, closeDatabase } from "./helpers/database";

// Global setup for E2E tests
let testDbInstance: ReturnType<typeof createTestDb>;

beforeAll(async () => {
  // Create test database connection
  testDbInstance = createTestDb();
});

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase(testDbInstance.db);
});

afterAll(async () => {
  // Clean database after all tests
  await cleanDatabase(testDbInstance.db);
  // Close database connection pool
  await closeDatabase(testDbInstance.pool);
});

export { testDbInstance };
