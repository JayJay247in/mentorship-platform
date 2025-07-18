// server/jest.config.js

// This line must be at the very top
// It finds the .env.test file and loads its variables into process.env
// before any other code (including your application code) is imported.
require('dotenv').config({ path: './.env.test' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // We no longer need the setupFilesAfterEnv property for this particular issue
};