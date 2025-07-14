// src/utils/errorHandler.ts
import { Response } from 'express';
import AppError from './AppError';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  // Log the error for debugging purposes on the server
  console.error('An unexpected error occurred:', error);
  return res.status(500).json({ message: 'An internal server error occurred' });
};

export default handleError;
