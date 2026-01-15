// Jest configuration specifically for integration tests
// This allows us to have a separate setup file for integration tests
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/integration"],
  testMatch: ["**/*.integration.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/infrastructure/**/*.ts",
    "src/application/use-cases/**/*.ts",
    "!src/**/*.d.ts",
  ],
  coverageDirectory: "coverage/integration",
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
  passWithNoTests: true,
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.ts"],
  testTimeout: 30000, // 30 seconds for integration tests
};
