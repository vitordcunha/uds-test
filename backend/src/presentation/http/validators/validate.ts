import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

interface ValidationConfig {
  body?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
}

export const validate = (config: ValidationConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (config.body) {
        req.body = await config.body.parseAsync(req.body);
      }

      // Validate params
      if (config.params) {
        const validatedParams = await config.params.parseAsync(req.params);
        req.params = validatedParams as typeof req.params;
      }

      // Validate query
      if (config.query) {
        const validatedQuery = await config.query.parseAsync(req.query);
        req.query = validatedQuery as typeof req.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = (error as ZodError).issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid input data",
          details: errors,
        });
      }

      next(error);
    }
  };
};
