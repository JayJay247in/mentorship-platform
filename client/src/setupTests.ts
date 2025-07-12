// src/setupTests.ts

// This polyfill MUST be the first thing in this file.
// It provides the TextEncoder/TextDecoder that MSW's dependencies need.
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;


// The rest of the setup file follows.
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());