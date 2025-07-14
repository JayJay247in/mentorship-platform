// src/setupTests.ts
import '@testing-library/jest-dom';

import { TextDecoder,TextEncoder } from 'util'; // Import from Node's built-in 'util' module

import { server } from './mocks/server';

// --- THIS IS THE FIX ---
// Polyfill for TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
// --- END OF FIX ---

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
