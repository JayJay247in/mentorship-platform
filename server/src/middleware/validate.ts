// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod'; // Import z itself for the generic type

// This is a "higher-order function". It takes a schema and returns a middleware function.
// We use z.ZodTypeAny as a generic type that can accept any Zod schema.
export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod's .parse() method will throw an error if validation fails.
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // If validation is successful, call the next middleware (or the controller)
      next();
    } catch (error) {
      // If the error is a ZodError, we can format it for a clean response.
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          // Use .issues instead of .errors to get the array of validation problems
          errors: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }
      // For any other kind of error, pass it to our generic error handler.
      next(error);
    }
  };
