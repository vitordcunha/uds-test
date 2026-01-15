// Jest setup file for integration tests
// This file runs before all integration tests

import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Set test environment variables
process.env.NODE_ENV = "test";

// Set test database URL if not already set
// Falls back to regular DATABASE_URL if TEST_DATABASE_URL is not provided
if (!process.env.TEST_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.TEST_DATABASE_URL = process.env.DATABASE_URL;
}

// Verify that database URL is set
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  console.warn(
    "⚠️  WARNING: TEST_DATABASE_URL or DATABASE_URL environment variable is not set."
  );
  console.warn(
    "⚠️  Integration tests require a database connection. Please set DATABASE_URL in .env file."
  );
  // Don't throw error here, let individual tests handle missing DB gracefully
}

// Increase timeout for integration tests (they interact with real database)
jest.setTimeout(30000); // 30 seconds

// Global setup for integration tests
// Database cleanup is handled per test file using beforeEach/afterEach hooks
