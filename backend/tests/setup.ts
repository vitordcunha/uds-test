// Jest setup file
// This file runs before all tests

// Set test environment variables if needed
process.env.NODE_ENV = "test";

// Set test database URL if not already set
// Falls back to regular DATABASE_URL if TEST_DATABASE_URL is not provided
if (!process.env.TEST_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.TEST_DATABASE_URL = process.env.DATABASE_URL;
}

// Add any global test setup here
// For example, database connection, mocks, etc.
