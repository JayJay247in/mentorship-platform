// server/src/__mocks__/mailService.ts

/**
 * This is a mock version of the mailService.
 * Whenever any test tries to import and use the real mailService, Jest will
 * automatically swap it with this version.
 */
export const sendPasswordResetEmail = jest.fn().mockResolvedValue(undefined);

// You can add mock versions of any other email functions you have here
// e.g., export const sendWelcomeEmail = jest.fn().mockResolvedValue(undefined);